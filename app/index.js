import './style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/app/app';

var template = (
	<Provider store={store}>
	  <App />
	</Provider>
);
store.dispatch({type:'RESET'});
ReactDOM.render(template, document.getElementById('root'));