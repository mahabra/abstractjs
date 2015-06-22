define(['./../Strings.js'], function(Strings) {
	Strings.extend({
		camelize: function() {
			return (this.__subject__||this).replace(/-([\da-z])/gi, function( all, letter ) {
				return letter.toUpperCase();
			});
		}
	});
});