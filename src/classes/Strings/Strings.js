define(['./../../core/core.js','./../../core/core-ext.js'], function(core) {
	/* Расширяем абстрактный класс Function */
	
	var Strings = core.registerClass('Strings', function() {
		
	});
	Strings.prototype = {
		/*
		Преобразует стиль строки dashes в camel
		*/
		camelize: function() {
			return (this.__subject__||this).replace(/-([\da-z])/gi, function( all, letter ) {
				return letter.toUpperCase();
			});
		},
		/*
		Преобразует стиль строки camel в dashes
		*/
		dasherize: function(text) {
			return (this.__subject__||this).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		},
		/*
		Преобразует первый символ в заглавный
		*/
		firstUpper: function() {
			return (this.__subject__||this).charAt(0).toUpperCase()+(this.__subject__||this).substr(1);
		}
	}
	Object.defineProperty(Strings, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Strings
	});
	Strings.assignTo('String');
});