import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';
let rand = d3.random.normal();

// const u = Math.max(ū - 1 / β * (Math.exp(x) - 1), .01); //other way to calculate u

const reduceTick = (state, action) => {
	let { πₑ, y, u, time, history } = state;
	const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;
	const dt = action.dt / 1000;
	const ϵ = rand() * .001;
	const η = rand() * .01;
	const r = i - πₑ;
	const ẏ = -(r - r̄) / σy + η;
	y += ẏ * dt; // with demand shock
	const π = πₑ + (y - ȳ) / σπ;
	const π̇_e = (π - πₑ) / σπₑ + ϵ;
	πₑ += dt * π̇_e;
	//unemployment is not directly consequential
	const u̇ = -ẏ / σu;
	u += u̇ * dt;
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
