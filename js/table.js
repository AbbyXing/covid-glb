var table = d3.select("#table")
	.append("table");
var titles = ["Country", "Confirmed Cases", "Today Cases", "Recovered", "Deaths", "Cases Per One Million"];
var sortAscending = true;
var dataForTable = [];

d3.json("https://corona.lmao.ninja/v2/countries").then(function(data){

	data.forEach(function(d){
		dataForTable.push([d.country, +d.cases, +d.todayCases, +d.deaths, +d.recovered, +d.casesPerOneMillion]);
	});

	var headers = table.append('thead').append('tr')
		                   .selectAll('th')
		                   .data(titles).enter()
		                   .append('th')
		                   .text(function (d) {
			                    return d;
		                    })
		                   .on('click', function (d) {
		                	   headers.attr('class', 'header');

		                	   var index = titles.findIndex((title) => title === d);
		                	   if (sortAscending) {
		                	     rows.sort(function(a, b) {
		                	     	return d3.ascending(b[index], a[index]); });
		                	     sortAscending = false;
		                	     this.className = 'aes';
		                	   } else {
		                		 rows.sort(function(a, b) { 
		                		 	return d3.descending(b[index], a[index]); });
		                		 sortAscending = true;
		                		 this.className = 'des';
		                	   }
		                   });

	var rows = table.append('tbody').selectAll('tr')
		               .data(dataForTable)
		               .enter()
		               .append('tr')
		               .on("mouseover", function(){
						    d3.select(this).style("background-color", "#525252");
						  })
						    .on("mouseout", function(){
						    d3.select(this).style("background-color", "#363636");
						  });

	rows.selectAll('td')
		    .data(function(d) {
                    //console.log(d);
                    return d;
                })
                .enter()
                .append("td")
                .text(function(d) {
                    return d;
                });
});