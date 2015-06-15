define(['./../../../core/core.js', './../Dom.js','../extras/querySelector.js'], function(core, Dom, querySelector) {
	Dom.proto({
		find: function(selector) {
			var suit = [],elements;
			this.each(function() {
				elements = querySelector(selector, this);
				if (elements.length) for (var i=0;i<elements.length;i++) {
					suit.push(elements[i]);
				};
			});

			return core(suit, 'HTMLElement');
		}
	});
});