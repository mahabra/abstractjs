define(function() {
	/* Covert array-like object to Array */
	return function(ob) {
		return Array.prototype.slice.call(ob);
	}
});