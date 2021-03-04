/* eslint-disable no-mixed-operators */
import React from 'react';
import {
  Modal,
  Button,
} from 'antd';
import warnPic from 'Assets/role/warn.png';
import styles from './modals.less';

/**
 * 提示对话框
 * @props {boolean} visible
 * @props {function} closeModal -visible设置为false
 * @props {function} handleOk 确定操作
 * @props {string || ReactNode} content 右侧内容，可以为string或dom内容
 * @props {string} icon image的src，默认为warnPic，其他图标可自定义
 */
const WarnModal = ({
  visible, closeModal, handleOk = () => {}, content = '您确定要删除该条告警信息吗？', icon = warnPic
}) => {
  const onOk = () => {
    handleOk();
    closeModal();
  };
  const footer = (
    <div className={styles.delModalFooter}>
      <Button type="primary" onClick={onOk}>确定</Button>
      <span className={styles.span10px} />
      <Button onClick={closeModal}>取消</Button>
    </div>
  );
  return (
    <Modal
      className={styles.delModal}
      title=" "
      visible={visible}
      footer={footer}
      onCancel={closeModal}
      width={400}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <img src={icon} alt="" />
        </div>
        <div className={styles.text}>
          {content}
        </div>
      </div>
    </Modal>
  );
};

export default WarnModal;
