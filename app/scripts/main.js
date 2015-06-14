// jshint devel:true
'use strict';

var touch;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
	touch = true;
	var wrapper = document.getElementById('interactive-wrapper');
	wrapper.className += ' touch-device';
}

function circleTooltip(circle) {
	var $this = circle;
	var lawsuit = $this.data('lawsuit');
	var court = $this.data('court');
	var decision = $this.data('decision');

	var tooltip = $('.map-tooltip');
	var html = '<span class="close">close</span><span class="label">Lawsuit</span><table><tr><td>Case</td><td>' + lawsuit + '</td></tr><tr><td>Court</td><td>' + court + '</td></tr><tr><td>Decided</td><td>' + decision + '</td></tr></table>';

	tooltip.addClass('lawsuit').css('display', 'block');
	tooltip.find('.tooltip-inner').each(function(){
		$(this).html(html);
	});
}

/* For concealed carry map only */
function initAccordion(){
	$('.filter-title').click(function(){
		var $parent = $(this).closest('.filter');
		var siblings = $parent.siblings();
		siblings.removeClass('filtered');
		siblings.find('.filter-description').each(function(){
			$(this).slideUp('fast');
		});
		$parent.toggleClass('filtered');
		$parent.find('.filter-description').each(function(){
			$(this).slideToggle('fast');
		});

		var id = parseInt( $parent.attr('id').replace('filter-', '') );
		var map = $('#interactive-wrapper');
		var clear = $('.clear-filter');
		if ($parent.hasClass('filtered')){
			map.attr('data-filter', id);
			clear.css('visibility', 'visible');
		} else {
			map.attr('data-filter', '');
			clear.css('visibility', 'hidden');
		}     
	});

	$('.clear-filter').click(function(){
		$('.filtered').find('.filter-title').trigger('click');
	}).keydown(function(e){
		var code = e.which;
		// 13 = Return, 32 = Space
		if ((code === 13) || (code === 32)) {
			$(this).trigger('click');
		}
	});

	$('.filter').keydown(function(e){ // Trigger the click event from the keyboard
		var code = e.which;
		// 13 = Return, 32 = Space
		if ((code === 13) || (code === 32)) {
			$(this).find('.filter-title').trigger('click');
		}
	});

	if (!touch){
		$('.cir-map-state').click(function(){
			var $this = $(this);
			var group = parseInt( $this.data('color') ) + 1;

			var filter = $('.filter:nth-child(' + group + ')');
			if ( !filter.hasClass('filtered') ) {
				filter.find('.filter-title').trigger('click');
			}
		});
		$('.cir-map-state').keydown(function(e){ // Trigger the click event from the keyboard
			var code = e.which;
			// 13 = Return, 32 = Space
			if ((code === 13) || (code === 32)) {
				$(this).trigger('click');
			}
		});
	}

	if (!touch){
		$('#us-map circle').hover(function(){
			var $this = $(this);
			circleTooltip($this);			
		}, function() {
			$('.map-tooltip').removeClass('lawsuit').css('display', 'none');
		});
		$('#us-map circle').focus(function(){ 
        	var $this = $(this);
			circleTooltip($this);
			$('.map-tooltip').css({
				'left':'30%',
				'top':'-50px'
			});
        });
        $('#us-map circle').blur(function(){ 
        	$('.map-tooltip').css('display', 'none');
        });
	} else {
		$('#us-map circle').click(function(){
			var $this = $(this);
			circleTooltip($this);	
		});

		$('path').click(function(){
			var $this = $(this);
			var circles = $('#us-map circle');
			$this.closest('svg').append(circles);
		});

		$(document).mouseup(function (e){
			var tooltip = $('.map-tooltip');

			if (!tooltip.is(e.target) && tooltip.has(e.target).length === 0) {
				tooltip.hide();
			}

			if ($(e.target).hasClass('close')){
				tooltip.hide();
			}
		});
	}

}

var lastFocusedElement = null;
var isClick = false;
if (!touch){
	$('#us-map *').mousedown(function() {     
	     isClick= true;
	}).focus(function(e){
		var tooltip = $('.map-tooltip');

	    // To prevent focus firing when element already had focus
	    if (lastFocusedElement !== e.target) {
	        if (isClick) {
	          tooltip.addClass('hide');
	        } else { 
			  tooltip.removeClass('hide'); 
	        }
	        lastFocusedElement = e.target;
	        isClick = false;
	    }
	}).mousemove(function(){
		var tooltip = $('.map-tooltip');
		tooltip.removeClass('hide');
	});
}

$(document.body).focus(function(){
  lastFocusedElement = document.body;
});

$(document).ready(function(){
	initAccordion();
});
