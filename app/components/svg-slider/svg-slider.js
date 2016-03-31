import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import Axis from '../axis/axis';
import col from "../../style/colors"

const SvgSlider = React.createClass({
	componentDidMount() {
		let onChange = this.props.onChange;
		var drag = d3.behavior.drag()
			.on('drag', () =>{
				onChange(d3.mouse(this.refs.circle)[1]);
			})
		d3.select(this.refs.circle)
			.call(drag);
	},
	render() {
		const { domain, height, ypx } = this.props;
		return (
			<g className='g-slider' ref="circle" >
				<g className='g-handle' transform={`translate(0,${ypx})`}>
					<circle 
						className='circle-handle' 
						stroke={'white'}
						r={5}/>
				</g>
				{
				// <Axis 
				// 	tickArguments={[5]}
				// 	classname='axis'
				// 	domain={domain}
				// 	range={[height,0]}
				// 	height={height}
				// 	orientation='right'
				// 	tickFormat={d3.format(".2p")}
				// />
				}
			</g>
		);
	}
});



export default SvgSlider;
