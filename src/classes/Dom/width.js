define(['./../Dom'], function(Dom) {
	Dom.extend({
		width: function() {
			if (this[0]===window) {
				var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0];
			    return w.innerWidth || e.clientWidth || g.clientWidth;
			} else {
				return this[0].offsetWidth;
			}
		}
	});
});