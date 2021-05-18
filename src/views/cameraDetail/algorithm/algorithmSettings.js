/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, { Component } from 'react';
import {
  Select,
  Tabs,
  Form,
  Input,
  Checkbox,
  Button,
  message,
  Spin,
} from 'antd';
import EIcon from 'Components/Icon';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { getAlgoList, postAlgoConf } from 'Redux/reducer/cameraDetail';
import defaultIcon from 'Assets/algorithmIcons/default.png';
import AlgoConfigDialog from './algoConfigDialog';
import { AlgoDisableTime } from '../constants';

import styles from '../index.less';


const mapStateToProps = state => ({
  cameraDetail: state.cameraDetail
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAlgoList,
    delAlgoConf: (deviceId, id, name) => postAlgoConf(deviceId, [{
      id,
      taskName: name,
      action: 'delete',
    }])
  },
  dispatch
);

const getImgUrl = (name) => {
  const arr = [
    'carPersonCheck', 'faceRecognize', 'plateRecognize', 'areaAlarm', 'stepWallCheck', 'peopleTraffic', 'plateTraffic', 'safetyHat',
    'workingClothes', 'carTypeDetect', 'peopleCrowd', 'fightDetect', 'fallDownDetect', 'roadsideStall', 'wanderTarry', 'maskDetect',
    'sleepDetect', 'fireDetect', 'dutyDetect', // 'fireEngineBlock'
  ];
  if (arr.indexOf(name) > -1) {
    return require(`Assets/algorithmIcons/${name}.png`);
  }
  return require('Assets/algorithmIcons/default.png');
};
class AlgorithmItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: '',
      // 5s内对同一算法不能二次操作
      disableEdit: {},
    };
  }

  componentDidMount() {
    const { curAlgo } = this.props;
    // 异步获取icon
    // getImgUrl(curAlgo.name).then((module) => {
    //   this.setState({
    //     imgSrc: module.default
    //   });
    // });
    this.setState({
      imgSrc: getImgUrl(curAlgo.name)
    });
  }

  render() {
    const {
      curAlgo,
      checked, onChange, toConfig
    } = this.props;
    const { imgSrc } = this.state;
    return (
      <div className={styles.algoItem}>
        <span className={styles['algoItem-checked']}>
          <Checkbox
            onChange={e => onChange(curAlgo, e.target.checked)}
            checked={checked}
          />
        </span>
        <span className={styles['algoItem-title']}>
          {/* <img src={imgSrc} alt="icon" className={styles['algoItem-title-icon']} /> */}
          <span className={styles['algoItem-title-icon']}><EIcon type={`myicon-algo-${curAlgo?.name}`} alt="icon" /></span>
          {curAlgo?.cnName}
        </span>
        <span className={styles['algoItem-desp']}>{curAlgo?.description}</span>
        {
          checked ? (
            <span className={styles['algoItem-configBtn']}>
              <a onClick={() => toConfig(curAlgo)}>规则配置</a>
            </span>
          ) : null
        }
      </div>
    );
  }
}

class AlgorithmSetting extends Component {
  constructor() {
    super();
    this.state = {
      algoChecked: {},
      configVisible: false,
      curAlgo: undefined,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    // 初始化algoChecked
    const { algoChecked } = this.state;
    const { getAlgoList, cameraId } = this.props;
    getAlgoList(cameraId).then((list) => {
      if (list) {
        for (const { id, isPick } of list) {
          algoChecked[id] = isPick || false;
        }
        this.setState({
          algoChecked
        });
      }
    });
  }

  openAlgoConfigDialog = (algo) => {
    this.setState({
      configVisible: true,
      curAlgo: algo,
    });
  }

  closeConfigModal = () => {
    this.initData();
    this.setState({
      configVisible: false,
      curAlgo: undefined,
    });
  }

  backToPre = () => {
    this.props.push('/monitor');
  }

  setAlgoEditDisable = (id, disable) => {
    this.setState(({ disableEdit }) => ({
      disableEdit: { ...disableEdit, [id]: disable }
    }));
  }

  onAlgoCheckedChange = (algo, checked) => {
    const { algoChecked, disableEdit = {} } = this.state;
    const { delAlgoConf, cameraId } = this.props;
    const { id, name, algorithmId } = algo;
    if (!disableEdit[algorithmId] || checked) {
      algoChecked[id] = checked;
      this.setState({
        algoChecked
      }, () => { console.log('algoChecked', algoChecked); });
    }
    if (checked) {
      this.openAlgoConfigDialog(algo);
    }
    if (disableEdit[algorithmId]) {
      message.warn('请勿对同一算法频繁操作，请5秒后尝试。');
      return;
    }
    if (!checked) {
      this.setAlgoEditDisable(algorithmId, true);
      delAlgoConf(cameraId, id, name).then((res) => {
        this.initData();
        window.sessionStorage.removeItem('deviceInfo');
        // 5s后disable置为false
        setTimeout(() => this.setAlgoEditDisable(algorithmId, false), AlgoDisableTime);
        message.success('删除成功');
      });
    }
  }


  render() {
    const {
      algoChecked,
      curAlgo,
      configVisible,
      disableEdit,
    } = this.state;
    const {
      cameraDetail: { algoList, algoListLoading },
      cameraId,
    } = this.props;
    return (
      <div className={styles.algorithmSetting}>
        <Spin spinning={algoListLoading}>
          <AlgoConfigDialog
            key={curAlgo?.id}
            cameraId={cameraId}
            curAlgo={curAlgo}
            configTypes={curAlgo?.configTypes?.split(',') || []}
            visible={configVisible}
            closeModal={this.closeConfigModal}
            setAlgoEditDisable={this.setAlgoEditDisable}
            algoEditDisable={disableEdit}
          />
          <div className={styles.algorithmList}>
            {
              algoList?.map(item => (
                <AlgorithmItem
                  key={item.id}
                  curAlgo={item}
                  checked={algoChecked[item.id]}
                  onChange={this.onAlgoCheckedChange}
                  toConfig={this.openAlgoConfigDialog}
                />
              ))
            }
          </div>
          <div className={styles.btnWrapper}>
            <Button onClick={this.backToPre}>
              返回
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}

AlgorithmSetting.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmSetting);
