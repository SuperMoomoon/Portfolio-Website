document.writeln(
	"<div class=\"Top\" id=\"d1\"><a href=\"javascript:;\"><img class=\"img\" src=\"icon/top_on.png\" /><img class=\"img_on\" src=\"icon/top.png\" /></a></div>"
	);


//head
$(window).scroll(function() {
	if ($(this).scrollTop() > 200) { //整体页面滚动大于100之后
		$('.left-nav').addClass('active'); // 添加menu-shrink
	} else {
		$('.left-nav').removeClass('active'); //否则删除menu-shrink
	}
});



// 动画
wow = new WOW({
	animateClass: 'animated',
});
wow.init();


//向下滚动
$(document).ready(function() {
	// 滚动到顶部
	$("#d1").click(function() {
		$("html, body").animate({
			scrollTop: $("body").offset().top
		}, {
			duration: 500,
			easing: "swing"
		});
		return false;
	});
	$("#d2").click(function() {
		$("html, body").animate({
			scrollTop: $("#d2_on").offset().top
		}, {
			duration: 1000,
			easing: "swing"
		});
		return false;
	});

});


// Initialize variables and DOM references
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const leftNav = document.querySelector('.left-nav');
// const newHead = document.querySelector('.new_head');
const overviewSection = document.getElementById('overview');
let menuShown = false;


// Main initialization function to avoid duplicate event listeners
function init() {
	// Initialize Wow.js for animations
	if (typeof WOW !== 'undefined') {
		new WOW({
			boxClass: 'wow',
			animateClass: 'animated',
			offset: 0,
			mobile: true,
			live: true,
			callback: function(box) {
				// Trigger a layout reflow to ensure animations render properly
				void box.offsetWidth;
			}
		}).init();
	}

	// Initialize navigation states
	updateActiveNavItem();
	checkInitialMenuState();

	// Add click event to navigation items for smooth scrolling
	navItems.forEach(item => {
		item.addEventListener('click', handleNavItemClick);
	});

	// Add single scroll event listener with optimized handling
	window.addEventListener('scroll', throttle(handleScroll, 50));
}

// Function to check if an element is in viewport
function isElementInViewport(el) {
	const rect = el.getBoundingClientRect();
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.5 &&
		rect.bottom >= 0
	);
}

// Function to update active navigation item based on scroll position
function updateActiveNavItem() {
	let currentSection = '';
	const viewportHeight = window.innerHeight;
	const scrollPosition = window.scrollY + (viewportHeight * 0.3);

	// Only update navigation when sections are actually in view
	sections.forEach(section => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.offsetHeight;

		if (scrollPosition >= sectionTop - 100 &&
			scrollPosition <= sectionTop + sectionHeight - 100) {
			currentSection = section.getAttribute('id');
		}
	});

	// Store previous section to optimize updates
	if (!updateActiveNavItem.previousSection) {
		updateActiveNavItem.previousSection = '';
	}

	// Only update if the section has changed to avoid unnecessary DOM operations
	if (currentSection !== updateActiveNavItem.previousSection) {
		navItems.forEach(item => {
			item.classList.remove('active');
			if (item.getAttribute('data-section') === currentSection) {
				item.classList.add('active');
				item.style.transition = 'all 0.2s ease';
			}
		});
		updateActiveNavItem.previousSection = currentSection;
	}
}

// Handle navigation item click for smooth scrolling
function handleNavItemClick() {
	const targetSectionId = this.getAttribute('data-section');
	const targetSection = document.getElementById(targetSectionId);

	if (targetSection) {
		window.scrollTo({
			top: targetSection.offsetTop - 80, // Offset for header
			behavior: 'smooth'
		});
	}
}

// Check initial menu state on page load
function checkInitialMenuState() {
	if (isElementInViewport(overviewSection) || window.scrollY >= overviewSection.offsetTop) {
		leftNav.classList.add('show');
		// newHead.classList.add('show');
		menuShown = true;
	}
}

// Throttle function to limit event frequency
function throttle(func, delay) {
	let timeoutId;
	let lastExecTime = 0;

	return function() {
		const context = this;
		const args = arguments;
		const currentTime = Date.now();
		const elapsedTime = currentTime - lastExecTime;

		if (elapsedTime >= delay) {
			func.apply(context, args);
			lastExecTime = currentTime;
		} else {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(function() {
				func.apply(context, args);
				lastExecTime = Date.now();
			}, delay - elapsedTime);
		}
	};
}

// Main scroll handler function to consolidate all scroll-related logic
function handleScroll() {
	// Update active navigation item
	updateActiveNavItem();

	// Check if overview section is in viewport
	if (!menuShown && isElementInViewport(overviewSection)) {
		leftNav.classList.add('show');
		// newHead.classList.add('show');
		menuShown = true;
	}
	// Check if user has scrolled up and left the overview section
	else if (menuShown && !isElementInViewport(overviewSection) && window.scrollY < overviewSection.offsetTop) {
		leftNav.classList.remove('show');
		newHead.classList.remove('show');
		menuShown = false;
	}
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

