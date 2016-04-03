import d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';
import plotInitialState from '../components/plot/plot-initial';

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
		...history, {...state }
	];

	return newState;
};

const defaultData = {
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

defaultData.history = _.map(_.range(0, 5, .003), time => ({...defaultData, time }))

const reduceData = (data, action) => {
	switch (action.type) {
		case 'TICK':
			return reduceTick(data, action);
		case 'RESET':
			return defaultData;
		case 'SET_VARIABLE':
			return {
				...data,
				[action.variable]: action.value
			};
		case 'SET_I':
			return {
				...data,
				i: action.i
			};
		default:
			return data;
	}
};

const reducePlot = (state, action) => {
	const { data, plot } = state;
	const { history } = data;
	const xDomain = [
		history[0].time,
		history[history.length - 1].time + 2.5
	];
	switch (action.type) {
		case 'CHANGE_PLOT':
			return _.assign({}, plot, action.changes, { xDomain });
		default:
			return {...plot, xDomain };
	}
};

const rootReduce = (state = { data: defaultData, plot: plotInitialState }, action) => {
	return {
		data: reduceData(state.data, action),
		plot: reducePlot(state, action)
	};
};

const store = createStore(rootReduce);

export default store;
