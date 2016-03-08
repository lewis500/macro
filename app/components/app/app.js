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
		let { min, max, value, variable, tex } = this.props;
		let step = .01;
		return (
			<div className='is-slider'>
				<Katexer string={tex + '=' + d3.round(value,2)} />
				<div className='ticks'>
					{_.map(_.range(10), (i) =>{
						let l = `${i*10}%`;
						return <div className='is-tick' key={i} style={{left: l}}></div>
					})}
				</div>
				<input 
					{...{min,max,value,step}} 
					onChange={this._onChange} 
					type='range' />
			</div>
		);
	}
});

const Slider = React.createFactory(sliderComponent);

const sliders = [
	['κ', .01, .6, '\\kappa'],
	['i', 0, .1, 'i'],
	['r̄', 0, .1, '\\bar{r}'],
	['Δ', 0, .15, '\\Delta'],
	['ȳ', 0, 2.0, '\\bar{y}'],
	['δ', 0, .5, '\\delta'],
	['σ', 1, 10, '\\sigma'],
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
								variable: e[0],
								tex: e[3],
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
			'\\dot{x} = 1/\\sigma \\cdot (i - \\pi - \\bar{r})',
			'r = i + \\pi_e',
		];
		return (
			<div className='flex-container-row main'>
				<IslmChart history={this.props.history}/>
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
