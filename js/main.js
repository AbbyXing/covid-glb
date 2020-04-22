// The svg
var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");

// Tooltip
var tooltip = d3.select('body')
				.append('div')
    			.attr('class', 'hidden tooltip')
    			.style("visibility", "hidden");

// Projection
const projection = d3
	.geoEckert4()
	.scale(130)
    .translate([0.5 * width, 0.5 * height]);

// Path and Graticule
const path = d3.geoPath().projection(projection);
var graticule = d3.geoGraticule10();

// Data Map and Color Scale
var data = d3.map();
var colorScaleCases = d3.scaleThreshold()
  .domain([0, 100, 400, 800, 5000, 10000, 30000, 50000])
  .range(d3.schemeReds[9]);
var colorScaleDeath = d3.scaleThreshold()
  .domain([0, 50, 100, 200, 500, 1000, 5000, 10000])
  .range(d3.schemeBlues[9]);

// Load External Data
var proxyUrl = "https://cors-anywhere.herokuapp.com/",
	targetUrl = "https://corona.lmao.ninja/v2/countries";
var promises = [
	d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
	d3.json(targetUrl)
];

// countries map
var countries;

Promise.all(promises).then(function(allData){
	var topo = allData[0];
	var example = allData[1];
	example.forEach(function(d){
		data.set(d.countryInfo.iso3, 
			{"flag": d.countryInfo.flag, "cases": +d.cases, "deaths": +d.deaths});
	});

	countries = ready(topo, countries);
});

// Data Toggle
var value = "cases";
function dataToggle(v){
	value = v;
	if(v === "deaths"){
		countries
		.attr("fill", function (d) {
      		d.total = 0;
      		if(data.has(d.id))
	        	d.total = +data.get(d.id)[value];
	        return colorScaleDeath(d.total);
	    });
	    d3.select(".title-word").text("DEATHS");
	} else {
		countries
		.attr("fill", function (d) {
      		d.total = 0;
      		if(data.has(d.id))
	        	d.total = +data.get(d.id)[value];
	        return colorScaleCases(d.total);
	    });
	    d3.select(".title-word").text("CONFIRMED CASES");
	}
	
}

function ready(topo, countries) {
	svg
		.append("g")
		.attr("class", "grid")
		.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path)
		.attr("opacity", 0.8)
		.attr('stroke-width', '0.5px')
	    .attr('stroke', '#ccc')
	    .attr("fill", "none");


	var countries = svg
		.append("g")
		.attr("class", "geomap")
	    .selectAll(".country")
	    .data(topo.features)
	    .enter()
	    .append("path")
	    .attr("class", function(d){
	    	return "country " + d.id;
	    })
	    .attr("d", path)
	    // set the color of each country
      	.attr("fill", function (d) {
      		d.total = 0;
      		if(data.has(d.id))
	        	d.total = +data.get(d.id)[value];
	        return colorScaleCases(d.total);
	    })
	    .on("mouseover", function(d){
	    	if(data.has(d.id))
	    		tooltip.style("visibility", "visible")
	    			.html("<img class='flag' src='" + data.get(d.id)?.flag + "' alt=' '>"
                		+ "<span>" + d.properties.name + "</span>"
                		+ ":<br/>" + data.get(d.id)[value] + " cases");
	    })
	    .on("mousemove", function(d) {
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });
    return countries;
}
