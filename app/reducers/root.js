import d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';
import plotInitialState from '../components/plot/plot-initial';
import macroData from './data'

const rand = d3.random.normal();

const reduceTick = (state, action) => {
    let { πₑ, y, u, time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;
    const dt = action.dt / 1000;
    const ϵ = rand() * .003;
    const η = Math.random() < .25 ? rand() * .015 : 0;
    const bigOne = Math.random() < .04 ? rand() * .04 : 0;
    const r = i - πₑ;
    const ẏ = -(r - r̄) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    y = Math.min(y, ȳ + ū * σu);
    // y = Math.min(y, ȳ + Math.log(1+ū*σu))
    const π = πₑ + (y - ȳ) / σπ;
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;
    const u̇ = -ẏ / σu;
    u += u̇ * dt;
    u = Math.max(u, 0);
    // u = ū -(y - ȳ)/σu;
    // u = ū - (Math.exp(y-ȳ)-1)/σu;
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
    u: .045,

    //params
    ȳ: 1.0,
    r̄: .02,
    ū: .045,

    //\sigmas
    σπₑ: 1.3,
    σπ: 2.15,
    σy: 1.2,
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

const reducePlot = (plot, data, action) => {
    switch (action.type) {
        case 'CHANGE_PLOT':
            return _.assign({}, plot, action.changes);
        case 'RESET':
        case 'TICK':
            const h = data.history,
                xDomain = [
                    h[0].time,
                    h[h.length - 1].time + 2.5
                ];
            return {...plot, xDomain };
        default:
            return plot
    }
};

const reduceMacro = (macro, action) => {
    switch (action.type) {
        case 'CHANGE_MACRO':
            return {...macro, ...action.changes };
        default:
            return macro;
    }
};

const rootReduce = (state = { data: defaultData, plot: plotInitialState }, action) => {
    const data = reduceData(state.data, action),
        plot = reducePlot(state.plot, data, action);
    return { data, plot, macroData };
};

const store = createStore(rootReduce);

export default store;
