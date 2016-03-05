import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import IslmChart from '../islm/islm';

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
	['γ', 0, 1, .025],
	['μ', 0, 1, .025],
	['y_bar', 0, 1, .025],
	['δ', 0, 1, .025],
	['Δ', 0, 1, .025]
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
		return (
			<div className='flex-container main'>
				{this._makeHeader()}
				<IslmChart/>
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
