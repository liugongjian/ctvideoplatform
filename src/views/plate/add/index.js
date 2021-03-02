import React, { Component } from 'react';
import { push } from 'react-router-redux';
import {
  Table, Upload , Icon , Button , Pagination , Tag , message , Modal
} from 'antd';
import {Link} from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { urlPrefix } from 'Constants/Dictionary';
import { getImportedPlate , getDuplicatedPlate , submitImportedPlate} from '@/redux/reducer/plate'
import { pathPrefix } from '@/constants/Dictionary';
import 'antd/dist/antd.css';
import styles from './index.less';
import warnPic from '@/assets/role/warn.png'
import EIcon from 'Components/Icon';
const { Column } = Table;
const { Dragger } = Upload;



const mapStateToProps = state => ({ role : state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  { push , getImportedPlate , getDuplicatedPlate , submitImportedPlate},
  dispatch
);


class AddPlate extends Component {
  state = {
    step : 1 , 
    importedPlateInfo:[],
    fileList : [],
    submitModalVisible: false,
    duplicatedPlates:0,
  };
  componentDidMount() {
    console.log('this.state.fileList',this.state.fileList)
  }

  onUploadChange = (info) => {
    const fileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'];
    if(!fileTypes.includes(info.file.type)){
      message.error('格式错误，请重新上传')
      return
    }   
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.setState({ fileList });
  }

  onNextStep = () => {
    this.props.getImportedPlate({pageNo:0 , pageSize: 10}).then((data)=>{
      console.log(data);
      this.setState({
        step:2,
        importedPlateInfo : data
      })
    })
  }
  onPageNumChange = (pageNo) => {
    this.props.getImportedPlate({
      pageNo : pageNo-1,
      pageSize : this.state.importedPlateInfo.pageSize
    }).then((data)=>{
      this.setState({importedPlateInfo : data})
    })
  }
  onPageSizeChange = (current , size) => {
    this.props.getImportedPlate({
      pageNo : 0,
      pageSize : size
    }).then((data)=>{
      // console.log(data);
      this.setState({importedPlateInfo : data})
    })
  }
  onCheckAndSubmit = () => {
    this.props.getDuplicatedPlate({}).then(data => {
      if(data > 0){
        this.setState({submitModalVisible : true , duplicatedPlates : data})
      }else{
        this.props.submitImportedPlate({}).then(data=>{
          if(data){
            message.success('导入成功');
            this.props.push(`${pathPrefix}/gallery/carLicense`);
          }
        });
      }
    })
  }
  onSubmitDuplicatedPlates = () => {
    this.props.submitImportedPlate({}).then(data=>{
      if(data){
        message.success('导入成功');
        this.props.push(`${pathPrefix}/gallery/carLicense`);
      }
    });
  }
  onBackToMain = ()=>{
    this.props.push(`${pathPrefix}/gallery/carLicense`);
  }

  render() {
    const { importedPlateInfo } = this.state;
    const uploadprops = {
      action: `${urlPrefix}/license/import`,
      onChange : this.onUploadChange,
    };
    const uploader = ()=>(         
          <div className={styles.uploadWrapper}>
            <div className={styles.templateWrapper}>
              <a href={`${urlPrefix}/license/template`}><EIcon type="myicon-downloadicon" />下载模板</a>
            </div>
            <Dragger {...uploadprops} fileList={this.state.fileList}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p className="ant-upload-hint">
                  支持的格式：仅支持csv、xlsx、xls格式文件
                </p>
              </Dragger>
              <div className={styles.buttonWrapper}>
                <Button key="submit" type="primary" className={styles.btnNext} onClick={()=>this.onNextStep()} disabled={this.state.fileList.length < 1}>
                  下一步
                </Button>
                <Button key="cancel"className={styles.btnBack} onClick={()=>this.onBackToMain()}>
                  返回
                </Button>
              </div>
          </div>
     );
    
    const confirmer = ()=>(
      <div>
          <Table dataSource={importedPlateInfo.list} pagination={false} rowKey={(record) => record.licenseNo}>
          <Column title="车牌号" dataIndex="licenseNo" width={'14%'} className="tabble-row" align="center" 
            render= {(text,record) => (
                <div>
                { 
                  record.duplicated ? <div style={{color:'red'}}>{ record.licenseNo }</div> : <div>{ record.licenseNo }</div>
                }    
                </div>      
              )
            }
          />
          <Column title="布控标签" dataIndex="label" width={'60%'} align="center"
                  render={(text, record) => (
                    <div>
                      {
                        text==="WHITE" ? (<Tag color="green">白名单</Tag>) : (<Tag color="red">黑名单</Tag>)
                      }          
                    </div>
                  )}
          />
          <Column title="车牌颜色" dataIndex="color" width={'26%'} align="center"/>
        </Table>
        <div className={styles.paginationWrapper}>
          <span>总条数: {importedPlateInfo.recordsTotal}</span>
          <div>
            <Pagination
              total={importedPlateInfo.recordsTotal}
              onChange={(pageNo) => this.onPageNumChange(pageNo)}
              current={importedPlateInfo.pageNo+1}
              showSizeChanger
              showQuickJumper
              pageSize={importedPlateInfo.pageSize}
              onShowSizeChange={(current,size) => this.onPageSizeChange(current , size)}
            />
          </div>
        </div>
          <div>
            <div className={styles.buttonWrapper2}>
              <Button key="cancel"className={styles.btnBack2} onClick={()=>this.setState({step : 1})}>上一步</Button>
              <Button type="primary" onClick={()=>this.onCheckAndSubmit()}>提交</Button>
            </div>
          </div>
          
        </div>
    )
    return (
      <div className={styles.mainWrapper}>
        {this.state.step > 1 ? confirmer() : uploader()}

        <Modal
          centered
          width={412}
          visible={this.state.submitModalVisible}
          onCancel={() => this.setState({submitModalVisible:false})}
          footer={[    
            <Button key="submit" type="primary" onClick={() => this.onSubmitDuplicatedPlates()} style={{margin:'0 0 0 5px'}}>
            确定
           </Button>,        
            <Button key="back" style={{margin:'0 0 0 30px'}} onClick={() => {this.setState({submitModalVisible:false})}}>
              取消
            </Button>,
          ]}
        >
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalImg}>
              <img src={warnPic}/>
            </div>
            <div className={styles.deleteModalInfo}>
              <span>你添加的人脸数据有{this.state.duplicatedPlates}条已存在是否要覆盖</span>
            </div>
          </div>
        </Modal>


      </div>
    );
  }
}

// AddPlate.propTypes = {
//   plate: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(AddPlate);
