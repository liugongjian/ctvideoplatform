import React, { Component } from 'react';
import {
  Modal,
  Icon,
  Form,
  Select,
  Radio,
  Input,
} from 'antd';
import { LicenseProvinces } from './constants';
import styles from './index.less';

class LicenseImportModalComp extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onOk = () => {
    const {
      closeModal, handleImport, form: { validateFields }
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        handleImport();
        closeModal();
      }
    });
  };

  render() {
    const {
      visible, closeModal, handleImport, initailVal, form
    } = this.props;
    const {
      getFieldDecorator
    } = form;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 16 },
    //   },
    // };
    return (
      <Modal
        className={styles.LicenseImport}
        title="导入车牌"
        visible={visible}
        onOk={this.onOk}
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
                    onSelect={() => { form.validateFields(['licenseNo']); }}
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
                  <Radio value={1}>白名单</Radio>
                  <Radio value={2}>黑名单</Radio>
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
        </div>
      </Modal>
    );
  }
}
const LicenseImportModal = Form.create()(LicenseImportModalComp);


const DeleteModal = ({
  visible, closeModal, handleOk = () => {}
}) => {
  const onOk = () => {
    handleOk();
    closeModal();
  };
  return (
    <Modal
      className={styles.delModal}
      title="删除提示"
      visible={visible}
      onOk={onOk}
      onCancel={closeModal}
      width="400px"
    >
      <div className={styles.content}>
        <span className={styles.iconWrapper}><Icon type="warning" theme="filled" /></span>
        <span className={styles.text}>您确定要删除该条告警信息吗？</span>
      </div>
    </Modal>
  );
};


const ImageModal = ({
  visible, closeModal, src
}) => (
  <Modal
    className={styles.imgModal}
    title="告警图片"
    visible={visible}
    footer={null}
    onCancel={closeModal}
    width="50vw"
  >
    <img src={src} width="100%" alt="告警图片" />
  </Modal>
);
export {
  LicenseImportModal,
  DeleteModal,
  ImageModal,
};
