import React, { Component } from 'react';
import {
  Form, Input, Button, Tree, Menu, Card
} from 'antd';

const { Search } = Input;

import styles from './index.less';
import infoPic from '@/assets/role/info.png'


class RoleUI extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const formItemLayout = {
          labelCol: {
            span: 2,
          },
          wrapperCol: {
            span: 14,
          },
        }
    

    return (
      <div className={styles.contentWrapper}>
        <span className={styles.subTitle}>基本配置</span>
            <Form
              {...formItemLayout}
              labelAlign="middle"
              layout="horizontal"
              name="basic"
              initialValues={{
                remember: true,
              }}
            > 
              <Form.Item label="角色名称" name="rolename"
                  rules={[
                    {
                      required: true,
                      message: '请输入角色名',
                    },
                  ]}
                >
                  <Input className={styles.formItemInput}/>
              </Form.Item>
            
              <Form.Item label="角色描述" name="comment">
                  <Input className={styles.formItemInput}/>
              </Form.Item>
          

            <span className={styles.subTitle}>权限配置</span>
              <Form.Item name="rights">

              <div className={styles.tree}>
                <div className={styles.treefl}>
                    <Menu
                      defaultSelectedKeys={['1']}
                      defaultOpenKeys={['sub1']}
                      mode="inline"
                      theme="light"
                    >
                      <Menu.Item key="1">
                        Option 1
                      </Menu.Item>
                      <Menu.Item key="2">
                        Option 2
                      </Menu.Item>
                    </Menu>
                  </div> 

                  <div className={styles.treefr}>
                    <div>
                      <div style={{display:'inline-block',margin:'5px 0 0 5px'}}>
                        <img style={{width:"20px",height:"20px",display:"inline-block"}} src={infoPic}/>
                        <span>请配置当前角色能够访问的系统管理菜单</span>
                      </div>
                      <Search placeholder="请输入菜单名称" style={{ display:'inline-block',float:'right',width:'25%',margin:'5px 5px 0 0'}} onChange={(e)=>this.onChange(e)} />
                    </div>
                    <Tree
                      checkable
                      height={300}
                      onExpand={(keys)=>this.props.onExpand(keys)}
                      expandedKeys={this.props.expandedKeys}
                      autoExpandParent={this.props.autoExpandParent}
                      onCheck={(keys)=>this.props.onCheck(keys)}
                      checkedKeys={this.props.checkedKeys}
                      treeData={this.props.treeData}
                    />
                  </div>
                </div>
              </Form.Item>

            <Form.Item>
              <div className={styles.btnWrapper}>
                <Button type="primary" htmlType="submit" style={{margin:'20px'}}>
                  保存
                </Button>
                <Button>
                  取消
                </Button>
              </div>
            </Form.Item>
        </Form>

          <div> 
        </div>
      </div>
    );
  }
}


export default RoleUI;
