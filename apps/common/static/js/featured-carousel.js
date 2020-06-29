$(function() {

if($(window).width()<768) $(".wrap-startpage-ftimages .wrap-slider").addClass("slider-simple");
  
 if($(".slider-simple").length ==0) {
    var carousel = $("#featured_carousel");
    var carousel_left = carousel.clone().attr("id","featured_carousel-left").addClass("additional-carousel left");
    var carousel_right = carousel.clone().attr("id","featured_carousel-right").addClass("additional-carousel right");

    carousel_left.add(carousel_right).find(".item-caption, .startpage-caption, .carousel-indicators").remove();
    carousel_left.find(".item.active").removeClass("active").end().find(".item").last().prependTo(carousel_left.find(".carousel-inner")).addClass("active");

    carousel_right.find(".item.active").removeClass("active").end().find(".item").first().appendTo(carousel_right.find(".carousel-inner"));
    carousel_right.find(".item").first().addClass("active");
    
    carousel_left.add(carousel_right).appendTo(carousel.parent());
    
    carousel.carousel({ interval: 3500 });

    carousel_left.carousel({ interval: 0 });
    carousel_right.carousel({ interval: 0 });

    carousel.on("slide.bs.carousel", function(event) {
      var next = $(event.relatedTarget).index();
      carousel_left.carousel(next);
      carousel_right.carousel(next);
    })
    
    carousel_left.on("click", function() {
      carousel.carousel('prev');
        return false;
    })
    carousel_right.on("click", function() {
      carousel.carousel('next');
        return false;
    })

  }else if($("#featured_carousel").length !=0) {
    $("#featured_carousel").carousel({interval: 6000});
  }

  
  
  $("#carousel_testimonial").carousel({interval: 6000});
})
