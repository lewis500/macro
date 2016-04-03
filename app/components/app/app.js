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
			<h1>Low interest rates aren't easy money</h1>
			<div className='flex-container-column'>
			<div>
				<p>
					"Low interest rates are generally a sign that money has been tight..." <br/> -Milton Friedman
				</p>
			</div>
				<div className='special'>
					<h4>What causes US recessions and booms?</h4>
				</div>
				<div className='content'>
						<p>
							The answer is: the Federal Reserve. The Fed constantly creates money to buy very safe debt.</p>
						<p>When the Fed suddenly creates money faster,  interest rates (at least short-term ones) fall. Lower rates stimulate spending by making it cheap to borrow or refinance. For example, North Carolina <a href="http://abc11.com/politics/nc-passes-$2-billion-bond-for-infrastructure/1247482/">will soon borrow $2 billion</a> to build infrastructure <a href="http://connect.nc.gov/">because of low interest rates.</a> The extra spending boosts inflation and/or employment.
						</p>
						INSERT PLOT OF YELLEN YEARS
						<p>The reverse happens when the Fed curbs money-creation: spending, inflation and employment fall.</p>
						INSERT PLOT OF VOLCKER YEARS
						<p>This logic sounds simple, but things get more complicated for three reasons:
						</p>
						<ol>
							<li>People learn, so if <Kat string="\pi" /> is  inflation and <Kat string="\pi_e" /> is <em>expected</em> inflation, then over time <Kat string="\pi_e \rightarrow\pi" />. </li>
							<li>Workers account for expected inflation. If workers expect 3% inflation, then&mdash;to create jobs&mdash;the Fed must boost spending more than if they expect 1%.</li>
							<li>Lenders/borrowers account for expected inflation. It's more expensive to pay 3% interest when you expect 0% inflation than to pay 8% interest when you expect 7%. Specifically, if the "nominal" interest rate is <Kat string="i" />, then the "real" interest rate, <Kat string="r=i-\pi_e"/>, is what matters. </li>
						</ol>
						<p>These facts lead to two special quantities:</p>	
							<ol>
								<li>The <em>natural real interest rate</em>, <Kat string="\bar{r}"/>. If the real rate, <Kat string="r"/>, goes below <Kat string="\bar{r}"/>, then spending, prices and employment climb. When  <Kat string="r"/> exceeds <Kat string="\bar{r}"/>, they diminish.</li>
								<li>The <em>natural unemployment rate</em>, <Kat string="\bar{u}"/>. Keeping unemployment below  <Kat string="\bar{u}"/> creates higher and higher inflation.</li>
							</ol>
				</div>
				<div className='special'>
					<h4>Instructions</h4>
				</div>
				<div className="content">
						<p>With the <span className="blue">blue</span> dot, control <Kat string="i" col={col["light-blue"]["800"]}/> to stabilize <Kat string="\pi" col={col.teal["500"]}/> and <Kat string="u" col={col.indigo["500"]}/>. Watch <Kat string="\bar{r}"/> and <Kat string="\bar{u}"/>, because when <Kat string="r<\bar{r}"/>, <Kat string="u" col={col.indigo["500"]}/> falls; and when <Kat string="u<\bar{u}"/>, <Kat string="\pi" col={col.teal["500"]}/> rises. </p>
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
