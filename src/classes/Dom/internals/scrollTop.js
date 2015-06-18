define(['./../Dom.js'], function(Dom) {
	Dom.proto({
		scrollTop: function(value) {
			if ("undefined"!==typeof value) {
				this.scrollTo(value);
				return this;
			} else {
				if (this===window) {
					return this.pageYOffset || this.documentElement.scrollTop;
				} else {
					return this.scrollTop;
				}
			}
		}
	});
});
