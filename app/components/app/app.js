import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import Plot from '../plot/plot';
import d3Timer from 'd3-timer';
import col from "../../style/colors"
import PicFrame from '../pic/pic';

const KK = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.S, { displayMode: false });
		const style = this.props.col ? { color: this.props.col } : {};
		return <span className="katex-span" style={style} dangerouslySetInnerHTML={ {__html: rendered } } />
	}
});

const CC = {
	π_e: col.orange["600"],
	π: col.pink["600"],
	r: col.teal["600"],
	i: col["light-blue"]["700"],
	u: col.indigo["500"]
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
				<div className='title'>
					<div className='title-container'>
						<h2>Federal Reserve Simulator</h2>
						by <a href="http://lewislehe.com">Lewis Lehe</a> (of <a href="http://setosa.io">Setosa</a>)
					</div>
				</div>
			<div className='flex-container-column'>
				<div className='content'>
						<p>
							The Federal Reserve constantly creates money to buy very safe debt. When it suddenly creates money faster,  short-term interest rates fall, which boosts spending. For example, North Carolina <a href="http://abc11.com/politics/nc-passes-$2-billion-bond-for-infrastructure/1247482/">will soon borrow $2 billion</a> to build school buildings <a href="http://connect.nc.gov/">because of low interest rates.</a> The extra spending boosts inflation and employment, which, likewise, fall when the Fed creates less money.
						</p>
						<p>To illustrate, we'll simulate an economy from four rules and choose the interest rate.</p>
				</div>
				<div className='special'>
					<h4>Four rules</h4>
				</div>
				<div className='content'>
						<ol>
							<li>People predict inflation from experience. If <KK S="\pi"col={CC.π} /> is inflation and <KK S="\pi_e" col={CC.π_e}/> is <em>expected</em> inflation, then over time <KK S="\pi_e" col={CC.π_e}/> <KK S="\rightarrow"/> <KK S="\pi" col={CC.π}/>.</li>
							<li>The "real" interest rate, which takes expected inflation <KK S="\pi_e" col={CC.π_e}/> into accounted, is what matters. If the "nominal" rate is <KK S="i" col={CC.i} /> (the rate advertised), then the real rate is <KK S="r=i-\pi_e" col={CC.r}/>.</li>
							<li>There is a "natural" real interest rate, <KK S="\bar{r}" col={CC.r}/>. If the real rate, <KK S='r' col={CC.r} />, drops below <KK S="\bar{r}" col={CC.r}/>, then unemployment falls. When <KK S="r" col={CC.r}/> exceeds <KK S="\bar{r}" col={CC.r}/>, unemployment climbs.</li>
							<li>There is a "natural" unemployment rate, <KK S="\bar{u}" col={CC.u}/>. If unemployment <KK S="u" col={CC.u}/> drops below  <KK S="\bar{u}" col={CC.u}/>, then inflation rises (because workers bid up wages). If  <KK S="u" col={CC.u}/> exceeds <KK S="\bar{u}" col={CC.u}/>, then inflation falls.</li>
						</ol>
				</div>
				<div className='special'>
					<h4>Put your money where your mouse is</h4>
				</div>
				<div className="content">
						<p style={{textAlign: 'center'}}>With the <span className="blue">blue</span> dot, control <KK S="i" col={CC.i}/> to stabilize <KK S="\pi" col={CC.π}/> and <KK S="u" col={CC.u}/>.  <br/>
						When <KK S="r<\bar{r}" col={CC.r}/>, <KK S="u" col={CC.u}/> falls. 	When <KK S="r>\bar{r}" col={CC.r}/>, <KK S="u" col={CC.u}/> rises.  <br/> 
						When <KK S="u<\bar{u}" col={CC.u}/>, <KK S="\pi" col={CC.π}/> rises.  When <KK S="u>\bar{u}" col={CC.u}/>, <KK S="\pi" col={CC.π}/> falls. <br/>
						You fail if <KK S="u<\bar{u}" col={CC.u}/> or <KK S="\pi" col={CC.π}/> gets too high.
						</p>
						<br/>
				<div className='flex-container-row'>
					<div style={{width:'72.5%',marginRight:'2.5%'}} className='plot-container'>
						<Plot />
					</div>
					<div className='flex-container-column' >
						<button className="btn" onClick={this.pausePlay} >{this.paused ? 'PLAY' : 'PAUSE'}</button>
						<button className="btn" onClick={this.props.reset}>RESET</button>
						<PicFrame 
							{...this.props}
							paused={this.paused}
							/>
					</div>
				</div>
				<div className='flex-container-row legend'>
						<ul>
							<li> <KK S="i" col={CC.i}/> &nbsp; Nominal interest rate</li>
							<li> <KK S="r" col={CC.r}/> &nbsp; Real interest rate</li>
							<li> <KK S="\bar{r}" col={CC.r}/> &nbsp; Natural interest rate</li>
						</ul>
						<ul>
							<li> <KK S="u" col={CC.u}/> &nbsp; Unemployment rate</li>
							<li> <KK S="\bar{u}" col={CC.u}/> &nbsp; Natural unemployment rate</li>
						</ul>
						<ul>
							<li> <KK S="\pi" col={CC.π}/> &nbsp; Inflation</li>
							<li> <KK S="\pi_e" col={CC.π_e}/> &nbsp; Expected inflation</li>
						</ul>
				</div>
				</div>
				<div className='special'>
					<h4>Discussion</h4>
				</div>
				<div className="content">
					<p>This is a very simple model. It is unrealistic in many ways: you can get 0% unemployment; you can't <a href="http://www.brookings.edu/blogs/ben-bernanke/posts/2016/03/18-negative-interest-rates">set negative interest rates</a>; the natural rates of unemployment and interest don't change (to make play easier). Moreover, in real life, the Fed has more tools than <KK S="i" col={CC.i}/>: it can <a href="http://www.brookings.edu/blogs/ben-bernanke/posts/2016/03/24-rate-pegs">set long-term interest rates</a> or do quantitative easing. But what the simulation does accomplish is to show the Fed's  trade-offs.</p>
					<p>To learn more about macro, subscribe to <a href="https://itunes.apple.com/us/podcast/macro-musings/id1099277290?mt=2" >David Beckworth's new podcast</a> or read <a href="http://www.brookings.edu/blogs/ben-bernanke">Ben Bernanke's</a> and <a href="http://www.themoneyillusion.com/">Scott Sumner's</a> blogs.	To read more about macroeconomics, check out David Romer's <a href="http://www.amazon.com/Advanced-Macroeconomics-McGraw-Hill-Series-Economics/dp/0073511374">Advanced Macroeconomics</a>. Please don't email me about <a href="http://econlog.econlib.org/archives/2006/09/my_latest_paper.html">Austrian economics</a> or other alternative theories.
					</p>
				</div>
				<div className='special'>
					<h4>A rant</h4>
				</div>
				<div className="content">
					<p>As a parting shot I couldn't resist, I'll address the idea <a href="http://www.businessinsider.com/ben-bernanke-on-federal-reserve-hurting-savers-2015-10">the Fed hurts "savers" with low interest rates.</a> The complaint has three problems:</p>
					<ol>
						<li>
							The Fed could only make <KK S="r" col={CC.r}/> higher than <KK S="\bar{r}" col={CC.r} /> at the cost of ever-worsening unemployment.
						</li>
						<li>The Fed has legal mandates to keep employment high and inflation low.</li>
						<li>
							"Saver" is not an identity. Anyone holding money in the bank can instead pay off debt, buy securities, buy real estate or spend.  If many people want to hold money and few safe borrowers want to invest, then returns to holding money will be low.
						</li>
					</ol>
					<p>Savers' real enemies are (i) <a href="http://www.bloombergview.com/articles/2016-04-11/those-tiny-fees-make-your-financial-adviser-rich">fund managers</a> who underperform index funds; and (ii) lawyers and officials who abuse the legal system&mdash;especially patent and <a href="http://www.planningreport.com/2015/12/21/new-ceqa-study-reveals-widespread-abuse-legal-process-non-environmentalists">land-use law</a>&mdash;in ways that block investment.</p>
				</div>
			</div>
			<p>Created with React, d3.js, Redux, WebPack and Babel.</p>
			</div>
		);
	}
});

	{

				}

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
