import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import IslmChart from '../islm/islm';

const Katexer = props => {
	let rendered = katex.renderToString(props.string, { displayMode: true });
	return (
		<span dangerouslySetInnerHTML={ {__html: rendered } } key={props.key}/>
	);
};

const sliderComponent = React.createClass({
	mixins: [PureRenderMixin],
	_onChange(e) {
		this.props.onChange({
			value: +e.target.value,
			variable: this.props.variable
		});
	},
	render() {
		let { min, max, value, step, variable, tex } = this.props;
		return (
			<div className='is-slider'>
				<Katexer string={tex} />
				<div className='ticks'>
					{_.map(_.range(10), (i) =>{
						let l = `${i*10}%`;
						return <div className='is-tick' key={i} style={{left: l}}></div>
					})}
				</div>
				<input 
					{...{min,max,step,value}} 
					onChange={this._onChange} 
					type='range' />
			</div>
		);
	}
});

const Slider = React.createFactory(sliderComponent);

const sliders = [
	['α', 0, 1, .025, '\\alpha'],
	['κ', 0, 1, .025, '\\kappa'],
	['θ', 0, 1, .025, '\\theta'],
	['γ', 0, .5, .025, '\\gamma'],
	['μ', 0, .2, .025, '\\mu'],
	['y_bar', 0, 1, .025, '\\bar{y}'],
	['δ', 0, 1, .025, '\\delta']
];


const AppComponent = React.createClass({
	mixins: [PureRenderMixin],
	_makeHeader() {
		return (
			<div style={{display: 'flex'}} className='flex-container-column'>
					{
						_.map(sliders,(e)=>(
							Slider({
								min: e[1],
								max: e[2],
								key: e[0],
								step: e[3],
								variable: e[0],
								tex: e[4],
								value: this.props[e[0]],
								onChange: this.props.setVariable
							})
						))
					}
				</div>
		);
	},
	render() {
		let strings = [
			'y = -\\gamma * r',
			// 'm = \\kappa \\cdot y -\\alpha(r+\\pi_e)',
			'i = \\frac{ \\kappa \\cdot y - m}{\\alpha}',
			'r = i + \\pi_e',
			'\\pi = \\pi_e + \\theta \\cdot(y-\\bar{y})',
			'\\dot{m} = \\mu - \\pi',
			'\\dot{\\pi}_e = \\delta \\cdot ( \\pi - \\pi_e)',
				// <IslmChart history={this.props.history} />
		];
		return (
			<div className='flex-container-row main'>
				{this._makeHeader()}
				<div className='flex-container-column' style={{display:'flex'}}>
					{_.map(strings, (string, i) => Katexer({ string, key: i }))}
				</div>
			</div>
		);
	}
});

const mapStateToProps = state => (state);

const mapActionsToProps = dispatch => {
	return {
		pausePlay() {
			dispatch({
				type: 'PAUSE_PLAY'
			});
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
