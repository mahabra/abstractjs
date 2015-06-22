define(['./../Dom'], function(Dom) {
	Dom.extend({
		offset: function() {
			return {
				top: this[0].offsetTop,
				left: this[0].offsetLeft
			}
		}
	});
});