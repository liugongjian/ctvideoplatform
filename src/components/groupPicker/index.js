/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Tree,
  Input,
  // Icon,
  Modal,
  message,
  Spin,
  Button,
} from 'antd';
import Icon from 'Components/Icon';
import AddFolder from 'Components/folderTree/addFolder';
import styles from './groupPicker.less';


const { TreeNode } = Tree;
const { Search } = Input;
let timer;
class GroupPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectId: null,
      selectName: null,
      searchVal: '',
      groupHover: {},
      addGroupVisible: false,
      editGroupVisible: false,
    };
  }

  initData(props) {
    const { initailVal } = props;
    this.setState({
      selectId: initailVal,
    });
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  onPickerScroll = (e) => {
    clearTimeout(timer);
    this.setState({
      scrolling: true,
    });
    timer = setTimeout(() => {
      this.setState({
        scrolling: false,
      });
    }, 500);
  }

  onMouseEnter = (groupKey) => {
    // console.log('enter', GroupKey);
    this.setState((preState, props) => ({
      groupHover: {
        ...preState.GroupHover,
        [groupKey]: true,
      },
    }));
  }

  onMouseLeave = (groupKey) => {
    // console.log('leave', GroupKey);
    this.setState((preState, props) => ({
      groupHover: {
        ...preState.GroupHover,
        [groupKey]: false,
      },
    }));
  }

  showAddGroup = () => {
    this.setState({
      addGroupVisible: true,
    });
  }

  addGroup = name => this.props.addFunc({ name })

  showEdit = (key, name, e) => {
    e.stopPropagation();
    this.setState({
      editGroupVisible: true,
      editingKey: key,
      editingName: name,
    });
  }

  editGroup = (name) => {
    const { editingKey } = this.state;
    return this.props.editFunc(editingKey, { name });
  }

  delGroup = (key, name, e) => {
    // this.setState({
    //   addGroupVisible: true,
    //   selectId: key,
    // });
    const { delFunc, refresh } = this.props;
    e.stopPropagation();
    Modal.confirm({
      title: `确定要删除[${name}]吗?`,
      // content: '删除部门将删除其下的所有的部门',
      onOk() {
        delFunc(key).then((res) => {
          message.success('删除成功');
          refresh();
        });
      },
      onCancel() {},
    });
  }

  closeAddFolder = (key) => {
    this.setState({
      addGroupVisible: false,
    });
  }

  closeEdit = (key) => {
    this.setState({
      editGroupVisible: false,
    });
  }

  onSearch = (val) => {
    const value = val.replace(/\s*/g, '');// 去除字符串中所有空格
    this.setState({
      searchVal: value,
    });

    const { data } = this.props;
    data.forEach((item) => {
      if (item.name === value) {
        this.setState({
        //   selectId: item.id,

        });
      }
    });
    // this.setState({
    //   expandedKeys,
    //   searchValue: value,
    //   autoExpandParent: true,
    // });
  }

  clickGroup = (item) => {
    if (item.id !== this.state.selectId) {
      this.setState({
        selectId: item.id,
        selectName: item.name,
      });
      this.props.onSelect(item.id, item.name, item.group_type);
    } else {
      this.setState({
        selectId: null,
        selectName: null,
      });
      this.props.onCancelSelect(item.id, item.name);
    }
  }

  render() {
    const {
      selectId,
      searchVal,
      groupHover,
      addGroupVisible,
      editGroupVisible,
      editingKey,
      editingName,
      scrolling,
    } = this.state;
    const { data, loading, refresh } = this.props;
    const self = this;

    return (
      <div className={styles['group-picker']}>
        <Spin spinning={loading}>
          <AddFolder
            visible={addGroupVisible}
            title="添加组"
            placeholder="请输入组名称"
            addFolder={this.addGroup}
            refresh={refresh}
            closeModal={() => this.closeAddFolder()}
          />
          <AddFolder
            visible={editGroupVisible}
            title="修改组名称"
            placeholder="请输入新的组名称"
            addFolder={this.editGroup}
            initialValue={editingName}
            refresh={refresh}
            closeModal={() => this.closeEdit()}
          />
          <div className={styles['search-bar']}>
            <span className={styles['search-input']}><Search placeholder="搜索组名" onSearch={this.onSearch} onChange={e => this.onSearch(e.target && e.target.value)} /></span>
          </div>
          {/* classNames(styles['group-scroll'], styles['group-wrapper']) */}
          <div style={{ overflowY: 'scroll' }} className={`${styles['group-wrapper']} ${scrolling && styles['group-scroll']}`} onScrollCapture={this.onPickerScroll}>
            {data.map((item, index) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={item.id}
                className={styles['group-item-wrapper']}
                onClick={() => self.clickGroup(item)}
                onMouseEnter={() => self.onMouseEnter(item.id)}
                onMouseLeave={() => self.onMouseLeave(item.id)}
                title={`${item.name}(${item.total})`}
              >
                <span className={`${styles['group-item']} ${selectId === item.id ? styles['group-item-selected'] : ''}`}>
                  <span className={`${styles['group-text']} ${(item.name.indexOf(searchVal) > -1 && searchVal !== '') && styles['group-text-match']}`}>{item.name}</span>
                  <span className={styles['group-total']}>{item.total}</span>
                  {
                    groupHover && groupHover[item.id] && !item.uneditable ? (
                      <span className={styles['group-op']}>
                        <a onClick={e => this.showEdit(item.id, item.name, e)}><Icon type="anticon-action-edit" /></a>
                        &nbsp;&nbsp;
                        <a onClick={e => this.delGroup(item.id, item.name, e)}><Icon type="anticon-delete" /></a>
                      </span>
                    ) : ''
                  }
                  {
                    item.component && <span className={styles['group-op']}>{item.component}</span>
                  }
                </span>
              </li>
            ))}
            <li className={`${styles['group-item-wrapper']} ${styles['add-btn-wrapper']}`}><a className={styles['add-btn']} onClick={this.showAddGroup}>+&nbsp;添加组</a></li>
          </div>
        </Spin>
      </div>
    );
  }
}

GroupPicker.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onSelect: PropTypes.func,
  onCancelSelect: PropTypes.func,
  addFunc: PropTypes.func.isRequired,
  delFunc: PropTypes.func.isRequired,
  editFunc: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  initailVal: PropTypes.number,
};
GroupPicker.defaultProps = {
//   treeData: [],
  loading: false,
  initailVal: null,
  onSelect: () => {},
  onCancelSelect: () => {},
};

export default GroupPicker;
