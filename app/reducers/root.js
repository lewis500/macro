import d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';

const rand = d3.random.normal();

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
	const newState = {
		...state,
		πₑ,
		y,
		ȳ,
		u,
		π,
		r,
		time: time + dt,
	};

	history = history.filter(d => (time - d.time) <= 5);

	newState.history = [
		...history, {...state}
	];

	return newState;
};

const defaultState = {
	time: 5,
	//variables
	y: 1.0,
	i: .04,
	πₑ: .02,
	r: .02,
	π: .02,
	u: .05,

	//params
	ȳ: 1.0,
	r̄: .02,
	ū: .05,

	//\sigmas
	σπₑ: 1.25,
	σπ: 3,
	σy: 1.5,
	σu: 2,
};

const reset = () => {
	const state = defaultState;
	state.history = _.map(_.range(0, 5, .003), time => ({...state, time }))
	return state;
};

const rootReduce = (state, action) => {
	switch (action.type) {
		case 'TICK':
			return reduceTick(state, action);
		case 'RESET':
			return reset(state);
		case 'SET_VARIABLE':
			return {
				...state,
				[action.variable]: action.value
			};
		case 'SET_I':
			return {
				...state,
				i: action.i
			};
		default:
			return state;
	}
};

const store = createStore(rootReduce);
store.dispatch({ type: 'RESET' });

export default store;
