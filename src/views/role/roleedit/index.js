/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import {
  getAreaList,
  addRole,
  getMenuList,
  getRoleInfo,
  editRoleInfo,
} from '@/redux/reducer/role';
import { pathPrefix } from '@/constants/Dictionary';
import PropTypes from 'prop-types';
import RoleUI from '@/views/role/roleUI';

const mapStateToProps = state => ({ role: state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    addRole,
    getMenuList,
    getRoleInfo,
    editRoleInfo,
  },
  dispatch
);

class RoleEdit extends Component {
  state = {
    tempData: [],
    treeDatas: [],
    activeMenuKey: {
      key: '1',
    },
    expandedKeys: [],
    checkedKeys: {
      menuIds: [],
      areaIds: [],
    },
    withParentCheckedKeys: {
      menuIds: [],
      areaIds: [],
    },
    selectedKeys: [],
    autoExpandParent: true,
    name: '',
    description: '',
    roleid: 0,
    serachInputValue: '',
  };


  componentDidMount() {
    const { roleid } = this.props.match.params;

    this.props.getMenuList().then((res) => {
      const expandedKeys = res.map(item => item.id);
      console.log('res', res);
      const treeDatas = this.dataToTree(res);
      this.setState(
        {
          tempData: res,
          treeDatas,
          expandedKeys,
        },
        () => {
          this.props.getRoleInfo(roleid).then((res) => {
            console.log('res1111', res);
            // const checkedKeys = {
            //   menuIds : JSON.parse(res[0].menuIds),
            //   areaIds : JSON.parse(res[0].areaIds),
            // }
            const menuIds = this.checkIfParentChecked(
              this.state.tempData,
              JSON.parse(res[0].menuIds)
            );
            const areaIds = JSON.parse(res[0].areaIds);

            const checkedKeys = {
              menuIds,
              areaIds,
            };
            this.setState({
              roleid,
              name: res[0].name,
              description: res[0].description,
              checkedKeys,
              withParentCheckedKeys: {
                menuIds: JSON.parse(res[0].menuIds),
                areaIds: JSON.parse(res[0].areaIds),
              },
            });
          });
        }
      );
    });
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
          const areaIds = this.checkIfParentChecked(
            res,
            this.state.checkedKeys.areaIds
          );
          this.setState({
            tempData: res,
            treeDatas,
            expandedKeys,
            checkedKeys: { ...this.state.checkedKeys, areaIds },
          });
        });
      }
    });
  }

  onCheck(keys) {
    if (this.state.activeMenuKey.key === '1') {
      const newCheckeKeys1 = this.getNewCheckeKeys(keys, 'menuIds');
      const menukeys = this.filterArray(this.getKeysParents(newCheckeKeys1));
      this.setState({
        checkedKeys: { ...this.state.checkedKeys, menuIds: newCheckeKeys1 },
        withParentCheckedKeys: {
          ...this.state.withParentCheckedKeys,
          menuIds: menukeys,
        },
      });
    } else {
      const newCheckeKeys2 = this.getNewCheckeKeys(keys, 'areaIds');
      const areakeys = this.filterArray(this.getKeysParents(newCheckeKeys2));

      this.setState({
        checkedKeys: { ...this.state.checkedKeys, areaIds: newCheckeKeys2 },
        withParentCheckedKeys: {
          ...this.state.withParentCheckedKeys,
          areaIds: areakeys,
        },
      });
    }
  }

  onNameChange(name) {
    this.setState({ name });
  }

  onDescriptionChange(description) {
    this.setState({ description });
  }

  onSave() {
    this.props
      .editRoleInfo({
        id: this.state.roleid,
        name: this.state.name,
        description: this.state.description,
        menuIds: this.state.withParentCheckedKeys.menuIds,
        areaIds: this.state.withParentCheckedKeys.areaIds,
      })
      .then((data) => {
        if (data) {
          message.success('添加成功');
          this.props.push(`${pathPrefix}/system/role`);

          this.setState({
            tempData: [],
            treeDatas: [],
            activeMenuKey: {
              key: '1',
            },
            expandedKeys: [],
            checkedKeys: {
              menuIds: [],
              areaIds: [],
            },
            withParentCheckedKeys: {
              menuIds: [],
              areaIds: [],
            },
            selectedKeys: [],
            autoExpandParent: true,
            name: '',
            description: '',
          });
        }
      });
  }

  onCancel() {
    this.setState(
      {
        tempData: [],
        treeDatas: [],
        activeMenuKey: {
          key: '1',
        },
        expandedKeys: [],
        checkedKeys: {
          menuIds: [],
          areaIds: [],
        },
        selectedKeys: [],
        autoExpandParent: true,
        name: '',
        description: '',
      },
      () => {
        this.props.push(`${pathPrefix}/system/role`);
      }
    );
  }

  onSearchInput(value) {
    this.setState({ serachInputValue: value }, () => {
      if (this.state.activeMenuKey.key === '1') {
        this.props.getMenuList(this.state.serachInputValue).then((res) => {
          res = res.map((item) => {
            if (item.configurable) {
              return item;
            }
          });
          const expandKeys = res.map(item => item.id);
          const treeDatas = this.dataToTree(res);
          this.setState({
            tempData: res,
            treeDatas,
            expandedKeys: expandKeys,
          });
        });
      } else {
        this.props.getAreaList(0, this.state.serachInputValue).then((res) => {
          const expandKeys = res.map(item => item.id);
          const treeDatas = this.dataToTree(res);
          this.setState({
            tempData: res,
            treeDatas,
            expandedKeys: expandKeys,
          });
        });
      }
    });
  }

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

  getNewCheckeKeys(keys, keytype) {
    // 未选择的选项id
    let deleteIds = [];
    if (keys.length === 0) {
      deleteIds = this.state.tempData.map(item => parseInt(item.id, 0));
    } else {
      this.state.tempData.map((item) => {
        for (let i = 0; i < keys.length; i++) {
          if (item.id !== keys[i]) {
            deleteIds.push(parseInt(item.id, 0));
          }
        }
      });
    }
    // 操作原来角色的权限
    const newCheckeKeys = JSON.parse(
      JSON.stringify(this.state.checkedKeys[keytype])
    ).map(item => parseInt(item, 0));

    // 删除未选择的选项id
    for (let i = 0; i < deleteIds.length; i++) {
      if (newCheckeKeys.indexOf(deleteIds[i]) >= 0) {
        newCheckeKeys.splice(newCheckeKeys.indexOf(deleteIds[i]), 1);
      }
    }
    // 添加已选择的选项id
    for (let i = 0; i < keys.length; i++) {
      if (newCheckeKeys.indexOf(parseInt(keys[i], 0)) < 0) {
        newCheckeKeys.push(parseInt(keys[i], 0));
      }
    }
    return newCheckeKeys;
  }

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
  };

  filterArray(keys) {
    keys.forEach((item, index, arr) => {
      if (typeof item === 'number') {
        arr[index] = `${item}`;
      }
    });
    keys = Array.from(new Set(keys));
    keys.splice(
      keys.findIndex(item => item == '0'),
      1
    );
    return keys;
  }

  checkIfParentChecked(rawtree, checkedKeys) {
    let parentCheckedKeys = [];
    const rawtreekeys = [];
    let leafCheckedKeys = [];
    const parentKeysInfo = {};
    // 找到父节点
    checkedKeys.forEach((item) => {
      rawtree.forEach((data) => {
        if (item == data.pid) {
          parentCheckedKeys.push(item);
        }
      });
    });
    // 去重
    parentCheckedKeys = Array.from(new Set(parentCheckedKeys));
    rawtree.forEach((item) => {
      rawtreekeys.push(item.id);
    });
    leafCheckedKeys = rawtreekeys.filter(
      key => !parentCheckedKeys.includes(key) && checkedKeys.includes(key)
    );
    parentCheckedKeys.forEach((item) => {
      const leafTotal = rawtree.filter(k => k.pid == item).length; // 原树中当前父节点子节点的总个数
      let leafChecked = 0;
      leafCheckedKeys.forEach((leaf) => {
        rawtree.forEach((node) => {
          if (leaf == node.id && item == node.pid) {
            leafChecked++;
          }
        });
      });
      if (leafTotal == leafChecked) {
        leafCheckedKeys.push(item);
      }
    });
    return leafCheckedKeys;
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
        onDescriptionChange={description => this.onDescriptionChange(description)
        }
        onSave={() => this.onSave()}
        onCancel={() => this.onCancel()}
        name={this.state.name}
        description={this.state.description}
        onSearchInput={keyword => this.onSearchInput(keyword)}
      />
    );
  }
}

// RoleEdit.propTypes = {
//     roleedit: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(RoleEdit);
