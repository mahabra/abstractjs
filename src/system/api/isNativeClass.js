define(['./../var/nativeClasses.js'], function(nativeClasses) {
	return function(className) {
		return nativeClasses.indexOf(className)>=0;
	}
});