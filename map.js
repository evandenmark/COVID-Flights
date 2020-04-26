
// DEFINE THE MAP
var mapWidth =  1100,
    mapHeight = 1000;

USA_SCALE = 1300;
USA_TRANSLATE = [mapWidth*0.5,mapHeight*0.4];

var projection = d3.geoAlbersUsa().scale(USA_SCALE).translate(USA_TRANSLATE);

var path = d3.geoPath().projection(projection);

var mapSvg = d3.select("#topCenter").append("svg")
		    .attr("width", mapWidth)
		    .attr("height", mapHeight)

d3.json("./countryShapeData/us.json").then(function(topology){

		//load the US shapes 
		var states = topojson.feature(topology, topology.objects.states);

		mapSvg.selectAll("path")
		      .data(states.features)
		      .enter().append("path")
			      .attr("d", path)
			      .attr("fill", "#efefef")
			      .attr("stroke", "#fff")

		//gather airport data
		d3.csv("./data/airports.csv").then(function(data){

			//set global and create quick map to lat long
			airportData = data
			airportMap = new Map(data.map(d => [d.icao, [d.long, d.lat]]));
			airportStateMap = new Map(data.map(d => [d.icao, d.state]));
			airportCityMap = new Map(data.map(d => [d.icao, d.city]));

			//gather flight data
			d3.csv("./data/processed_USflights.csv").then(function(_data){
				processedFlights = _data;

				setTotalFlightsPerAirline(processedFlights, 'All');

				d3.csv("./data/maxTrafficAirport.csv").then(function(max_data){

					d3.csv("./data/maxTrafficRoutes.csv").then(function(max_route_data){
						//flight routes
						setMaxTrafficMapPerRoute(max_route_data, maxTrafficPerRoute);

						//max traffic maps
						setMaxTrafficMapPerAirport(max_data, maxTrafficPerAirport);

						globalLinks = getCurrentLinks();
						drawRoutes();

						//airport points
						drawAirports()
					})
					
					
				})
			});
		})
});

//weekly processed route data
d3.csv("./data/processed_american.csv").then(function(data){
	americanFlights = data;
	setTotalFlightsPerAirline(americanFlights, 'American');
});

d3.csv("./data/processed_jetblue.csv").then(function(data){
	jetblueFlights = data;
	setTotalFlightsPerAirline(jetblueFlights, 'JetBlue');
});

d3.csv("./data/processed_united.csv").then(function(data){
	unitedFlights = data;
	setTotalFlightsPerAirline(unitedFlights, 'United');
});

d3.csv("./data/processed_southwest.csv").then(function(data){
	southwestFlights = data;
	setTotalFlightsPerAirline(southwestFlights, 'Southwest');
});

d3.csv("./data/processed_delta.csv").then(function(data){
	deltaFlights = data;
	setTotalFlightsPerAirline(deltaFlights, 'Delta');
});

d3.csv("./data/processed_spirit.csv").then(function(data){
	spiritFlights = data;
	setTotalFlightsPerAirline(spiritFlights, 'Spirit');
});

d3.csv("./data/processed_frontier.csv").then(function(data){
	frontierFlights = data;
	setTotalFlightsPerAirline(frontierFlights, 'Frontier');
});

//airports
d3.csv("./data/maxTrafficAirport_jetblue.csv").then(function(data){
	jetblueAirportMax = data;
	setMaxTrafficMapPerAirport(jetblueAirportMax, maxTrafficPerAirport_jetblue);
});

d3.csv("./data/maxTrafficAirport_delta.csv").then(function(data){
	deltaAirportMax = data;
	setMaxTrafficMapPerAirport(deltaAirportMax, maxTrafficPerAirport_delta);
});

d3.csv("./data/maxTrafficAirport_southwest.csv").then(function(data){
	southwestAirportMax = data;
	setMaxTrafficMapPerAirport(southwestAirportMax, maxTrafficPerAirport_southwest);
});

d3.csv("./data/maxTrafficAirport_united.csv").then(function(data){
	unitedAirportMax = data;
	setMaxTrafficMapPerAirport(unitedAirportMax, maxTrafficPerAirport_united);
});

d3.csv("./data/maxTrafficAirport_american.csv").then(function(data){
	americanAirportMax = data;
	setMaxTrafficMapPerAirport(americanAirportMax, maxTrafficPerAirport_american);
});

d3.csv("./data/maxTrafficAirport_spirit.csv").then(function(data){
	spiritAirportMax = data;
	setMaxTrafficMapPerAirport(spiritAirportMax, maxTrafficPerAirport_spirit);
});

d3.csv("./data/maxTrafficAirport_frontier.csv").then(function(data){
	frontierAirportMax = data;
	setMaxTrafficMapPerAirport(frontierAirportMax, maxTrafficPerAirport_frontier);
});

//routes
d3.csv("./data/maxTrafficRoutes_jetblue.csv").then(function(data){
	jetblueRoutesMax = data;
	setMaxTrafficMapPerRoute(jetblueRoutesMax, maxTrafficPerRoute_jetblue);
});

d3.csv("./data/maxTrafficRoutes_delta.csv").then(function(data){
	deltaRoutesMax = data;
	setMaxTrafficMapPerRoute(deltaRoutesMax, maxTrafficPerRoute_delta);
});

d3.csv("./data/maxTrafficRoutes_southwest.csv").then(function(data){
	southwestRoutesMax = data;
	setMaxTrafficMapPerRoute(southwestRoutesMax, maxTrafficPerRoute_southwest);
});

d3.csv("./data/maxTrafficRoutes_united.csv").then(function(data){
	unitedRoutesMax = data;
	setMaxTrafficMapPerRoute(unitedRoutesMax, maxTrafficPerRoute_united);
});

d3.csv("./data/maxTrafficRoutes_american.csv").then(function(data){
	americanRoutesMax = data;
	setMaxTrafficMapPerRoute(americanRoutesMax, maxTrafficPerRoute_american);
});

d3.csv("./data/maxTrafficRoutes_spirit.csv").then(function(data){
	spiritRoutesMax = data;
	setMaxTrafficMapPerRoute(spiritRoutesMax, maxTrafficPerRoute_spirit);
});

d3.csv("./data/maxTrafficRoutes_frontier.csv").then(function(data){
	frontierRoutesMax = data;
	setMaxTrafficMapPerRoute(frontierRoutesMax, maxTrafficPerRoute_frontier);
});

// CHECKBOX
d3.select("#myCheckbox")
	.on('change', toggleMajorAirports);

function toggleMajorAirports(){
	if (d3.select("#myCheckbox").property("checked")){
		//remove non-major aiports
		console.log('remove non major airports');

	} else{
		//add major airports
		console.log('add non major airports');
	}
}


/// SLIDER
var sliderVertical = d3
	.sliderLeft()
	.min(1)
	.max(14)
	.height(300)
	.ticks(5)
	.default(currentWeek)
	.on('onchange', val => {
	  week = Math.round(val);
	  d3.select('p#value-vertical').text(week);
	  if (week != currentWeek){
		  updateWeek(week);

		  //routes
		  globalLinks = getCurrentLinks();
		  mapSvg.selectAll(".routes").remove();
		  drawRoutes();

		  //airports
		  mapSvg.selectAll("rect").remove();
		  drawAirports();
	  }
});

var gVertical = d3
	.select('div#slider-vertical')
	.append('svg')
	.attr('width', 100)
	.attr('height', 400)
	.append('g')
	.attr('transform', 'translate(60,30)');

gVertical.call(sliderVertical);

d3.select('p#value-vertical').text(Math.round(sliderVertical.value()));




//DROPDOWN
var airlines = ['All','American', 'Delta', 'JetBlue', 'Southwest', 'United', 'Spirit', 'Frontier'];

var dropdownButton = d3.select("#dropdown-container").insert("select", "svg").on("change", dropdownSelect);

dropdownButton.selectAll('option') // Next 4 lines add 6 options = 6 colors
			  .data(airlines)
			  .enter().append('option')
			  .text(function (d) { return d; }) // text showed in the menu
			  .attr("value", function (d) { return d; }); // corresponding value returned by the button

function dropdownSelect(){
	currentAirline = this.value;
	//routes
	  globalLinks = getCurrentLinks();
	  mapSvg.selectAll(".routes").remove();
	  drawRoutes();

	  //airports
	  mapSvg.selectAll("rect").remove();
	  drawAirports();
}


//HELPER FUNCTIONS

function drawAirports(){
	circles = mapSvg.selectAll("rect")
					.data(
						  largeAirportsOnly(
						  getUSairports(
						  getAirportsExcludingStates(airportData))))
					.join(
				    	enter => enter.append("rect"),
				    	update => update,
				    	exit => exit.remove()
			    	)
			    	.attr('width', 15)
			    	.attr('height', d => 10000*getTotalAirportTraffic(d.icao, currentWeek)/(totalTrafficPerAirline.get(currentAirline)))
					.attr('fill', airlineAirportColors.get(currentAirline))
					.attr('stroke', "#000000")
					.attr("transform", function(d) {
						var p = projection([d.long, d.lat]);
						var q = p[1] - this.height.baseVal.value;
						var r = p[0] - 7;
						return "translate(" + r +','+q + ")";})
					.append("title")
					.text(d => d.name + '\n' + d.city +'\n' +
						getTotalAirportTraffic(d.icao, currentWeek) + ' / ' + getMaxTrafficPerAirport(d.icao) + '\n'+
						Math.round(100*getTotalAirportTraffic(d.icao, currentWeek)/getMaxTrafficPerAirport(d.icao)) +'% capacity');
}

function drawRoutes(){
	routes = mapSvg.selectAll(".routes")
					.data(globalLinks)
					.join(
				    	enter => enter.append("path"),
				    	update => update,
				    	exit => exit.remove()
			    	)
	                .attr("d", path)
	                .attr("class", "routes")
	                .attr("fill", "none")
	                .attr("stroke", airlineRouteColors.get(currentAirline))
	                .attr("stroke-width", 5)
	                .attr("stroke-opacity", function(d){
	                	return d.weight/getMaxTrafficPerRoute(d.start+"-"+d.end)})
	                .append("title")
					.text(d => airportCityMap.get(d.start) + ' - ' + d.start + '\n' 
								+ airportCityMap.get(d.end)+ ' - ' +d.end +'\n' 
								+ d.weight + ' / ' + getMaxTrafficPerRoute(d.start+"-"+d.end) + '\n'
								+ Math.round(100*d.weight/getMaxTrafficPerRoute(d.start+"-"+d.end)) + "%");

}

function setMaxTrafficMapPerAirport(data, specificMap){
	data.forEach(function(d){
		specificMap.set(d.icao, Math.max(1, parseInt(d.maxTraffic)));
	})
}

function setMaxTrafficMapPerRoute(data, specificMap){

	data.forEach(function(d){
		specificMap.set(d.routeStart + "-" +d.routeEnd, Math.max(1,parseInt(d.maxTraffic)));
	});
}

function setTotalFlightsPerAirline(data, airlineName){
	var total = data.reduce(function(sum, x){ return sum + parseInt(x.amount)}, 0);
	totalTrafficPerAirline.set(airlineName, total);
}

function getMaxTrafficPerAirport(icaoCode){
	var maxTrafficValue;

	switch (currentAirline){
		case 'All':
			maxTrafficValue = maxTrafficPerAirport.get(icaoCode);
			break;

		case 'Delta':
			maxTrafficValue = maxTrafficPerAirport_delta.get(icaoCode)
			break;

		case 'JetBlue':
			maxTrafficValue =maxTrafficPerAirport_jetblue.get(icaoCode);
			break;

		case 'United':
			maxTrafficValue =maxTrafficPerAirport_united.get(icaoCode);
			break;

		case 'American':
			maxTrafficValue =maxTrafficPerAirport_american.get(icaoCode);
			break;

		case 'Southwest':
			maxTrafficValue =maxTrafficPerAirport_southwest.get(icaoCode);
			break;

		case 'Spirit':
			maxTrafficValue =maxTrafficPerAirport_spirit.get(icaoCode);
			break;

		case 'Frontier':
			maxTrafficValue =maxTrafficPerAirport_frontier.get(icaoCode);
			break;

		default:
			maxTrafficValue =maxTrafficPerAirport.get(icaoCode);
			break;
	}
	return maxTrafficValue;
}

function getMaxTrafficPerRoute(route){

	var maxTrafficValue;

	switch (currentAirline){
		case 'All':
			maxTrafficValue = maxTrafficPerRoute.get(route);
			break;

		case 'Delta':
			maxTrafficValue = maxTrafficPerRoute_delta.get(route)
			break;

		case 'JetBlue':
			maxTrafficValue =maxTrafficPerRoute_jetblue.get(route);
			break;

		case 'United':
			maxTrafficValue =maxTrafficPerRoute_united.get(route);
			break;

		case 'American':
			maxTrafficValue =maxTrafficPerRoute_american.get(route);
			break;

		case 'Southwest':
			maxTrafficValue =maxTrafficPerRoute_southwest.get(route);
			break;

		case 'Spirit':
			maxTrafficValue =maxTrafficPerRoute_spirit.get(route);
			break;

		case 'Frontier':
			maxTrafficValue =maxTrafficPerRoute_frontier.get(route);
			break;

		default:
			maxTrafficValue =maxTrafficPerRoute.get(route);
			break;
	}
	return maxTrafficValue;

}

function getTotalAirportTraffic(icaoCode, week){
	//gets the total traffic for an airport in a given week

	var flight_data;
	switch (currentAirline){
		case 'All':
			flight_data = processedFlights;
			break;
		case 'Delta':
			flight_data = deltaFlights;
			break;
		case 'JetBlue':
			flight_data = jetblueFlights;
			break;
		case 'United':
			flight_data = unitedFlights;
			break;
		case 'Southwest':
			flight_data = southwestFlights;
			break;
		case 'American':
			flight_data = americanFlights;
			break;
		case 'Spirit':
			flight_data = spiritFlights;
			break;
		case 'Frontier':
			flight_data = frontierFlights;
			break;
		default: 
			flight_data = processedFlights;
			break;
	} 


	return getSpecificAirportTraffic(
			temporalFilter(flight_data, week), icaoCode)
			.reduce(function(sum, x){
				return sum + parseInt(x.amount);
			}, 0);
}

function updateWeek(newWeek){
	currentWeek = newWeek;
}

function getCurrentLinks(){

	var flight_data;
	switch (currentAirline){

		case 'All':
			flight_data = processedFlights;
			break;
		case 'Delta':
			flight_data = deltaFlights;
			break;
		case 'JetBlue':
			flight_data = jetblueFlights;
			break;
		case 'United':
			flight_data = unitedFlights;
			break;
		case 'Southwest':
			flight_data = southwestFlights;
			break;
		case 'American':
			flight_data = americanFlights;
			break;
		case 'Spirit':
			flight_data = spiritFlights;
			break;
		case 'Frontier':
			flight_data = frontierFlights;
			break;
		default: 
			flight_data = processedFlights;
			break; 
	}

	return processLinks(
		filterFlightsStates(temporalFilter(flight_data, currentWeek)));
}

function getSpecificAirportTraffic(data, specificAirport){
	return data.filter(d => (d.startCode == specificAirport || d.destCode == specificAirport));
}

function getSpecificAirport(data, specificAirport){
	x = data.filter(d => (d.icao == specificAirport));
	return x;
}

function getUSairports(data){
	return data.filter(d => d.country == 'US');
}

function getAirportsInState(data, specificState){
	return data.filter(d => d.state == specificState);
}

function getAirportsExcludingStates(data){
	return data.filter(d => excludedStates.indexOf(d.state) == -1)
}

function largeAirportsOnly(data){
	return data.filter(d => d.airportType == 'large_airport');
}

function getAirportState(icaoCode){
	return airportStateMap.get(icaoCode);
}

function getAirportCountry(icaoCode){
	return airportData.filter(d => d.icao == icaoCode)[0].country;
}

function getAirportCity(icaoCode){
	return airportData.filter(d => d.icao == icaoCode)[0].city;
}

function getAirportLatLong(icaoCode){
	return airportMap.get(icaoCode);
}

function filterFlightsStates(data){
	return data.filter(d => (airportStateMap.get(d.startCode) !== 'AK' && airportStateMap.get(d.destCode) !== 'AK'));
}

function temporalFilter(data, selectedWeek){
	return data.filter(d => d.week == selectedWeek);
}

function processLinks(data){
	links = Array();
	for(var i=0, len=data.length; i<len; i++){
		links.push({
            type: "LineString",
            coordinates: [
                 airportMap.get(data[i].startCode),
                 airportMap.get(data[i].destCode)
            ],
            weight: data[i].amount,
            start: data[i].startCode,
            end: data[i].destCode
        });
	}
	return links;
}