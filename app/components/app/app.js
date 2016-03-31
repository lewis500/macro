import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import YPlot from '../islm/y-plot';
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

const SliderComponent = React.createClass({
	mixins: [PureRenderMixin],
	_onChange(e) {
		this.props.onChange({
			value: e,
			variable: this.props.variable
		});
	},
	render() {
		const { min, max, value, variable, tex } = this.props;
		const step = .001;
		return (
			<div className='is-slider'>
				<Katexer string={tex + '=' + d3.round(value,2)} />
			</div>
		);
	}
});

const Slider = React.createFactory(SliderComponent);

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
	reset(){
		this.dispatch({type: 'RESET'});
	},
	render() {
		return (
			<div className='flex-container-column'>
				<OtherPlot />
				<div className='flex-container-row'>
					<button className="btn" onClick={this.pausePlay} style={{flexBasis: '50%'}}>{this.paused ? 'PLAY' : 'PAUSE'}</button>
					<button className="btn" onClick={this.reset} style={{flexBasis: '50%'}}>RESET</button>
				</div>
			</div>
		);
	}
});

// {Slider({
// 	min: 0,
// 	max: .08,
// 	tex: "i",
// 	variable: "i",
// 	value: this.props.i,
// 	onChange: this.props.setVariable
// })}

const mapStateToProps = state => (state);

const mapActionsToProps = dispatch => {
	return {
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

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
