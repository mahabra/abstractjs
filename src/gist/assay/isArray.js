define(function() {
	return function(value) {
		return Array.isArray(value) && Object.prototype.toString.call(value) === '[object Array]';
	}
});