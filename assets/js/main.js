$(document).ready(function () {
    // Menu
    var header = $("#header");
    var overlay = $("#overlay");
    var menuBurger = $("#header .burger");
    var menuMenu = $("#header .menu-list");
    const langSelect = $("#language");

    langSelect.val(location.href.split("/")[3]);

    langSelect.change((e) => {
        location.href = e.target.value;
    });

    menuBurger.on("click", function () {
        if (!menuMenu.hasClass("active")) {
            menuMenu.addClass("active");
            menuBurger.addClass("active");
            header.addClass("active");
            overlay.addClass("active");
            $("body").addClass("overlay");

            return false;
        } else {
            menuMenu.removeClass("active");
            menuBurger.removeClass("active");
            header.removeClass("active");
            overlay.removeClass("active");
            $("body").removeClass("overlay");

            return false;
        }
    });

    $(".menu-list .nav-link").click(function () {
        setTimeout(function () {
            menuMenu.removeClass("active");
            menuBurger.removeClass("active");
            header.removeClass("active");
            overlay.removeClass("active");
            $("body").removeClass("overlay");
        }, 1000);
    });

    // ToolTips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            html: true,
        });
    });

    // Slider Road Map
    var cfgSliderRoadmap = {
        loop: false,
        items: 4,
        nav: true,
        navText: ["<span></span>", "<span></span>"],
        dots: true,
        margin: 15,
        stagePadding: 30,
        smartSpeed: 0,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            991: { items: 2 },
            992: { items: 3 },
            1199: { items: 3 },
            1200: { items: 4 },
            1400: { items: 4 },
        },
    };
    var sliderRoadmap = $(".roadmap-slider").owlCarousel(cfgSliderRoadmap);

    var HRoadmapInfo = 0;
    $(".roadmap-slider .item .info-block ul").each(function () {
        if ($(this).height() > HRoadmapInfo) HRoadmapInfo = $(this).height();
    });
    $(".roadmap-slider .item .info-block ul").height(HRoadmapInfo);
    $(window).scroll(function () {
        $(".roadmap-slider .item .info-block ul").each(function () {
            if ($(this).height() > HRoadmapInfo) HRoadmapInfo = $(this).height();
        });
        $(".roadmap-slider .item .info-block ul").height(HRoadmapInfo);
    });

    // Planet Animation
    var hT = $("#avocado-group").offset().top;
    var hH = $("#avocado-group").outerHeight();
    var wH = $(window).height();
    var wS = $(this).scrollTop();
    var pad = 200;
    if (wS >= hT + hH - wH) $("#avocado-group").removeClass("noanimate");

    $(window).scroll(function () {
        wS = $(this).scrollTop();

        // Header
        if (wS > 50) $("#header").addClass("scroll");
        else $("#header").removeClass("scroll");

        // Planet Animation
        if (wS >= hT + hH - wH - pad) $("#avocado-group").removeClass("noanimate");
    });

    /*
    var wSize = window.innerWidth;
    
    if( wSize <= 991 ) {
        sliderRoadmap = $('.roadmap-slider').owlCarousel(cfgSliderRoadmap)
    }
    else {
        sliderRoadmap.trigger('destroy.owl.carousel');
    }
    window.onresize = function(event) {
        wSize = window.innerWidth;
        
        if( wSize <= 991 ) {
            sliderRoadmap = $('.roadmap-slider').owlCarousel(cfgSliderRoadmap)
        }
        else {
            sliderRoadmap.trigger('destroy.owl.carousel');
        }
    };
    */
});
