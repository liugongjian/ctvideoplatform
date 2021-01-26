/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import {
  Modal,
  Row,
  Col
} from 'antd';
import EIcon from 'Components/Icon';
import './modals.less';

/**
 * title
 * line1
 * line2
 * handleOp 点‘是’执行的操作
 * handleClose 关闭对话框方法
 */

class BasicModal extends Component {
  constructor() {
    super();
  }

    onOk = () => {
      this.props.handleOp();
      this.props.handleClose();
    }

    onCancel = () => {
      this.props.handleClose();
    }

    render() {
      const {
        className, handleOp, handleClose, line1, line2, ...restProps
      } = this.props;
      return (
        <Modal
          className={`delete-modal ${className}`}
          width={400}
          okText="是"
          cancelText="否"
          onOk={this.onOk}
          onCancel={this.onCancel}
          {...restProps}
        >
          <Row className="delete-content">
            <Col span={4} className="delete-icon">
              <EIcon type="anticon-warn" />
            </Col>
            <Col offset={1} span={19} className="delete-text">
              <div>
                {line1}
              </div>
              <div>
                {line2}
              </div>
            </Col>
          </Row>

        </Modal>
      );
    }
}

/**
 * props:
 * opName : 删除／禁用／...
 * type :string 操作类型（表、数据库等）
 * name :string 要删除的名称
 * msg :string 提示信息
 * handleOp: func 执行的操作
 * handleClose: func 关闭方法（需要设置visible为false）
 */
class WarnModal extends Component {
  constructor() {
    super();
  }

  render() {
    const {
      opName, type, name, msg, className, ...restProps
    } = this.props;
    return (
      <BasicModal
        title={`${opName}${type}${name}`}
        line1={`确认要${opName}该${type}吗？`}
        line2={msg}
        {...restProps}
      />
    );
  }
}

export {
  BasicModal,
  WarnModal,
};
