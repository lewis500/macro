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

const Katexer = props => {
	const rendered = katex.renderToString(props.string, { displayMode: true });
	return (
		<span dangerouslySetInnerHTML={ {__html: rendered } } />
	);
};

const vars = [
	["π", col.pink["500"], "\\pi"],
	["i", col.red["500"], "i"],
	["π_e", col.indigo['500'], "\\pi_e"],
	["r̄", col.green["500"], "\\bar{r}"],
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
	componentDidMount() {
		// let domNode = findDOMNode(this);
		// this.parent = domNode.parentElement;
		// this.resize();
		// this.listener = window.addEventListener('resize', this.resize);
		// this.lineLabels = d3.select(this.refs.paths)
		// 	.selectAll(".foreign")
		// 	.append("foreignObject")
		// 	.attr({width: 40, height: 50})
		// 	.append("xhtml:body")
		// 	.html("<p>hello</p>");

		// .select()
		// .append("text")
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
		// vars.sort((a, b) => last[a[0]] > last[b[0]]);
		let paths = _.map(vars, (v, i) => (
			<g className="g-path" key={v[0]}>
					<path className='path'	d={this.pathMaker(history,'time',v[0])}  stroke={v[1]}/>
					<g className='foreign' transform={`translate(${xScale(last.time)}, ${yScale(last[v[0]])})`}>
						<foreignObject width="22px" height="50px" y="-10px" x={i*5}>
							<body >
								<Katexer string={v[2]}/>
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
