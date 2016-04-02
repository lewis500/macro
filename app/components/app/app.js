import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import OtherPlot from '../islm/other-plot';
import d3Timer from 'd3-timer';

const Katexer = props => {
	const rendered = katex.renderToString(props.string, { displayMode: false });
	return (
		<span dangerouslySetInnerHTML={ {__html: rendered } } key={props.key}/>
	);
};

const AppComponent = React.createClass({
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
			<div className='flex-container-column'>
				<div>
						<h4>Instructions</h4>
						<p>Using the blue dot, move <Katexer string="i"/> to control the nominal interest rate. Try to keep <Katexer string="\pi"/> (inflation) at some level of your choosing and  <Katexer string="u"/> (unemployment) as low as possible. The constants <Katexer string="\bar{r}"/> and <Katexer string="r<\bar{u}"/> are the natural rates of interest and unemployment, respectively. When <Katexer string="r<\bar{r}"/>, <Katexer string="u"/> falls (and the converse). When <Katexer string="u<\bar{u}"/>, <Katexer string="\pi"/> rises (and the converse).  </p>
				</div>
				<OtherPlot />
				<div className='flex-container-row'>
					<button className="btn" onClick={this.pausePlay} style={{flexBasis: '50%'}}>{this.paused ? 'PLAY' : 'PAUSE'}</button>
					<button className="btn" onClick={this.props.reset} style={{flexBasis: '50%'}}>RESET</button>
				</div>
				<div>
					<h4 style={{marginTop: 10}}>Legend</h4>
					<ul>
						<li> <Katexer string="i"/> &nbsp; Nominal rate of interest</li>
						<li> <Katexer string="r"/> &nbsp; Real rate of interest</li>
						<li> <Katexer string="\bar{r}"/> &nbsp; Natural rate of interest</li>
						<li> <Katexer string="u"/> &nbsp; Unemployment rate</li>
						<li> <Katexer string="\bar{u}"/> &nbsp; Non-accelerating inflation rate of unemployment (NAIRU)</li>
						<li> <Katexer string="\pi"/> &nbsp; Inflation</li>
						<li> <Katexer string="\pi_e"/> &nbsp; Expected inflation</li>
					</ul>
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

export default connect(state => state.data, mapActionsToProps)(AppComponent);
