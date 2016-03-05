import d3 from 'd3';
import _ from 'lodash';
import col from '../style/colors';

// y = -gamma * r
// m = κ⋅y - α(r+π_e)
// mdot = μ - π
// pi_edot = δ(π - π_e)
// π = π_e + θ(y-y_bar)

const initialState = {
	time: 1,
	history: [],
	// parameters

	α: .25,
	κ: 1,
	π: .02,
	π_e: .02,
	θ: .5,
	γ: .5,
	μ: .01,
	y_bar: 0,
	δ: .1,

	// variables
	y: 0,
	m: .01,
	r: .02,

	// delta_t
	Δ: .1
};


const reduceHistory = (state)=>{
	

};

// const colorScale = d3.scale.linear()
// 	.domain([0, 1 / SPACE])
// 	.interpolate(d3.interpolateHcl)
// 	.range([col['red']['50'], col.pink['800']]);

const reduceTick = (state) => {
	let { κ, α, π, π_e, δ, θ, μ, y_bar, y, m, r, γ, Δ } = state;
	// our constants
	let c = κ + α / γ,
		d = α + κ * γ;

	//fundamental variables
	y = (m + α * π_e) / c;
	r = -(m + α * π_e) / d;

	//other variables
	let	π_e_dot = δ * (π - π_e),
		m_dot = m + μ - π;
	π_e = π_e + Δ * π_e_dot;
	π = π_e + θ * (y - y_bar);
	m = m + Δ * m_dot;

	return {
		...state,
		y,r,π,π_e,m
	};
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'TICK':
			return reduceTick(state, action);
		case 'SET_VARIABLE':
			return {
				...state,
				[action.variable]: action.value
			};
		case 'PAUSE_PLAY':
			return {...state,
				paused: !state.paused
			};
		default:
			return state;
	}
};

export default rootReduce;
