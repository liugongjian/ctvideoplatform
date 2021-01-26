import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Input,
} from 'antd';
import styles from './folderTree.less';

class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      itemName: '',
      addLoading: false,
    };
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData = (props) => {
    if (!this.state.addLoading) {
      this.setState({
        itemName: props.initialValue || '',
      });
    }
  }

  onOk = () => {
    const { itemName } = this.state;
    this.setState({
      addLoading: true,
    });
    const add = this.props.addFolder(itemName);
    add.then((res) => {
      this.props.closeModal();
      this.props.refresh();
      this.setState({
        addLoading: false,
      });
      return true;
    }).catch((e) => {
      this.setState({
        addLoading: false,
      });
    });
  };

  onChange = (e) => {
    // addFolder(name);
    this.setState({
      itemName: e.target.value,
    });
  };

  render() {
    const { itemName, addLoading } = this.state;
    const {
      title, visible, addFolder, closeModal, placeholder
    } = this.props;
    return (
      <Modal
        className={styles['add-folder']}
        title={title}
        visible={visible}
        width={400}
        onOk={this.onOk}
        okButtonProps={
          {
            loading: addLoading,
          }
        }
        onCancel={() => closeModal()}
      >
        <Input
          value={itemName}
          placeholder={placeholder}
          onChange={this.onChange}
          disabled={addLoading}
        />
      </Modal>
    );
  }
}

AddFolder.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  addFolder: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

AddFolder.defaultProps = {
};

export default AddFolder;
