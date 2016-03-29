import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';

console.log(initialState);

const reduceHistory = (state) => {
	let history = _.reduce(_.range(0, 60), (a) => {
		let last_state = a[a.length - 1];
		return [...a, reduceTick(last_state)];
	}, [_.omit(state, 'history')]);
	return {
		...state,
		history,
	};
};

const reduceTick = (state) => {
	let { π_e, ȳ, x, y, κ, σ, δ, r̄, i, Δ, time } = state;

	let r = i - π_e; //real interest rate
	//ONE WAY
	let ẏ = -1/σ*(r - r̄);
	y = ẏ * Δ + y;
	x = y - ȳ;

	//ANOTHER WAY
	let π = π_e + κ * x;
	let π̇_e = δ * (π - π_e);
	// let π̇_e = δ * (κ * x);
	π_e = Δ * π̇_e + π_e;
	return {
		...state,
		x,
		π_e,
		y,
		π,
		r,
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
