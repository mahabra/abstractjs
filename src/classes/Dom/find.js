define(['$//$', './../Dom','./extras/querySelector.js','$//classes/Eacher/each'], function(core, Dom, querySelector) {
	Dom.extend({
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