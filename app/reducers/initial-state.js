const initialState = {
	history: [],
	// parameters
	time: 0,
	α: .25,
	κ: 1,
	π: .02,
	π_e: .02,
	θ: .5,
	γ: .1,
	μ: .1,
	y_bar: 1,
	δ: .1,
	β:.5,

	// variables
	y: 0,
	m: .01,
	r: .02,
	G: .2,

	// delta_t
	Δ: .35,
	rStar: 0
};

let { κ, α, π_e, δ, θ, μ, y_bar, m, γ, Δ, time } = initialState;

initialState.rStar = -(κ + α / γ) / (α + κ * γ) * y_bar;

export default initialState;
