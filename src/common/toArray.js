/* Covert array-like object to Array */
define(function() {
	return function(ob) {
		return Array.prototype.slice.call(ob);
	}
});