import React from 'react';
import {
  Select,
  Input,
  Menu,
  Dropdown,
  Table,
  Tabs,
  Popover,
  Button,
  Radio,
  Checkbox,
  Row,
  Col
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import * as loadable from 'react-loadable';

// import EButton from 'Components/EButton';
import ETable from 'Components/ETable';
import Icon from 'Components/Icon';
import EPopover from 'Components/EPopover';

// test FormPop
import FormPop from 'Components/FormPop';

import ESwitch from 'Components/ESwitch';
import ERadio from 'Components/ERadio';
import ESearch from 'Components/ESearch';
import ECheckableTag from 'Components/ECheckableTag';
import ECheckableTagGroup from 'Components/ECheckableTagGroup';
// import Test from 'Components/Donut';

import ERegion from 'Components/ERegion';
import EDatepicker from 'Components/EDatepicker';
import EInput from 'Components/EInput';

import styles from 'Styles/index.less';

import use from 'Components/use.less';
import { load } from 'Redux/reducer/info';

console.log(use);

const TestDonut = loadable({
  loader: () => import('Components/Donut'),
  loading() {
    return <div>Loading...</div>;
  }
});


const { Option } = Select;
const { Search } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const { SubMenu, ItemGroup: MenuItemGroup } = Menu;
const { TabPane } = Tabs;

// const { Search } = Input;
const plainOptions = ['Apple', 'Pear', 'Orange'];
const optionsWithDisabled = [
  { label: 'Nut', value: 'Nut' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear', disabled: true },
  { label: 'Orange', value: 'Orange', disabled: true }
];
const tagGroupOptions = [
  {
    value: 1,
    text: '组件1'
  },
  {
    value: 2,
    text: '组件2'
  },
  {
    value: 3,
    text: '组件3'
  },
  {
    value: 4,
    text: '组件4'
  }
];
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

const tableStatusMap = {
  start: {
    name: '启动中',
    icon: 'anticon-dot-circle-o',
    color: '#3399FF',
  },
  running: {
    name: '运行中',
    icon: 'anticon-status-running',
    color: '#3DCCA6',
  },
  stopping: {
    name: '终止中',
    icon: 'anticon-status-off',
    color: '#999999',
  },
  stop: {
    name: '已终止',
    icon: 'anticon-status-off',
    color: '#999999',
  },
  error: {
    name: '异常',
    icon: 'anticon-status-problem',
    color: '#FF8833',
  },
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    render: text => <a href="javascript:;">{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    render: age => [
      <Popover
        content={(
          <div>
            <div>11111</div>
            <div>22222</div>
            <div>33333</div>
            <div>44444</div>
            <div>55555</div>
          </div>
        )}
        title="title"
        placement="top"
        key="top"
      >
        <Button type="primary">top</Button>
      </Popover>,
      <Popover
        content={(
          <div>
            <div>11111</div>
            <div>22222</div>
            <div>33333</div>
            <div>44444</div>
            <div>55555</div>
          </div>
        )}
        title="title"
        placement="bottom"
        key="bottom"
      >
        <Button type="primary">bottom</Button>
      </Popover>,
      <Popover
        content={(
          <div>
            <div>11111</div>
            <div>22222</div>
            <div>33333</div>
            <div>44444</div>
            <div>55555</div>
          </div>
        )}
        placement="left"
        key="left"
      >
        <Button type="primary">left</Button>
      </Popover>,
      <Popover
        content={(
          <div>
            <div>11111</div>
            <div>22222</div>
            <div>33333</div>
            <div>44444</div>
            <div>55555</div>
          </div>
        )}
        placement="right"
        key="right"
      >
        <Button type="primary">right</Button>
      </Popover>,
    ],
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '50%',
    className: 'ellipsis',
    render: text => (
      <span title={text}>
        {text}
      </span>
    )
  },
  {
    title: 'status',
    dataIndex: 'status',
    render: (status) => {
      const { name, icon, color } = tableStatusMap[status];
      return (
        <span>
          <Icon type={icon} style={{ color, marginRight: '5px' }} />
          {name}
        </span>
      );
    }
  }
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. This is a long text.',
    status: 'start',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    status: 'running',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    status: 'stop',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
    status: 'error',
  }
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name
  })
};

const pagination = {
  total: 100,
  defaultCurrent: 1,
  defaultPageSize: 10,
};

const mapStateToProps = state => ({ info: state.info });
const mapDispathToProps = dispatch => bindActionCreators({ load, push }, dispatch);

class Components extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = { loading: false };
  //   }

  state = {
    disabledSwitch: true,
    ERadioValue: 2,
    checkedList: ['Apple', 'Orange'],
    indeterminate: true,
    checkAll: false,
    tagStatus: false,
    selectedList: [],
    showRegion: false, // ERegion是否展示
    chooseRegion: '北京3', // ERegion选择的值
    inputValue: '',
    dateValue: [],
  };

  componentDidMount() {
    // import('Components/Donut').then((value) => {
    //   this.getDonut(value);
    //   // this.setState({ AnotherComponent: value.default });
    // });
    // this.getDonut();
  }

  onClick = (e) => {
    const { push, load } = this.props;
    push('/');
  };

  onTestRedux = () => {
    console.log('点击redux');
    const { load } = this.props;
    load();
  };

  toggleSwitch = () => {
    const { disabledSwitch } = this.state;
    this.setState({
      disabledSwitch: !disabledSwitch
    });
  };

  onERadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      ERadioValue: e.target.value
    });
  };

  onCheckChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length
    });
  };

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  changeTagStatus = () => {
    this.setState(prevState => ({ tagStatus: !prevState.tagStatus }));
  };

  changeTagGroupStatus = (selectedList) => {
    this.setState({
      selectedList
    });
  };


  // getDonut = async (donut) => {
  //   const fun = donut.default;
  //   console.log('donut', fun);
  //   const nodes = await fun();
  //   console.log('nodes', nodes);
  //   this.setState({ AnotherComponent: nodes });
  // }


  // ERegion回调
  chooseProvince = (name, url, id) => {
    // id 是城市的ID，用来调取接口。
    console.log(name, url, id);
    this.setState({
      showRegion: false
    }, () => {
      if (url) {
        window.open(url);
      } else {
        this.setState({
          chooseRegion: name
        });
      }
    });
  }

  // EDatepicker默认回传2个数组，第一个是moment数组，第二个是YYYY-MM-DD数组  两个数组都是['startval','endval']格式
  getDate =(moment, dateValue) => {
    this.setState({
      dateValue
    }, () => console.log(dateValue));
  }

  render() {
    const {
      disabledSwitch,
      ERadioValue,
      indeterminate,
      checkAll,
      checkedList,
      tagStatus,
      selectedList,
      AnotherComponent,
      showRegion,
      chooseRegion = '',
      inputValue = '',
      dateValue
    } = this.state;
    console.log('AnotherComponent', AnotherComponent);
    console.log(dateValue);
    const children = [];
    for (let i = 10; i < 36; i += 1) {
      children.push(
        <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
      );
    }

    const { info } = this.props;
    console.log('info', info, styles);

    // formpop 测试值
    const tips = [{
      message: '长度为8~15个字符',
      validate: /^.{8,15}$/
    }, {
      message: '字母、数字及至少一个特殊符号（#!@）组合',
      validate: /^(?=.*[#!@])[0-9a-zA-Z#!@]+$/
    },
    {
      message: '需包含大写字母',
      validate: /^(?=.*[A-Z]).+$/
    }
    ];

    return (
      <div>
        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>图标</span>
          </Col>
          <Col span={18}>
            {' '}
            <Icon type="anticon-NAT-Gateway" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>小色按钮</span>
          </Col>
          <Col span={18}>
            {' '}
            <Button onClick={this.onClick} type="primary">首页</Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>小色按钮：禁用</span>
          </Col>
          <Col span={18}>
            {' '}
            <Button disabled type="primary">
              +申请集群
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>按钮</span>
          </Col>
          <Col span={18}>
            {' '}
            <Button onClick={this.onTestRedux}>redux promise</Button>
            {/* {`${Object.entries(info)}`} */}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>按钮</span>
          </Col>
          <Col span={18}>
            {' '}
            <Button disabled>button</Button>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>下拉菜单</span>
          </Col>
          <Col span={18}>
            {' '}
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={() => { }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>搜索框</span>
          </Col>
          <Col span={18}>
            {' '}
            <Search />

          </Col>
        </Row>


        <Row gutter={16}>
          <Col style={{ textAlign: 'right' }} span={6}>
            <span>表单新提示</span>
          </Col>
          <Col span={18}>
            {' '}
            <EPopover tips={tips} />
          </Col>
        </Row>


        {/* by hjt */}
        <div style={{ margin: 20 }}>
          {/* switch */}
          <div>
            <ESwitch disabled={disabledSwitch} defaultChecked />
            {' '}
            &nbsp;
            <Button type="primary" onClick={this.toggleSwitch}>
              Toggle disabled
            </Button>
          </div>
          {/* radio */}
          <div>
            <RadioGroup onChange={this.onERadioChange} value={ERadioValue}>
              <Radio value={1}>A</Radio>
              <Radio value={2} disabled>
                B
              </Radio>
              <Radio value={3}>C</Radio>
            </RadioGroup>
          </div>
          {/* checkbox */}
          <div>
            <CheckboxGroup
              options={optionsWithDisabled}
              defaultValue={['Nut', 'Orange']}
            />
          </div>
          <div>
            <div style={{ marginTop: 10, borderBottom: '1px solid #E9E9E9' }}>
              <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
              <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkAll}
                disabled
              >
                Check all
              </Checkbox>
            </div>
            <CheckboxGroup
              options={plainOptions}
              value={checkedList}
              onChange={this.onCheckChange}
            />
          </div>
          {/* search */}
          <div>
            <ESearch
              placeholder="请输入关键字"
              onSearch={value => console.log(value)}
              style={{ width: 300 }}
            />
            <ESearch
              placeholder="请输入关键字"
              disabled
              onSearch={value => console.log(value)}
              style={{ width: 300 }}
            />
            <Input placeholder="input with clear icon" allowClear />
          </div>
          {/* checkableTag */}
          <div>
            <ECheckableTag checked={tagStatus} onChange={this.changeTagStatus}>
              测试
            </ECheckableTag>
            <ECheckableTag checked>默认选中</ECheckableTag>
            <ECheckableTag disabled>禁用</ECheckableTag>
            <ECheckableTag size="large">large</ECheckableTag>
            <ECheckableTag size="small">small</ECheckableTag>
          </div>
          {/* checkableTagGroup */}
          <div>
            <ECheckableTagGroup
              options={tagGroupOptions}
              onChange={this.changeTagGroupStatus}
              selectedList={selectedList}
            />
          </div>
          <div>
            <ECheckableTagGroup
              disabled
              options={tagGroupOptions}
            />
          </div>
        </div>
        {/* select */}
        <div>
          <Select style={{ width: 300 }} placeholder="Please select">
            {children}
          </Select>
          <Select
            style={{ width: 300 }}
            placeholder="Please select"
            value="b11"
            disabled
          >
            {children}
          </Select>
          <Select
            mode="multiple"
            style={{ width: 300 }}
            placeholder="Please select"
          >
            {children}
          </Select>
        </div>
        {/* <Icon type="search" theme="outlined" />
        <Icon type="robot" theme="outlined" /> */}
        {/* <Search placeholder="请输入xxx" style={{ width: '200px' }} /> */}
        <Input
          placeholder="Enter your username"
          suffix={<Icon type="icon-NAT-Gateway" />}
        // suffix={<span className="service-list-service-icon hwsicon-service-ecm" />}
        />
        <ETable
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          pagination={pagination}
        />
        <Menu
          mode="inline"
          style={{ width: 256 }}
          defaultSelectedKeys={['3']}
        >
          <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </Menu>
        <Tabs defaultActiveKey="1" onChange={() => {}}>
          <TabPane tab="集群概览" key="1">Content of Tab Pane 1</TabPane>
          <TabPane tab="主机列表" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="运行监控" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>

        <TestDonut />
        {AnotherComponent ? <AnotherComponent /> : null}
        {/* <Test /> */}

        {/* header-region */}

        <div style={{ width: '400px', margin: '20px' }}>
          <EInput
            placeholder="请输入"
            value={inputValue}
            onChange={(e) => { this.setState({ inputValue: e.target.value }); }}
            allowClear
          />
        </div>

        <div style={{ margin: '0 0 100px 300px' }}>

          <div className={showRegion ? `${use['EMR-useeregion']} ${use['EMR-useeregion-arrow']}` : use['EMR-useeregion']}>
            <div className={use['EMR-useeregion-box']} onClick={() => { this.setState({ showRegion: !showRegion }); }}>
              <span className={use['EMR-useeregion-addr']}>
                <Icon type="anticon-position" theme="outlined" />
              </span>
              <span className={showRegion ? `${use['EMR-useeregion-title-hover']} ${use['EMR-useeregion-title']}` : use['EMR-useeregion-title']}>
                <span className={use['EMR-useeregion-text']}>{chooseRegion}</span>
                {
                  showRegion ? <Icon type={`anticon-arrow2  ${use['EMR-useeregion-arrowicon']}`} theme="outlined" />
                    : <Icon type={`anticon-down  ${use['EMR-useeregion-arrowicon']}`} theme="outlined" />
                }
              </span>
            </div>
            {
              showRegion ? (
                <ERegion
                  choose={(name, url, id) => { this.chooseProvince(name, url, id); }}
                  chooseRegion={chooseRegion}
                />
              ) : null}
          </div>
        </div>
        <div style={{ margin: '200px 0 400px 300px' }}>
          {/* 设置默认区间 length为2的整数数组 第一个数字是起始 第二个数字为结束 默认为1和8 0为今天 不可填小于0的 */ }
          <EDatepicker defaultTime={['1', '8']} getDate={this.getDate} />
        </div>


      </div>
    );
  }
}

Components.propTypes = {
  /**
   *调用路由跳转，参数路由地址
   */
  push: PropTypes.func.isRequired,
  info: PropTypes.shape({
    loading: PropTypes.bool
  }).isRequired,
  load: PropTypes.func.isRequired,
  AnotherComponent: PropTypes.shape({}),
};

Components.defaultProps = {
  AnotherComponent: null
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(Components);


const output = () => { // 懒加载
  // import('./lazy').then((module) => {
  //   console.log(module.default);
  // });
};
