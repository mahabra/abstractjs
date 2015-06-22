define(['$//$', './../Dom','./extras/querySelector.js','$//classes/Eacher/each','./is.js'], function(core, Dom, querySelector) {
	Dom.extend({
		/*
`		Search в отличии от find производит проверку самого элемента на соответствие условием поиска
		*/
		search: function(selector) {
			var suit = [],elements;

			this.each(function(root) {
				
				if (core(root).is('img')) {
					suit.push(root);
				} else {
					elements = querySelector(selector, root);

					if (elements.length) for (var i=0;i<elements.length;i++) {
						suit.push(elements[i]);
					};
				}
			});

			return core(suit, 'HTMLElement');
		}
	});
});