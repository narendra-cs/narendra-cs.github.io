/* ===================================
1. Preloader
2. Change menu background
3. Smooth scrool
4. Parallax
5. Reviews
6. Blog slider
7. Navigation collapse
8. Wow js
==================================== */

(function ($) {

    jQuery(document).ready(function () {

        /* ===================================
        1. Preloader
        ==================================== */

        var prealoaderOption = $(window);
        prealoaderOption.on("load", function () {
            var preloader = jQuery('.preloader');
            var preloaderArea = jQuery('.preloader-area');
            preloader.fadeOut();
            preloaderArea.delay(350).fadeOut('slow');
        });

        /* ===================================
        2. Change menu background
        ==================================== */

	    if ( document.location.pathname == "/"){
        var headertopoption = $(window);
        var headTop = $('.header-top-area');

        headertopoption.on('scroll', function () {
            if (headertopoption.scrollTop() > 200 ) {
                headTop.addClass('menu-bg');
            } else {
                headTop.removeClass('menu-bg');
            }
        });
        }
	
        if ( document.location.pathname != "/"){
        var headTop = $('.header-top-area');
        headTop.addClass('menu-bg');
	    }

        /* ===================================
        3. Smooth scrool
        ==================================== */

        $('a.smoth-scroll').on("click", function (e) {
            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top - 50
            }, 1000);
            e.preventDefault();
        });

        // direct browser to top right away
        if (window.location.hash)
            scroll(0,0);
        // takes care of some browsers issue
        setTimeout(function(){scroll(0,0);},1);

        $(function(){
        //your current click function
        $('a.smooth-scroll').on('click',function(e){
            e.preventDefault();
            $('html,body').animate({
                scrollTop:$($(this).attr('href')).offset().top - 50
            },1000,'swing');
        });

        // if we have anchor on the url (calling from other page)
        if(window.location.hash){
            // smooth scroll to the anchor id
            $('html,body').animate({
                scrollTop:$(window.location.hash).offset().top - 50
                },1000,'swing');
            }
        });

        /* ===================================
        4. Parallax
        ==================================== */

        var parallaxeffect = $(window);
        parallaxeffect.stellar({
            responsive: true,
            positionProperty: 'position',
            horizontalScrolling: false
        });

        /* ===================================
        5. Reviews
        ==================================== */

        $(".review-list").owlCarousel({
            items: 1,
            autoPlay: true,
            navigation: false,
            itemsDesktop: [1199, 1],
            itemsDesktopSmall: [980, 1],
            itemsTablet: [768, 1],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            pagination: true,
            autoHeight: true,
        });

        /* ===================================
        6. Blog slider
        ==================================== */

        $(".blog-slider").owlCarousel({
            items: 1,
            autoPlay: true,
            navigation: false,
            itemsDesktop: [1199, 1],
            itemsDesktopSmall: [980, 1],
            itemsTablet: [768, 1],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            pagination: true,
            autoHeight: true,
        });

        /* ===================================
        7. Navigation collapse
        ==================================== */

        $(document).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                $(this).collapse('hide');
            }
        });
        $('body').scrollspy({
            target: '.navbar-collapse',
            offset: 195
        });

        /* ===================================
        8. Wow js
        ==================================== */

        new WOW().init();

    });

})(jQuery);
