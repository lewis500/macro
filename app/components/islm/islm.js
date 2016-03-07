import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';
import col from '../../style/colors';

const m = {
	top: 20,
	left: 45,
	bottom: 30,
	right: 15
};

const pathPairs = [
	['π', col.pink['500'], '\\pi'],
	['r', col['light-blue']['500'], 'r'],
	['y', col.indigo['500'], 'y'],
	['π_e', col.teal['500'], '\\pi_e']
];

const IslmChart = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			xDomain: [1, 100],
			yDomain: [-.5, .3],
			width: 500,
			height: 350
		};
	},
	xScale(v) {
		let { xDomain, width } = this.state;
		return (v - xDomain[0]) / (xDomain[1] - xDomain[0]) * width;
	},
	yScale(v) {
		let { yDomain, height } = this.state;
		return height * (yDomain[1] - v) / (yDomain[1] - yDomain[0]);
	},
	_path(data, xVar, yVar) {
		var i = data.length,
			points = new Array(i);
		while (i--) {
			points[i] = [
				this.xScale(data[i][xVar]),
				this.yScale(data[i][yVar])
			];
		}
		return "M" + points.join("L");
	},
	_makeLegend() {
		return _.map(pathPairs, (e, i) => {
			return (
				<g 
					key={e[0]}
					transform={`translate(0,${i*15})`}>
					<rect fill={e[1]}/>
					<text>{e[0]}</text>
				</g>
			);
		});
	},
	componentWillUpdate(nextProps) {
		let variables = _.map(pathPairs, p => p[0]),
			data = nextProps.history,
			min, val, max;
		min = val = max = data[0][variables[0]];
		_.forEach(data, (d) => {
			_.forEach(variables, (v) => {
				val = d[v];
				if (min > val) min = val;
				if (max < val) max = val;
			});
		});
		if (min != this.state.yDomain[0] && max != this.state.yDomain[1]) {
			this.setState({ yDomain: [min, max], xDomain: [1, data[data.length - 1].time] });
		}
	},
	render() {
		let { width, height, yDomain, xDomain } = this.state;
		let { yScale, xScale } = this;
		let paths;
		if (this.props.history.length > 0) {
			paths = (
				<g 
					transform={`translate(${m.left},${m.top})`} 
					clipPath="url(#myClip)">
				{
						_.map(pathPairs, (e)=>{
						return (
							<path 
								className='path'	
								key={e[0]} 
								d={this._path(this.props.history,'time',e[0])} 
								stroke={e[1]}/>
						);
					})
				}
				<line 
					className='path'
					stroke={col.green['500']}
					{...{x1: 0, x2: width, y1: this.yScale(this.props.rStar), y2: this.yScale(this.props.rStar)}}
					/>
				</g>
			);
		}
		return (
			<div style={{...this.props.style}}>
				<svg 
					className='chart' 
					width={width+m.left+m.right}
					height={height+m.top+m.bottom}
					>
					<clipPath id="myClip" >
						<rect 
							y={-5}
							width={width} 
							height={height +5} />
					</clipPath>
					<g transform={`translate(${m.left},${m.top})`}>

						<rect 
							className='bg' 
							width={width} 
							height={height}/>

						<Axis 
							classname='axis'
							domain={yDomain}
							range={[height,0]}
							height={height}
							orientation='left'
							tickFormat={d3.format("+0.2r")}
							innerTickSize={-width}
						/>
						<Axis 
							className='axis'
							innerTickSize={-height}
							domain={xDomain}
							range={[0,width]}
							width={width}
							height={height}
							orientation='bottom'
							label='time'
						/>
						<line 
							{...{x1: 0, x2: width, y1: yScale(0), y2: yScale(0)}} 
							className='zero'
						/>
						<g 
							className='legend' 
							transform={`translate(${width - 50},15)`}>
							{this._makeLegend()}
						</g>
					</g>
					{paths}
				</svg>
			</div>
		);
	}
});

export default IslmChart;
