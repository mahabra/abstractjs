
define(['./../../core/core.js','./../../common/mixin.js','./../../core/core-ext.js'], function(core,mixin) {
	/* Расширяем абстрактный класс Function */
	
	var Objective = core.registerClass('Objective', function() {
		
	});
	Objective.prototype = {
		stringify: function() {
			var args = Array.prototype.slice.apply(arguments);
			args.unshift(this.__subject__||this);

			try {
				return JSON.stringify.apply(JSON, args);
			} catch(e) {
				return null;
			}
		}
	}
	Object.defineProperty(Objective, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Objective
	});
	Objective.assignTo('Object');
});

