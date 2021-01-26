/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件,工具箱组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chart: null,
    };
  }

  componentDidMount() {
    this.initChart();
  }

  initChart = () => {
    const { id } = this.props;
    // 基于准备好的dom，初始化echarts实例
    const node = document.getElementById(`barChart_${id}`);
    if (node) {
      const barChart = echarts.init(node);
      this.setState({
        chart: barChart,
      });
    }
  }

  render() {
    const {
      id, data, loading,
    } = this.props;
    // 如果数据为空，直接显示空，不显示空chart
    let empty = true;
    data.forEach((d) => {
      if (d && d.values && d.values.length) {
        empty = false; // 只要有一个数据不为空就展示chart
      }
    });
    const { chart } = this.state;
    // 绘制图表
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
          const date = [];
          const value = [];
          params.forEach((p) => {
            if (p.value.length) {
              date.push(`${p.value[0]} <br/>`);
              value.push(`${p.marker}${p.seriesName} : ${p.value[1]}${p.value[2]}<br/>`);
            }
          });
          if (date[0]) {
            value.unshift(date[0]);
          }
          return value.join('');
        },
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
        }
      },
      yAxis: {
        type: 'value',
        // name: `单位(${unit})`,
        nameTextStyle: {
          padding: [0, 10],
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
        right: 10,
        bottom: 30,
      },
      color: ['#4E98BA', '#99DAF0', '#F8CC5B'],
      series: data.map(s => ({
        name: s.metricDisplayName || '',
        type: 'bar',
        barMaxWidth: 50,
        barGap: 0,
        data: s && s.values && s.values.map(item => ([
          moment(item.timeStamp).format('YYYY-MM-DD'),
          item.value,
          s.unit || '',
        ])),
      }))
    };
    if (chart) {
      chart.setOption(option);
    }

    return (
      <div style={{ position: 'relative' }}>
        <div id={`barChart_${id}`} style={{ height: 450 }} />
        {
          empty && !loading
            ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  textAlign: 'center',
                  height: '450px',
                  lineHeight: '450px'
                }}
              >
                暂无数据
              </div>
            ) : null
        }
      </div>
    );
  }
}

Bar.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
