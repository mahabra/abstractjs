define(['./../../core/core.js','./../../core/core-ext.js'], function(core) {
	/* Расширяем абстрактный класс Function */
	
	var Strings = core.registerClass('Strings', function() {
		
	});
	Strings.prototype = {
		camelize: function() {
			return (this.__subject__||this).replace(/-([\da-z])/gi, function( all, letter ) {
				return letter.toUpperCase();
			});
		},
		dasherize: function(text) {
			return (this.__subject__||this).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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