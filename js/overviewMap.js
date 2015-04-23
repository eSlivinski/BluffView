$(function makeOverviewMap(){
	var width = ($('.navbar-toggle').is(':visible')) ? $("#aboutModal").width() :
		($("#aboutModal .modal-dialog").width()+$("#aboutModal .modal-dialog .modal-content").width()+$("#aboutModal .modal-dialog .modal-content .modal-body").width());
	var height = 300;

	var projection = d3.geo.mercator()
		.center([-89,44.511])
	    .scale(2200)
	    .translate([width / 2, height / 2])
	    .precision(.1);

	var svg = d3.select("#aboutModal .modal-dialog .modal-content .modal-body").append("svg")
		.attr('width', width)
		.attr('height', height);


	var path = d3.geo.path()
		.projection(projection);
	function makeStates(){
		d3.json("data/greatLakesStates.json", function(error, topology) {
			svg.selectAll(".states")
				.data(topojson.feature(topology, topology.objects.states).features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", "state")
				.call(makeCounties);
		});
		
	}
	
	function makeCounties(){
	    d3.json("data/ozaukeeCo_topojson.json", function(error, topology) {
			svg.selectAll(".counties")
		    	.data(topojson.feature(topology, topology.objects.counties).features)
		      	.enter().append("path")
		      	.attr("d", path)
		      	.attr("class", "county")
		      	.call(makeGreatLakes);
		});
	}	
	function makeGreatLakes(){
		d3.json("data/greatLakes_topojson.json", function(error, topology) {
		  svg.selectAll(".lakes")
		  		.data(topojson.feature(topology, topology.objects.lakes).features)
		  		.enter().append("path")
		      	.attr("d", path)
		      	.attr("class", "lake");        
		});
	}
	makeStates();

	d3.select(self.frameElement).style("height", height + "px");


});
