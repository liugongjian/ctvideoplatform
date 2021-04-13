/* eslint-disable max-len */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button, Table, message, Form, Input, Select
} from 'antd';
import {
  getTenantDetail, getDeviceSupplier, updateTenant, addTenant
} from 'Redux/reducer/platform';
import { urlPrefix } from 'Constants/Dictionary';
import styles from './index.less';


const { Option } = Select;
const { TextArea } = Input;

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getTenantDetail, getDeviceSupplier, updateTenant, addTenant
  },
  dispatch
);

class TenantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantDetail: null,
      deviceSupplier: [],
      supplierParams: [],
      currentKey: '',
      algorithmConfig: [],
    };
  }

  componentDidMount() {
    const { getTenantDetail, getDeviceSupplier } = this.props;
    const { tenantId } = this.props.match.params;
    console.log('this.props', this.props.match.params.tenantId);
    let ckey;
    if (tenantId) {
      getTenantDetail(tenantId).then((res) => {
        console.log('tenantDetail', res);
        ckey = JSON.parse(res.deviceSupplierInfo).supplier;
        const algolist = JSON.parse(res.algorithmsInfoJson).map((item) => {
          delete item.createTime;
          return item;
        });
        this.setState({ tenantDetail: res, currentKey: ckey, algorithmConfig: algolist });
      });
    }
    getDeviceSupplier().then((supplier) => {
      console.log(supplier, 'supplier');
      let mkey;
      if (supplier) {
        if (ckey) {
          supplier.forEach((item, index) => {
            if (item.name === ckey) {
              mkey = index;
            }
          });
          console.log('mkey', mkey);
          console.log('supplier[mkey].supplierParams', supplier[mkey].supplierParam);
          this.setState({ deviceSupplier: supplier, supplierParams: supplier[mkey].supplierParam });
        } else {
          this.setState({ deviceSupplier: supplier, currentKey: 0, supplierParams: supplier[0].supplierParam });
        }
      }
    });
  }

  handleSelectChange = (supkey) => {
    //
    console.log('supkey', supkey);
    this.state.deviceSupplier.forEach((item) => {
      if (item.name === supkey) {
        this.setState({ supplierParams: item.supplierParam, currentKey: supkey });
      }
    });
  }

  handleCfmPwd = (rules, value, callback) => {
    const loginpass = this.props.form.getFieldValue('password');
    if (loginpass && loginpass !== value) {
      callback(new Error('两次密码输入不一致'));
    } else {
      callback();
    }
  }

  onSave = () => {
    const { updateTenant, addTenant } = this.props;
    const { getFieldValue, validateFields } = this.props.form;
    const { tenantId } = this.props.match.params;
    const postTenant = tenantId ? updateTenant : addTenant;
    validateFields((errors, values) => {
      if (!errors) {
        const sources = {};
        this.state.supplierParams.forEach((item) => {
          sources[item] = getFieldValue(item + this.state.currentKey);
        });
        const data = {
          name: getFieldValue('name'),
          password: getFieldValue('password'),
          deviceQuota: getFieldValue('deviceQuota'),
          description: getFieldValue('description'),
          algorithmConfig: this.state.algorithmConfig,
          sourceList: [sources]
        };
        console.log('data', data);
        console.log('supplierParams', this.state.supplierParams);
        postTenant(tenantId, data).then(
          (res) => {
            message.success('提交成功');
            this.props.form.resetFields();
            this.props.history.go(-1);
          }
        ).catch((err) => {
          // message.warning('添加账户失败')
        });
      }
    });
  }

  onAlgoChange = (record, e) => {
    console.log('record1', record);
    console.log('value', e.target.value);
    const algorithmConfig = Object.assign(this.state.algorithmConfig);
    let found = false;
    const result = algorithmConfig.map((item) => {
      if (item.name === record.name) {
        found = true;
        return { ...item, quota: e.target.value };
      }
      return item;
    });
    if (!found) {
      result.push({ name: record.name, quota: e.target.value });
    }
    this.setState({ algorithmConfig: result });
  }

  render() {
    const emptyDetail = {
      algorithmIds: '',
      algorithmQuota: 0,
      algorithmsInfoJson: '[]',
      description: '',
      deviceQuota: 0,
      deviceSupplierInfo: '[]',
      name: '',
    };
    const {
      deviceSupplier, supplierParams, currentKey, tenantDetail
    } = this.state;
    const td = tenantDetail || emptyDetail;
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
        render: (text, record) => (<Input defaultValue={text} onChange={e => this.onAlgoChange(record, e)} />),
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
        >
          <div className={styles.basicInfoWrapper}>
            <Form.Item label="租户名称" name="name">
              {getFieldDecorator('name', {
                initialValue: td.name || '',
                rules: [{ required: true, message: '请输入租户名' }],
              })(
                <Input className={styles.formItemInput} />
              )}
            </Form.Item>

            <Form.Item label="租户密码" name="password">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }]
              })(<Input.Password autoComplete="new-password" className={styles.formItemInput} />)}
            </Form.Item>
            <Form.Item label="密码确认" name="pwdconfirm">
              {getFieldDecorator('pwdconfirm', {
                rules: [{ required: true, message: '请确认密码！' },
                  {
                    validator: (rules, value, callback) => { this.handleCfmPwd(rules, value, callback); }
                  }]
              })(<Input.Password autoComplete="new-password" className={styles.formItemInput} />)}
            </Form.Item>
            <Form.Item label="备注" name="description">
              {getFieldDecorator('description', {
                initialValue: td.description,
                rules: [{ required: true, message: '请确认备注！' }]
              })(<TextArea className={styles.formItemInput} rows={4} autoSize={false} />)}
            </Form.Item>
            <span className={styles.subTitle}>规则配置</span>
            <Form.Item label="视频源类型" name="videotype">
              {getFieldDecorator('videotype', {
                initialValue: JSON.parse(td.deviceSupplierInfo).supplier || '',
                rules: [{ required: true, message: '请选择类型!' }],
              })(
                <Select
                  className={styles.formItemInput}
                  onChange={this.handleSelectChange}
                >
                  {deviceSupplier.map(sup => (
                    <Option key={sup.name}>{sup.cnName}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            {supplierParams.map((item) => {
              if (currentKey === JSON.parse(td.deviceSupplierInfo).supplier) {
                return (
                  <Form.Item label={item}>
                    {getFieldDecorator(item + currentKey, {
                      initialValue: JSON.parse(td.deviceSupplierInfo)[item],
                      rules: [{ required: true, message: `请确认${item}！` }]
                    })(<Input className={styles.formItemInput} />)}
                  </Form.Item>
                );
              }
              return (
                <Form.Item label={item}>
                  {getFieldDecorator(item + currentKey, {
                    rules: [{ required: true, message: `请确认${item}！` }]
                  })(<Input className={styles.formItemInput} />)}
                </Form.Item>
              );
            })}
            <Form.Item label="视频接入额度" name="deviceQuota">
              {getFieldDecorator('deviceQuota', {
                initialValue: td.deviceQuota || '',
                rules: [{ required: true, message: '请输入额度' }],
              })(
                <Input className={styles.formItemInput} />
              )}
            </Form.Item>
            <span className={styles.subTitle}>算法配置</span>
            <Table columns={columns} dataSource={JSON.parse(td.algorithmsInfoJson)} pagination={false} />
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
