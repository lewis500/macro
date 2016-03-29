import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';
let rand = d3.random.normal();


const reduceTick = (state, action) => {
	let { πₑ, ȳ, y, ū, κ, σ, δ, β, r̄, i, Δ, time, history } = state;
	let dt = action.dt / 1000;
	let r = i - πₑ;
	let ϵ = rand() * .001;
	let η = rand() * .01;
	const ẏ = -1 / σ * (r - r̄) + η;
	y = ẏ * dt + y ; // with demand shock
	const x = y - ȳ;
	const u = Math.max(ū - 1 / β * (Math.exp(x) - 1), .01);
	const π = πₑ + κ * x ;
	const π̇_e = δ * (π - πₑ) + ϵ;
	πₑ = dt * π̇_e + πₑ;
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
			πₑ,
			time: time + dt
		}
	];
	history = history.filter(d => (time - d.time) <= 5);
	return {
		...state,
		history,
		πₑ,
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
