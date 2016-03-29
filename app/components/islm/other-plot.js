import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';
import col from "../../style/colors"

const m = {
	top: 20,
	left: 55,
	bottom: 30,
	right: 15
};

const Katexer = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: true });
		// let col = d3.hsl(this.props.col);
		// col.s*=.89;
		// col.l*=1.1;
		return (
			<span className="katex-span" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
		);
	}
})

const vars = [
	["r̄", col.green["500"], "\\bar{r}", 0, col.green["600"]],
	["i", col.red["500"], "i", 12, col.red["600"] ],
	["π", col.pink["500"], "\\pi", 22, col.pink["600"],],
	["π_e", col.indigo['500'], "\\pi_e", 40, col.indigo['600'],],
];

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
		let values = _.flatten(_.map(nextProps.history, d => _.map(vars, v => d[v[0]])));
		let yDomain = d3.extent(values);
		yDomain[0] = Math.min(0, yDomain[0])
		this.setState({ xDomain, yDomain })
	},
	render() {
		let { width, height, yDomain, xDomain } = this.state;
		let { yScale, xScale } = this;
		let { history } = this.props;
		let last = this.props.history[this.props.history.length - 1];
		let paths = _.map(vars, v => (
			<g className="g-path" key={v[0]}>
					<path className='path'	d={this.pathMaker(history,'time',v[0])}  stroke={v[1]}/>
					<g className='foreign' transform={`translate(${xScale(last.time)}, ${yScale(last[v[0]])})`}>
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
						<g ref='paths'>
							{paths}
						</g>
					</g>
				</svg>
			</div>
		);
	}
});

export default OtherPlot;
