

import React, { PureComponent } from 'react';
import {
} from 'antd';
import echarts from 'echarts';
import ResizeObserver from 'resize-observer-polyfill';
import NoChart from './noChartPlaceholder';
import styles from './charts.less';

const recordwidth = 0;
const bigScreenWidth = 1800;
class BarChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.hasData = true;
  }


  componentDidMount() {
    const { id } = this.props;
    const domNode = document.getElementById(`bar-${id}`);
    this.initData(this.props);
    this.resizeOb = new ResizeObserver((entries, observer) => {
      this.handleResize();
    });
    this.resizeOb.observe(domNode);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  componentWillUnmount() {
    const { id } = this.props;
    const domNode = document.getElementById(`bar-${id}`);
    this.resizeOb?.unobserve(domNode);
  }

  handleResize = () => {
    const resize = () => {
      if (this.myChart) this.myChart.resize();
    };
    clearTimeout(this.timeout);
    this.timeout = setTimeout(resize, 500);
  }

  initData = (props) => {
    const {
      id, title, data, loading
    } = props;
    const domNode = document.getElementById(`bar-${id}`);
    this.myChart = echarts.init(domNode);
    // window.addEventListener('resize', this.handleResize.bind(this));
    if (data && data.yAxisData && data.yAxisData.length) {
      if (data && !data.xAxisDataFormatter) {
        data.xAxisDataFormatter = x => x;
      }
      this.hasData = true;
      const option = {
        // tooltip: {
        //   trigger: 'item',

        // },
        tooltip: {
          trigger: 'item',
          formatter: '{b0}: {c0}',
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
            color: '#999',
            rotate: window?.outerWidth < bigScreenWidth ? 30 : 0,
            formatter: value => data?.xAxisDataFormatter(value)
          },
          axisPointer: {
            show: true,
            type: 'line',
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: data?.xAxisData,
        },
        yAxis: {
          type: 'value',
          name: data?.yAxisName || '',
          nameTextStyle: {
            align: 'left',
            fontSize: 12,
            color: '#999',
          },
          // 坐标轴轴线
          axisLine: {
            show: false,
            // color: '#999',
          },
          // 坐标轴刻度标签
          axisLabel: {
            fontSize: 12,
            color: '#999',
            // formatter: a => echarts.format.addCommas(+a),
          },
          // 坐标轴刻度
          axisTick: {
            show: false
          },
          // 坐标轴在grid中的分割线
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e8e8e8',
              type: 'dashed'
            }
          },
          // 坐标轴在grid中的分割区域
          // splitArea: {
          //   show: true,
          //   areaStyle: {
          //     color: ['#F7F8F8', '#fff']
          //   }
          // }
        },
        grid: {
          left: 40,
          top: 40,
          right: 30,
          bottom: window?.outerWidth < bigScreenWidth ? 65 : 50,
        },
        color: ['#1890FF'], // ['#4E98BA', '#99DAF0', '#F8CC5B'],
        series: [{
          data: data?.yAxisData,
          type: 'bar',
          barWidth: '30%',
          barMaxWidth: '30px',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#666'
          }
        }]
      };
      this.myChart.setOption(option);
    } else if (!loading) {
      this.myChart.clear();
      this.hasData = false;
    }
  }

  render() {
    const {
      id, className, data
    } = this.props;
    return (
      <React.Fragment>
        <div
          id={`bar-${id}`}
          className={`${className || ''}`}
          style={{ display: this.hasData ? 'block' : 'none', width: '100%', height: '100%' }}
        />
        <NoChart show={!this.hasData} width="100%" height="100%" />
      </React.Fragment>
    );
  }
}

export default BarChart;
