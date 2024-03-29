/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';

import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import { getAreaList, addRole, getMenuList } from '@/redux/reducer/role';
import { pathPrefix } from '@/constants/Dictionary';
import PropTypes from 'prop-types';

import RoleUI from '@/views/role/roleUI';


const mapStateToProps = state => ({ role: state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    addRole,
    getMenuList
  },
  dispatch
);

class RoleAdd extends Component {
  state = {
    tempData: [],
    treeDatas: [],
    activeMenuKey: {
      key: '1'
    },
    expandedKeys: [],
    checkedKeys: {
      menuIds: [],
      areaIds: []
    },
    withParentCheckedKeys: {
      menuIds: [],
      areaIds: []
    },
    selectedKeys: [],
    autoExpandParent: true,
    name: '',
    description: '',
    searchValue: '',
  };

  dataToTree = (data) => {
    // 下面的forEach写法会改变原数组，所以深度拷贝一次
    const copy = JSON.parse(JSON.stringify(data));
    const map = {};
    copy.forEach((item) => {
      item.defaultName = item.name;
      item.key = item.id;
      item.title = item.name;
      map[item.id] = item;
    });
    const val = [];
    copy.forEach((item) => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        val.push(item);
      }
    });
    return val;
  }

  onExpand(keys) {
    this.setState({ expandedKeys: keys, autoExpandParent: false });
  }

  onSelectTreeMenu(key) {
    this.setState({ activeMenuKey: key }, () => {
      if (key.key === '1') {
        this.props.getMenuList().then((res) => {
          const treeDatas = this.dataToTree(res);
          const expandedKeys = res.map(item => item.id);
          this.setState({
            tempData: res,
            treeDatas,
            expandedKeys,
          });
        });
      } else {
        this.props.getAreaList(0, null).then((res) => {
          const treeDatas = this.dataToTree(res);
          const expandedKeys = res.map(item => item.id);
          this.setState({
            tempData: res,
            treeDatas,
            expandedKeys,
          });
        });
      }
    });
  }

  // onSearchInput(value) {
  //   this.setState({ serachInputValue: value }, () => {
  //     if (this.state.activeMenuKey.key === '1') {
  //       this.props.getMenuList(this.state.serachInputValue).then(
  //         (res) => {
  //           res = res.map((item) => {
  //             if (item.configurable) {
  //               return item;
  //             }
  //           });
  //           console.log('onSearchInput', res);
  //           const expandKeys = res.map(item => item.id);
  //           const treeDatas = this.dataToTree(res);
  //           this.setState({
  //             tempData: res,
  //             treeDatas,
  //             expandedKeys: expandKeys,
  //           });
  //         }
  //       );
  //     } else {
  //       this.props.getAreaList(0, this.state.serachInputValue).then((res) => {
  //         const expandKeys = res.map(item => item.id);
  //         const treeDatas = this.dataToTree(res);
  //         this.setState({
  //           tempData: res,
  //           treeDatas,
  //           expandedKeys: expandKeys
  //         });
  //       });
  //     }
  //   });
  // }

  getKeysParents(keys) {
    if (keys.length == 0) {
      return [];
    }
    const pkeys = [];
    keys.forEach((item) => {
      this.state.tempData.forEach((data) => {
        if (item == data.id) {
          pkeys.push(data.pid);
        }
      });
    });
    const temp1 = this.getKeysParents(pkeys);
    const result = pkeys.concat(temp1).concat(keys);
    return result;
  }

  filterArray(keys) {
    keys.forEach((item, index, arr) => {
      if (typeof (item) === 'number') {
        arr[index] = `${item}`;
      }
    });
    keys = Array.from(new Set(keys));
    keys.splice(keys.findIndex(item => item == '0'), 1);
    return keys;
  }

  onCheck(keys) {
    if (this.state.activeMenuKey.key === '1') {
      const menukeys = this.filterArray(this.getKeysParents(keys));
      this.setState({
        checkedKeys: { ...this.state.checkedKeys, menuIds: keys },
        withParentCheckedKeys: { ...this.state.withParentCheckedKeys, menuIds: menukeys }
      });
    } else {
      const areakeys = this.filterArray(this.getKeysParents(keys));
      this.setState({ checkedKeys: { ...this.state.checkedKeys, areaIds: keys }, withParentCheckedKeys: { ...this.state.withParentCheckedKeys, areaIds: areakeys } });
    }
  }

  onNameChange(name) {
    this.setState({ name });
  }

  onDescriptionChange(description) {
    this.setState({ description });
  }

  onSave() {
    this.props.addRole({
      name: this.state.name,
      description: this.state.description,
      menuIds: this.state.withParentCheckedKeys.menuIds,
      areaIds: this.state.withParentCheckedKeys.areaIds,
    }).then((data) => {
      if (data) {
        message.success('添加成功');
        this.props.push(`${pathPrefix}/system/role`);
        this.setState({
          tempData: [],
          treeDatas: [],
          activeMenuKey: {
            key: '1'
          },
          expandedKeys: [],
          checkedKeys: {
            menuIds: [],
            areaIds: []
          },
          withParentCheckedKeys: {
            menuIds: [],
            areaIds: []
          },
          selectedKeys: [],
          autoExpandParent: true,
          name: '',
          description: ''
        });
      }
    });
  }

  onChange(e) {
    const { value } = e.target;

    const treeFilter = (tree, func) =>
    // 使用map复制一下节点，避免修改到原树
      tree.map(node => ({ ...node })).filter((node) => {
        node.children = node.children && treeFilter(node.children, func);
        return func(node) || (node.children && node.children.length);
      });
    const filteredTree = treeFilter(treeData, (node) => {
      if (node.title.indexOf(value) > -1) {
        return true;
      }
      return false;
    });

    this.setState({
      checkedKeys: filteredTree,
      searchValue: value,
      autoExpandParent: true,
    });
  }


  onCancel() {
    this.setState({
      tempData: [],
      treeDatas: [],
      activeMenuKey: {
        key: '1'
      },
      expandedKeys: [],
      checkedKeys: {
        menuIds: [],
        areaIds: []
      },
      selectedKeys: [],
      autoExpandParent: true,
      name: '',
      description: ''
    }, () => {
      this.props.push(`${pathPrefix}/system/role`);
    });
  }

  onSearchChange = (e) => {
    const { value } = e.target;
    const expandedKeys = this.state.tempData.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return item.pid;
      }
    }).filter(item => item);
    this.setState({ searchValue: e.target.value, expandedKeys });
  }

  componentDidMount() {
    this.props.getMenuList().then((res) => {
      const treeDatas = this.dataToTree(res);
      const expandedKeys = res.map(item => item.id);
      this.setState({
        tempData: res,
        treeDatas,
        expandedKeys
      });
    });
    // this.props.getAreaList(0,null).then((res) => {
    //   // console.log(res)
    //   const treeDatas = this.dataToTree(res);
    //   // console.log(treeDatas)
    //   this.setState({
    //     tempData: res,
    //     treeDatas,
    //   });
    // });
  }

  render() {
    return (
      <RoleUI
        onExpand={keys => this.onExpand(keys)}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={keys => this.onCheck(keys)}
        checkedKeys={this.state.checkedKeys}
        onSelectTreeMenu={key => this.onSelectTreeMenu(key)}
        activeMenuKey={this.state.activeMenuKey}
        treeData={this.state.treeDatas}
        onNameChange={name => this.onNameChange(name)}
        onDescriptionChange={description => this.onDescriptionChange(description)}
        onSave={() => this.onSave()}
        onCancel={() => this.onCancel()}
        // onSearchInput={keyword => this.onSearchInput(keyword)}
        name={this.state.name}
        description={this.state.description}
        onSearchChange={this.onSearchChange}
        searchValue={this.state.searchValue}
      />
    );
  }
}

// RoleEdit.propTypes = {
//     roleedit: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(RoleAdd);
