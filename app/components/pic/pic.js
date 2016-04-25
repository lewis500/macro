import React from 'react';
import col from "../../style/colors";

const PicFrame = React.createClass({
	getUrl(){
		const {u,π,πₑ,r,r̄} = this.props;
		if(u>.08 || π>.08) return './app/img/benernke-failed-01.png';
		if(u>.05) return './app/img/yellen-unemployment-01.png';
		if(π>.035) return './app/img/volcker-inflation-01.png';
		return './app/img/yellen-great-job-01.png'
	},
	beenPlayed: false,
	componentWillReceiveProps(){
		if(!this.props.paused) this.beenPlayed = true;
	},
	render() {
		let c = 'img-face ' 
		// + (this.beenPlayed ?  'show' : 'hide');

		const asdf = (
			<div className='img-container'>
				<img src={this.getUrl()} className={c}/>
			</div>
		);
		return (
			<div className='pic-frame'>
				{asdf}
			</div>
		);
	}
});



export default PicFrame;
