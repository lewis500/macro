import React, {
	Children, cloneElement, createClass
}
from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './style-canvas.scss';

const RectCanvas = React.createClass({
	render() {
		let {
			ctx, x, y, w, h, fill
		} = nextProps;
		ctx.fillStyle = fill;
		ctx.fillRect(x, y, w, h);
		return false;
	}
});

export default RectCanvas;
