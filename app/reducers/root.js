import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';

const reduceTick = (state, action) => {
	let { π_e, ȳ, y, κ, σ, δ, r̄, i, Δ, time, history } = state;
	let dt = action.dt / 1000;
	let r = i - π_e;
	const ẏ = -1 / σ * (r - r̄);
	y = ẏ * dt + y;

	let π = π_e + κ * (y - ȳ);
	const π̇_e = δ * (π - π_e);
	π_e = dt * π̇_e + π_e;
	history = [
		...history, {
			y,
			i,
			r,
			π,
			π_e,
			time: time + dt
		}
	];
	history = history.filter(d => (time - d.time) <= 5);
	// if( (time - history[0].time) > 25) history =  
	return {
		...state,
		history,
		π_e,
		y,
		π,
		r,
		time: time + dt
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
		default:
			return state;
	}
};

export default rootReduce;
