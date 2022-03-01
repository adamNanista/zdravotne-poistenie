
var StickyTable = (function () {

	var DOM = {};
	
	// Global functions

	function cacheDom() {
		DOM.tables = document.querySelectorAll('.sticky-table');
	}

	function setupDom() {
		if (DOM.tables.length) {
			DOM.tables.forEach((table) => {
				wrap(table, 'sticky-table-wrapper');
				wrap(table, 'sticky-table-scroller');
				
				var shadowLeftColHeader = createShadowElement(table, 'sticky-table-shadowleftcolheader');
				var shadowLeftCol = createShadowElement(table, 'sticky-table-shadowleftcol');
				var shadowHeader = createShadowElement(table, 'sticky-table-shadowheader');
				
				insertAfter(table, shadowLeftColHeader);
				insertAfter(table, shadowLeftCol);
				insertAfter(table, shadowHeader);
			});
		}
	}
	
	function equalWidths() {
		if (DOM.tables.length) {
			DOM.tables.forEach((table) => {
				var tableWidth = table.offsetWidth;
				
				var shadowLeftColHeader = table.parentNode.querySelector('.sticky-table-shadowleftcolheader');
				var shadowHeader = table.parentNode.querySelector('.sticky-table-shadowheader');
				
				shadowLeftColHeader.style.width = tableWidth + 'px';
				shadowHeader.style.width = tableWidth + 'px';
			});
		}
	}
	
	function stickHeader() {
		if (DOM.tables.length) {
			DOM.tables.forEach((table) => {
				var tableHeight = table.offsetHeight;
				
				var scroller = table.parentNode;
				
				var wrapper = scroller.parentNode;
				var wrapperOffsetTop = wrapper.offsetTop;
				var wrapperOffsetLeft = wrapper.offsetLeft;
				
				var shadowLeftColHeader = table.parentNode.querySelector('.sticky-table-shadowleftcolheader');
				var shadowHeader = table.parentNode.querySelector('.sticky-table-shadowheader');
				
				window.addEventListener('scroll', function (event) {
					var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
					
					if (scrollTop > wrapperOffsetTop && scrollTop < wrapperOffsetTop + tableHeight) {
						shadowHeader.classList.add('sticked');
						shadowLeftColHeader.classList.add('sticked');
						shadowLeftColHeader.style.left = wrapperOffsetLeft + 'px';
					} else {
						shadowHeader.classList.remove('sticked');
						shadowLeftColHeader.classList.remove('sticked');
						shadowLeftColHeader.style.left = '';
					}
				});
				
				scroller.addEventListener('scroll', function (event) {
					var scrollLeft = scroller.scrollLeft;
					
					shadowHeader.style.left = wrapperOffsetLeft - scrollLeft + 'px';
				});
			});
		}
	}
	
	// Local functions
	
	function createShadowElement(referenceNode, className) {
		var shadowElement = referenceNode.cloneNode(true);
		
		shadowElement.classList.add(className);
		shadowElement.setAttribute('aria-hidden', 'true');
		
		return shadowElement;
	}
	
	function insertAfter(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	
	function wrap(referenceNode, className) {
		var wrapper = document.createElement('div');
		wrapper.classList.add(className);
		
		referenceNode.parentNode.appendChild(wrapper);
		wrapper.appendChild(referenceNode);
	}

	function init() {
		cacheDom();
		setupDom();
		equalWidths();
		stickHeader();
		
		var globalResizeTimer = null;
		
		window.addEventListener('resize', function (event) {
			if( globalResizeTimer != null ) window.clearTimeout(globalResizeTimer);
			
			globalResizeTimer = window.setTimeout( function () {
				equalWidths();
				stickHeader();
			}, 200);
		});
	}

	return {
		init: init
	};

}());

(function () {
	StickyTable.init();
})();