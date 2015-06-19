define(['./../../../core/core.js', './../Dom.js'], function(core, Dom) {
	Dom.proto({
		first: function(selector) {
			return core(this[0]);
		}
	});
});