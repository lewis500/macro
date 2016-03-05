import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';
import col from '../../style/colors';

const m = {
		top: 20,
		left: 30,
		bottom: 30,
		right: 15
	},
	width = 500,
	height = 350;

const xDomain = [0, 100],
	yDomain = [-1, 1];

const xScale = d3.scale.linear().domain(xDomain).range([0, width]);

const yScale = d3.scale.linear().domain(yDomain).range([height, 0]);

const makePath = (data, variable) => {
	let pm = d3.svg.line()
		.x(d => xScale(d.time))
		.y(d => yScale(d[variable]))
	return pm(data);
};

const pathPairs = [
	['π', col.pink['500'], '\\pi'],
	['r', col['light-blue']['500'], 'r'],
	['y', col.indigo['500'], 'y'],
	['π_e', col.teal['500'], '\\pi_e']
];

const IslmChart = React.createClass({
	mixins: [PureRenderMixin],
	_makeLegend() {
		return _.map(pathPairs, (e, i) => {
			let rendered = katex.renderToString(e[2], { displayMode: true });
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
	render() {
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
								d={makePath(this.props.history,e[0])} 
								stroke={e[1]}/>
						);
					})
				}
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
							width={width} 
							height={height } />
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
							transform='translate(30,15)'>
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
