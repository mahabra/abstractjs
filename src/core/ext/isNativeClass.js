define(['./../core.js', './../var/nativeClasses.js'], function(core, nativeClasses) {
	/*
	Возвращает true, если класс является нативным
	*/
	core.extend({
		isNativeClass: function(className) {
			return nativeClasses.indexOf(className)>=0;
		}
	});
});