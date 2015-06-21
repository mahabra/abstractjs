define(['./../Inherit.js','$//gist/common/inherit.js'], function(Inherit, inherit) {
	Inherit.extend({
		inherit: function() {
			var classes = Array.prototype.slice.apply(arguments);
			return inherit(this.__subject__||this, classes);
		}
	});
});
		