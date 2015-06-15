define(['./../Dom.js'], function(Dom) {
	Dom.proto({
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