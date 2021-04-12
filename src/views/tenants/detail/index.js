/* eslint-disable max-len */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Modal, Button, Table, Tag, Divider, Form, Input, Select
} from 'antd';
import {
  getTenantDetail
} from 'Redux/reducer/platform';
import { urlPrefix } from 'Constants/Dictionary';
import styles from './index.less';


const { Option } = Select;
const { TextArea } = Input;

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  { getTenantDetail },
  dispatch
);

class TenantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantDetail: null
    };
  }

  componentDidMount() {
    const { tenantId } = this.props.match.params;
    console.log('this.props', this.props.match.params.tenantId);
    if (tenantId) {
      this.props.getTenantDetail(tenantId).then((res) => {
        console.log('res-id', res);
        this.setState({ tenantDetail: res });
      });
    }
  }

  render() {
    const emptyDetail = {
      algorithmIds: '',
      algorithmQuota: 0,
      algorithmsInfoJson: [],
      description: '',
      deviceQuota: 0,
      deviceSupplierInfo: [],
      name: '',
    };
    const td = this.state.tenantDetail || emptyDetail;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const columns = [
      {
        title: '算法类型',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '额度(路)',
        dataIndex: 'quota',
        key: 'quota',
        render: text => (
          <Input value={text} />
        ),
      },
    ];
    console.log(td);
    return (
      <div className={styles.contentWrapper}>
        <span className={styles.subTitle}>基础信息</span>
        <Form
          {...formItemLayout}
          labelAlign="middle"
          layout="horizontal"
          name="basic"
          initialValues={{
            remember: true,
          }}
        >
          <div className={styles.basicInfoWrapper}>
            <Form.Item label="租户名称" name="name">
              {getFieldDecorator('name', {
                initialValue: td.name || '',
                rules: [{ required: true, message: '请输入租户名' }],
              })(
                <Input className={styles.formItemInput} onChange={e => this.props.onNameChange(e.target.value)} />
              )}
            </Form.Item>

            <Form.Item label="租户密码" name="password">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} />
            </Form.Item>
            <Form.Item label="密码确认" name="pwdconfirm">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} />
            </Form.Item>
            <Form.Item label="备注" name="description">
              <TextArea className={styles.formItemInput} rows={4} autoSize={false} value={td.description} />
            </Form.Item>
            <span className={styles.subTitle}>规则配置</span>
            <Form.Item label="视频源类型" name="videotype">
              {getFieldDecorator('videotype', {
                rules: [{ required: true, message: 'Please select your videotype!' }],
              })(
                <Select
                  className={styles.formItemInput}
                  placeholder="Select a option and change input text above"
                  onChange={this.handleSelectChange}
                >
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="APPKey" name="pwdconfirm">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} value={this.props.description} />
            </Form.Item>
            <Form.Item label="SecretKey" name="pwdconfirm">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} value={this.props.description} />
            </Form.Item>
            <Form.Item label="NumberKey" name="pwdconfirm">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} value={this.props.description} />
            </Form.Item>
            <Form.Item label="视频接入额度" name="pwdconfirm">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} value={this.props.description} />
            </Form.Item>

            <span className={styles.subTitle}>算法配置</span>
            <Table columns={columns} dataSource={[]} pagination={false} />
          </div>

          <Form.Item>
            <div className={styles.btnWrapper}>
              <Button type="primary" style={{ margin: '20px' }} onClick={() => this.onSave()}>
                保存
              </Button>
              <Button onClick={() => this.onCancel()}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(TenantDetail));
