
const initialState = {
	history: [],
	// parameters
	time: 0,
	α: .25,
	κ: 1,
	π: .02,
	π_e: .02,
	θ: .5,
	γ: .5,
	μ: .1,
	y_bar: 0,
	δ: .1,

	// variables
	y: 0,
	m: .01,
	r: .02,

	// delta_t
	Δ: .35,

};

export default initialState;