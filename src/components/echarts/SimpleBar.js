

import React, { PureComponent } from 'react';
import {
} from 'antd';
import echarts from 'echarts';
import NoChart from './noChartPlaceholder';
import styles from './charts.less';

class BarChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.hasData = true;
  }


  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData = (props) => {
    const {
      id, title, data, loading
    } = props;
    const myChart = echarts.init(document.getElementById(`bar-${id}`));
    if (data && data.yAxisData && data.yAxisData.length) {
      this.hasData = true;
      const option = {
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
            show: false
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
            show: false
          },
          // 坐标轴在grid中的分割区域
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#F7F8F8', '#fff']
            }
          }
        },
        grid: {
          left: 40,
          top: 40,
          right: 30,
          bottom: 50,
        },
        color: ['#1890FF'], // ['#4E98BA', '#99DAF0', '#F8CC5B'],
        series: [{
          data: data?.yAxisData,
          type: 'bar',
          barWidth: '30%',
          barMaxWidth: '30px',
        }]
      };
      myChart.setOption(option);
    } else if (!loading) {
      myChart.clear();
      this.hasData = false;
    }
  }

  render() {
    const {
      id, width, height, className, data
    } = this.props;
    return (
      <React.Fragment>
        <div id={`bar-${id}`} className={`${className || ''}`} style={{ display: this.hasData ? 'block' : 'none', width, height }} />
        <NoChart show={!this.hasData} width={width} height={height} />
      </React.Fragment>
    );
  }
}

export default BarChart;
