import {
  Breadcrumb,
} from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import styles from './pageHeader.less';


const PageHeader = (props) => {
  const { routes, tooltip } = props;
  const { length } = routes;

  return (
    <div className={styles['page-header']}>
      <Breadcrumb separator=">">
        {
          routes.map((route, index) => {
            if (index === length - 1) {
              return (
                <Breadcrumb.Item key={index} title={route.title}>
                  {route.title}
                </Breadcrumb.Item>
              );
            }
            return (
              <Breadcrumb.Item key={index} title={route.title}>
                <Link to={route.path}>{route.title}</Link>
              </Breadcrumb.Item>
            );
          })
        }
      </Breadcrumb>
      <div className={styles['tooltip-wrappper']}>
        {
          tooltip ? tooltip() : null
        }
      </div>
    </div>
  );
};

export default PageHeader;
