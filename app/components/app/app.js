import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import OtherPlot from '../islm/other-plot';
import d3Timer from 'd3-timer';

const Kat = props => {
	const rendered = katex.renderToString(props.string, { displayMode: false });
	return (
		<span dangerouslySetInnerHTML={ {__html: rendered } } key={props.key}/>
	);
};

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
					<h4>How the US macroeconomy works</h4>
				</div>
				<div>
						<p>
							Laws, health, learning, demographics, physical capital and luck decide what standard-of-living is <em>possible</em> for Americans to enjoy. But these don't change quickly, so what's behind recessions and booms?  
						</p>
						<p>
							The answer is: the Federal Reserve. The Fed creates money to buy short-term, safe debt. When they do so quickly, short-term interest rates fall, and total spending in the economy &mdash; called "nominal GDP" or "NGDP" &mdash; rises, because people refinance and borrow. For example, North Carolina <a href="http://abc11.com/politics/nc-passes-$2-billion-bond-for-infrastructure/1247482/">will soon borrow $2 billion</a> to build infrastructure <a href="http://connect.nc.gov/">because of low interest rates.</a> Rising NGDP drags inflation and employment up, too: inflation because sellers raise prices amid brisk spending; employment because wages/salaries don't rise as quickly as sales revenue and tax collections do, which makes firms and public agencies want to hire. The opposite happens when the Fed curbs money-creation.</p>
						<p>This logic sounds simple: more money => more spending => more jobs/higher prices. But the whole story is murkier, because...
						</p>
						<ol>
							<li>People learn, so if <Kat string="\pi" /> is actual inflation and <Kat string="\pi_e" /> is <em>expected</em> inflation, then over time <Kat string="\pi_e \rightarrow\pi" />. </li>
							<li>Workers account for expected inflation. If workers expect 3% inflation, to lower unemployment, the Fed must boost NGDP enough to create inflation higher than 4%.</li>
							<li>Lenders/borrowers account for expected inflation. It's more expensive, in terms of spending power, to pay 3% interest when you expect 0% inflation than to pay 8% interest when you expect 7% inflation. Therefore, if the "nominal" interest rate is <Kat string="i" />, then the "real" interest rate, <Kat string="r=i-\pi_e"/>, is what affects NGDP/inflation/unemployment. </li>
						</ol>
						<p>These facts lead, in roundabout ways, to two special quantities:
						</p>	
							<ol>
								<li>The <em>natural real interest rate</em>, <Kat string="\bar{r}"/>. If the actual real rate, <Kat string="r"/>, goes below <Kat string="\bar{r}"/>, then NGDP, prices and employment grow faster. When  <Kat string="r"/> exceeds <Kat string="\bar{r}"/>, the opposite happens.</li>
								<li>The <em>natural unemployment rate</em>, <Kat string="\bar{u}"/>. To keep unemployment below it forever would require higher and higher inflation. </li>
							</ol>
				</div>
				<div className='special'>
					<h4>Instructions</h4>
				</div>
				<div>
						<p>Using the blue dot,control the nominal interest rate <Kat string="i"/> to stabilize <Kat string="\pi"/> (inflation) and <Kat string="u"/> (unemployment). Pay attention to <Kat string="\bar{r}"/> (the natural real interest rate) and <Kat string="\bar{u}"/> (the natural unemployment rate). When <Kat string="r<\bar{r}"/>, unemployment decreases. When <Kat string="u<\bar{u}"/>, inflation increases. </p>
				</div>
				<div className='flex-container-row'>
					<div style={{width: '70%'}}>
						<OtherPlot />
					</div>
					<div className='flex-container-column' style={{width: '25%'}}>
						<button className="btn" onClick={this.pausePlay} >{this.paused ? 'PLAY' : 'PAUSE'}</button>
						<button className="btn" onClick={this.props.reset}>RESET</button>
					</div>
				</div>
				<div>
					<h4 style={{marginTop: 10}}>Legend</h4>
					<ul>
						<li> <Kat string="i"/> &nbsp; Nominal rate of interest</li>
						<li> <Kat string="r"/> &nbsp; Real rate of interest</li>
						<li> <Kat string="\bar{r}"/> &nbsp; Natural rate of interest</li>
						<li> <Kat string="u"/> &nbsp; Unemployment rate</li>
						<li> <Kat string="\bar{u}"/> &nbsp; Non-accelerating inflation rate of unemployment (NAIRU)</li>
						<li> <Kat string="\pi"/> &nbsp; Inflation</li>
						<li> <Kat string="\pi_e"/> &nbsp; Expected inflation</li>
					</ul>
				</div>
			</div>
			</div>
		);
	}
});

const mapActionsToProps = dispatch => {
	return {
		reset(){
			dispatch({type: 'RESET'});
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
