define(['./../core.js','./../../common/mixin.js'], function(core) {
	core.extend({
		/*
		Функция заносит все расширения в прототипы родных объектов Javascript.
		Тем самым загрязняя прототипы объектов, но делая доступных использование расширенных функций
		без использования функции обертки.
		*/
		globalize : function() {
			for (var i=0;i<nativeClasses.length;++i) {
				if ("object"===typeof Abstract.prototypes[nativeClasses[i]]) {
					(function(protos, className) {
						eval('var essence = '+className+';');
						mixin(essence.prototype, protos);
					})(Abstract.prototypes[nativeClasses[i]], nativeClasses[i]);
				}
			}
		}
	});

	/*
	Другое название функции globalize
	*/
	core.extend({
		apocalypse: core.globalize
	})
});

