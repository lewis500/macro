import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';
import col from "../../style/colors"
import SvgSlider from "../svg-slider/svg-slider";

const m = {
	top: 20,
	left: 55,
	bottom: 30,
	right: 95
};

const Katexer = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: true });
		return (
			<span className="katex-span" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
		);
	}
});

const vars = [
	["πₑ", col.pink['500'], "\\pi_e", 32, col.pink['600'], ],
	["i", col["light-blue"]["500"], "i", 45, col["light-blue"]["500"]],
	["u", col.indigo["400"], "u", 0, col.indigo["500"]],
	["π", col.green["500"], "\\pi", 15, col.green["500"]],
];

const OtherPlot = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			xDomain: [0, 7.5],
			yDomain: [0,.1],
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
		this.setState({ xDomain })
	},
	onChange(ypx){
		let{height,yDomain} = this.state;
		this.props.dispatch({
			type: 'SET_I',
			i: yDomain[1] - ypx/height*(yDomain[1] - yDomain[0])
		});
	},
	render() {
		let { width, height, yDomain, xDomain } = this.state;
		let { yScale, xScale,onChange } = this;
		let { history } = this.props;
		let last = this.props.history[this.props.history.length - 1];
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
							tickFormat={d3.format(".2p")}
							innerTickSize={-width}
						/>
						<g ref='paths'>
							<g className='g-real-r'>
								<path 
									className="real-r" 
									d={
										`M${width},${yScale(last.πₑ)}L${width},${yScale(last.i)}`
									}/>
								<path 
									className="path connector"
									stroke={vars[1][1]}
									d={`M${xScale(last.time)+vars[1][3]+20},${yScale(last.i)}L${width},${yScale(last.i)}`}/>
								<path 
									className="path connector"
									stroke={vars[0][1]}
									d={`M${xScale(last.time)+vars[0][3]+20},${yScale(last.πₑ)}L${width},${yScale(last.πₑ)}`}/>	
								<g transform={`translate(${width}, ${ yScale(last.i*.5 + last.πₑ*.5)})`}>
									<foreignObject width="17px" height="40px" y="-.7em" x={5}>
										<body >
											<Katexer string={"r"} col={col["blue-grey"]["600"]}/>
										</body>
									</foreignObject>
								</g>
							</g>
							{paths}
						</g>
					</g>
					<g transform={`translate(${width+m.left}, ${m.top})`}>
						<SvgSlider 
							ypx={yScale(last.i)}
							domain={yDomain}
							height={height}		
							onChange={onChange}					
						/>
					</g>
				</svg>
			</div>
		);
	}
});

export default connect(state=>state,null)(OtherPlot);
