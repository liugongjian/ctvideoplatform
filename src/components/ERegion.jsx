import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'Components/Icon';
import styles from './ERegion.less';

console.log(styles);

class ERegion extends Component {
    state={
      chooseProvince: '',
      showCity: false
    }

    componentDidMount = () => {

    }

    kind = () => {
      const regionData = {
        regions: [{
          seqId: 35,
          id: 'cn-hz1',
          name: '杭州',
          created: '2016-12-02 14:37:22',
          lastModified: '2018-10-29 10:54:28',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '浙江',
          shortName: 'zhejiang',
          regionOrder: 0,
          isSelfDevelop: false,
          isAlliance: false
        }, {
          seqId: 1,
          id: 'cn-gz1',
          name: '贵州',
          created: '2016-03-23 12:10:43',
          lastModified: '2018-09-21 00:48:20',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          ascription: '贵州',
          shortName: 'guizhou',
          regionOrder: 0,
          isSelfDevelop: false,
          isAlliance: false
        }, {
          seqId: 156,
          id: 'cn-sxty1',
          name: '太原',
          created: '2018-02-07 22:31:53',
          lastModified: '2018-11-03 22:40:59',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '山西',
          shortName: 'shanxi',
          regionOrder: 0,
          isSelfDevelop: false,
          isAlliance: false
        }, {
          seqId: 73,
          id: 'cn-sdqd1',
          name: '青岛',
          created: '2017-04-01 10:36:10',
          lastModified: '2018-11-03 22:41:24',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '山东',
          shortName: 'shandong',
          regionOrder: 0,
          isSelfDevelop: false,
          isAlliance: false
        }, {
          seqId: 176,
          id: 'cn-xian1',
          name: '西安',
          created: '2018-07-05 19:03:13',
          lastModified: '2018-07-05 19:03:13',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '陕西',
          shortName: 'shaanxi',
          regionLink: 'http://www.ctyun.cn/v3control?zoneId=910fd013c59211e6b63fa0369f9f6a76',
          regionOrder: 0,
          isSelfDevelop: true,
          isAlliance: false
        }, {
          seqId: 187,
          id: 'cn-hlhrb1',
          name: '哈尔滨',
          created: '2018-07-27 00:06:58',
          lastModified: '2018-07-27 00:06:58',
          locale: 'zh-cn',
          active: true,
          type: 'private',
          domainType: 'CTC',
          ascription: '黑龙江',
          shortName: 'heilongjiang',
          regionOrder: 0,
          isSelfDevelop: false,
          isAlliance: false
        }, {
          seqId: 186,
          id: 'haiwai',
          name: '海外',
          created: '2018-07-05 19:03:13',
          lastModified: '2018-10-30 20:03:21',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '海外',
          shortName: 'haiwai',
          regionLink: 'http://www.ctyun.cn/v3control?zoneId=11111111111111111111111111111111',
          regionOrder: 0,
          isSelfDevelop: true,
          isAlliance: false
        }, {
          seqId: 188,
          id: 'cn-nmhh1',
          name: '内蒙3',
          created: '2018-09-01 00:21:41',
          lastModified: '2018-11-03 22:41:43',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '内蒙',
          shortName: 'neimeng',
          regionOrder: 0,
          isSelfDevelop: false,
          isAlliance: false
        }, {
          seqId: 169,
          id: 'cn-fuzhou2',
          name: '福州2',
          created: '2018-07-05 19:03:13',
          lastModified: '2018-07-25 23:15:56',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '福建',
          shortName: 'fujian',
          regionLink: 'http://www.ctyun.cn/v3control?zoneId=577604052f1611e7af8ac68bf8eb9419',
          regionOrder: 5,
          isSelfDevelop: true,
          isAlliance: false
        }, {
          active: true,
          ascription: '内蒙',
          created: '2018-10-24 14:21:36',
          domainType: 'CTC',
          id: 'cn-neimeng4',
          isAlliance: false,
          isSelfDevelop: true,
          lastModified: '2018-10-24 14:48:39',
          locale: 'zh-cn',
          name: '内蒙4',
          regionLink: 'http://www.ctyun.cn/v3control/index?zoneId=683e2603a9d611e8ba4a8e8d61f1a315',
          regionOrder: 10,
          seqId: 191,
          shortName: 'neimeng',
          type: 'public',
        }, {
          seqId: 190,
          id: 'cn-beijing3',
          name: '北京3',
          created: '2018-10-24 14:14:25',
          lastModified: '2018-10-24 14:54:39',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '北京',
          shortName: 'beijing',
          regionLink: 'http://www.ctyun.cn/v3control/index?zoneId=ad99fd9d95fd11e8ba4a8e8d61f1a315',
          regionOrder: 10,
          isSelfDevelop: true,
          isAlliance: false
        }, {
          seqId: 70,
          id: 'cn-gdgz1',
          name: '广州4',
          created: '2017-02-27 22:15:47',
          lastModified: '2018-09-22 13:23:36',
          locale: 'zh-cn',
          active: true,
          type: 'public',
          domainType: 'CTC',
          ascription: '广东',
          shortName: 'guangdong',
          regionOrder: 15,
          isSelfDevelop: false,
          isAlliance: false
        }],
        total: 12
      };
      const kind = {
        a: [], h: [], l: [], t: []
      };
      const map = {};
      const destData = [];

      regionData.regions.map((item, index) => {
        if (!map[item.shortName]) {
          destData.push({
            data: [item],
            shortName: item.shortName
          });
          map[item.shortName] = item.shortName;
        } else {
          destData.map((val, idx) => {
            if (val.shortName === item.shortName) {
              val.data.push(item);
              return false;
            }
            return val;
          });
        }
        return item;
      });

      destData.map((item) => {
        const letter = item.shortName.charAt(0);
        if (letter <= 'g') {
          kind.a.push({ data: item.data, shortName: item.shortName });
        } else if (letter <= 'k') {
          kind.h.push({ data: item.data, shortName: item.shortName });
        } else if (letter <= 's') {
          kind.l.push({ data: item.data, shortName: item.shortName });
        } else if (letter <= 'z') {
          kind.t.push({ data: item.data, shortName: item.shortName });
        }
        return item;
      });
      return kind;
    }

    chooseProv = (value) => {
      this.setState({
        chooseProvince: value,
        showCity: true
      });
    }

    chooseCity = (name) => {
      const {
        choose
      } = this.props;
      choose(name.name, name.regionLink, name.id);
    }

    regionData = (value) => {
      const { chooseRegion } = this.props;
      const data = (
        <div key={Math.random()} className={styles['EMR-eregion-pName']} onClick={() => { this.chooseProv(value.data); }}>
          <span className={chooseRegion === value.data[0].name ? styles['EMR-eregion-pName-choosen'] : ''}>
            {value.data[0].ascription}
          </span>
        </div>
      );
      return data;
    }


    render() {
      const { chooseProvince, showCity } = this.state;
      const kind = this.kind();
      const { chooseRegion } = this.props;
      return (
        <div className={styles['EMR-eregion']} onClick={e => e.nativeEvent.stopImmediatePropagation()}>
          {!showCity ? (
            <div className={styles['EMR-eregion-province']}>
              <div className={styles['EMR-eregion-pBox']}>
                <div>A-G</div>
                {
                  kind.a.map(item => (
                    this.regionData(item)
                  ))
                }
              </div>
              <div className={styles['EMR-eregion-pBox']}>
                <div>H-K</div>
                {
                  kind.h.map(item => (
                    this.regionData(item)
                  ))
                }
              </div>
              <div className={styles['EMR-eregion-pBox']}>
                <div>L-S</div>
                {
                  kind.l.map(item => (
                    this.regionData(item)
                  ))
                }
              </div>
              <div className={styles['EMR-eregion-pBox']}>
                <div>T-Z</div>
                {
                  kind.t.map(item => (
                    this.regionData(item)
                  ))
                }
              </div>
            </div>
          ) : null
          }
          {
            showCity ? (
              <div className={styles['EMR-eregion-city']}>
                <div>
                  <span className={styles['EMR-eregion-province-show']}>{chooseProvince[0].ascription}</span>
                  <span className={styles['EMR-eregion-goback']} onClick={() => { this.setState({ showCity: false }); }}>
                    <Icon type="anticon-left" theme="outlined" />
                    返回
                  </span>
                </div>
                {
                  chooseProvince.map(item => (
                    <div key={item.id} className={styles['EMR-eregion-city-choose']} onClick={() => { this.chooseCity(item); }}>
                      {chooseRegion === item.name
                        ? <Icon type={`anticon-position ${styles['EMR-eregion-city-choose-icon']}`} theme="outlined" /> : null}
                      <span className={styles['EMR-eregion-city-choose-text']}>{item.name}</span>
                    </div>
                  ))
                }

              </div>
            ) : null
          }

        </div>
      );
    }
}

ERegion.propTypes = {
  choose: PropTypes.func.isRequired,
  chooseRegion: PropTypes.string
};

ERegion.defaultProps = {
  chooseRegion: ''
};

export default ERegion;
