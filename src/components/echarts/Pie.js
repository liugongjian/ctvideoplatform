import React, { PureComponent } from 'react';
import {
} from 'antd';
import echarts from 'echarts';
import NoChart from './noChartPlaceholder';
import './charts.less';

class PieChart extends PureComponent {
  constructor(props) {
    super(props);
    const that = this;
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
      const myChart = echarts.init(document.getElementById(`pie-${id}`));
      if (data && data.data) {
        this.hasData = true;
        const option = {
          color: ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'],
          tooltip: {
            trigger: 'item',
            formatter: `{a} <br/>{b}: {c}${data?.unit || ''} ({d}%)`
          },

          legend: {
            // orient: 'vertical',
            // x: 'right',
            type: 'scroll',
            orient: 'vertical',
            right: 20,
            top: 20,
            icon: 'circle',
            formatter(name) {
              return `Legend ${name}`;
            }
          },
          series: [
            {
              name: data?.title || '',
              type: 'pie',
              radius: ['60%', '80%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data.data
            }
          ]
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
      console.log('???', data);
      return (
        <React.Fragment>
          <div id={`pie-${id}`} className={`${className || ''}`} style={{ display: this.hasData ? 'block' : 'none', width, height }} />
          <NoChart show={!this.hasData} width={width} height={height} />
        </React.Fragment>
      );
    }
}

export default PieChart;
