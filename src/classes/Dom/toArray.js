define(['$//$', './../Dom.js','$//internals/frendly'], function(core, Dom) {
	Dom.extend({
		/* Преобразует объект-селектор в массив */
		toArray: function() {
			return core.$frendly(Array.prototype.slice.apply(this));
		}
	});
});