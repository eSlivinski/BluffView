
$('.toggle').hide()
$('nav').click(function(){$(window).trigger('resize')})
function debouncer( func , timeout ) {
   var timeoutID , timeout = timeout || 100;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
   }
}


function getMapHieght(){
  visibleControlHieght= $("#map").siblings(':visible').map(function(){return $(this).height();}).get().reduce(function(previousValue, currentValue, index, array){return previousValue + currentValue;});
  setTimeout(function() {
    mapTop=$('.navbar-fixed-top').height()
    mapBottom=$('.navbar-fixed-bottom').height()
    
    $('.up-top').animate({
      top: mapTop
    }, 100, function() {
    // Animation complete.
    });
    $('.down-low').animate({
      bottom: mapBottom,
    }, 100, function() {
    // Animation complete.
    });
  },200)
  // $(".customTools").css("top", hh)
  //$('.navbar-fixed-bottom').height()
  windowHieght= $(window).height()
  // h= $('.navbar-fixed-top').height()
  // $('#map').css('top',h)
  // return (windowHieght-(visibleControlHieght-4))

  return windowHieght
}

function getSliderWidth(){
  sliderControlWidth= $('.sliderControls').map(function(){return $(this).width();}).get().reduce(function(previousValue, currentValue, index, array){return previousValue + currentValue;});
  wholeWidth= $('.slider').parent().width()
  padding=113
  sliderWidth = (wholeWidth - (sliderControlWidth+padding))
  $('.slider').css('width', sliderWidth)
  
  labelSlider(sliderWidth)
}

function checkCollapsed(){
  if ($('.navbar-toggle').is(':visible')===true){
    $('.alt-menu').show()
    $('.primary-menu').hide()
    $('[data-toggle="tooltip"]').tooltip('destroy')
    $('.myTooltip').tooltip('destroy')
  }else{
    $('.alt-menu').hide()
    $('.primary-menu').show()
    $('[data-toggle="tooltip"]').tooltip()
    makeToolTips()
  }

}
checkCollapsed()

$('#map').css('width', function(){return '100%'})
$('#map').css('height', getMapHieght)

$( window ).resize(debouncer(function (e){
  getSliderWidth()
  $('#map').css('height', getMapHieght)
  checkCollapsed()    

}));

$(document).resize(function(){
  $(window).trigger('resize')

})

// $('body').children().not('.modal').css('opacity', 0.4)



// $('.slider-track').click(function(event){
//   console.log(event)
//   event.preventDefault()
// })
function labelSlider(sliderWidth){
  $('.slider .toolbarSlider').html('')
  var htmlList='',
      sliderLength=sliderWidth,
      yearLength= years.length-1;
      htmlList+="<ul style='padding-left: 0px; margin-top: -25px'>"
      $(years).each(function(i){
        margin = ((i*sliderLength)/yearLength)-10
        // console.log(i)
        htmlList+=("<li class='tick' style='margin-left: "+margin+"px'><a href='#' onclick='changeYear("+i+", \"fast\", \"fade\")'>"+years[i]+"</a></li>")
      })
      htmlList+="</ul>"
      // console.log(htmlList)
       $('#slider').append(htmlList)
       $(".toolbarSlider").css("display","inline")
 }