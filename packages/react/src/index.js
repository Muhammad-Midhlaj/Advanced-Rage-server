import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './helpers/store';
import { App } from './pages/App';

import myEventEmmiter from './helpers/events';  
mp.events = myEventEmmiter;

ReactDOM.render(
    <Provider store={store}>
    	<App />
    </Provider>,
    document.getElementById('container')
);
