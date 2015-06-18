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

			var fullModuleName = 'module'+core(className).firstUpper();


			if (!core.classExists(fullModuleName)) {

				var widget = $(function() { }).inherit(core.class('Widget'));
				core.registerClass(fullModuleName, widget);

			} else {
				var widget = core.class(fullModuleName);
			}
			if (constructor!==null) {
				core.classes[fullModuleName] = widget.inherit(constructor);
			}
			if (proto!==null) core.classes[fullModuleName]  = widget.proto(proto);
			/*
			Сохраняем виджет
			*/
			
			return widget;
		}

	});
});