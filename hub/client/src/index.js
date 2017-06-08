import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';

import configureStore from './store/configureStore'
export const store = configureStore({})
import AppWait from './containers/AppWait'

global.jQuery = require('jquery');
require('bootstrap')

ReactDOM.render(
  <Provider store={store}><AppWait /></Provider>,
  document.getElementById('root')
);
