import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';

const reduceHistory = (state) => {
	let { κ, α, π_e, δ, θ, μ, y_bar, m, γ, Δ, time } = state;
	let c = κ + α / γ,
		d = α + κ * γ;
	// console.log(c,d);

	// let rStar = -y_bar / γ;
	let rStar = -c / d * y_bar;
	// console.log(c / d * y_bar);
	let history = _.reduce(_.range(0, 300), (a) => {
		let last_state = a[a.length - 1];
		return [...a, reduceTick(last_state)];
	}, [state]);
	return {
		...state,
		history,
		rStar
	};
};

const reduceTick = (state) => {
	let { κ, α, π_e, δ, θ, μ, y, y_bar, m, γ, r, Δ, time, G,β } = state;
	// our constants


	//fundamental variables
	y = G + β*y - γ * r;

	let i = -(m - κ * y) / α,
		π = π_e + θ * (y - y_bar);
	r = i - π_e;

	//other variables
	let π_e_dot = δ * (π - π_e),
		m_dot = μ - π;
	π_e = π_e + Δ * π_e_dot;
	m = m + Δ * m_dot;

	return {
		...state,
		y,
		r,
		π,
		π_e,
		m,
		time: time + 1
	};
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'TICK':
			return reduceTick(state, action);
		case 'SET_VARIABLE':
			return reduceHistory({
				...state,
				[action.variable]: action.value
			});
		case 'MAKE_HISTORY':
			return reduceHistory(state);
		default:
			return state;
	}
};

export default rootReduce;
