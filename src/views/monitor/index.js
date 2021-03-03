import React, { Component, Fragment } from 'react';
import {
  Select, Tree, Icon, Input, Button, Table, Divider,
  Modal, Checkbox, Tooltip, Spin, Popover
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getList, renameArea, addChild, delArea, upArea, downArea,
  getDeiviceList, delDeviceById, getAlgorithmList, getDevicePoolList, setDeviceList, getAreaName
} from 'Redux/reducer/monitor';

import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const InputGroup = Input.Group;

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getList,
    renameArea,
    addChild,
    delArea,
    upArea,
    downArea,
    getDeiviceList,
    delDeviceById,
    getAlgorithmList,
    getDevicePoolList,
    setDeviceList,
    getAreaName
  },
  dispatch
);
class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '测试什么的',
      treeDatas: [],
      expandedKeys: ['1'],
      editValue: '',
      hasSame: '',
      tempData: [],
      deptHover: {},
      areaId: 1,
      selectAreaKeys: ['1'],
      pageNo: 0,
      modalPageNo: 0,
      recursive: false,
      pageSize: 10,
      tableData: {},
      showModal: false,
      checkedKeys: [],
      showDelModal: false,
      deviceName: '',
      deviceId: '',
      originId: '',
      algorithmId: 'all',
      algorithmList: [],
      modalDeviceName: '',
      modalDeviceId: '',
      modalDeviceData: {},
      modalCheckedKeys: [],
      selectedKeys: [],
      modalSelectedKeys: [],
    };
  }


  componentDidMount() {
    this.getAreaList();
    this.getDeviceList();
    this.getAlgorithmList();
  }

  getAlgorithmList = () => {
    const { getAlgorithmList } = this.props;
    getAlgorithmList().then((res) => {
      this.setState({
        algorithmList: res
      });
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  getAreaList = (keyword) => {
    const { getList } = this.props;
    const { expandedKeys } = this.state;
    getList(0, keyword).then((res) => {
      const treeDatas = this.dataToTree(res);
      this.setState({
        tempData: res,
        treeDatas,
      }, () => this.onExpand(expandedKeys));
    });
  }

  dataToTree = (data) => {
    // 下面的forEach写法会改变原数组，所以深度拷贝一次
    const copy = JSON.parse(JSON.stringify(data));
    const map = {};
    copy.forEach((item) => {
      item.defaultName = item.name;
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

  renderTreeNodes = data => data.map((item, index) => {
    const { deptHover } = this.state;
    const getBtn = () => {
      if (deptHover && deptHover[item.id]) {
        if (item.pid === 0) {
          return (
            <span className={styles.treeBtnBox}>
              {item.ifEdit
                ? (
                  <Button type="link" className={styles.checkBtn} disabled={item.hasSame} size="small" onClick={(e) => { this.sureEdit(e, item.id, item.addTag, item.pid); }}>
                    <Icon type="check" />
                  </Button>
                )
                : <Icon type="edit" className={styles.treeBtn} onClick={e => this.editThis(e, item.id, item.name)} />}

              <Icon type="plus-square" className={styles.treeBtn} onClick={(e) => { this.onAdd(e, item.id); }} />

            </span>
          );
        }
        return (
          <span className={styles.treeBtnBox}>
            {item.ifEdit
              ? (
                <Button className={styles.checkBtn} type="link" disabled={item.hasSame} size="small" onClick={(e) => { this.sureEdit(e, item.id, item.addTag, item.pid); }}>
                  <Icon type="check" />
                </Button>
              )
              : <Icon type="edit" className={styles.treeBtn} onClick={e => this.editThis(e, item.id, item.name)} />}
            {!item.addTag
              ? (
                <Fragment>
                  <Icon type="delete" className={styles.treeBtn} onClick={(e) => { this.onDelete(e, item.id); }} />
                  <Icon type="plus-square" className={styles.treeBtn} onClick={(e) => { this.onAdd(e, item.id); }} />
                  <Icon type="arrow-up" className={styles.treeBtn} onClick={(e) => { this.upArea(e, item.id); }} />
                  <Icon type="arrow-down" className={styles.treeBtn} onClick={(e) => { this.downArea(e, item.id); }} />
                </Fragment>
              ) : <Icon type="delete" className={styles.treeBtn} onClick={(e) => { this.cancel(e, item.id); }} />}
          </span>
        );
      }
      return null;
    };

    const getContent = () => {
      if (item.pid === 0) {
        return (
          <span className={styles.treeBtnBox}>
            {item.ifEdit
              ? (
                <Button type="link" className={styles.checkBtn} disabled={item.hasSame} size="small" onClick={(e) => { this.sureEdit(e, item.id, item.addTag, item.pid); }}>
                  <Icon type="check" />
                </Button>
              )
              : <Icon type="edit" className={styles.treeBtn} onClick={e => this.editThis(e, item.id, item.name)} />}
            <Icon type="plus-square" className={styles.treeBtn} onClick={(e) => { this.onAdd(e, item.id); }} />
          </span>
        );
      }
      return (
        <span className={styles.treeBtnBox}>
          {
            item.ifEdit
              ? (
                <Button className={styles.checkBtn} type="link" disabled={item.hasSame} size="small" onClick={(e) => { this.sureEdit(e, item.id, item.addTag, item.pid); }}>
                  <Icon type="check" />
                </Button>
              )
              : <Icon type="edit" className={styles.treeBtn} onClick={e => this.editThis(e, item.id, item.name)} />
          }
          {!item.addTag
            ? (
              <Fragment>
                {item.ifEdit
                  ? <Icon type="close" className={styles.treeBtn} onClick={(e) => { this.cancel(e, item.id); }} />
                  : <Icon type="delete" className={styles.treeBtn} onClick={(e) => { this.onDelete(e, item.id); }} />
                }

                <Icon type="plus-square" className={styles.treeBtn} onClick={(e) => { this.onAdd(e, item.id); }} />
                <Icon type="arrow-up" className={styles.treeBtn} onClick={(e) => { this.upArea(e, item.id); }} />
                <Icon type="arrow-down" className={styles.treeBtn} onClick={(e) => { this.downArea(e, item.id); }} />
              </Fragment>
            ) : <Icon type="close" className={styles.treeBtn} onClick={(e) => { this.cancel(e, item.id); }} />
          }
        </span>
      );
    };

    const getTitle = val => (
      <Popover
        arrowPointAtCenter
        content={getContent()}
        overlayClassName={item.pid === 0 ? `${styles.popoverInfoMin}` : `${styles.popoverInfo}`}
        getPopupContainer={trigger => trigger}
      >
        <div className={styles.treeTitleInfo}>
          {
            val.ifEdit
              ? (
                <Input
                  value={this.state.editValue}
                  onChange={e => this.onChange(e, val.id, val.name)}
                  size="small"
                  maxLength={30}
                  autoFocus
                  onPressEnter={(e) => { e.stopPropagation(); }}
                />
              )
              : (
                <span>
                  {val.name}
                </span>
              )
          }
          {item.hasSame ? <div className={styles.hasSame}>区域名称重复，请重新设置</div> : null}
        </div>
      </Popover>

    );
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.id.toString()}
          title={getTitle(item)}
          className={styles.treenode}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={item.id.toString()}
        title={getTitle(item)}
        className={styles.treenode}
      />
    );
  })

  editThis = (e, key, name) => {
    e.stopPropagation();
    const arr = this.state.tempData.filter(item => item.addTag);
    if (arr && arr.length > 0) {
      return;
    }

    const editData = this.editNode(key, this.state.treeDatas);
    this.setState({
      treeDatas: editData,
      editValue: name
    });
  }

  editNode = (key, data) => data.map((item) => {
    if (item.id === key) {
      item.ifEdit = true;
    } else {
      item.ifEdit = false;
    }
    item.name = item.defaultName;
    if (item.children) {
      this.editNode(key, item.children);
    }
    return item;
  })

  sureEdit = (e, key, tag, pid) => {
    e.stopPropagation();
    if (tag) {
      const { editValue, tempData } = this.state;
      const { addChild } = this.props;
      addChild(pid, editValue).then((res) => {
        this.getAreaList();
      });
    } else {
      const { editValue, tempData } = this.state;
      const { renameArea } = this.props;
      renameArea(key, editValue).then((res) => {
        const temp = tempData.find(item => item.id === res.id) || {};
        temp.name = res.name;
        this.setState({
          treeDatas: this.dataToTree(tempData)
        }, () => { this.getAreaList(); });
      });
    }
  }

  onChange = (e, key, name) => {
    e.stopPropagation();
    const { tempData, treeDatas } = this.state;
    const test = tempData.filter(item => item.name === e.target.value);
    if (test && test.length) {
      const temp = tempData.find(item => item.id === key && item.name !== e.target.value) || {};
      temp.hasSame = true;
      temp.ifEdit = true;
      this.setState({
        treeDatas: this.dataToTree(tempData)
      });
    } else {
      const temp = tempData.find(item => item.id === key) || {};
      temp.hasSame = false;
      temp.ifEdit = true;
      this.setState({
        treeDatas: this.dataToTree(tempData)
      });
    }
    this.setState({
      editValue: e.target.value
    });
  }

  changeNode = (key, value, data) => data.map((item) => {
    if (item.id === key) {
      item.name = value;
    }
    if (item.children) {
      this.changeNode(key, value, item.children);
    }
    return item;
  })

  onAdd = (e, key) => {
    e.stopPropagation();
    this.state.tempData.map((item) => {
      item.ifEdit = false;
      return item;
    });
    const arr = this.state.tempData.filter(item => item.addTag);
    if (arr && arr.length > 0) {
      return;
    }
    const temp = {
      hasSame: false,
      ifEdit: true,
      id: -1,
      pid: key,
      addTag: true
    };
    this.state.tempData.push(temp);
    const tempKeys = [...this.state.expandedKeys, key.toString()];
    this.setState({
      treeDatas: this.dataToTree(this.state.tempData),
      editValue: '',
      expandedKeys: tempKeys
    });
  }

  cancel = (e, key) => {
    e.stopPropagation();
    const temp = this.state.tempData.filter(({ id }) => id !== -1);
    const tempData = temp.map((item) => {
      item.ifEdit = false;
      item.hasSame = false;
      return item;
    });
    this.setState({
      treeDatas: this.dataToTree(tempData)
    });
  }

  onDelete = (e, key) => {
    e.stopPropagation();
    const { delArea } = this.props;
    delArea(key).then((res) => {
      this.getAreaList();
    });
  }

  onMouseEnter = (key) => {
    this.setState((preState, props) => ({
      deptHover: {
        ...preState.deptHover,
        [key]: true,
      },
    }));
  }

  onMouseLeave = (key) => {
    this.setState((preState, props) => ({
      deptHover: {
        ...preState.deptHover,
        [key]: false,
      },
    }));
  }

  upArea = (e, key) => {
    e.stopPropagation();
    const { upArea } = this.props;
    upArea(key).then((res) => {
      this.getAreaList();
    });
  }

  downArea =(e, key) => {
    e.stopPropagation();
    const { downArea } = this.props;
    downArea(key).then((res) => {
      this.getAreaList();
    });
  }

  onSelect = (keys, e) => {
    const eleName = e.nativeEvent.target.localName;
    const eleCls = e.nativeEvent.target.className;
    if (eleName !== 'input' && eleCls.indexOf('popover') === -1) {
      if (keys && keys.length > 0) {
        const [a] = keys;
        if (a === '-1') {
          return false;
        }
        this.setState({
          areaId: a,
          selectAreaKeys: keys,
          pageNo: 0
        }, () => this.getDeviceList());
      } else {
        // this.setState({
        //   areaId: 1,
        //   selectAreaKeys: ['1'],
        //   pageNo: 0
        // }, () => this.getDeviceList());
      }
    }
  }

  getDeviceListByAll = () => {
    this.setState({
      pageNo: 0
    }, () => { this.getDeviceList(); });
  }

  getDeviceList = () => {
    const { getDeiviceList } = this.props;
    const {
      areaId,
      pageNo,
      recursive,
      pageSize,
      deviceName,
      deviceId,
      originId,
      algorithmId
    } = this.state;
    const param = {
      areaId,
      pageNo,
      recursive,
      pageSize,
      name: deviceName,
      // deviceId,
      originId,
      algorithm: algorithmId === 'all' ? '' : algorithmId
    };
    getDeiviceList(param).then((res) => {
      this.setState({
        tableData: res || {},
        selectedKeys: [],
        checkedKeys: []
      });
    });
  }

  changePageNo = (num) => {
    this.setState({
      pageNo: num - 1,
      // checkedKeys: []
    }, () => this.getDeviceList());
  }

  modalChangePageNo = (num) => {
    this.setState({
      modalPageNo: num - 1,
      modalCheckedKeys: [],
    }, () => {
      this.getModalDeviceList();
    });
  }

  getModalDeviceListByAll = () => {
    this.setState({
      modalPageNo: 0
    }, () => {
      this.getModalDeviceList();
    });
  }

  selectThisAlgorithm = (value) => {
    this.setState({
      algorithmId: value
    });
  }

  changeDeviceName = (e) => {
    this.setState({
      deviceName: e.target.value
    });
  }


  changeDeviceId = (e) => {
    this.setState({
      // deviceId: e.target.value
      originId: e.target.value
    });
  }

  changeModalDeviceId = (e) => {
    this.setState({
      modalDeviceId: e.target.value
    });
  }

  changeModalDeviceName = (e) => {
    this.setState({
      modalDeviceName: e.target.value
    });
  }

  resetSearch = () => {
    this.setState({
      areaId: 1,
      pageNo: 0,
      // recursive: false,
      pageSize: 10,
      deviceName: '',
      // deviceId: '',
      originId: '',
      algorithmId: 'all',
      selectAreaKeys: ['1']
    }, () => this.getDeviceList());
  }

  getModalDeviceList = () => {
    const { getDevicePoolList } = this.props;
    const { modalDeviceId, modalDeviceName, modalPageNo } = this.state;
    const param = {
      deviceId: modalDeviceId,
      name: modalDeviceName,
      pageSize: 10,
      pageNo: modalPageNo,
    };
    getDevicePoolList(param).then((res) => {
      if (Array.isArray(res.list)) {
        this.setState({
          modalDeviceData: res,
        });
      } else {
        this.setState({
          modalDeviceData: {}
        });
      }
    });
  }

  resetModalSearch = () => {
    this.setState({
      modalDeviceName: '',
      modalDeviceId: '',
    }, () => this.getModalDeviceList());
  }

  openModal=() => {
    const { getDevicePoolList, getAreaName } = this.props;
    const { areaId, modalPageNo } = this.state;
    const param = {
      deviceId: '',
      name: '',
      pageSize: 10,
      pageNo: modalPageNo
    };
    getDevicePoolList(param).then((res) => {
      getAreaName(areaId).then((data) => {
        if (res && Array.isArray(res.list)) {
          this.setState({
            modalDeviceData: res,
            showModal: true,
            showAreaName: data
          });
        }
      });
    });
  }


  changeStatus = (e) => {
    const { checked } = e.target;
    this.setState({
      recursive: checked
    }, () => this.getDeviceList());
  }

  toDetail = (record) => {
    const { id } = record;
    const { push } = this.props;
    push(`/monitor/${id}`);
  }


  changeCheckRowKeys = (selected, arr) => {
    const temp = arr.map(item => item.id);
    this.setState({
      checkedKeys: temp,
      selectedKeys: selected
    });
  }

  delThisKeys = () => {
    const { checkedKeys } = this.state;
    if (checkedKeys.length > 0) {
      this.setState({
        showDelModal: true
      });
    }
  }

  delThisKey = (record) => {
    const { id } = record;
    const { delDeviceById } = this.props;
    const { pageNo, tableData } = this.state;
    const temp = [id];
    const param = {
      deviceIds: temp
    };

    this.setState({
      checkedKeys: temp,
      showDelModal: true
    });

    // const ifLastPage = () => {
    //   if (pageNo === tableData.pageTotal - 1 && tableData.recordsTotal % 10 === 1) {
    //     return true;
    //   }
    //   return false;
    // };
    // if (ifLastPage()) {
    //   delDeviceById(param).then((res) => {
    //     this.setState({
    //       showDelModal: false,
    //       pageNo: tableData.pageTotal - 2 >= 0 ? tableData.pageTotal - 2 : 0
    //     }, () => this.getDeviceList());
    //   });
    // } else {
    //   delDeviceById(param).then((res) => {
    //     this.setState({
    //       showDelModal: false,
    //     }, () => this.getDeviceList());
    //   });
    // }
  }

  sureDelThisKeys = (e) => {
    const { checkedKeys, pageNo, tableData } = this.state;
    const { delDeviceById } = this.props;
    const param = {
      deviceIds: checkedKeys
    };
    const ifLastPage = () => {
      if (pageNo === tableData.pageTotal - 1) {
        if (checkedKeys.length !== 10 && checkedKeys.length === tableData.recordsTotal % 10) {
          return true;
        } if (checkedKeys.length === 10 && tableData.recordsTotal % 10 === 0) {
          return true;
        }
      } else {
        return false;
      }
    };
    if (ifLastPage()) {
      delDeviceById(param).then((res) => {
        this.setState({
          showDelModal: false,
          checkedKeys: [],
          selectedKeys: [],
          pageNo: tableData.pageTotal - 2 >= 0 ? tableData.pageTotal - 2 : 0
        }, () => this.getDeviceList());
      });
    } else {
      delDeviceById(param).then((res) => {
        this.setState({
          showDelModal: false,
          checkedKeys: [],
          selectedKeys: []
        }, () => this.getDeviceList());
      });
    }
  }

  cancelDelthisKeys = () => {
    this.setState({
      showDelModal: false
    });
  }

  sureImportDevice = () => {
    const { modalCheckedKeys, areaId } = this.state;
    const { setDeviceList } = this.props;
    if (modalCheckedKeys.length > 0) {
      const temp = modalCheckedKeys.map(item => (
        {
          deviceId: item.deviceId,
          sourceId: item.sourceId,
          deviceName: item.deviceName
        }
      ));
      setDeviceList(temp, areaId).then((res) => {
        this.setState({
          showModal: false,
          modalCheckedKeys: [],
          modalDeviceName: '',
          modalDeviceId: '',
          modalSelectedKeys: []
        }, () => {
          this.getModalDeviceList();
          this.getDeviceList();
        });
      });
    }
  }

  cancelImportDevice = () => {
    this.setState({
      showModal: false,
      modalCheckedKeys: [],
      modalDeviceName: '',
      modalDeviceId: '',
      modalSelectedKeys: []
    });
  }

  changeModalCheckRowKeys =(selected, arr) => {
    this.setState({
      modalCheckedKeys: arr,
      modalSelectedKeys: selected
    });
  }

  tableChange = (page, filter, sorter, extra) => {
    console.log(page, filter, sorter, extra);
  }

  render() {
    const {
      test, treeDatas, expandedKeys, tableData, showModal, showDelModal,
      algorithmList = [], algorithmId, modalDeviceData, pageSize, showAreaName,
      deviceName, deviceId, modalDeviceName, modalDeviceId, originId, checkedKeys,
      selectedKeys, modalSelectedKeys, selectAreaKeys, modalPageNo, pageNo
    } = this.state;
    const { monitor: { areaListLoading } } = this.props;
    const columns = [
      {
        title: '摄像头名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        render: (text) => {
          if (text.length > 10) {
            return (
              <Tooltip title={text}>
                <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
              </Tooltip>
            );
          }
          return <span>{text.substring(0, 10)}</span>;
        },
      },
      {
        title: '摄像头ID',
        dataIndex: 'originId',
        key: 'originId',
        // fixed: 'left',
      },
      {
        title: '区域名称',
        dataIndex: 'areaPath',
        key: 'areaPath',
        render: (text) => {
          const arr = text.split('/');
          const showText = arr[arr.length - 1];
          return (
            <Tooltip placement="topLeft" title={text}>
              <span className={styles.cursorPoniter}>{showText}</span>
            </Tooltip>
          );
        }
      },
      {
        title: '已配置算法',
        dataIndex: 'algorithms',
        key: 'algorithms',
      },
      {
        title: '经纬度',
        dataIndex: 'latitude',
        key: 'latitude',
        render: (text, record) => (
          <span>
            {text || '-'}
            ,
            {record.longitude || '-'}
          </span>
        )
      },
      {
        title: '状态',
        dataIndex: 'online',
        key: 'online',
        width: '100px',
        render: (text) => {
          if (text) {
            return (
              <span className={styles.tableOnlineStatus}>
                <span className={styles.tableOnline} />
                <span className={styles.tableOnlineText}>在线</span>
              </span>
            );
          }
          return (
            <span className={styles.tableOnlineStatus}>
              <span className={styles.tableOffline} />
              <span className={styles.tableOfflineText}>离线</span>
            </span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'x',
        fixed: 'right',
        width: '120px',
        render: (text, record) => (
          <span>
            <a onClick={() => { this.toDetail(record); }}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => { this.delThisKey(record); }}>删除</a>
          </span>
        ),
      }
    ];
    const modalColumns = [
      {
        title: '摄像头名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        fixed: 'left',
        render: (text) => {
          if (text.length > 10) {
            return (
              <Tooltip title={text}>
                <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
              </Tooltip>
            );
          }
          return <span>{text.substring(0, 10)}</span>;
        },
      },
      {
        title: '摄像头ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        // fixed: 'left',
      },
    ];

    const drawAlgorithmList = () => algorithmList.map(item => (
      <Option value={item.id} key={item.id}>{item.cnName}</Option>));

    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.changeCheckRowKeys(selectedRowKeys, selectedRows);
      },
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };

    const modalRowSelection = {
      selectedRowKeys: modalSelectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.changeModalCheckRowKeys(selectedRowKeys, selectedRows);
      },
    };

    const showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>);

    const pagination = {
      total: tableData.recordsTotal,
      defaultCurrent: 1,
      current: pageNo + 1,
      pageSize,
      onChange: this.changePageNo,
      showTotal
    };

    const modalPagination = {
      total: modalDeviceData.recordsTotal,
      defaultCurrent: 1,
      current: modalPageNo + 1,
      pageSize: 10,
      onChange: this.modalChangePageNo,
      showTotal
    };


    return (

      <div className={styles.content}>
        <div className={styles.areaTree}>
          <h1 className={styles.titleText}>区域列表</h1>
          <Search placeholder="请输入关键字" onSearch={this.getAreaList} />
          <div className={styles.areaList}>
            {
              treeDatas && treeDatas.length ? (
                <Tree
                  expandedKeys={expandedKeys}
                  defaultExpandAll
                  blockNode
                  showLine
                  onExpand={this.onExpand}
                  onSelect={this.onSelect}
                  defaultSelectedKeys={['1']}
                  className={styles.dataTree}
                  selectedKeys={selectAreaKeys}
                  ref={ref => this.treeNode = ref}
                >
                  {this.renderTreeNodes(treeDatas)}
                </Tree>
              ) : null
            }
          </div>
        </div>
        <div className={styles.monitorList}>
          <h1 className={styles.titleText}>视频监控点</h1>
          <div className={styles.searchBox}>
            <div className={styles.searchItme}>
              <span>摄像头名称：</span>
              <Input value={deviceName} placeholder="请输入摄像头名称" onChange={this.changeDeviceName} />
            </div>
            <div className={styles.searchItme}>
              <span>摄像头ID：</span>
              <Input value={originId} placeholder="请输入摄像头ID" onChange={this.changeDeviceId} />
            </div>
            <div className={styles.searchItme}>
              <span>算法：</span>
              <Select
                defaultValue="all"
                value={algorithmId}
                style={{ width: 120 }}
                onSelect={this.selectThisAlgorithm}
              >
                <Option value="all">全部</Option>
                {drawAlgorithmList()}
              </Select>
            </div>
            <Button type="primary" className={styles.searchHandleBtn} onClick={this.getDeviceListByAll}>查询</Button>
            <Button className={styles.searchHandleBtn} onClick={this.resetSearch}>
              <Icon type="reload" />
              <span>重置</span>
            </Button>
          </div>
          <div className={styles.searchResult}>
            <div className={styles.handleResult}>
              <Button type="link" onClick={this.openModal} className={styles.handleBtn}>
                <Icon type="export" />
                <span>批量导入</span>
              </Button>
              <Button type="link" className={styles.handleBtn} onClick={this.delThisKeys} disabled={!checkedKeys.length}>
                <Icon type="delete" />
                <span>批量删除</span>
              </Button>
              <Checkbox onChange={this.changeStatus}>包含下级区域</Checkbox>
            </div>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={tableData.list || []}
              scroll={{ x: 'max-content' }}
              pagination={pagination}
              onChange={this.tableChange}
            />
          </div>
        </div>

        <Modal
          title="导入摄像头"
          visible={showModal}
          getContainer={false}
          onOk={this.sureImportDevice}
          onCancel={this.cancelImportDevice}
          forceRender
          destroyOnClose
          className={styles.deviceModal}
          width="800px"
        >
          <span className={styles.areaTitle}>当前区域：</span>
          <span className={styles.areaName}>{showAreaName}</span>
          <div className={styles.searchModalBox}>
            <div className={styles.searchItme}>
              <span>摄像头名称：</span>
              <Input value={modalDeviceName} placeholder="请输入摄像头名称" onChange={this.changeModalDeviceName} />
            </div>
            <div className={styles.searchItme}>
              <span>摄像头ID：</span>
              <Input value={modalDeviceId} placeholder="请输入摄像头ID" onChange={this.changeModalDeviceId} />
            </div>
            <Button type="primary" className={styles.searchHandleBtn} onClick={this.getModalDeviceListByAll}>查询</Button>
            <Button className={styles.searchHandleBtn} onClick={this.resetModalSearch}>
              <Icon type="reload" />
              <span>重置</span>
            </Button>
          </div>
          <Table
            dataSource={modalDeviceData.list}
            rowSelection={modalRowSelection}
            columns={modalColumns}
            pagination={modalPagination}
            getContainer={false}
          />
        </Modal>

        <Modal
          title="删除提示"
          visible={showDelModal}
          onOk={this.sureDelThisKeys}
          onCancel={this.cancelDelthisKeys}
          getContainer={false}
        >
          <p className={styles.delModalText}>您确定要删除所选摄像头吗？</p>
        </Modal>
      </div>
    );
  }
}

// Monitor.propTypes = {
//   monitor: PropTypes.object.isRequired,
//   // getList: PropTypes.func.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
