define(['./../Dom.js'], function(Dom) {
	Dom.proto({
		toArray: function(html) {
			return Array.prototype.slice.apply(this);
		}
	});
});