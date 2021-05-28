import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './ModalOpr.less';

export default class ModalOpr extends PureComponent {
  render() {
    const {
      visible, title, headComponent, footer, width, children, onCancel, ...rest
    } = this.props;
    const modalTitle = (
      <div className={styles['modal-client-title']}>
        <span className={styles['modal-client-title-text']}>{title}</span>
        { headComponent || null }
        <button type="button" className={styles['modal-client-title-close']} onClick={onCancel}>
          <span className={styles['modal-client-title-close-x']}>
            <i className="anticon anticon-close-circle" />
          </span>
        </button>
      </div>
    );
    return (
      <Modal
        {...rest}
        closable={false}
        title={modalTitle}
        visible={visible}
        onCancel={onCancel}
        footer={footer}
        width={width}
      >
        {children}
      </Modal>
    );
  }
}
ModalOpr.propTypes = {
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  headComponent: PropTypes.any,
  footer: PropTypes.any,
  width: PropTypes.number,
  children: PropTypes.element.isRequired,
};
ModalOpr.defaultProps = {
  footer: null,
  width: 800,
  headComponent: null,
};
