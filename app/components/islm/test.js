const getTrips;

// const 

let pagesCount, trips = [];
let max_rate = 30 * 1000;
let last_time = Date.now();
getTrips({
		query
	})
	.then(function cb(res,err) {
		if (!pagesCount) pagesCount = res.pages;
		trips.push(res.trips);
		let page = res.page;
		setTimeout(() => {
			if (page < pagesCount) getTrips(query).then(cb);
		}, Date.now() - last_time);
		last_time = Date.now();
		set
		else console.log('done');
	})


// getTrips({
// 	page: 'all',
// 	trips
// }).then(function(){

// })
