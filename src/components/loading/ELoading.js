import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import gifSmall from 'Assets/cloud.gif';
import gifLarge from 'Assets/cloud-l.gif';
import styles from './ELoading.less';

const ELoading = ({
  loading, size, page, children
}) => {
  const imgSrc = size === 'small' ? gifSmall : gifLarge;
  const imgCls = size === 'small' ? styles['emr-loading-layer-img'] : classNames(styles['emr-loading-layer-img'], styles['emr-loading-layer-img-large']);
  const layerCls = size === 'small' ? styles['emr-loading-layer'] : classNames(styles['emr-loading-layer'], styles['emr-loading-layer-large']);
  return (
    <div className={styles['emr-loading']}>
      <div className={loading ? styles['emr-loading-blur'] : null}>{children}</div>
      {
        loading
          ? (
            <div className={page ? classNames(layerCls, styles['emr-loading-layer-fixed']) : layerCls}>
              <img src={imgSrc} className={imgCls} alt="loading" />
            </div>
          )
          : null
      }
    </div>
  );
};

ELoading.propTypes = {
  loading: PropTypes.bool.isRequired,
  size: PropTypes.string,
  page: PropTypes.bool,
  children: PropTypes.node,
};
ELoading.defaultProps = {
  size: 'small',
  page: false,
  children: '',
};

export default ELoading;
