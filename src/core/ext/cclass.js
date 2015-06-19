define(['./../core.js','./../var/classCreator.js'], function(core, classCreator) {
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		class: function(className) {
			/*
			Получаем класс
			*/
			if ("function"===typeof core.classes[className]) {
				return core.classes[className];
			} else {
				return null;
			}
		},
		classExists: function(className) {
			if ("function"===typeof core.classes[className]) {
				return true;
			} else {
				return false;
			}
		},
		module: function(moduleName) {
			var realModuleName = 'module'+core(moduleName).firstUpper();
			if ("function"===typeof core.classes[realModuleName]) {
				return core.classes[realModuleName];
			} else {
				return null;
			}
		},
		moduleExists: function(moduleName) {
			var realModuleName = 'module'+core(moduleName).firstUpper();
			if ("function"===typeof core.classes[realModuleName]) {
				return true;
			} else {
				return false;
			}
		}

	});
});