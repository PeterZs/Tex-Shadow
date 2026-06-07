window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

    // Side nav: scroll-based active / dark detection
    var sideItems = document.querySelectorAll('.side-nav-item');
    var sideNav   = document.getElementById('side-nav');

    if (sideItems.length > 0 && sideNav) {
        // map each item to its target's <section> (id is on h2, so use closest)
        var navEntries = [];
        sideItems.forEach(function (item) {
            var id = item.getAttribute('href').slice(1);
            var el = document.getElementById(id);
            var sec = el ? el.closest('section') : null;
            if (sec) navEntries.push({ item: item, section: sec });
        });

        var PROBE = 120;   // probe line from top
        var OFFSET = 90;   // scroll margin on click

        function updateSideNav() {
            var current = null;
            navEntries.forEach(function (e) {
                var r = e.section.getBoundingClientRect();
                if (r.top <= PROBE && r.bottom >= PROBE) current = e;
            });
            // force-activate last item when reaching page bottom
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
                current = navEntries[navEntries.length - 1];
            }
            if (current) {
                sideItems.forEach(function (el) { el.classList.remove('is-active'); });
                current.item.classList.add('is-active');
                sideNav.classList.toggle('on-dark', current.section.classList.contains('theme-ink'));
            }
        }

        window.addEventListener('scroll', updateSideNav, { passive: true });
        window.addEventListener('resize', updateSideNav);
        updateSideNav();

        // smooth scroll (with offset)
        sideItems.forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    var y = target.getBoundingClientRect().top + window.scrollY - OFFSET;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });
    }

    // Mega dropdown: mousemove-based — no edge oscillation
    const megaItem  = document.querySelector('.navbar-item.has-dropdown');
    const megaInner = megaItem ? megaItem.querySelector('.mega-inner') : null;

    if (megaItem && megaInner) {
        let closeTimer = null;
        let isOpen = false;

        function openMenu() {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            if (!isOpen) {
                megaItem.classList.remove('is-closing');
                megaItem.classList.add('is-open');
                isOpen = true;
            }
        }

        function closeMenu() {
            if (isOpen) {
                megaItem.classList.add('is-closing');
                setTimeout(function () {
                    megaItem.classList.remove('is-open', 'is-closing');
                    isOpen = false;
                }, 280);
            }
        }

        var GAP = 12; // .mega-dropdown padding-top + buffer

        document.addEventListener('mousemove', function (e) {
            var tr = megaItem.getBoundingClientRect();
            var inTrigger = e.clientX >= tr.left && e.clientX <= tr.right &&
                            e.clientY >= tr.top  && e.clientY <= tr.bottom + GAP;

            var inCard = false;
            if (isOpen) {
                var cr = megaInner.getBoundingClientRect();
                inCard = e.clientX >= cr.left && e.clientX <= cr.right &&
                         e.clientY >= cr.top - GAP && e.clientY <= cr.bottom;
            }

            if (inTrigger || inCard) {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                openMenu();
            } else if (isOpen && !closeTimer) {
                closeTimer = setTimeout(function () {
                    closeMenu();
                    closeTimer = null;
                }, 80);
            }
        });
    }

})