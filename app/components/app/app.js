import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import IslmChart from '../islm/islm';

const Katexer = props => {
	let rendered = katex.renderToString(props.string, {displayMode:true});
	return (
		<p dangerouslySetInnerHTML={ {__html: rendered } } key={props.key}/>
	);
};

// class MathDisplay {
//     constructor(props) {
//         this.props = props;
//     }

//     render() {
//         var math = katex.renderToString(this.props.data);
//         return (<p dangerouslySetInnerHTML={ {__html: math} }/>);
//     }
// }


const sliderComponent = React.createClass({
	mixins: [PureRenderMixin],
	_onChange(e) {
		this.props.onChange({
			value: +e.target.value,
			variable: this.props.variable
		});
	},
	render() {
		let { min, max, value, step, variable } = this.props;
		return (
			<div >
				<span>{variable}</span>
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
	['α', 0, 1, .025],
	['κ', 0, 1, .025],
	['θ', 0, 1, .025],
	['γ', 0, .5, .025],
	['μ', 0, .2, .025],
	['y_bar', 0, 1, .025],
	['δ', 0, 1, .025]
];


const AppComponent = React.createClass({
	mixins: [PureRenderMixin],
	_makeHeader() {
		return (
			<div style={{display: 'flex', width: '100%'}}>
					{
						_.map(sliders,(e)=>(
							Slider({
								min: e[1],
								max: e[2],
								key: e[0],
								step: e[3],
								variable: e[0],
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
		];
		let u = _.map(strings,(string,i) =>Katexer({string, key: i}));
		return (
			<div className='flex-container main'>
				<div style={{'textAlign': 'left'}}>
				{u}
				</div>
				{this._makeHeader()}
				<IslmChart history={this.props.history}/>
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
