import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';

const m = {
	top: 20,
	left: 55,
	bottom: 30,
	right: 15
};

const vars = ["π", "i"];

const OtherPlot = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			xDomain: [1, 100],
			yDomain: [-.5, .3],
			width: 500,
			height: 160
		};
	},
	componentDidMount() {
		let domNode = findDOMNode(this);
		this.parent = domNode.parentElement;
		this.resize();
		this.listener = window.addEventListener('resize', this.resize);
	},
	resize() {
		this.setState({ width: this.parent.clientWidth * .9 });
	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize)
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
	componentWillReceiveProps(nextProps) {
		let { history } = nextProps;
		let xDomain = [
			history[0].time,
			history[history.length - 1].time + 2.5
		];
		let values = _.flatten(_.map(nextProps.history, d=> _.map(vars, v=> d[v])));
		let yDomain = d3.extent(values);
		// let yDomain = d3.extent(nextProps.history.map(d => d3));
		this.setState({ xDomain, yDomain })
	},
	render() {
		let { width, height, yDomain, xDomain } = this.state;
		let { yScale, xScale } = this;
		let { history } = this.props;
		let paths;
		if (history.length > 0) {
			paths = _.map(vars, v => (
				<path className='path'	d={this.pathMaker(history,'time',v)} key={v}/>
			))
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
							tickArguments={[5]}
							classname='axis'
							domain={yDomain}
							range={[height,0]}
							height={height}
							orientation='left'
							tickFormat={d3.format(".2p")}
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
						{paths}
					</g>
				</svg>
			</div>
		);
	}
});

export default OtherPlot;
