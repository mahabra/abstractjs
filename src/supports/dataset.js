define(['./../core/core.js', './../core/core-ext.js'], function(core, supports) {
	core.supports.extend({
		dataset: function() {
			return (typeof document.createElement('div').dataset !== "undefined");
		}
	});
});