import React, { PureComponent } from 'react';
import {
} from 'antd';
import echarts from 'echarts';
import { parse } from 'superagent';
import ResizeObserver from 'resize-observer-polyfill';
import NoChart from './noChartPlaceholder';
import styles from './charts.less';

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
    const { id } = this.props;
    const domNode = document.getElementById(`pie-${id}`);
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
    const domNode = document.getElementById(`pie-${id}`);
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
      this.myChart = echarts.init(document.getElementById(`pie-${id}`));
      if (data && data.data && data.data.length) {
        this.hasData = true;
        const option = {
          color: ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'],
          tooltip: {
            trigger: 'item',
            formatter: `{a} <br/>{b}: {c}${data?.unit || ''} ({d}%)`
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '60%',
            top: 20,
            icon: 'circle',
            formatter(curname) {
              let item; let
                percent;
              if (data?.data) {
                item = data.data.find(({ value, name }) => name === curname);
                if (data.total === 0) percent = 0;
                else percent = parseFloat(item?.value / data.total * 100).toFixed(2);
              }
              return `${curname}:  ${typeof item?.value === 'number' ? item.value : ''} ${percent || percent === 0 ? `(${percent}%)` : ''}`;
            },
            textStyle: {
              fontSize: 14,
              lineHeight: 22,
              fontFamily: 'PingFangSC-Regular',
            }
          },
          series: [
            {
              name: data?.title || '',
              type: 'pie',
              radius: ['60%', '80%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  formatter: `{b}\n{c}${data?.unit || ''} ({d}%)`,
                  textStyle: {
                    color: '#666',
                    fontSize: '20',
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
          <div id={`pie-${id}`} className={`${className || ''}`} style={{ display: this.hasData ? 'block' : 'none', width: '100%', height: '100%' }} />
          <NoChart show={!this.hasData} width="100%" height="100%" />
        </React.Fragment>
      );
    }
}

export default PieChart;
