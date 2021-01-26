import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import styles from './index.less';

export default function DelModal(props) {
  const {
    visible, onOk, onCancel, title, children
  } = props;

  const footer = (
    <div className={styles.delModalFooter}>
      <Button type="primary" className={styles.sureBtn} onClick={onOk}>确定</Button>
      <Button className={styles.cancelBtn} onClick={onCancel}>取消</Button>
    </div>
  );
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={title}
      footer={footer}
      wrapClassName={styles.delModalWrap}
      centered
      width={400}
      getContainer={false}
    >
      {children}
    </Modal>
  );
}
