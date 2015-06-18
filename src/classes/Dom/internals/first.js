define(['./../../../core/core.js', './../Dom.js'], function(core, Dom) {
	Dom.proto({
		first: function(selector) {
			console.log(this);
			return core(this[0]);
		}
	});
});