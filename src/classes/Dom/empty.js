define(['./../Dom','$//classes/Eacher/each'], function(Dom) {
	Dom.extend({
		empty: function() {
			this.each(function() {
				this.innerHTML = '';
			});
			return this;
		}
	});
});