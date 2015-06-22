
define(['./../Strings.js'], function(Strings) {

	Strings.extend({
		/*
		Преобразует первый символ в заглавный
		*/
		firstUpper: function() {
			return (this.__subject__||this).charAt(0).toUpperCase()+(this.__subject__||this).substr(1);
		}
	});
});