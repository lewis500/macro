import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-plot';
import Axis from '../axis/axis';
import col from "../../style/colors"
import SvgSlider from "../svg-slider/svg-slider";

const m = {
	top: 5,
	left: 32.5,
	bottom: 5,
	right: 20
};

const Katexer = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: true });
		return <span className="katex-span" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
	}
});

const vars = [
	["πₑ", col.pink['500'], "\\pi_e", 35, col.pink['600'], ],
	["i", col["light-blue"]["500"], "i", 5, col["light-blue"]["500"]],
	["u", col.indigo["500"], "u", 50, col.indigo["500"]],
	["π", col.orange["500"], "\\pi", 15, col.orange["500"]],
];

const Plot = React.createClass({
	mixins: [PureRenderMixin],
	xScale(v) {
		const { width, xDomain } = this.props;
		return (v - xDomain[0]) / (xDomain[1] - xDomain[0]) * width;
	},
	yScale(v) {
		const { yDomain, height } = this.props;
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
	onChange(ypx) {
		const { height, yDomain } = this.props;
		let i = yDomain[1] - ypx / height * (yDomain[1] - yDomain[0]);
		i = Math.min(i, yDomain[1]);
		i = Math.max(i, yDomain[0]);
		this.props.dispatch({
			type: 'SET_I',
			i
		});
	},
	changePlot(changes) {
		this.props.dispatch({ type: 'CHANGE_PLOT', changes });
	},
	componentDidMount() {
		const domNode = findDOMNode(this);
		this.resize();
		window.addEventListener('resize', this.resize);
	},
	resize() {
		const width = this.refs.holder.clientWidth - m.left - m.right;
		// const height = this.refs.holder.parentElement.parentElement.clientHeight - m.bottom - m.top;
		this.changePlot({ width });
	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize)
	},
	render() {
		let { yScale, xScale, onChange } = this;
		let { history, width, height, yDomain, xDomain } = this.props;
		let last = this.props.history[this.props.history.length - 1];
		let x0 = xScale(last.time);
		let zz = width * .7 + (xScale(last.time) + 40) * .3;
		let paths = _.map(vars, v => (
			<path className='path'	d={this.pathMaker(history,'time',v[0])}  stroke={v[1]} key={v[0]}/>
		));
		let connectors = _.map(vars, v => (
			<g className='foreign' transform={`translate(${x0}, ${yScale(this.props[v[0]])})`} key={v[0]}>
				<line className="path connector" x1="0" x2={v[3]} y1="0" y2="0" stroke={v[1]} />
				<foreignObject width="17px" height="17px" y="-.7em" x={v[3]}>
					<body >
						<Katexer string={v[2]} col={v[4]}/>
					</body>
				</foreignObject>
			</g>
		));
		return (
			<div ref='holder' className='plot'>
				<svg 
					className='chart' 
					width={width+m.left+m.right}
					height={height+m.top+m.bottom}>
					<g transform={`translate(${m.left},${m.top})`}>
						<Axis 
							tickArguments={[5]}
							classname='axis'
							domain={yDomain}
							range={[height,0]}
							height={height}
							orientation='left'
							tickFormat={d3.format(".2p")}
							innerTickSize={-width}/>

							<g className='g-nairu'>
								<foreignObject width="17px" height="18px" y="-.7em" x={5}
									transform={`translate(${width-3}, ${ yScale(this.props.ū)})`}	>
									<body><Katexer string={"\\bar{u}"} col={col["indigo"]["500"]}/></body>
								</foreignObject>
								<path className="nairu" d={`M${0},${yScale(this.props.ū)}L${width},${yScale(this.props.ū)}`}/>
							</g>
							<g className='g-r-bar'>
								<path className="r-bar" d={`M${zz},${yScale(last.πₑ)}L${zz},${yScale(this.props.r̄ + last.πₑ)}`}/>
								<foreignObject width="17px" height="18px" y="-.6em" x={0}
									transform={`translate(${zz}, ${ yScale(this.props.r̄*.5 + last.πₑ)})`}	>
									<body><Katexer string={"\\bar{r}"} col={col["cyan"]["700"]}/></body>
								</foreignObject>
							</g>
							{connectors}
							<path 
								className="path connector i"
								stroke={vars[1][1]}
								d={`M${xScale(last.time)+vars[1][3]+20},${yScale(this.props.i)}L${width},${yScale(this.props.i)}`}/>
							<path 
								className="path connector πₑ"
								stroke={vars[0][1]}
								d={`M${xScale(last.time)+vars[0][3]+20},${yScale(this.props.πₑ)}L${width},${yScale(this.props.πₑ)}`}/>	
								<g className="g-r">
									<path className="real-r" d={`M${width},${yScale(last.πₑ)}L${width},${yScale(this.props.i)}`}/>
									<foreignObject width="17px" height="18px" y="-.7em" x={0}
										transform={`translate(${width}, ${ yScale(last.i*.5 + last.πₑ*.5)})`}	>
										<body><Katexer string={"r"} col={col["cyan"]["700"]}/></body>
									</foreignObject>
								</g>
						{paths}
						<g transform={`translate(${xScale(last.time)},0)`}>
							<SvgSlider 
								ypx={yScale(this.props.i)}
								domain={yDomain}
								height={height}		
								onChange={onChange}/>
						</g>
					</g>

				</svg>
			</div>
		);
	}
});

const mapStateToProps = state => ({
	...state.data,
	...state.plot
});

export default connect(mapStateToProps)(Plot);
