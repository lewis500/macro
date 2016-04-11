import React from 'react';
import col from "../../style/colors";

const PicFrame = React.createClass({
	getUrl(){
		const {u,π} = this.props;
		if(u>.06) return './app/yellen-unemployment-01.png';
		if(π>.035) return './app/yellen-inflation-01.png';
		return './app/yellen-killing-it-01.png'
	},
	render() {
		const asdf = (
			<div className='img-container'>
				<img src={this.getUrl()}/>
			</div>
		);
		return (
			<div className='pic-frame'>
				{!this.props.paused && asdf}
			</div>
		);
	}
});



export default PicFrame;
