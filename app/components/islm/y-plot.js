import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';
import col from '../../style/colors';

const m = {
	top: 20,
	left: 55,
	bottom: 30,
	right: 15
};

const vars = [
	["r̄", col.green["500"], "\\bar{r}", 0, col.green["600"]],
	["πₑ", col.red['800'], "\\pi_e", 15, col.red['800'], ],
	["i", col.indigo["500"], "i", 32, col.indigo["600"]],
];

const YPlot = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			xDomain: [1, 100],
			yDomain: [-.5, .3],
			width: 500,
			height: 160
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
	pathMaker(data, xVar, yVar) {
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
	componentDidMount(){
		d3.select(this.refs.paths).selectAll("path")
	},
	componentWillReceiveProps(nextProps) {
		let { history } = nextProps;
		let xDomain = [
			history[0].time,
			history[history.length - 1].time + 2.5
		];
		// let yDomain = d3.extent(nextProps.history, d => d.y);

		let yDomain = [0, d3.max(nextProps.history, d => d.u) * 1.5];
		this.setState({ xDomain, yDomain })
	},
	render() {
		let { width, height, yDomain, xDomain } = this.state;
		let { yScale, xScale } = this;
		let path = (
			<g ref='paths'>
				<path className='path'	d={this.pathMaker(this.props.history,'time','u')} stroke={col.blue["500"]} />
				<path className='path'	d={this.pathMaker(this.props.history,'time','ū')} stroke={col["blue-grey"]["500"]}  />
			</g>
		);
		return (
			<div style={{...this.props.style}}>
				<svg 
					className='chart' 
					width={width+m.left+m.right}
					height={height+m.top+m.bottom}
					>
					<g transform={`translate(${m.left},${m.top})`}>

						<Axis 
							tickArguments={[5]}
							classname='axis'
							domain={yDomain}
							range={[height,0]}
							height={height}
							orientation='left'
							tickFormat={d3.format("0.1%")}
							innerTickSize={-width}
						/>

						{path}
					</g>
				</svg>
			</div>
		);
	}
});

// <line {...{x1: 0, x2: width, y1: yScale(0), y2: yScale(0)}} 
// 	className='zero' />

export default YPlot;
