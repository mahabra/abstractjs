define(function() {
	return function(value) {
		return value && 
		"object"===typeof value && 
		value.__proto__ && 
		value.__proto__ === Object.prototype;
	}
});