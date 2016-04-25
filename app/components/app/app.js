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
  componentDidMount(){
  	this.pausePlay();
  	setTimeout(()=>{
  		this.pausePlay();
  	}, 2200);
  },
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
				<div className="content">
					<div className='flex-container-row'>
						<div style={{width:'72.5%',marginRight:'2.5%'}} className='plot-container'>
							<Plot/>
						</div>
						<div className='flex-container-column' >
							<button className="btn" onClick={this.pausePlay} >{this.paused ? 'PLAY' : 'PAUSE'}</button>
							<button className="btn" onClick={this.props.reset}>RESET</button>
							<PicFrame {...this.props}	paused={this.paused}/>
						</div>
					</div>
					<div className='flex-container-row legend'>
						<div>						
							<p>With the <span className="blue">blue</span> dot, control <KK S="i" col={CC.i}/> to stabilize <KK S="\pi" col={CC.π}/> and <KK S="u" col={CC.u}/>. When <KK S="r<\bar{r}" col={CC.r}/>, <KK S="u" col={CC.u}/> falls; 	when <KK S="r>\bar{r}" col={CC.r}/>, <KK S="u" col={CC.u}/> rises. When <KK S="u<\bar{u}" col={CC.u}/>, <KK S="\pi" col={CC.π}/> rises; when <KK S="u>\bar{u}" col={CC.u}/>, <KK S="\pi" col={CC.π}/> falls.<br/> You fail if <KK S="u" col={CC.u}/> or <KK S="\pi" col={CC.π}/> gets too high.
							</p>
						</div>
						<div>
							<ul>
								<li> <KK S="i" col={CC.i}/> &nbsp; nominal interest rate</li>
								<li> <KK S="r" col={CC.r}/> &nbsp; real interest rate</li>
								<li> <KK S="\bar{r}" col={CC.r}/> &nbsp; natural interest rate</li>
								<li> <KK S="u" col={CC.u}/> &nbsp; unemployment rate</li>
							</ul>
						</div>
						<div>
							<ul>
								<li> <KK S="\bar{u}" col={CC.u}/> &nbsp; natural unemployment rate</li>
								<li> <KK S="\pi" col={CC.π}/> &nbsp; inflation</li>
								<li> <KK S="\pi_e" col={CC.π_e}/> &nbsp; expected inflation</li>
							</ul>
						</div>
					</div>
				</div>
				<div className='special'>
					<h4>What's Happening</h4>
				</div>
				<div className='content'>
						<ul>
							<li>The Fed creates money to buy safe debt. When it does so quickly, the "nominal" interest rate <KK S="i" col={CC.i}/> falls. The nominal rate is the "sticker price" of borrowing.
							</li>
							<li>It's not the nominal rate, <KK S="i" col={CC.i}/>, but the "real" rate, <KK S="r" col={CC.r}/>, that matters. The real rate subtracts out expected inflation <KK S="\pi_e" col={CC.π_e}/>, so it's <KK S="r" col={CC.r}/><KK S=":="/><KK S="i" col={CC.i}/><KK S="-"/><KK S="\pi_e" col={CC.π_e}/>. A low <KK S="r" col={CC.r}/> can boost spending: for example, North Carolina <a href="http://abc11.com/politics/nc-passes-$2-billion-bond-for-infrastructure/1247482/">will borrow $2 billion</a> for schools <a href="http://connect.nc.gov/">due to low  rates.</a></li>
							<li>People learn to expect inflation. If <KK S="\pi"col={CC.π} /> is inflation and <KK S="\pi_e" col={CC.π_e}/>  <em>expected</em> inflation, then over time <KK S="\pi_e" col={CC.π_e}/> <KK S="\rightarrow"/> <KK S="\pi" col={CC.π}/>.</li>
							<li>There is a "natural" real interest rate, <KK S="\bar{r}" col={CC.r}/>. If <KK S='r' col={CC.r} /> drops below <KK S="\bar{r}" col={CC.r}/>, unemployment falls. When <KK S="r" col={CC.r}/> exceeds <KK S="\bar{r}" col={CC.r}/>, unemployment climbs.</li>
							<li>There is a "natural" unemployment rate, <KK S="\bar{u}" col={CC.u}/>. If unemployment <KK S="u" col={CC.u}/> drops below  <KK S="\bar{u}" col={CC.u}/>, inflation rises. If  <KK S="u" col={CC.u}/> exceeds <KK S="\bar{u}" col={CC.u}/>, inflation falls.</li>
						</ul>
				</div>
				<div className='special'>
					<h4>Discussion</h4>
				</div>
				<div className="content">
					<p>This is a very simple model. It is unrealistic in many ways: you can get 0% unemployment; there's nothing wrong with deflation; you can't <a href="http://www.brookings.edu/blogs/ben-bernanke/posts/2016/03/18-negative-interest-rates">set negative interest rates</a>; the natural rates of unemployment and interest don't change (to make play easier). Moreover, the Fed has more tools than <KK S="i" col={CC.i}/>: it can <a href="http://www.brookings.edu/blogs/ben-bernanke/posts/2016/03/24-rate-pegs">set long-term interest rates</a> or do quantitative easing. But what the simulation does accomplish is to show the Fed's  trade-offs.</p>
					<p>To learn more about macro, subscribe to <a href="https://itunes.apple.com/us/podcast/macro-musings/id1099277290?mt=2" >David Beckworth's new podcast</a> or read <a href="http://www.brookings.edu/blogs/ben-bernanke">Ben Bernanke's</a> and <a href="http://www.themoneyillusion.com/">Scott Sumner's</a> blogs.	For deep cuts, check out David Romer's <a href="http://www.amazon.com/Advanced-Macroeconomics-McGraw-Hill-Series-Economics/dp/0073511374">Advanced Macroeconomics</a>.
					</p>
				</div>
			</div>
			<p>Made with React, d3.js, Redux, WebPack and Babel. Thanks to my roommates for playing this boring game.</p>
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
