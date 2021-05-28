/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/**
 * 标准的查询表单组件
 * createBy: hjt
 * createTime: 2019-11-5
 * @prop {columns} 必填，同antd内置的columns
 * @prop {url} 必填，查询的接口
//  * @prop {searchForm} 选填，表示搜索条件
 * @prop {tableType} 选填，"row"代表支持多选，"normal"代表普通的展示表格
//  * @prop {actions} 选填，页面中的操作按钮，位于inline类型的搜索条件右侧
 * @prop {searchConditions} 选填，表示搜索条件
//  * @prop {refresh} 选填，表示是否需要重新查询，一般是进行了列表中某一项的删除等操作后需要重新查询列表
//  * @prop {resetRefresh} 选填，配合refresh使用
 * @prop {getSelectedRows} 当tableType为"row"时必填，从子组件获取选择的rows
 * @prop {selectedRows} 当tableType为"row"时必填，从父组件传递当前选中的rows，主要用于重置子组件中的selectedRowKeys
//  * @prop {title} 选填，页面的标题
 * @prop {defaultClass} 选填，是否使用默认样式，不填的时候是true
 * @prop {setPageData} 选填，把当前页的数据塞给父组件
 * @prop {showQueryBtn} 选填，是否显示查询按钮，默认为false
 * @prop {showResetBtn} 选填，是否显示重置按钮，默认为false
 * @prop {handleReset} 选填，当showResetBtn为true的时候要传
 * @prop {showExportBtn} 选填，是否显示导出按钮，默认为false
 * @prop {exportType} 选填，当showExportBtn为true的时候要传
 * @prop {keyMap} 选填，后端返回的数据中的唯一标志，一般为id，默认是key
 * @prop {closeHistory} 选填，默认为false，打开后不再将参数传到地址栏
 * @prop {compKey} 区分不同表刷新的key，配合事件使用window.ee.emitEvent('refreshSearchCondition',[data, lazy, closeHistory, compKey]);
 * @prop {fixHead} 选填，是否固定表头，默认不固定
 * @prop {scrollHeight} 选填，fixHead情况下自定义高度
 * @prop {ignoreParams} 选填，忽略地址栏中的多余字段
 * eg. searchConditions
 * [
 *  {
        display: 'inline',   // 单独一行'line'或多个一行'inline'
        component: <Input />,   // 搜索的具体组件
        label: '姓名',   // 可选，display为'line'的时候用到
        initial: {key: value}  // 可选，初始参数
      }
    ]
 * @prop {leftBtns} 选填, 可以自定义左侧按钮, 渲染到<div class="left">中, 且遵从flex布局
 * eg.
 *  [
      {
        component: (
          <Button >
            xxxx
          </Button>
        )
      }
    ];
 * eg.
 * <SearchTableList
        columns={columns}
        url={MYSERVICE_URL}
        // searchForm={searchForm}
        // actions={actions}
        // refresh={this.state.refresh}
        // resetRefresh={this.resetRefresh}
        tableType="row"
        getSelectedRows={this.getSelectedRows}
        selectedRows={this.state.selectedRows}
        // title="xx列表"
        defaultClass={false}
        setPageData={pageData => this.setState({ pageData })}
        showQueryBtn
        showResetBtn
        handleReset={this.handleReset}
        showExportBtn
        exportType={"employee"}
      />
 */
import React from 'react';
import { Button } from 'antd';
import ETable from 'Components/ETable';
import apiClient from 'Common/ApiClient';
import classNames from 'classnames/bind';
import { buildParams, buildObj } from 'Utils/paramsOperate';
import { urlPrefix } from 'Constants/Dictionary';
import styles from './index.less';

const cx = classNames.bind(styles);
class SearchTableList extends React.Component {
  static defaultProps = {
    prefixCls: 'E-SearchTable'
  };

  constructor(props) {
    super(props);
    this.state = {
      searchParams: {},
      selectedRowKeys: [],
      pageList: {
        total: '',
        pageSize: 10,
        pageNum: 1,
        list: []
      },
      loading: false,
      downloadLoading: false
    };
  }

  // 获取列表页
  componentDidMount() {
    // 遍历搜索条件，看是否有初始查询条件
    let initConditions = {};
    (this.props.searchConditions || []).map((item) => {
      if (item.initial !== undefined) {
        initConditions = item.initial;
      }
    });
    const {
      closeHistory = false, compKey, ignoreParams,
    } = this.props;
    this.setState({
      compKey
    });
    let searchParams = {};
    if (closeHistory) {
      searchParams = { ...initConditions };
    } else {
      const urlParams = buildObj(decodeURIComponent(window.location.search));
      // if (ignoreParams && ignoreParams.length) {
      //   ignoreParams.forEach((para) => {
      //     urlParams[para] = null;
      //   });
      // }
      searchParams = {
        ...initConditions,
        ...urlParams
      };
    }
    // console.log('didmount', searchParams);

    this.getTableList(searchParams);
    this.setState({
      searchParams
    });
    window.ee.addListener(
      'refreshSearchCondition',
      this.listenChangeSearchCondition
    );
    window.ee.addListener('refreshList', this.listenChangeList);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedRows && !nextProps.selectedRows.length) {
      this.setState({
        selectedRowKeys: []
      });
    }
  }

  componentWillUnmount() {
    window.ee.removeListener(
      'refreshSearchCondition',
      this.listenChangeSearchCondition
    );
    window.ee.removeListener('refreshList', this.listenChangeList);
  }

  getTableList(initParams) {
    const {
      url, columns, tableType, setPageData
    } = this.props;
    if (!url || !columns) {
      throw new Error(
        'SearchTableList组件中，url、columns两个属性是必填项，请仔细检查'
      );
    }
    const params = {};
    Object.entries(initParams).map(([key, value]) => {
      if (value !== undefined) {
        params[key] = value;
      }
    });
    // 转换为后端的字段格式
    params.page_size = params.pageSize || 10;
    params.page_num = params.pageNum || 1;
    delete params.pageSize;
    delete params.pageNum;
    this.setState({
      loading: true
    });
    // console.log('params--->', params);
    apiClient
      .get(url, { params })
      .then((data) => {
        if (data.success === 0) {
          return data.data;
        }
        return Promise.reject(data.message);
      })
      .then((res) => {
        if (res) {
          this.setState({
            pageList: {
              ...res,
              pageSize: res.page_size,
              pageNum: res.page_num
            },
            loading: false
          });
          // 重置选择框
          if (tableType === 'row') {
            this.setState({
              selectedRowKeys: []
            });
            this.props.getSelectedRows([]);
          }
          // 父组件需要当前页数据
          if (setPageData) {
            setPageData(res.list);
          }
        }
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
        Promise.reject(error);
      });
  }

  listenChangeSearchCondition = (
    inputObject = {},
    lazy = false,
    closeHistory = false,
    updateKey = undefined
  ) => {
    const { searchParams, compKey } = this.state;
    const params = {
      ...searchParams,
      ...inputObject,
      pageNum: 1
    };
    this.setState({
      searchParams: params
    });
    if (compKey && updateKey && compKey !== updateKey) {
      return;
    }
    console.log('changeSearchConditions', params);
    // 非实时更新，一般会有查询按钮
    if (!lazy) {
      this.getTableList(params);
    }
    if (!closeHistory) {
      history.pushState(
        {},
        null,
        `${window.location.pathname}?${buildParams(params)}${
          window.location.hash
        }`
      );
    }
  };

  listenChangeList = () => {
    const { searchParams } = this.state;
    this.getTableList(searchParams);
  };

  clearSearchConditions = () => {
    const { handleReset } = this.props;
    handleReset && handleReset();
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
    this.props.getSelectedRows(selectedRows);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { tableType, closeHistory } = this.props;
    if (tableType === 'row') {
      this.setState({
        selectedRowKeys: []
      });
      this.props.getSelectedRows([]);
    }
    let params = {
      ...this.state.searchParams,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    };
    if (sorter.columnKey) {
      params = { ...params, orderColumn: sorter.columnKey, sort: sorter.order };
    }
    this.setState({
      searchParams: params
    });
    this.getTableList(params);
    if (!closeHistory) {
      history.pushState(
        {},
        null,
        `${window.location.pathname}?${buildParams(params)}${
          window.location.hash
        }`
      );
    }
  };

  handleExport = () => {
    this.setState({
      downloadLoading: true
    });
    const { exportType } = this.props;
    const { searchParams } = this.state;
    const params = { ...searchParams };
    delete params.pageNum;
    delete params.pageSize;
    console.log(JSON.stringify(params));
    apiClient
      .post(`${urlPrefix}/api/v1/export/${exportType}/`, { data: params })
      .then((data) => {
        if (data.success === 0) {
          return data.data;
        }
        return Promise.reject(data.message);
      })
      .then((res) => {
        if (res) {
          location.href = res;
        }
        this.setState({
          downloadLoading: false
        });
      })
      .catch((error) => {
        this.setState({
          downloadLoading: false
        });
        Promise.reject(error);
      });
  };


  renderTableHeaders = () => {
    const {
      searchConditions = [],
      showQueryBtn = false,
      showResetBtn = false,
      showExportBtn = false,
      leftBtns = false
    } = this.props;
    const { downloadLoading, selectedRowKeys } = this.state;
    const newLines = searchConditions.filter(item => item.display === 'line');
    const inlines = searchConditions.filter(item => item.display === 'inline');
    return (
      <>
        {newLines.map((item, index) => (
          <div className={styles.line} key={index}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.content}>{item.component}</div>
          </div>
        ))}
        {inlines.length > 0 && (
          <div className={styles.inline}>
            <div className={styles.left}>
              {showExportBtn && (
                <div key="export" className={styles['action-item']}>
                  <Button onClick={this.handleExport} loading={downloadLoading}>
                    导出
                  </Button>
                </div>
              )}
              {
                leftBtns && leftBtns.map((item, index) => (
                  <div key={index} className={styles['action-item']}>
                    {item.component}
                  </div>
                ))
              }
            </div>
            <div className={styles.right}>
              <div className={styles['search-wp']}>
                {inlines.map((item, index) => (
                  <div className={styles['search-item']} key={index}>
                    {item.component}
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                {showQueryBtn && (
                  <div key="query" className={styles['action-item']}>
                    <Button onClick={this.listenChangeList}>搜索</Button>
                  </div>
                )}
                {showResetBtn && (
                  <div
                    key="reset"
                    className={styles.reset}
                    onClick={this.clearSearchConditions}
                  >
                    重置
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  onPageChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };

  onShowSizeChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };

  renderTable = () => {
    const { selectedRowKeys, pageList } = this.state;
    const {
      tableType,
      keyMap = 'key',
      fixHead = false,
      scrollHeight,
      nopagination
    } = this.props;
    // console.log('..props', this.props);
    const { loading } = this.state;
    let data;
    let pagination;
    if (pageList) {
      data = pageList.list;
      if (data && data[0]) {
        if (data[0][keyMap]) {
          data = data.map(item => ({ ...item, key: item[keyMap] }));
        } else {
          data = data.map((item, index) => ({ ...item, key: index }));
        }
      }
      pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
        total: Number(pageList.total),
        pageSize: Number(pageList.pageSize),
        defaultCurrent: 1,
        current: Number(pageList.pageNum),
        hideOnSinglePage: false
      };
      pagination.onChange = this.onPageChange;
      pagination.onShowSizeChange = this.onShowSizeChange;
    }

    const { columns } = this.props;
    if (!columns) {
      throw new Error('SearchTableList组件中，columns属性是必填项，请仔细检查');
    }
    const formValues = new URLSearchParams(
      decodeURIComponent(window.location.search)
    );
    const sortOrder = formValues.get('sort');
    if (sortOrder) {
      const orderColumn = formValues.get('orderColumn');
      for (const item of columns) {
        if (item.sorter === true && item.key === orderColumn) {
          item.sortOrder = sortOrder;
          break;
        }
      }
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled
      })
    };
    const extra = {};
    if (fixHead) {
      extra.scroll = {
        y: scrollHeight || 'calc(100vh - 305px)'
      };
    }
    return (
      <div className={styles['table-content']}>
        <ETable
          loading={loading}
          columns={columns}
          rowKey={record => record.key}
          rowClassName={() => 'dark-row'}
          rowSelection={tableType === 'row' ? rowSelection : null}
          dataSource={data}
          pagination={nopagination ? null : pagination}
          onChange={this.handleTableChange}
          locale={{ emptyText: '暂无数据' }}
          {...extra}
        />
      </div>
    );
  };

  render() {
    const { defaultClass = true, className } = this.props;
    return (
      <div
        className={`${
          styles[`${this.props.prefixCls}-search-table-list`]
        } ${className}`}
      >
        <div className={cx('content-body', { default: defaultClass })}>
          {this.renderTableHeaders()}
          {this.renderTable()}
        </div>
      </div>
    );
  }
}
export default SearchTableList;
