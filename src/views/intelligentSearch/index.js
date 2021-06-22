import React, { Component } from 'react';
import {
  Input, Select, Upload, Icon, message, Button, Radio, Dropdown, Menu,
  Spin, Form, Slider
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  searchPlate, searchFace, saveImages, addImage, delImage
} from 'Redux/reducer/intelligentSearch';
import NODATA_IMG from 'Assets/nodata.png';
import { trueDependencies } from 'mathjs';
import PeopleRes from './results/peopleRes';
import CarRes from './results/carRes';
import ImagePicker from './imagePicker';
import styles from './index.less';
import {
  SEARCH_TYPES,
  SEARCH_TYPES_FACE,
  SEARCH_TYPES_PLATE,
  SEARCH_FACE_ORIGIN_TYPE,
} from './constants';
import {
  getTypeFromUrl
} from './utils';

const { Search } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  { searchPlate, searchFace },
  dispatch
);

class IntelligentSearch extends Component {
  constructor() {
    super();
    this.state = {
      curImage: null,
      resData: undefined,
      resLoading: false,
      filterType: 0,
      // searchType: SEARCH_TYPES_PLATE,
    };
  }

  componentDidMount() {
  }

 handleSearch = () => {
   const searchType = getTypeFromUrl(this.props);
   console.log('menuClick-searchType', searchType);
   const {
     afterCrop
   } = this.state;
   if (!afterCrop) {
     message.warn('请上传图片!');
     return;
   }
   this.setState({ resLoading: true });
   const formData = new FormData();
   //  const file = dataURLtoFile(afterCrop, 'test.jpeg');
   formData.append('file', afterCrop, 'cropped.jpeg');
   let searchFunc = () => {};
   switch (searchType) {
     case SEARCH_TYPES_PLATE:
       searchFunc = this.props.searchPlate;
       break;
     case SEARCH_TYPES_FACE:
       searchFunc = this.props.searchFace;
       break;
     default:
       break;
   }
   searchFunc(formData).then((res) => {
     this.setState({
       resData: res,
       resLoading: false,
     });
     console.log('res', res);
   }).catch((err) => {
     this.setState({
       resData: undefined,
       resLoading: false,
     });
     console.log(err);
   });
 }

 switchFaceOrigin = (e) => {
   e.preventDefault();
   console.log('click', e.target.value);
   this.setState({
     filterType: e.target.value,
   });
 }

 onReUpload = () => { this.setState({ imageUrl: undefined, resData: undefined }); }

 render() {
   const {
     imageUrl, resData, resLoading, curImage, filterType
   } = this.state;
   const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: {
       xs: { span: 24 },
       sm: { span: 6 },
     },
     wrapperCol: {
       xs: { span: 24 },
       sm: { span: 18 },
     },
   };

   //  const marks = {
   //    0: '100%',
   //    100: '0',
   //  };

   const searchType = getTypeFromUrl(this.props);
   const renderRes = (resData) => {
     switch (searchType) {
       case SEARCH_TYPES_PLATE:
         return <CarRes data={resData} />;
       case SEARCH_TYPES_FACE:
         return <PeopleRes data={resData} />;
       default:
         return null;
     }
   };

   const renderForm = () => {
     switch (searchType) {
       case SEARCH_TYPES_FACE:
         return (
           <React.Fragment>
             <div className={styles.filterType}>
               <ButtonGroup size="large" className={styles.btnGroup} onClick={this.switchFaceOrigin}>
                 {
                   SEARCH_FACE_ORIGIN_TYPE.map((item, idx) => (
                     <Button
                       key={idx}
                       value={idx}
                       className={`${styles['btnGroup-btn']} ${idx == filterType ? styles['btnGroup-btn-selected'] : ''}`}
                       disabled={idx > 0}
                     >
                       {item}
                     </Button>
                   ))
                 }
               </ButtonGroup>
             </div>
             <Form {...formItemLayout}>
               <Form.Item label="姓名">
                 {getFieldDecorator('name', {
                   rules: [
                   ],
                 })(<Input />)}
               </Form.Item>
               <Form.Item label="布控标签">
                 {getFieldDecorator('label', {
                   rules: [
                   ],
                 })(
                   <Select>
                     <Option value="white">白名单</Option>
                     <Option value="black">黑名单</Option>
                     <Option value="other">其他</Option>
                   </Select>
                 )}
               </Form.Item>
               <Form.Item label="置信度">
                 {getFieldDecorator('confirm', {
                   rules: [
                   ],
                 })(
                   <Slider
                     step={1}
                     defaultValue={10}
                     tipFormatter={value => (`${100 - value}%`)}
                     reverse
                   //  tooltipVisible
                   />
                 )}
               </Form.Item>
             </Form>
           </React.Fragment>
         );
       case SEARCH_TYPES_PLATE:
       default:
         return null;
     }
   };

   return (
     <div className={styles.intelligentSearch}>
       <div className={styles['intelligentSearch-contentWrapper']}>
         <div className={styles['intelligentSearch-contentWrapper-leftPart']}>
           {/* <div className={styles.subTitle}>{SEARCH_TYPES[searchType]}</div> */}
           <div className={styles.searchWrapper}>
             <ImagePicker curImage={curImage} />
             <div className={styles.filterWrapper}>
               {
                 renderForm()
               }
             </div>
             <div className={styles.btnWrapper}>
               {/* <Dropdown overlay={searchOptions}>
                 <Button type="primary" className={styles.searchBtn}>
                   <span className={styles.searchBtnText}>开始检索</span>
                   <Icon type="down" className={styles.searchBtnIcon} />
                 </Button>
               </Dropdown> */}
               <Button type="primary" className={styles.searchBtn} onClick={this.handleSearch}>
                 <span className={styles.searchBtnText}>检索</span>
               </Button>
               {
                 imageUrl ? (
                   <div className={styles.reUpload}>
                     <a href="javascript:void(0);" onClick={this.onReUpload}>
                       <span className={styles['reUpload-text']}>重新上传</span>
                       <Icon type="undo" className={styles['reUpload-icon']} />
                     </a>
                   </div>
                 ) : null
               }
             </div>
           </div>
         </div>
         <div className={styles['intelligentSearch-contentWrapper-rightPart']}>
           <div className={styles.subTitle}>检索结果</div>
           <Spin spinning={resLoading}>
             {
               resData ? renderRes(resData) : (
                 <div className={styles.nodataWrapper}>
                   <img src={NODATA_IMG} alt="" />
                 </div>
               )
             }
           </Spin>

         </div>
       </div>
     </div>
   );
 }
}

IntelligentSearch.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(IntelligentSearch));
