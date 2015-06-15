define(['./../core.js','./../../common/mixin.js'], function(core, mixin) {
	var supports = function(test) {
		if (core.supports[test] && "function"===typeof core.supports[test]) core.supports[test] = core.supports[test]();
		if (core.supports[test]) return core.supports[test]; else return false;
	}
	supports.extend = function(data) {
		mixin(this, data);
		return this;
	}
	core.extend({
		supports: supports
	});
});