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
	["u", col.blue["500"], "u", 22, col.blue["600"]],
	["π", col.pink["500"], "\\pi", 40, col.pink["600"]],
	["ū", col["blue-grey"]['800'], "\\bar{u}", 0, col["blue-grey"]['800'], ],
];

const Katexer = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: true });
		return (
			<span className="katex-span" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
		);
	}
});

const YPlot = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			width: 500,
			height: 160
		};
	},
	xDomain: [0, 1],
	yDomain: [0, 1],
	xScale(v) {
		let { width } = this.state;
		let { xDomain } = this;
		return (v - xDomain[0]) / (xDomain[1] - xDomain[0]) * width;
	},
	yScale(v) {
		let { height } = this.state;
		let { yDomain } = this;
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
	componentWillMount() {
		this.changeDomains();
	},
	changeDomains() {
		let { history } = this.props;
		let xDomain = [
			history[0].time,
			history[history.length - 1].time + 2.5
		];
		let values = _.flatten(_.map(history, d => _.map(vars, v => d[v[0]])));
		let yDomain = d3.extent(values);
		yDomain[1] = yDomain[1] * 1.5;
		yDomain[0] = Math.min(0, yDomain[0]);
		this.xDomain = xDomain;
		this.yDomain = yDomain;
	},
	componentDidUpdate() {
		this.changeDomains();
	},
	render() {
		let { width, height } = this.state;
		let { yScale, xScale, yDomain } = this;
		let { history } = this.props;
		let last = _.last(history);
		let x0 = xScale(last.time);
		let paths = _.map(vars, v => (
			<g className="g-path" key={v[0]}>
					<path className='path'	d={this.pathMaker(history,'time',v[0])}  stroke={v[1]}/>
					<g className='foreign' transform={`translate(${x0}, ${yScale(last[v[0]])})`}>
						<line className="path-link" x1="0" x2={v[3]} y1="0" y2="0" stroke={v[1]} />
						<foreignObject width="17px" height="50px" y="-.7em" x={v[3]}>
							<body >
								<Katexer string={v[2]} col={v[4]}/>
							</body>
						</foreignObject>
					</g>
			</g>
		));
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
						<g ref='paths'>
							{paths}
						</g>
					</g>
				</svg>
			</div>
		);
	}
});

// <line {...{x1: 0, x2: width, y1: yScale(0), y2: yScale(0)}} 
// 	className='zero' />

export default YPlot;
