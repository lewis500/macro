import React from 'react';
import d3 from 'd3';
import './style-axis.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';


const Axis = React.createClass({
	mixins: [PureRenderMixin],
	propTypes: {
		tickArguments: React.PropTypes.array,
		tickValues: React.PropTypes.array,
		tickFormat: React.PropTypes.func,
		innerTickSize: React.PropTypes.number,
		tickPadding: React.PropTypes.number,
		outerTickSize: React.PropTypes.number,
		domain: React.PropTypes.array,
		range: React.PropTypes.array,
		className: React.PropTypes.string,
		orientation: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		label: React.PropTypes.string
	},
	_getTranslate() {
		let { orientation, height, width } = this.props;
		switch (orientation) {
			case 'top':
			case 'left':
				return `translate(0, 0)`;
			case 'bottom':
				return `translate(0, ${height})`;
			case 'right':
				return `translate(${width}, 0)`;
		}
	},
	getDefaultProps() {
		return {
			tickArguments: [10],
			tickValues: null,
			tickFormat: x => x,
			domain: [0, 1],
			range: [200, 0],
			innerTickSize: 6,
			tickPadding: 10,
			outerTickSize: 6,
			orientation: 'left',
			className: "axis",
			label: ""
		};
	},
	render() {
		let {
			height,
			width,
			tickArguments,
			tickValues,
			tickFormat,
			innerTickSize,
			tickPadding,
			outerTickSize,
			orientation,
			className,
			range,
			domain,
			label
		} = this.props,
			scale = d3.scale.linear().range(range).domain(domain),
			ticks = scale.ticks.apply(scale, tickArguments),
			tickSpacing = Math.max(innerTickSize, 0) + tickPadding,
			sign = orientation === "top" || orientation === "left" ? -1 : 1;


		let transform, x, y, x2, y2, dy, textAnchor, d_path, labelElement;
		switch (orientation) {
			case 'bottom':
			case 'top':
				transform = `translate({}, 0)`;
				x = 0;
				y = sign * tickSpacing;
				x2 = 0;
				y2 = sign * innerTickSize;
				dy = sign < 0 ? "0em" : ".71em";
				textAnchor = "middle";
				d_path = `M${range[0]}, ${sign * outerTickSize}V0H${range[1]}V${sign * outerTickSize}`;

				labelElement = <text className={`${className} label`} textAnchor={"end"} x={width} y={-6}>{label}</text>;
				break;
			case 'right':
			case 'left':
				transform = `translate(0, {})`;
				x = sign * tickSpacing;
				y = 0;
				x2 = sign * innerTickSize;
				y2 = 0;
				dy = ".32em";
				textAnchor = sign < 0 ? "end" : "start";
				d_path = `M${sign * outerTickSize}, ${range[0]}H0V${range[1]}H${sign * outerTickSize}`;
				labelElement = <text className={`${className} label`} textAnchor={"end"} y={6} dy={".75em"} transform={"rotate(-90)"}>{label}</text>;
				break;
		}


		let pathElement = <path className="domain" d={d_path} fill="none" stroke="#aaa"/>;
		let tickElements = ticks.map((tick, index) => {
			let position = scale(tick),
				translate = transform.replace("{}", position);
			return (
				<g key={`${tick}.${index}`} className="tick" transform={translate}>
		            <line x2={x2} y2={y2} stroke="#aaa"/>
		            <text x={x} y={y} dy={dy} textAnchor={textAnchor}>
		            {tickFormat(tick)}</text>
		            </g>
			);
		});
		return (
			<g ref="axis" className={className} transform={this._getTranslate()} style={{shapeRendering: 'crispEdges'}}>
		        {tickElements}
		        {pathElement}
		        {labelElement}
		    </g>
		);
	}
});

export default Axis
