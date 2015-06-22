define(['./../Dom.js'], function(Dom) {
	Dom.extend({
		height: function() {
			if (this[0]===window) {
				var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0];
			    return w.innerWidth || e.clientHeight || g.clientHeight;
			} else {
				return this[0].offsetHeight;
			}
		}
	});
});