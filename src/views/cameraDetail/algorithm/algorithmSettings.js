import React, { Component } from 'react';
import {
  Select,
  Tabs,
  Form,
  Input,
  Checkbox,
  Button,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import AlgoConfigDialog from './algoConfigDialog';

import styles from '../index.less';

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

const AlgorithmItem = ({
  id, checked, title, desp, onChange, toConfig
}) => (
  <div className={styles.algoItem}>
    <span className={styles['algoItem-checked']}>
      <Checkbox
        onChange={e => onChange(id, e.target.checked)}
        checked={checked}
      />
    </span>
    <span className={styles['algoItem-title']}>{title}</span>
    <span className={styles['algoItem-desp']}>{desp}</span>
    <span className={styles['algoItem-configBtn']}><a onClick={() => toConfig(id)}>算法配置</a></span>
  </div>
);

class AlgorithmSetting extends Component {
  constructor() {
    super();
    this.state = {
      listData: [
        {
          id: 1,
          title: '移动侦测',
          desp: '实时监控视频范围在出现的人、机动车、非机动车等移动目标，移动目标出现后会进行抓拍和告警。'
        },
        {
          id: 2,
          title: '电子围栏',
          desp: '这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，'
        },
        {
          id: 3,
          title: '人员布控',
          desp: '这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，'
        },
        {
          id: 4,
          title: '车辆布控',
          desp: '这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，'
        },
        {
          id: 5,
          title: '安全帽检测',
          desp: '这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，这里是算法描述，'
        },
      ],
      algoChecked: {},
      configVisible: false,
      curId: undefined,
    };
  }

  componentDidMount() {
    // 初始化algoChecked
    const { listData, algoChecked } = this.state;
    // eslint-disable-next-line no-restricted-syntax
    for (const { id, applied } of listData) {
      algoChecked[id] = applied || false;
    }
    this.setState({
      algoChecked
    });
  }

  openAlgoConfigDialog = (id) => {
    this.setState({
      configVisible: true,
      curId: id,
    });
  }

  closeConfigModal = () => {
    this.setState({
      configVisible: false,
      curId: undefined,
    });
  }

  onAlgoCheckedChange = (id, checked) => {
    const { algoChecked } = this.state;
    algoChecked[id] = checked;
    this.setState({
      algoChecked
    }, () => { console.log('algoChecked', algoChecked); });
  }

  render() {
    const {
      listData,
      algoChecked,
      curId,
      configVisible
    } = this.state;
    return (
      <div className={styles.algorithmSetting}>
        <AlgoConfigDialog
          key={curId}
          visible={configVisible}
          closeModal={this.closeConfigModal}
        />
        <div className={styles.algorithmList}>
          {
            listData.map(item => (
              <AlgorithmItem
                {...item}
                checked={algoChecked[item.id]}
                onChange={this.onAlgoCheckedChange}
                toConfig={this.openAlgoConfigDialog}
              />
            ))
          }
        </div>
        <div className={styles.btnWrapper}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <span className={styles.span10px} />
          <Button>
            取消
          </Button>
        </div>
      </div>
    );
  }
}

AlgorithmSetting.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmSetting);
