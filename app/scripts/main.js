/* For concealed carry map only */
function initAccordion(){
	$(".filter-title").click(function(){
		var $parent = $(this).closest(".filter");
		var siblings = $parent.siblings()
		siblings.removeClass('filtered');
		siblings.find(".filter-description").each(function(){
			$(this).slideUp("fast");
		});
		$parent.toggleClass('filtered');
		$parent.find(".filter-description").each(function(){
			$(this).slideToggle("fast");
		});

		var id = parseInt( $parent.attr("id").replace('filter-', '') );
		var map = $('#interactive-wrapper');
		var clear = $('#clear-filter');
		if ($parent.hasClass('filtered')){
			map.attr('data-filter', id);
			clear.css("visibility", "visible");
		} else {
			map.attr('data-filter', '');
			clear.css("visibility", "hidden");
		}     
	});

	$('#clear-filter').click(function(){
		$(".filtered").find(".filter-title").trigger("click");
	}).keydown(function(e){
		var code = e.which;
		// 13 = Return, 32 = Space
		if ((code === 13) || (code === 32)) {
			$(this).trigger("click");
		}
	});

	$(".filter").keydown(function(e){ // Trigger the click event from the keyboard
		var code = e.which;
		// 13 = Return, 32 = Space
		if ((code === 13) || (code === 32)) {
			$(this).find(".filter-title").trigger("click");
		}
	});

	if (!touch){
		$(".cir-map-state").click(function(){
			var $this = $(this);
			var group = parseInt( $this.data("color") ) + 1;

			var filter = $(".filter:nth-child(" + group + ")");
			if ( !filter.hasClass("filtered") ) {
				filter.find(".filter-title").trigger("click");
			}
		});
	}

	$("#us-map circle").hover(function(){
		$this = $(this);
		var lawsuit = $this.data("lawsuit");
		var court = $this.data("court");
		var location = $this.data("location");
		var decision = $this.data("decision");

		var tooltip = $(".map-tooltip");
		//var html = "<span class='label'>Lawsuit</span><span class='case'>" + lawsuit + "</span><span class='court'>" + court + "</span><span class='location'>" + location + "</span><span class='decision'>" + decision + "</span>";
		html = "<span class='label'>Lawsuit</span><table><tr><td>Case</td><td>" + lawsuit + "</td></tr><tr><td>Court</td><td>" + court + "</td></tr><tr><td>Decided</td><td>" + decision + "</td></tr></table>";

		tooltip.addClass("lawsuit").css("display", "block");
		tooltip.find(".tooltip-inner").each(function(){
			$(this).html(html);
		});
	}, function() {
		$(".map-tooltip").removeClass("lawsuit").css("display", "none");
	});
}