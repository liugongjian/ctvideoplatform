import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import RoleUI from '@/views/role/roleUI'


const mapStateToProps = state => ({ roleList: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);


const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0',
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1',
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2',
          },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
  {
    title: '0-3',
    key: '0-3',
  },
  {
    title: '0-4',
    key: '0-4',
  },
];


class RoleEdit extends Component {
  state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
    autoExpandParent: true,
  };



  onFinish(values) {
    console.log('Success:', values);
  };

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  };

  onExpand(keys) {
    console.log('onExpand', keys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({expandedKeys:keys,autoExpandParent:false});
  };

  onCheck(keys){
    console.log('onCheck', keys);
    this.setState({checkedKeys:keys},()=>{console.log(this.state.checkedKeys)});
  };

  onChange(e) {
    const { value } = e.target;

    const treeFilter = (tree, func) => {
        // 使用map复制一下节点，避免修改到原树
        return tree.map(node => ({ ...node })).filter(node => {
          node.children = node.children && treeFilter(node.children, func);
          return func(node) || (node.children && node.children.length)
        })
    };
    const filteredTree = treeFilter(treeData , (node) => { 
      if( node.title.indexOf(value) > -1 ){
        return true;
      }
      return false;
    });

    this.setState({
      checkedKeys:filteredTree,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  componentDidMount() {
    // console.log(this.props.match.params.roleid); 
  }

  render() {
    
    return (
      <RoleUI 
        onExpand={(keys)=>this.onExpand(keys)}
        expandedKeys ={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={(keys)=>this.onCheck(keys)}
        checkedKeys={this.state.checkedKeys}
        treeData={treeData}
      />
    );
  }
}

// RoleEdit.propTypes = {
//     roleedit: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(RoleEdit);
