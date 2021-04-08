import React, { Component } from 'react';
import {
  Table, Input, Divider, Card, Tabs, Tag
} from 'antd';
import Pagination from 'Components/EPagination';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InnerTable from './components';

// import { getRoleList, deleteRoles } from '@/redux/reducer/role';

import 'antd/dist/antd.css';
import styles from './index.less';

const { Column } = Table;
const { Search } = Input;
const { TabPane } = Tabs;


const mapStateToProps = state => ({ role: state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);


class Tenants extends Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <span>
            {tags.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`/tenants/${record.key}`}>
              编辑
            </Link>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    return (
      <div className={styles.mainWrapper}>
        <div>
          <Card style={{ width: 150 }}>
            <p>可接入设备</p>
            <p>6,560</p>
          </Card>
        </div>
        <div>
          <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <TabPane tab="租户管理" key="1">
              <InnerTable columns={columns} data={data} />
            </TabPane>
            <TabPane tab="License管理" key="2">
              License管理
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

Tenants.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenants);
