define(['./../../../core/core.js', './../Dom.js','../extras/querySelector.js'], function(core, Dom, querySelector) {
	Dom.proto({
		find: function(selector) {
			var suit = [],elements;

			this.each(function(root) {
				
				elements = querySelector(selector, root);
				
				if (elements.length) for (var i=0;i<elements.length;i++) {
					suit.push(elements[i]);
				};
			});

			
			return core(suit, 'HTMLElement');
		}
	});
});