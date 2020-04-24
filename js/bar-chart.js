var margin = { left:80, right:10, top:10, bottom:150 };

var width = 1100 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;
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

	var date = "4/23/20";

	var x = d3.scaleBand()
		.domain(data.map(function(d){ return d.country; }))
		.range([0, width])
		.paddingInner(0.2)
		.paddingOuter(0.2);

	var y = d3.scaleLinear()
		.domain([0, d3.max(data, function(d){
			return parseInt(+d.timeline.cases[date]);;
		})])
		.range([height, 0]);

	var xAxisCall = d3.axisBottom(x);
	g.append("g")
		.attr("class", "x axis")
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
		.attr("class", "y axis")
		.call(yAxisCall)
		.selectAll("text")
		.attr("fill", "white");

	update(data, x, y, date);
});


function update(data, x, y, date){

	// Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

    // JOIN new data with old elements.
    var rects = g.selectAll("rect")
		.data(data);

    // // EXIT old elements not present in new data.
    // circles.exit()
    //     .attr("class", "exit")
    //     .remove();

    // ENTER new elements present in new data.
	rects.enter()
		.append("rect")
			.attr("y", function(d){ return parseInt(y(+d.timeline.cases[date])); })
			.attr("x", function(d){ return x(d.country); })
			.attr("width", x.bandwidth)
			.attr("height", function(d){ 
				return height - parseInt(y(+d.timeline.cases[date])); })
			.attr("fill", "grey");

}






