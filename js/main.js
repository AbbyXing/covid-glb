// The svg
var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");

// Tooltip
var tooltip = d3.select('body')
				.append('div')
    			.attr('class', 'hidden tooltip');

// Projection
const projection = d3
	.geoEckert4()
	.scale(200)
    .translate([0.5 * width, 0.50 * height]);

// Path and Graticule
const path = d3.geoPath().projection(projection);
var graticule = d3.geoGraticule10();

// Data Map and Color Scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([0, 100, 400, 800, 5000, 10000, 30000, 50000])
  .range(d3.schemeReds[9]);

// Load External Data
var promises = [
	d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
	d3.json("https://corona.lmao.ninja/v2/countries")
];

Promise.all(promises).then(function(allData){
	var topo = allData[0];
	var example = allData[1];
	example.forEach(function(d){
		data.set(d.countryInfo.iso3, +d.cases);
		//console.log(d.countryInfo.iso3);
	});
	ready(topo);
});

function ready(topo) {
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


	svg
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
	        d.total = data.get(d.id) || 0;
	        return colorScale(d.total);
	    })
	    .on("mouseover", function(){
	    	return tooltip.style("visibility", "visible");
	    })
	    .on("mousemove", function(d) {
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
                	.html(d.properties.name + ":<br/>" + data.get(d.id) + " cases");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });

}
