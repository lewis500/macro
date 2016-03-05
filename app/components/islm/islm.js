import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';

const m = {
		top: 20,
		left: 30,
		bottom: 30,
		right: 15
	},
	width = 500,
	height = 350;

const IslmChart = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		return (
			<div>
				<svg 
					className='chart' 
					width={width+m.left+m.right}
					height={height+m.top+m.bottom}
					>
					<g transform={`translate(${m.left},${m.right})`}>
						<rect 
							className='bg' 
							width={width} 
							height={height}/>
						<Axis 
							classname='y-axis'
							domain={[0,1]}
							range={[height,0]}
							height={height}
							orientation='left'
							// label='y'
						/>
						<Axis 
							className='time-axis'
							domain={[0,1000]}
							range={[0,width]}
							width={width}
							height={height}
							orientation='bottom'
							label='time'
						/>
					</g>
				</svg>
			</div>
		);
	}
});

export default IslmChart;
