
var years = [1956,1980,1990,1999,2010];
// Defines the slider
$(function() {
	var mySlider= $('#slider').slider({min: 0, max: 4, tooltip: 'hide'}),
		sliderValue= $('.sliderValue');
		

	mySlider.on('slideStop', function(){
		if ($(this).val()===undefined){
			changeYear(0, 'slow');
		}else{
			changeYear($(this).val(), 'slow');
		}
	});
  
});

// Handles HTML changes and calls the tween function 
function changeYear(index, speed, transitionType){
	$('a.currentYear').removeClass('currentYear');
	var year=String(years[index]);
	$('#slider').slider('setValue', index);
	$('.sliderValue').html(year);
	makeFeatures(year, speed, transitionType);
	$('#yearPicker li a[data='+year+']').addClass('currentYear');


}
$('#pauseButton').hide();
var play=false;
//Loops through whole animation

$('#playButton').click(function(){
	$('#pauseButton').show();
	$('#playButton').hide();
	play=true;
	var i=0;
	do {
		var k=0;

	   setTimeout(function() {
	    	if(play===true){
	    		ghosting(k);
					changeYear(k, 'slow', 'fade');
	    	}
	    	
			k++;
		}, (i*6000));
		i++;
	} while (i < 5);
		setTimeout(function() {
			play=false;
			$('#playButton').show();
			$('#pauseButton').hide();
		}, (i*6000));
});
$('#pauseButton').click(function(){
	play=false;
	$('#pauseButton').hide();
	$('#playButton').show();

});
function ghosting(i){
	if ($('#enableGhosting i').hasClass("fa-check-square-o")==true){
		var currentYear = years[i];
		
		d3.selectAll('[year= "'+currentYear+'"]')
			.transition().delay(6000)
			.attr('stroke-opacity', 0.8)
			.transition().delay(12000).duration(6000)
			.attr('stroke-opacity', 0);
	}
	
}