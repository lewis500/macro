import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';

const reduceHistory = (state) => {
	let history = _.reduce(_.range(0, 100), (a) => {
		let last_state = a[a.length - 1];
		return [...a, reduceTick(last_state)];
	}, [state]);
	return {
		...state,
		history
	};
};

const reduceTick = (state) => {
	let { κ, α, π, π_e, δ, θ, μ, y_bar, m, γ, Δ, time } = state;
	// our constants
	let c = κ + α / γ,
		d = α + κ * γ;

	//fundamental variables
	let r = -(m + α * π_e) / d,
		y = -γ * r;
	// y = (m + α * π_e) / c;
	π = π_e + θ * (y - y_bar);

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
