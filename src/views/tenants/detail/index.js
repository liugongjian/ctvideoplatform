/* eslint-disable no-useless-escape */
/* eslint-disable react/sort-comp */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { push } from 'react-router-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button, Table, message, Form, Input, Select, Tooltip, Icon
} from 'antd';
import {
  getTenantDetail, getDeviceSupplier, updateTenant, addTenant, getAlgorithmList, getDeviceQuota, getAllAlgorithmQuota
} from 'Redux/reducer/platform';
import { urlPrefix } from 'Constants/Dictionary';
import { pathPrefix } from '@/constants/Dictionary';
import { Fragment } from 'react';
import styles from './index.less';


const { Option } = Select;
const { TextArea } = Input;
const encodeFormat = 'encodeFormat';
const baseUri = 'baseUri';
const encodeFormatOptions = ['H.264', 'H.265'];

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getTenantDetail, getDeviceSupplier, updateTenant, addTenant, getAlgorithmList, getDeviceQuota, getAllAlgorithmQuota
  },
  dispatch
);

class TenantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantDetail: null,
      deviceSupplier: [],
      tenantSupllier: [],
      supplierParams: [],
      currentKey: '',
      algorithmConfig: [],
      algorithmList: [],
      deviceQuota: 0,
    };
  }

  componentDidMount() {
    const {
      getTenantDetail, getDeviceSupplier, getAlgorithmList, getDeviceQuota, getAllAlgorithmQuota
    } = this.props;
    const { tenantId } = this.props.match.params;
    let calgolist; let algoTableData;
    let ckey;
    if (tenantId) {
      getTenantDetail(tenantId)
        .then((res) => {
          console.log('tenantDetail', res);
          ckey = res.deviceSupplierIdList ? JSON.parse(res.deviceSupplierIdList) : [];
          const algolist = JSON.parse(res.algorithmsInfoJson).map((item) => {
            delete item.createTime;
            return item;
          });
          console.log('JSON.parse(res.algorithmsInfoJson)', JSON.parse(res.algorithmsInfoJson));
          calgolist = JSON.parse(res.algorithmsInfoJson);
          this.setState({ tenantDetail: res });
          getDeviceSupplier().then((supplier) => {
            console.log('supplier', supplier);
            const tenantSupllier = [];
            if (supplier) {
              // supplier.forEach((item, index) => {
              //   if (item.name === ckey) {
              //     mkey = index;
              //   }
              // });
              this.setState({ deviceSupplier: supplier });
            }
          });
          getAlgorithmList().then((list) => {
            console.log('getAlgorithmList', list);
            console.log('calgolist', calgolist);

            if (list) {
              getAllAlgorithmQuota().then((allquota) => {
                console.log('getAllAlgorithmQuota', allquota);
                algoTableData = list.map((algo) => {
                  // eslint-disable-next-line no-restricted-syntax
                  let quota = null;
                  calgolist.forEach((item) => {
                    if (item.name === algo.name) {
                      // eslint-disable-next-line prefer-destructuring
                      quota = item.quota;
                    }
                  });
                  return {
                    name: algo.name,
                    quota: quota || 0,
                    cnName: algo.cnName,
                    quotaTotal: allquota[algo.name]
                  };
                });
                console.log('algoTableData', algoTableData);
                this.setState({ algorithmList: list, algorithmConfig: algoTableData });
              });
            }
          });
        });
    } else {
      getDeviceSupplier().then((supplier) => {
        console.log(supplier, 'supplier');
        let mkey;
        if (supplier) {
          // this.setState({ deviceSupplier: supplier, currentKey: supplier[0].name, supplierParams: supplier[0].supplierParam });
          this.setState({ deviceSupplier: supplier });
        }
      });
      getAlgorithmList().then((list) => {
        console.log('getAlgorithmList', list);
        if (list) {
          getAllAlgorithmQuota().then((allquota) => {
            const table = list.map(item => ({
              name: item.name,
              quota: 0,
              cnName: item.cnName,
              quotaTotal: allquota[item.name]
            }));
            this.setState({ algorithmList: list, algorithmConfig: table });
          });
        }
      });
    }


    getDeviceQuota().then((quota) => {
      if (quota) {
        this.setState({ deviceQuota: quota });
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

  handleCalcQuotaTotal(record) {
    let temp; let temp2;
    this.state.algorithmConfig.forEach((item) => {
      if (item.name === record.name) {
        temp = item;
      }
    });
    if (this.state.tenantDetail) {
      const algorithmsInfo = JSON.parse(this.state.tenantDetail.algorithmsInfoJson);
      algorithmsInfo.forEach((item) => {
        if (item.name === record.name) {
          temp2 = item;
        }
      });
      return (
        <span>{`${record.quota || '0'} / ${parseInt(temp.quotaTotal, 10) + parseInt(temp2 ? temp2.quota : '0', 10)}`}</span>
      );
    }
    return (
      <span>{`${record.quota || '0'} / ${parseInt(temp.quotaTotal, 10)}`}</span>
    );
  }

  onSave = () => {
    const { updateTenant, addTenant } = this.props;
    const { getFieldValue, validateFieldsAndScroll } = this.props.form;
    const { tenantId } = this.props.match.params;
    const postTenant = tenantId ? updateTenant : addTenant;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const data = tenantId
          ? {
            name: getFieldValue('name'),
            deviceQuota: getFieldValue('deviceQuota'),
            description: getFieldValue('description').trim(),
            algorithmConfig: this.state.algorithmConfig,
            deviceSupplierIdList: getFieldValue('videotype')
          } : {
            name: getFieldValue('name'),
            password: getFieldValue('password'),
            deviceQuota: getFieldValue('deviceQuota'),
            description: getFieldValue('description'),
            algorithmConfig: this.state.algorithmConfig,
            deviceSupplierIdList: getFieldValue('videotype')
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

  onCancel = () => {
    this.props.push(`${pathPrefix}/platform`);
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

  validatorPsw = (rule, value, callback) => {
    if (!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_~.])(.{12,26})/.test(value)) && value) {
      callback(new Error('密码至少包含大小写字母、数字和特殊字符(!@#$%^&*?_~.)，且长度为12～26位字符'));
    } else {
      callback();
    }
  };

  validatorUrl = (rule, value, callback) => {
    try {
      //  const strReg = '^((https|http)?://)'
      //  + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
      //   + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
      //   + '|' // 允许IP和DOMAIN（域名）
      //   + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      //   + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
      //   + '[a-z]{2,6})' // first level domain- .com or .museum
      //   + '(:[0-9]{1,10})?' // 端口- :80
      //   + '((/?)|' // a slash isn't required if there is no file name
      //   + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
      // const re = new RegExp(strReg);
      const re = /^((https|http)?:\/\/)(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])/;
      if (!(re.test(value)) && value) {
        callback(new Error('不是有效的URL地址，请更正！'));
      } else {
        callback();
      }
    } catch (err) {
      callback(err);
    }
    // try {
    //  const strReg = '^((https|http)?://)'
    //  + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
    //   + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
    //   + '|' // 允许IP和DOMAIN（域名）
    //   + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    //   + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
    //   + '[a-z]{2,6})' // first level domain- .com or .museum
    //   + '(:[0-9]{1,10})?' // 端口- :80
    //   + '((/?)|' // a slash isn't required if there is no file name
    //   + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    // const re = new RegExp(strReg);
    //   const re = /^((https|http)?:\/\/)(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    //   if (!(re.test(value)) && value) {
    //     callback(new Error('不是有效的URL地址，请更正！'));
    //   } else {
    //     callback();
    //   }
    // } catch (err) {
    //   callback(err);
    // }
    callback();
  };

  validatorDeviceQuota = (rule, value, callback) => {
    try {
      const tdQuota = this.state.tenantDetail ? this.state.tenantDetail.deviceQuota : 0;
      if (parseInt(value, 10) > tdQuota + this.state.deviceQuota) {
        callback(new Error(`不能超过总额度${tdQuota + this.state.deviceQuota}`));
      } else {
        callback();
      }
    } catch (err) {
      callback(err);
    }
  };

  validatorAlgoQuota = (rule, value, callback, record) => {
    try {
      const algoQuota = this.state.tenantDetail ? JSON.parse(this.state.tenantDetail.algorithmsInfoJson) : null;
      let ifValid = true;
      // const re = /^([0]|[1-9][0-9]*)$/;
      if (algoQuota) {
        algoQuota.forEach((algo) => {
          if (algo.name === record.name && (algo.quota + record.quotaTotal < record.quota)) {
            ifValid = false;
          }
        });
      } else if (record.quota > record.quotaTotal) {
        ifValid = false;
      } else {
        ifValid = true;
      }
      ifValid ? callback() : callback(new Error('不能大于总额度！'));
    } catch (err) {
      callback(err);
    }
  };

  // renderEncodeFormat = (item, currentKey, deviceSupplierInfo) => {
  //   const { getFieldDecorator } = this.props.form;
  //   return (
  //     <Form.Item label={item.name}>
  //       <Tooltip placement="right" title={item.desc}>
  //         {getFieldDecorator(item.name + currentKey, {
  //           initialValue: currentKey === deviceSupplierInfo.supplier ? deviceSupplierInfo[item.name] : '',
  //           rules: [{ required: true, message: `请确认${item.name}！` }],
  //           validateTrigger: ['onBlur', 'onInput']
  //         })(
  //           <Select
  //             className={styles.formItemInput}
  //           >
  //             {encodeFormatOptions.map(option => (
  //               <Option key={option}>{option}</Option>
  //             ))}
  //           </Select>
  //         )}
  //       </Tooltip>
  //     </Form.Item>
  //   );
  // }

  // renderBaseUri = (item, currentKey, deviceSupplierInfo) => {
  //   const { getFieldDecorator } = this.props.form;
  //   return (
  //     <Form.Item label={item.name}>
  //       <Tooltip placement="right" title={`${item.desc}（以http(s)://开头的网络地址）`}>
  //         {getFieldDecorator(item.name + currentKey, {
  //           initialValue: currentKey === deviceSupplierInfo.supplier ? deviceSupplierInfo[item.name] : '',
  //           rules: [
  //             { required: true, message: `请确认${item.name}！` },
  //             { max: 50, message: '不能超过50位' },
  //             { validator: (rule, value, callback) => this.validatorUrl(rule, value, callback) }
  //           ],
  //           validateTrigger: ['onBlur', 'onInput'],
  //           validateFirst: true,
  //         })(
  //           <Input
  //             className={styles.formItemInput}
  //           />
  //         )}
  //       </Tooltip>
  //     </Form.Item>
  //   );
  // }

  render() {
    const emptyDetail = {
      algorithmIds: '',
      algorithmQuota: 0,
      algorithmsInfoJson: '[]',
      description: '',
      deviceQuota: 0,
      deviceSupplierInfo: '{"supplier":"ffcs2"}',
      deviceSupplierIdList: null,
      name: '',
    };
    const { tenantId } = this.props.match.params;
    const {
      deviceSupplier, supplierParams, currentKey, tenantDetail, tenantSupllier
    } = this.state;
    const td = tenantDetail || emptyDetail;
    const deviceSupplierIdList = td.deviceSupplierIdList
      ? JSON.parse(td.deviceSupplierIdList)
      : [];
    console.log('deviceSupplierIdList', deviceSupplierIdList);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 13,
      },
    };
    const columns = [
      {
        title: '算法类型',
        dataIndex: 'cnName',
        key: 'cnName',
      },
      {
        title: '剩余额度',
        dataIndex: 'quotaTotal',
        key: 'quotaTotal',
        render: (text, record) => this.handleCalcQuotaTotal(record),
      },
      {
        title: '额度(路)',
        dataIndex: 'quota',
        key: 'quota',
        render: (text, record) => (
          <div style={{ marginTop: '24px' }}>
            <Form.Item>
              {/* {getFieldDecorator(record.name, {
              initialValue: text,
              rules: [
                { required: true, message: `请输入${record.cnName}额度！` },
                { pattern: /^([0]|[1-9][0-9]*)$/, message: '必须大于等于0的整数' },
                { validator: (rule, value, callback) => this.validatorAlgoQuota(rule, value, callback, record) }],
              validateTrigger: 'onChange' */}
              {getFieldDecorator(record.name,
                {
                  initialValue: text,
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                  rules: [
                    { required: true, message: `请输入${record.cnName}额度！` },
                    { pattern: /^([0]|[1-9][0-9]*)$/, message: '必须大于等于0的整数' },
                    { validator: (rule, value, callback) => this.validatorAlgoQuota(rule, value, callback, record) }
                  ]
                })(<Input onChange={e => this.onAlgoChange(record, e)} />)}
            </Form.Item>
          </div>
        ),
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
                rules: [{ required: true, message: '请输入租户名' }, { max: 50, message: '不能超过50个字符' }],
                validateTrigger: ['onBlur', 'onInput']
              })(
                <Input className={styles.formItemInput} disabled={!!tenantId} />
              )}
            </Form.Item>
            {
              !tenantId && (
                <Fragment>
                  <Form.Item label="租户密码" name="password">
                    {getFieldDecorator('password', {
                      rules: [
                        { required: true, message: '请输入密码！' },
                        { validator: (rule, value, callback) => this.validatorPsw(rule, value, callback) },
                        { max: 26, message: '密码不能超过26位' },
                        { min: 12, message: '密码不能少于12位' }
                      ],
                      validateTrigger: ['onBlur', 'onInput'],
                      validateFirst: true
                    })(<Input.Password autoComplete="new-password" className={styles.formItemInput} />)}
                  </Form.Item>
                  <Form.Item label="密码确认" name="pwdconfirm">
                    {getFieldDecorator('pwdconfirm', {
                      rules: [
                        { required: true, message: '请确认密码！' },
                        {
                          validator: (rules, value, callback) => { this.handleCfmPwd(rules, value, callback); }
                        }],
                      validateTrigger: ['onBlur', 'onInput'],
                      validateFirst: true
                    })(<Input.Password autoComplete="new-password" className={styles.formItemInput} />)}
                  </Form.Item>
                </Fragment>
              )
            }
            <Form.Item label="备注" name="description">
              {getFieldDecorator('description', {
                initialValue: td.description,
                rules: [{ required: true, message: '请确认备注！' }, { max: 100, message: '不能超过100个字符' }],
                validateFirst: true,
                validateTrigger: ['onBlur', 'onInput']
              })(<TextArea className={styles.formItemInput} rows={4} autoSize={false} />)}
            </Form.Item>
            <span className={styles.subTitle}>规则配置</span>
            <Form.Item label="视频源类型" name="videotype">
              {getFieldDecorator('videotype', {
                initialValue: deviceSupplierIdList,
                rules: [{ required: true, message: '请选择类型!' }],
                validateTrigger: ['onBlur', 'onInput']
              })(
                <Select
                  mode="multiple"
                  className={styles.formItemInput}
                  maxTagCount={2}
                  maxTagTextLength={10}
                >
                  {deviceSupplier.map(sup => (
                    <Option key={sup.id}>{sup.displayName}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            {/* {supplierParams.map((item) => {
              if (currentKey === deviceSupplierInfo.supplier) {
                console.log('deviceSupplierInfo', deviceSupplierInfo);
                if (item.name === encodeFormat) {
                  return this.renderEncodeFormat(item, currentKey, deviceSupplierInfo);
                }
                if (item.name === baseUri) {
                  return this.renderBaseUri(item, currentKey, deviceSupplierInfo);
                }
                return (
                  <Form.Item label={item.name}>
                    <Tooltip placement="right" title={item.desc}>
                      {getFieldDecorator(item.name + currentKey, {
                        initialValue: deviceSupplierInfo[item.name],
                        rules: [{ required: true, message: `请确认${item.name}！` }, { max: 50, message: '不能超过50位' }],
                        validateTrigger: ['onBlur', 'onInput']
                      })(
                        <Input
                          className={styles.formItemInput}
                        />
                      )}
                    </Tooltip>
                  </Form.Item>
                );
              }
              if (item.name === encodeFormat) {
                return this.renderEncodeFormat(item, currentKey, deviceSupplierInfo);
              }
              if (item.name === baseUri) {
                return this.renderBaseUri(item, currentKey, deviceSupplierInfo);
              }
              return (
                <Form.Item label={item.name}>
                  <Tooltip placement="right" title={item.desc}>
                    {getFieldDecorator(item.name + currentKey, {
                      rules: [{ required: true, message: `请确认${item.name}！` }, { max: 50, message: '不能超过50位' }],
                      validateTrigger: ['onBlur', 'onInput']
                    })(
                      <Input
                        className={styles.formItemInput}
                      />
                    )}
                  </Tooltip>
                </Form.Item>
              );
            })} */}
            <Form.Item label="视频接入额度" name="deviceQuota">
              {getFieldDecorator('deviceQuota', {
                initialValue: td.deviceQuota || '',
                rules: [
                  { required: true, message: '请输入额度' },
                  { pattern: /^([0]|[1-9][0-9]*)$/, message: '必须大于等于0的整数' },
                  { validator: (rule, value, callback) => this.validatorDeviceQuota(rule, value, callback) }
                ],
                validateTrigger: ['onBlur', 'onInput'],
                validateFirst: true,
              })(
                <Input className={styles.formItemInput} />
              )}
              <span className={styles.quota}>
                剩余额度：
                <span className={`${styles.quota} ${styles.warn}`}>{`${this.props.form.getFieldValue('deviceQuota') || 0} / ${this.state.deviceQuota + td.deviceQuota || 0}`}</span>
              </span>
            </Form.Item>
            <span className={styles.subTitle}>算法额度配置</span>
            <Table tableLayout="fixed" rowKey={record => record.name} columns={columns} dataSource={this.state.algorithmConfig} pagination={false} />
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
