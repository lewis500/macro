import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';
let rand = d3.random.normal();


const reduceTick = (state, action) => {
	let { π_e, ȳ, y, ū, κ, σ, δ, β, r̄, i, Δ, time, history } = state;
	let dt = action.dt / 1000;
	let r = i - π_e;
	let ϵ = rand() * .001;
	let η = rand() * .1;
	const ẏ = -1 / σ * (r - r̄) + η;
	y = ẏ * dt + y ; // with demand shock
	const x = y - ȳ;
	const u = Math.max(ū - 1 / β * (Math.exp(x) - 1), .01);
	const π = π_e + κ * x ;
	const π̇_e = δ * (π - π_e) + ϵ;
	π_e = dt * π̇_e + π_e;
	history = [
		...history, {
			y,
			ȳ,
			i,
			u,
			r,
			ū,
			π,
			r̄,
			π_e,
			time: time + dt
		}
	];
	history = history.filter(d => (time - d.time) <= 5);
	return {
		...state,
		history,
		π_e,
		y,
		ȳ,
		u,
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
