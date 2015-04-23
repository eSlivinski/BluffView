// Define tooltip settings
function makeToolTips(){
	$('.myTooltip').each(function(){
		var options= {
			container: 'body',
			animation: 'true',
      title: $(this).attr('data-tooltip-title'),
      placement: 'bottom'
    };
		$(this).tooltip(options);
	});
}

$('.dropdown-toggle.myTooltip').parents('.dropdown').on('show.bs.dropdown', function(){
	var x=$(this).find('.dropdown-toggle.myTooltip');
			x.tooltip('destroy');
	var options= {
		container: 'body',
    title: x.attr('data-tooltip-title'),
    placement: x.attr('data-tooltip-placement')
	};
	
	x.tooltip(options);
	x.tooltip('toggle');
});

$('.dropdown-toggle.myTooltip').parents('.dropdown').on('hide.bs.dropdown', function(){
	var x=$(this).find('.dropdown-toggle.myTooltip');
			x.tooltip('destroy');
	var options= {
			container: 'body',
    	title: x.attr('data-tooltip-title'),
    	placement:'bottom'
	};
	x.tooltip(options);
});

$("#enableGhosting").parents('.dropdown').on('hidden.bs.dropdown', function(){
	if($("#ghostingModal").is(":visible")){
		$("#enableGhosting").parents('.dropdown').addClass('open');
	}
	
});
// KEEPS DROPDOWN OPEN
$('.dropdown-menu').on({
    "click":function(e){
      e.stopPropagation();
    }
});
/* Controls the toggling of the layers controll */
$("input[name='OrthoCheckbox']").on('click', function(){
	if($("input[name='OrthoCheckbox']").is(':checked')===true){
		$('#OrthoOverlays').slideDown()
		$(document).trigger('resize')
	}else{
		$('#OrthoOverlays').slideUp()
		$(document).trigger('resize')
		yearGroup.clearLayers();
	}
})
$("input[name='bluffCheckbox']").on('click', function(){
	if($("input[name='bluffCheckbox']").is(':checked')===true){
		$('#bluffOverlay').slideDown()
		$(document).trigger('resize')
	}else{
		$('#bluffOverlay').slideUp()
		$(document).trigger('resize')
		yearGroup.clearLayers();
	}
})


$('#toggleLayers').click(function(){
	$('#layersPanel').slideToggle()
	$(document).trigger('resize')
})

$('#help').click(function(){
	$('#helpModal').modal()
})

$("[name='orthoYears']").on('click', function(){
	yearOverlay(parseInt($("[name='orthoYears']:checked").val()))
})


$("[name='bluffExpand']").on("click", function(){
	var row = $(this).parents('[name="bluffCol"]').children(".row")
		if (row.is(':visible')==false){
			row
				.removeClass('hide')
				.hide()
				.slideDown()
		}else{
			row.slideUp()
		}

	
})


$(".sliderControls").click(function(){

	var clicked = (this.id)


	var targetIndex = (clicked==="stepBack") ? (years.indexOf(parseInt($('.sliderValue').html()))-1) : 
		(clicked=="stepForward") ? (years.indexOf(parseInt($('.sliderValue').html()))+1) :
		(clicked=="fastForward") ? (years.length-1) :
		(clicked=="fastBackward") ? (0) : (null);

	changeYear(targetIndex, "fast")

	var disabledControls= (targetIndex===years.length-1) ? ($(".sliderControls#fastForward,#stepForward")) :
		(targetIndex===0) ? ($(".sliderControls#fastBackward,#stepBack")) : null;

	$(disabledControls).attr("disabled", "disabled")
	$(".sliderControls").not(disabledControls).removeAttr("disabled")
})


$("#overlayOzaukee").on("click", function(){
	if($(this).hasClass('showingCounty')===true){
		d3.selectAll('.wi').attr('opacity', 0)
		$(this).removeClass('showingCounty')
	}else{
		console.log("yes")
		d3.selectAll('.wi').attr('opacity', .8)
		$(this).addClass('showingCounty')
	}
})
$("#countyLabels").on("click", function(){
	if ($(this).hasClass('showingLabels')===true){
		d3.selectAll('.labels').attr('opacity', 0)
		$(this).removeClass('showingLabels')
	}else{
		console.log("yes")
		d3.selectAll('.labels').attr('opacity', 1)
		$(this).addClass('showingLabels')
	}
})

$('.prettyCheck').on('click', function(){
	$(this).children("i").toggleClass("fa-square-o").toggleClass("fa-check-square-o")
})
$('.prettyRadio').on('click', function(){
	var group = $(this).attr('data-group');

	if($(this).children('i.fa-circle-o').length>0){
		console.log($(this))
		$(this).children("i").removeClass("fa-circle-o").addClass("fa-dot-circle-o")
	}else{
		console.log('n')
		$(this).children("i.fa-dot-circle-o").removeClass("fa-dot-circle-o").addClass("fa-circle-o")		
	}
	$('[data-group='+group+']').not(this).children("i").removeClass("fa-dot-circle-o").addClass("fa-circle-o")
})


$(".orthoSubmenu").on('click', function(){
	year=parseInt($(this).attr('data'))
	console.log($(this).radioValue(), year)
	if($(this).children("i").hasClass("fa fa-dot-circle-o")===true){

		// $(".orthoSubmenu i.fa-check-square-o").not(this).removeClass('fa-check-square-o').addClass('fa-square-o')
		yearOverlay(year)
	}else{
		yearGroup.clearLayers();
	}

})
$('#clearOverlays').on('click', function(){
	// Remove BluffLines
	$('.yearSubmenu i.fa-check-square-o').removeClass('fa-check-square-o').addClass('fa-square-o')
	toggleOpacity()

	// Remove County Boundry
	$('.showingCounty').trigger('click')
	$('.showingLabels').trigger('click')

	//Remove Imagery
	$('.orthoSubmenu i.fa-dot-circle-o').removeClass('fa-dot-circle-o').addClass('fa-circle-o')
	// $('#animateOrthos i.fa-check-square-o').removeClass('fa-check-square-o').addClass('fa-square-o')
	yearGroup.clearLayers();
})

$("#yearPicker li a").on("click", function(){
	newYear= $(this).attr("data")
	$(".sliderValue").html(newYear)
	index= years.indexOf(parseInt(newYear))
	changeYear(index, "fast")
})
// $('.slider').append('<div style="margin-top:-30px"></div>')
$(".rightList").parents(".dropdown").on('shown.bs.dropdown', function(){
	$(this).find(".rightList").each(function(){
		$(this).css("top", function(){
			return $(""+$(this).attr("target-sibling")+"").position().top+2
		})
	})
})
$("#ghostingExplanation").on("click", function(){
	$("#ghostingModal").modal()
	if($("#enableGhosting i").hasClass("fa-check-square-o")){
		$("[name='ghostingState'][data='on']").trigger('click')
	}else{
		$("[name='ghostingState'][data='off']").trigger('click')
	}
	$("#enableGhosting").parents('.dropdown').addClass('open')
})

$("#ghostingState").on("change", function(){
	$("#enableGhosting").trigger("click")
	$("#enableGhosting").parents(".dropdown-toggle").dropdown('toggle')
})



jQuery.fn.extend({
  prettyCheck: function(x) {
	function clicking(r){
  		$(r).trigger('click')
  	}
  	function classToggle(r,x){
			x = (x=='check') ? 'prettyCheckBox fa fa-square-o' : 
				(x=='uncheck') ? 'prettyCheckBox fa fa-check-square-o': 'prettyCheckBox fa fa-square-o';

			$(r).children('i').attr('class', x)
			$(r).trigger('click')
		}
  	return this.each(function() {

    	ftocall = ((x==null)||(x==undefined)) ? clicking(this) : classToggle(this, x);
    });
  },
  makecheck: function() {
    return this.each(function() {
		// $(this).wrapInner( "<div class='prettyText'></div>");
		$(this).prepend('<i class="prettyCheckBox fa fa-square-o"></i>')
		// $(this).children('.prettyText').css("top", function(){
		// 	return $(this).siblings('i.prettyCheckBox').position().top
		// })
		// $(this).children('.prettyText').css("left", function(){
		// 	return ($(this).siblings('i.prettyCheckBox').position().left + $(this).siblings('i').width() + 5)
		// })

    });
  },
   makeradio: function() {
    return this.each(function() {
		// $(this).wrapInner( "<div class='prettyText'></div>");
		$(this).prepend('<i class="prettyRadioBtn fa fa-circle-o"></i>')
		// $(this).children('.prettyText').css("top", function(){
		// 	return $(this).siblings('i.prettyCheckBox').position().top
		// })
		// $(this).children('.prettyText').css("left", function(){
		// 	return ($(this).siblings('i.prettyCheckBox').position().left + $(this).siblings('i').width() + 5)
		// })
		
    });
  },
    checkValue: function() {
    		return $(this).children("i.prettyCheckBox").hasClass("fa-check-square-o")
  },
    radioValue: function() {
    		return $(this).children("i.prettyRadioBtn").hasClass("fa-dot-circle-o")
  }
});

$('.prettyCheck').makecheck()
$('.prettyRadio').makeradio()
// $(this).wrapInner( "<div class='prettyText success'></div>");
// $(this).prepend('<i class="fa fa-square-o"></i>')
// console.log(this)
// })