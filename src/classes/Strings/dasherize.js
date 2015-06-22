define(['./../Strings.js'], function(Strings) {
	Strings.extend({
		dasherize: function(text) {
			return (this.__subject__||this).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		}
	});
});