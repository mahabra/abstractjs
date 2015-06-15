define(['./../Dom.js'], function(Dom) {
	Dom.proto({
		empty: function() {
			this.each(function() {
				this.innerHTML = '';
			});
			return this;
		}
	});
});