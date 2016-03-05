import React, {
	Children, cloneElement, createClass
}
from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import './style-canvas.scss';

const Canvas = createClass({
	mar: 3,
	componentDidMount() {
		this.setState({
			ctx: this.refs.canvas.getContext("2d"),
			canvas: this.refs.canvas,
			mounted: true
		});
	},
	getInitialState() {
		return {
			ctx: null,
			mounted: false
		};
	},
	componentWillUpdate() {
		if (this.state.mounted) {
			// this.state.ctx.clearRect(0, 0, this.props.width, this.props.height);
		}
	},
	_makeChildren() {
		if (!this.state.mounted) return false;
		return Children
			.map(this.props.children, (child) => {
				return cloneElement(child, {
					ctx: this.state.ctx
				});
			});
	},
	render() {
		const style = {
			...this.props.style,
			width: this.props.width,
			height: this.props.height,
			position: 'absolute'
		};
		return (
			<div style={{...style}}>
			<canvas 
					className = 'canvas'
					width = {this.props.width}
					height = {this.props.height}
					ref='canvas' 
				>
					{this._makeChildren()} 
				</canvas>
			</div>
		);
	}
});

export default Canvas;