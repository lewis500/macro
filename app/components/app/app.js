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
			<h1 style={{'horizonal-align': 'center'}}>Macroeconomics in one lesson</h1>
			<div className='flex-container-column'>
				<div className='special'>
					<h4>What causes US recessions and booms?</h4>
				</div>
				<div className='content'>
						<div className='pic'>
							<img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Marriner_S._Eccles_Federal_Reserve_Board_Building.jpg" height="200px"/>
						</div>
						<p>
							The answer is: the Federal Reserve. The Fed constantly creates money to buy very safe debt from big banks, and this is most of what explains the economy's swings.</p>
						<p>When the Fed suddenly creates money faster,  interest rates (at least short-term ones) fall. This boosts spending by making it cheap to borrow or refinance. For example, North Carolina <a href="http://abc11.com/politics/nc-passes-$2-billion-bond-for-infrastructure/1247482/">will soon borrow $2 billion</a> to build infrastructure <a href="http://connect.nc.gov/">because of low interest rates.</a> The extra spending boosts inflation and/or employment. When the Fed doesn't create money fast enough, spending falls. It might do this on purpose to cut inflation <a href="http://www.carnegie-rochester.rochester.edu/Nov04-pdfs/GK.pdf">like in the early 80's,</a> or by accident <a href="http://fee.org/articles/the-great-depression-according-to-milton-friedman/">like in the 30's.</a>
						</p>
				</div>
				<div className='special'>
					<h4>Four rules</h4>
				</div>
				<div className='content'>
						<p>To see how the Fed decides what to do, we'll simulate a simple economy. It has four rules:</p>
						<ol>
							<li>People predict what inflation will be from experience. So if <Kat string="\pi" /> is <em>current</em> inflation and <Kat string="\pi_e" /> is <em>expected</em> inflation, then over time <Kat string="\pi_e \rightarrow\pi" />.</li>
							<li>The "real" interest rate, which takes expected inflation into account, is what matters to employment. If the "nominal" interest rate is <Kat string="i" /> (the rate at which you actually borrow), then the real interest rate <Kat string="r"/> is given by <Kat string="r=i-\pi_e"/>. So if <Kat string="\pi_e"/> rises, then <Kat string="i"/> needs to rise to have the same effect, and vice versa.</li>
							<li>There is a "natural" real interest rate, <Kat string="\bar{r}"/>. If the real rate drops below <Kat string="\bar{r}"/>, then unemployment falls. And when <Kat string="r"/> exceeds <Kat string="\bar{r}"/>, unemployment climbs.</li>
							<li>There is a "natural" unemployment rate, <Kat string="\bar{u}"/>. If unemployment <Kat string="u"/> drops below  <Kat string="\bar{u}"/>, then inflation rises (because workers bid up wages). If  <Kat string="u"/> exceeds <Kat string="\bar{u}"/>, then inflation falls.</li>
							</ol>
				</div>
				<div className='special'>
					<h4>A simulation</h4>
				</div>
				<div className="content">
						<p>This simulation applies the ideas above to a simple economy. With the <span className="blue">blue</span> dot, control <Kat string="i" col={col["light-blue"]["800"]}/> to stabilize <Kat string="\pi" col={col.orange["500"]}/> and <Kat string="u" col={col.indigo["500"]}/>. Watch <Kat string="\bar{r}" col={col.teal["600"]}/> and <Kat string="\bar{u}" col={col.indigo["500"]}/>, because when <Kat string="r<\bar{r}" col={col.teal["600"]}/>, <Kat string="u" col={col.indigo["500"]}/> falls; and when <Kat string="u<\bar{u}" col={col.indigo["500"]}/>, <Kat string="\pi" col={col.orange["500"]}/> rises. To reach a stable equilibrium, try a two-step plan: (i) change <Kat string="i"/> to make <Kat string="u=\bar{u}"/>; (ii) change  <Kat string="i"/> to make <Kat string="r=\bar{r}"/>. </p>
				<div className='flex-container-row plot-container'>
					<div style={{width: '75%', padding: '10px'}}>
						<Plot />
					</div>
					<div className='flex-container-column' style={{width: '25%', alignItems: 'center'}}>
						<button className="btn" onClick={this.pausePlay} >{this.paused ? 'PLAY' : 'PAUSE'}</button>
						<button className="btn" onClick={this.props.reset}>RESET</button>
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
