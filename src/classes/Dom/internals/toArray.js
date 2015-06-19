define(['./../Dom.js'], function(Dom) {
	Dom.proto({
		/* Преобразует объект-селектор в массив */
		toArray: function() {
			return core.$frendly(Array.prototype.slice.apply(this));
		}
	});
});