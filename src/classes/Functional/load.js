define(['./../Functional.js', './includes/microvendor.js'], function(Functional, microvendor) {
	Functional.extend({
		load: function(resources) {
			var callback = (this.__subject__||this);
			
			return microvendor(resources, function(res) {
				var args = Array.prototype.slice.apply(arguments);
				callback.call(window, false, args);
			});
		}
	});
});
		