import {
	connect
}
from 'react-redux';
import React from 'react';
import Plot from '../plot/plot.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
const {
	input
} = React.DOM;
import './style-app.scss';

const AppComponent = React.createClass({
	mixins: [PureRenderMixin],
	onSlide(e) {
		this.props.setTime(+e.target.value);
	},
	// go() {
	// 	d3.timer(() => {
	// 		this.props.advance();
	// 		if (!this.props.paused) this.go();
	// 		return true;
	// 	}, 25);
	// },
	// onClick() {
	// 	if (this.props.paused) this.go()
	// 	this.props.pausePlay();
	// },
	render() {
		return (
			<div className='flex-container main'>
				<Plot style={{display: 'flex'}}/>
				<div style={{display: 'flex', width: '100%'}}>
			    <input type="range" 
						min="0" 
						max="100" 
						step='1' 
						onChange={this.onSlide} 
						value={this.props.time}/>
				</div>
			</div>
		);
	}
});
				// <div>
				// 	<button className='btn btn-large' onClick={this.onClick}>
				// 		PAUSE_PLAY
				// 	</button>
				// </div>

const mapStateToProps = (state) => ({
	time: state.time,
	paused: state.paused
});

const mapActionsToProps = (dispatch) => {
	return {
		setTime(time) {
				dispatch({
					type: 'SET_TIME',
					time
				});
			},
			pausePlay() {
				dispatch({
					type: 'PAUSE_PLAY'
				});
			},
			advance() {
				dispatch({
					type: 'ADVANCE'
				});
			}
	};
};

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
