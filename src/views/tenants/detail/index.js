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
  getHistoryListTopTen
} from 'Redux/reducer/preview';
import { urlPrefix } from 'Constants/Dictionary';
import styles from './index.less';


const { Option } = Select;
const { TextArea } = Input;

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class TenantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('this.props', this.props.match.params.tenantId);
    // this.props.match.params.tenantId && 请求后端接口
  }

  render() {
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
        dataIndex: 'age',
        key: 'age',
        render: text => (
          <Input value={text} />
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
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
              {getFieldDecorator('input', {
                initialValue: this.props.name || '',
                rules: [{ required: true, message: '请输入租户名' }],
              })(
                <Input className={styles.formItemInput} onChange={e => this.props.onNameChange(e.target.value)} />
              )}
            </Form.Item>

            <Form.Item label="租户密码" name="password">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} value={this.props.description} />
            </Form.Item>
            <Form.Item label="密码确认" name="pwdconfirm">
              <Input.Password className={styles.formItemInput} onChange={e => this.props.onDescriptionChange(e.target.value)} value={this.props.description} />
            </Form.Item>
            <Form.Item label="备注" name="description">
              <TextArea className={styles.formItemInput} rows={4} autoSize={false} />
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
            <Table columns={columns} dataSource={data} pagination={false} />
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
