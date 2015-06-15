define(function() {
	if (!Array.prototype.forEach) Array.prototype.forEach = function(callback) {
		for (var i = 0;i<this.length;i++) {
			callback.call(this[i], this[i], i);
		}
	}
});