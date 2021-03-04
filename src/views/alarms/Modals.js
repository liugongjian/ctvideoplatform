/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import {
  Modal,
  Icon,
  Form,
  Select,
  Radio,
  Input,
  Button,
} from 'antd';
import warnPic from 'Assets/role/warn.png';
import { LicenseProvinces } from './constants';
import styles from './index.less';

class LicenseImportModalComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exist: false,
    };
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps?.initailVal !== this.props.initailVal) {
      this.initData(nextProps);
    }
  }

  initData = (props) => {
    const { initailVal, form } = props;
    const { licenseNo: licenseOrigin, label: labelOrigin, color } = initailVal || {};
    const licenseProvince = licenseOrigin && licenseOrigin[0] || undefined;
    const licenseNo = licenseOrigin && licenseOrigin.slice(1, licenseOrigin.length);
    const label = labelOrigin;
    // switch (labelOrigin) {
    //   case 'WHITE':
    //     label = 1;
    //     break;
    //   case 'BLACK':
    //     label = 2;
    //     break;
    //   default:
    //     break;
    // }
    form.setFieldsValue({
      licenseProvince, licenseNo, color, label
    }, this.validateExist);
  }

  onOk = () => {
    const {
      closeModal, handleImport, isLicenseExist,
      form: { validateFields }
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const {
          licenseProvince, licenseNo, label, color,
        } = values;
        const license = `${licenseProvince}${licenseNo}`;
        handleImport({
          licenseNo: license,
          label,
          color,
        });
      }
    });
  };

  validateExist = (val) => {
    const {
      isLicenseExist, form
    } = this.props;
    const licenseNo = val?.licenseNo || form.getFieldValue('licenseNo');
    const licenseProvince = form.getFieldValue('licenseProvince');
    const license = `${licenseProvince}${licenseNo}`;
    isLicenseExist(license).then((res) => {
      this.setState({ exist: res });
    });
  }

  render() {
    const {
      visible, closeModal, handleImport, initailVal, form, isLicenseExist
    } = this.props;
    const {
      getFieldDecorator
    } = form;
    const {
      exist
    } = this.state;
    const footer = (
      <div className={styles.delModalFooter}>
        <Button type="primary" onClick={this.onOk}>确定</Button>
        <span className={styles.span20px} />
        <Button onClick={closeModal}>取消</Button>
      </div>
    );
    return (
      <Modal
        className={styles.LicenseImport}
        title="导入车牌"
        visible={visible}
        footer={footer}
        // onOk={this.onOk}
        onCancel={closeModal}
        width="500px"
      >
        <div className={styles['LicenseImport-formWrapper']}>
          <Form>
            <Form.Item label="车牌号" style={{ marginBottom: 0 }} className={styles.addItemRequiredIcon}>
              <Form.Item className={styles.licenseSel}>
                {getFieldDecorator('licenseProvince', {
                  rules: [
                    {
                      validator: (rule, val, callback) => {
                        if (!val || !form.getFieldValue('licenseNo')) {
                          callback('请补充车牌号！');
                        }
                        callback();
                      }
                    }
                  ],
                })(
                  <Select
                    onSelect={() => {
                      form.validateFields(['licenseNo']);
                      this.validateExist();
                    }}
                    placeholder="-"
                  >
                    {
                      LicenseProvinces.map(item => (
                        <Select.Option value={item}>{item}</Select.Option>
                      ))
                    }
                  </Select>
                )}
              </Form.Item>
              <span className={styles.licenseSplit}>&nbsp;</span>
              <Form.Item className={styles.licenseInput}>
                {getFieldDecorator('licenseNo', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: ' ',
                    },
                    {
                      validator: (rule, val, callback) => {
                        form.validateFields(['licenseProvince']);
                        if (!val || !form.getFieldValue('licenseProvince')) {
                          callback(' ');
                        }
                        callback();
                      }
                    }
                  ],
                })(<Input
                  onChange={e => this.validateExist({ licenseNo: e.target.value })}
                  placeholder="请输入车牌号"
                />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="布控标签">
              {getFieldDecorator('label', {
                rules: [
                  {
                    required: true,
                    message: '请选择布控标签!',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="WHITE">白名单</Radio>
                  <Radio value="BLACK">黑名单</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="车牌颜色">
              {getFieldDecorator('color', {
                rules: [
                  {
                    required: true,
                    message: '请选择车牌颜色!',
                  },
                ],
              })(
                <Select>
                  <Select.Option value="蓝色">蓝色</Select.Option>
                  <Select.Option value="绿色">绿色</Select.Option>
                  <Select.Option value="黄色">黄色</Select.Option>
                  <Select.Option value="白色">白色</Select.Option>
                  <Select.Option value="黑色">黑色</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Form>
          { exist ? (
            <div className={styles.existMsg}>
              <span className={styles['existMsg-icon']}><Icon type="exclamation-circle" /></span>
              该车牌已经在车辆库中，确定则覆盖原数据。
            </div>
          ) : null}
        </div>
      </Modal>
    );
  }
}
const LicenseImportModal = Form.create()(LicenseImportModalComp);


const ImageModal = ({
  visible, closeModal, src, handleImageError
}) => (
  <Modal
    className={styles.imgModal}
    title="告警图片"
    visible={visible}
    footer={null}
    onCancel={closeModal}
    width="50vw"
    style={{
      maxWidth: '800px'
    }}
  >
    <img
      src={src}
      onError={handleImageError}
      width="100%"
      alt="告警图片"
    />
  </Modal>
);
export {
  LicenseImportModal,
  ImageModal,
};
