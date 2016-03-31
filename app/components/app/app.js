import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import OtherPlot from '../islm/other-plot';
import d3Timer from 'd3-timer';
import Rcslider from 'rc-slider';
import 'rc-slider/assets';

const Katexer = props => {
	const rendered = katex.renderToString(props.string, { displayMode: true });
	return (
		<span dangerouslySetInnerHTML={ {__html: rendered } } key={props.key}/>
	);
};

const AppComponent = React.createClass({
	mixins: [PureRenderMixin],
	paused: true,
	timer: null,
	pausePlay() {
		if (!(this.paused = !this.paused)) {
			let last = 0;
			this.timer = d3Timer
				.timer(elapsed => {
					const dt = elapsed - last;
					last = elapsed;
					if (this.paused) this.timer.stop();
					this.props.tick(dt);
				});
		}
	},
	render() {
		return (
			<div className='main'>
			<div className='flex-container-column' style={{padding:'20px', margin: '20px'}}>
				<OtherPlot />
				<div className='flex-container-row'>
					<button className="btn" onClick={this.pausePlay} style={{flexBasis: '50%'}}>{this.paused ? 'PLAY' : 'PAUSE'}</button>
					<button className="btn" onClick={this.props.reset} style={{flexBasis: '50%'}}>RESET</button>
				</div>
			</div>
			</div>
		);
	}
});

const mapActionsToProps = dispatch => {
	return {
		reset(){
			dispatch({type: 'RESET'});
		},
		tick(dt) {
			dispatch({
				type: 'TICK',
				dt
			})
		},
		setVariable({ value, variable }) {
			dispatch({
				type: 'SET_VARIABLE',
				value,
				variable
			});
		}
	};
};

export default connect(state => state, mapActionsToProps)(AppComponent);
