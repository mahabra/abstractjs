define(['./../core.js'], function(core) {
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		module: function(className) {
			var constructor=null,proto=null;
			if (arguments.length>1) {
				(typeof arguments[1]==="function") && (constructor=arguments[1], ("object"===typeof arguments[2] && (proto=arguments[2])));
				(typeof arguments[1]==="object") && (proto=arguments[1], ("function"===typeof arguments[2] && (constructor=arguments[2])));
			}

			var realModuleName = 'module'+core(className).firstUpper();
			
			if (!core.moduleExists(className)) {
				core.registerModule(className, constructor||function() {});

			};
			var widget = core.classes[realModuleName];
			
			//if (proto!==null) core.classes[realModuleName]  = widget.proto(proto);
			/*
			Сохраняем виджет
			*/
			
			return widget;
		}

	});
});