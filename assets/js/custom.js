jQuery(document).ready(function ($) {
  $('.accordion-trigger').on('click', function () {
    const $trigger = $(this);
    const $panel = $('#' + $trigger.attr('aria-controls'));
    const isExpanded = $trigger.attr('aria-expanded') === 'true';

    // Toggle aria attributes
    $trigger.attr('aria-expanded', !isExpanded);
    $panel.attr('aria-hidden', isExpanded);

    // Slide animation
    $panel.stop().slideToggle(300);
    
    // Optional: Toggle active class for styling
    $trigger.toggleClass('active');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        el.classList.add("visible");

        // Animate children with stagger
        const children = el.children;
        [...children].forEach((child, index) => {
          setTimeout(() => {
            child.classList.add("visible");
          }, index * 300);
        });

        // Optional: unobserve if you only want it to run once
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0
  });

  // Observe all `.animate` elements
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));
});
jQuery(document).ready(function ($) {
  // Initialize header scroll detection
  toggleHeaderClass('.header', 'scrolled-down', 'scrolled-up');
  header();
  smoothScroll();

  function header() {
    $(document).on("click", "#menu-toggle", function (e) {
      e.preventDefault();
      toggleMenu();
    });

    $(document).on("click", ".toc-menu__toggle-btn", function (e) {
      e.preventDefault();
      
      $(this).toggleClass('active');

      const $parentItem = $(this).closest(".toc-menu__nav-item--has-children");
      const $subMenu = $parentItem.find(".toc-menu__subnav-list");
      const isExpanded = $(this).attr("aria-expanded") === "true";

      $subMenu.stop(true, true).slideToggle(300);
      $(this).attr("aria-expanded", !isExpanded);
      $parentItem.toggleClass("active");

      if ($(".toc-menu__subnav-list:visible").length > 0) {
        $(".toc-menu__nav-list").addClass("is-open");
      } else {
        $(".toc-menu__nav-list").removeClass("is-open");
      }
    });
  }

  // Function to handle scroll class toggle
  function toggleHeaderClass(headerSelector, activeClass, upClass) {
    const $header = $(headerSelector);
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
          // Scrolling Down
          $header.addClass(activeClass).removeClass(upClass);
        } else if (scrollTop <= 30 ) {
          // Reached the very top
          $header.addClass(upClass).removeClass(activeClass);
        } else {
            // Scrolling Up but not at the very top
            $header.removeClass(upClass).addClass(activeClass);
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, { passive: true }); // Use passive listener for better performance
  }


  // Function to handle menu toggle
  function toggleMenu() {
    const $menuOverlay = $("#menu-overlay");
    const $menuToggle = $("#menu-toggle");
    const $body = $("body");

    $menuOverlay.toggleClass("active");
    $menuToggle.toggleClass("open");
    $body.toggleClass("nav-active");

    $menuOverlay.off("transitionend").on("transitionend", function () {
      if ($menuOverlay.hasClass("active")) {
        $body.addClass("transition-complete");
      } else {
        $body.removeClass("transition-complete");
      }
    });
  }

  // Smooth Scroll with Hash Support
  function smoothScroll() {
    const headerHeight = $('#header').outerHeight(); 

    // Smooth scroll on link click, supporting both hash-only and page-relative links
    jQuery(document).on('click', 'a[href*="#"]', function (e) {
      const linkHref = jQuery(this).attr('href');

      // Check if the link is page-relative (e.g., lessons.html#we-cant-do-it-alone)
      if (linkHref.includes('.html#')) {
        const page = linkHref.split('#')[0];
        const hash = linkHref.split('#')[1];

        // If it's a different page, let the browser handle it
        if (window.location.pathname.indexOf(page) === -1) {
          return;
        }
      }
      
      e.preventDefault();
      
      // Get the target element
      const target = jQuery('#' + linkHref.split('#')[1]);
      console.log("linked click");

      if (jQuery(this).hasClass('toc-menu__subnav-link')) {
         jQuery('#menu-toggle').trigger('click');
      }

      if (target.length) {
        const headerHeight = jQuery('#header').outerHeight(); 
        jQuery('html, body').animate({
          scrollTop: target.offset().top - headerHeight
        }, 800);
      }
    });


    // If URL contains a hash on page load
    if (window.location.hash) {
      const target = $(window.location.hash); 

      if (target.length) {
        setTimeout(function () {
          const headerHeight = $('#header').outerHeight(); 

          $('html, body').animate({
            scrollTop: target.offset().top - headerHeight
          }, 800);
        }, 300); // Small delay to ensure page is fully loaded
      }
    }
  }
});
