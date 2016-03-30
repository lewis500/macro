const initialState = {
	history: [],
	time: 0,
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
	σπₑ: 2,
	σπ: 3,
	σy: 3,
	σu: 3,
};


initialState.history = [{...initialState}];

export default initialState;