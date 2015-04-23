var totalDistance = 0;
$("#distanceTool").click(function(){
	if($("#distanceTool").hasClass("active-btn")==true){
		measurementMarkers.clearLayers()
		measurementLines.clearLayers()
		totalDistance=0
		$('#totalDistance').html('0 miles');
		$("#map").removeClass("measure")
		$("#distanceTool").removeClass("active-btn")
		$('#distanceInfo, #distanceMeasured').slideUp()
		$("#distanceTool").tooltip()
	}else{
		$("#map").addClass("measure")
		$("#distanceTool").addClass("active-btn")
		$('#distanceInfo, #distanceMeasured').slideDown()
		$("#distanceTool").tooltip('destroy')
	}
	
})


	function convertDistance(distance){
		// If distance < .25 Miles return distance in feet
		convertedDistance = (distance<402.336) ? (String(Math.round(distance*3.28084))+ ' feet') : (String((Math.round(100*(distance/1609.34)))/100)+ ' miles')

	return (convertedDistance)
}


measurementMarkers= new L.featureGroup()
		.setStyle()
		.addTo(map);

measurementLines= new L.layerGroup().addTo(map);

var clickCounter= 0,
	totalDistance=0;


map.on('dblclick', function(){
	if ($("#distanceTool").hasClass('active-btn')==true){
		measurementMarkers.clearLayers()
		measurementLines.clearLayers()
		totalDistance=0
		$('#totalDistance').html('0 miles');
	}
});



map.on('click', function(e){
	if ($("#distanceTool").hasClass('active-btn')==true){
		var e=event,
			clickEvent= map.mouseEventToLatLng(e),
			clickMarker =L.circleMarker(clickEvent, {radius: 5, color: 'orange'})
				.addTo(measurementMarkers);
		
		if (clickCounter==0) {

			clickCounter++

		} else {

			var x= (measurementMarkers.getLayers().length-2),
				prev= measurementMarkers.getLayers()[x],
				distance = (clickEvent.distanceTo(prev._latlng));

				if (totalDistance==0){
					totalDistance=distance
				}else{
					totalDistance=(totalDistance+distance)
				};

				transformedDistance = convertDistance(totalDistance);
				
			L.polyline([prev._latlng, map.mouseEventToLatLng(e)], {color: 'red'})
				.addTo(measurementLines);

			$('#totalDistance').html(transformedDistance);

			clickCounter++;

		};
		
	};
});	


/* customTools */
$('.customTools .tool-header .close').on('click', function(){ $(this).parents('.customTools').slideUp()})
$('.customTools[data-trigger]').each(function(){
	var tool= this,
		trigger = $(tool).attr('data-trigger');

	var times = ( $(tool).hasClass('showOnce') ) ? showOnce() : show()
	

	$(trigger).on('click', times)


	function showOnce(){
		$(trigger).one('click', function() { $(tool).slideToggle() })
	}
	function show(){
		$(trigger).on('click', function() { $(tool).slideToggle() })
	}	
})

$('.showHelp').on('click',function(){
	$('#compareFeatures').slideDown()
})