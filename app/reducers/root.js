import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';
import col from '../style/colors';

const initialState = {
	time: 1,
	history: [],

};

// const colorScale = d3.scale.linear()
// 	.domain([0, 1 / SPACE])
// 	.interpolate(d3.interpolateHcl)
// 	.range([col['red']['50'], col.pink['800']]);

const reduceTick = (state,action)=>{
	return {
		...state,
		time: state.time + 1
	};
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'TICK':
			return reduceTick(state,action);
		// case 'CALC_HISTORY':
		// 	return reduceHistory(state);
		// case 'ADVANCE':
		// 	return reduceTime(state, state.time + 1);
		// case 'SET_TIME':
		// 	return reduceTime(state, action.time);
		// case 'PAUSE_PLAY':
		// 	return {...state, paused: !state.paused
		// 	};
		default: return state;
	}
};

export default rootReduce;
