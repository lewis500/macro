const initialState = {
	history: [],
	time: 0,
	//variables
	y: 1.0,
	i: .03,
	πₑ: .03,
	r: 0,
	π: .03,
	u: .05,

	//params
	ȳ: 1.0,
	r̄: .01,
	Δ: .075,
	κ: .1,
	δ: .25,
	σ: 2,
	ū: .05,
	β: 3,
};


initialState.history = [{...initialState}];

export default initialState;