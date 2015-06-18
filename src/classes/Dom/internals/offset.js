define(['./../Dom.js'], function(Dom) {
	Dom.proto({
		offset: function() {
			return {
				top: this[0].offsetTop,
				left: this[0].offsetLeft
			}
		}
	});
});