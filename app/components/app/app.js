import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import Plot from '../plot/plot';
import d3Timer from 'd3-timer';
import col from "../../style/colors"

const Kat = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: false });
		const style = this.props.col ? { color: this.props.col } : {};
		return <span className="katex-span" style={style} dangerouslySetInnerHTML={ {__html: rendered } } />
	}
});

const AppComponent = React.createClass({
	paused: true,
	timer: null,
	pausePlay() {
		if (!(this.paused = !this.paused)) {
			let last = 0;
			this.timer = d3Timer
				.timer(elapsed => {
					const dt = elapsed - last;
					last = elapsed;
					if (this.paused) this.timer.stop();
					this.props.tick(dt);
				});
		}
	},
	render() {
		return (
			<div className='main'>
				<div className='title'>
					<div className='title-container'>
						<h2>How to make money</h2>
					</div>
				</div>
			<div className='flex-container-column'>
				<div className='content'>
						{
							// <div className='pic'>
							// 	<img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Marriner_S._Eccles_Federal_Reserve_Board_Building.jpg" height="200px"/>
							// </div>
						}
						<p>
							The Federal Reserve constantly creates money to buy very safe debt. When it suddenly creates money faster,  short-term interest rates fall, which boosts spending. For example, North Carolina <a href="http://abc11.com/politics/nc-passes-$2-billion-bond-for-infrastructure/1247482/">will soon borrow $2 billion</a> to build school buildings <a href="http://connect.nc.gov/">because of low interest rates.</a> The extra spending boosts inflation and employment. Inflation and employment fall when the Fed makes money more slowly or sucks it up.
						</p>
						<p>To illustrate, we'll simulate an economy with four rules, and let you choose interest rates.</p>
				</div>
				<div className='special'>
					<h4>Four rules</h4>
				</div>
				<div className='content'>
						<ol>
							<li>People predict inflation from experience. If <Kat string="\pi" /> is inflation and <Kat string="\pi_e" /> is <em>expected</em> inflation, then over time <Kat string="\pi_e \rightarrow\pi" />.</li>
							<li>The "real" interest rate, which accounts for expected inflation <Kat string="\pi_e" />, is what matters. If the "nominal" rate is <Kat string="i" /> (the rate advertised), then the real rate is <Kat string="r=i-\pi_e"/>.</li>
							<li>There is a "natural" real interest rate, <Kat string="\bar{r}"/>. If the real rate drops below <Kat string="\bar{r}"/>, then unemployment falls. When <Kat string="r"/> exceeds <Kat string="\bar{r}"/>, unemployment climbs.</li>
							<li>There is a "natural" unemployment rate, <Kat string="\bar{u}"/>. If unemployment <Kat string="u"/> drops below  <Kat string="\bar{u}"/>, then inflation rises (because workers bid up wages). If  <Kat string="u"/> exceeds <Kat string="\bar{u}"/>, then inflation falls.</li>
							</ol>
				</div>
				<div className='special'>
					<h4>Put the money where your mouse is</h4>
				</div>
				<div className="content">
						<p>With the <span className="blue">blue</span> dot, control <Kat string="i" col={col["light-blue"]["800"]}/> to stabilize <Kat string="\pi" col={col.orange["500"]}/> and <Kat string="u" col={col.indigo["500"]}/>. Watch <Kat string="\bar{r}" col={col.teal["600"]}/> and <Kat string="\bar{u}" col={col.indigo["500"]}/>, because when <Kat string="r<\bar{r}" col={col.teal["600"]}/>, <Kat string="u" col={col.indigo["500"]}/> falls; and when <Kat string="u<\bar{u}" col={col.indigo["500"]}/>, <Kat string="\pi" col={col.orange["500"]}/> rises. To reach a stable equilibrium, try a two-step plan: (i) change <Kat string="i"/> to make <Kat string="u=\bar{u}"/>; (ii) change  <Kat string="i"/> to make <Kat string="r=\bar{r}"/>. </p>
				<div className='flex-container-row plot-container'>
					<div style={{width: '75%', padding: '10px'}}>
						<Plot />
					</div>
					<div className='flex-container-column' style={{width: '25%', alignItems: 'center'}}>
						<button className="btn" onClick={this.pausePlay} >{this.paused ? 'PLAY' : 'PAUSE'}</button>
						<button className="btn" onClick={this.props.reset}>RESET</button>
						<div className='img-container'>
							{
								<img src="./app/yellen-unemployment-01.png"/>
							}
						</div>
					</div>
				</div>
				<div className='flex-container-row legend'>
						<ul>
							<li> <Kat string="i"/> &nbsp; Nominal interest rate</li>
							<li> <Kat string="r"/> &nbsp; Real interest rate</li>
							<li> <Kat string="\bar{r}"/> &nbsp; Natural interest rate</li>
						</ul>
						<ul>
							<li> <Kat string="u"/> &nbsp; Unemployment rate</li>
							<li> <Kat string="\bar{u}"/> &nbsp; Natural unemployment rate</li>
						</ul>
						<ul>
							<li> <Kat string="\pi"/> &nbsp; Inflation</li>
							<li> <Kat string="\pi_e"/> &nbsp; Expected inflation</li>
						</ul>
				</div>
				</div>
			</div>
			</div>
		);
	}
});

const mapActionsToProps = dispatch => {
	return {
		reset() {
			dispatch({ type: 'RESET' });
		},
		tick(dt) {
			dispatch({
				type: 'TICK',
				dt
			})
		},
		setVariable({ value, variable }) {
			dispatch({
				type: 'SET_VARIABLE',
				value,
				variable
			});
		}
	};
};

export default connect(state => state.data, mapActionsToProps)(AppComponent);
