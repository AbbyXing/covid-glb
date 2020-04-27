// selection button
var selectionBtn = $( "#country-select" );

// selected country
var selectedCountry;

// margin
var margin = { left:80, right:10, top:10, bottom:150 };

// width and height
var width = 1100 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// transition
var t = d3.transition().duration(1000);

// svg
var svg2 = d3.select("#bar-chart")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)

var g = svg2.append("g")
	.attr("transform", "translate(" + margin.left + ", "
			+ margin.top + ")")
	.attr("class", "bars")

g.append("text")
	.attr("class", "y axis-label")
	.attr("x", -(height / 2))
	.attr("y", -70)
	.attr("font-size", "12px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.attr("fill", "white")
	.text("Confirmed Cases");

d3.json("https://corona.lmao.ninja/v2/historical?lastdays=400").then(function(data){

	// initiate country selection values:
	data.forEach(function(d, i){
		if(d.province == null){
			selectionBtn.append(`<option value="${d.country}">${d.country}</option>`); 
		} else{
			selectionBtn.append(`<option value="${d.country + "-" + d.province}">${d.country + "-" + d.province}</option>`); 
		}
	});

	var timeline = Object.keys(data[0].timeline.cases);

	var x = d3.scaleBand()
		.domain(timeline)
		.range([0, width])
		.paddingInner(0.2)
		.paddingOuter(0.2);

	var y = d3.scaleLinear()
		.domain([0, 10000])
		.range([height, 0]);

	var xAxisCall = d3.axisBottom(x);
	g.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxisCall)
		.selectAll("text")
			.attr("y", 3)
			.attr("x", 8)
			.attr("font-size", "6px")
			.attr("transform", "rotate(60)")
			.attr("fill", "white")
    		.style("text-anchor", "start");

	var yAxisCall = d3.axisLeft(y)
		.ticks(20)
		.tickFormat(function(d){
			return d;
		});
	g.append("g")
		.attr("class", "y-axis")
		.call(yAxisCall)
		.selectAll("text")
		.attr("fill", "white");

	// update(data, x, y, xAxisCall, yAxisCall, selectedCountry);

	$(document).ready(function(){
	    $(selectionBtn).change(function(){
	        selectedCountry = $(this).children("option:selected").val();
	        update(data, x, y,xAxisCall, yAxisCall, selectedCountry);
	    });
	});
});


function update(data, x, y, xAxisCall, yAxisCall, selectedCountry){

	// ENTER new elements present in new data.
    if(selectedCountry != null && selectedCountry != "Select a country"){
    	var country = selectedCountry.split("-");
    	var filteredData;
    	if(country.length == 2){
    		filteredData = data.filter(obj => {
			  return obj.country === country[0] && obj.province === country[1];
			});
    	} else{
    		filteredData = data.filter(obj => {
			  return obj.country === country[0];
			});
    	}

    	filteredData = filteredData[0].timeline.cases;

    	var dataForChart = [];
    	for(date in filteredData){
    		dataForChart.push({"date": date, "case": +filteredData[date]});
    	}

    	y.domain([0, d3.max(Object.values(filteredData))]);

		x.domain(Object.keys(filteredData));

		// JOIN new data with old elements.
	    var rects = g.selectAll("rect")
        .data(dataForChart);

		// // EXIT old elements not present in new data.
	    rects.exit()
	        .attr("fill", "red")
	    .transition(t)
	        .attr("y", y(0))
	        .attr("height", 0)
	        .remove();
	    d3.select(".x-axis").remove();
	    d3.select(".y-axis").remove();

		xAxisCall = d3.axisBottom(x);
		g.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0, " + height + ")")
			.call(xAxisCall)
			.selectAll("text")
				.attr("y", 3)
				.attr("x", 8)
				.attr("font-size", "6px")
				.attr("transform", "rotate(60)")
				.attr("fill", "white")
	    		.style("text-anchor", "start");

		yAxisCall = d3.axisLeft(y)
		g.append("g")
			.attr("class", "y-axis")
			.call(yAxisCall)
			.selectAll("text")
			.attr("fill", "white");

		rects.enter()
    		.append("rect")
    			.attr("fill", "grey")
	            .attr("y", y(0))
	            .attr("height", 0)
	            .attr("x", function(d){ return x(d.month) })
            	.attr("width", x.bandwidth)
            // AND UPDATE old elements present in new data.
            .merge(rects)
            .transition(t)
				.attr("y", function(d){ return y(parseInt(d.case)); })
				.attr("x", function(d){ return x(d.date); })
				.attr("width", x.bandwidth)
				.attr("height", function(d){ 
					return height - y(parseInt(d.case)); });
    }
}






