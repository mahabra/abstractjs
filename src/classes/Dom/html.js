define(['./../Dom.js','$//classes/Eacher/each'], function(Dom) {
	Dom.extend({
		html: function(html) {
			if ("undefined"===typeof html) {
				if (this.length<=0) return null;
				return this[0].innerHTML;
			}
			else
			return this.each(function() {
				this.innerHTML = html;
			});
		}
	});
});