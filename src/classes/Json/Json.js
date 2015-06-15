
define(['./../../core/core.js','./../../common/mixin.js','./../../core/core-ext.js'], function(core,mixin) {
	/* Расширяем абстрактный класс Function */
	
	var Json = core.registerClass('Json', function() {
		
	});
	Json.prototype = {
		parse: function() {
			if ("string"!==typeof (this.__subject__||this)) {
				return (this.__subject__||this);
			}
			var args = Array.prototype.slice.apply(arguments);
			args.unshift(this.__subject__||this);

			return JSON.parse.apply(JSON, args);
		}
	}
	Object.defineProperty(Json, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Json
	});
	Json.assignTo('Object');
});