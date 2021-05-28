import ReactDOM from 'react-dom';
import React from 'react';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Root from './routers';

import 'Styles/index.less';
import 'Components/Button.less';

ReactDOM.render(<ConfigProvider locale={zhCN}><Root /></ConfigProvider>, document.getElementById('rootCt'));
