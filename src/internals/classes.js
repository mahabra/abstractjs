define(['$//$','$//system/var/classCreator'], function(core, classCreator) {
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		registerClass: function(className, constructor) {
				
				/*
				Создаем новый класс
				*/
				core.classes[className] = classCreator(className, constructor||false);
				/*
				Регистриуем класс в таблице присваиваний
				*/
				core.classesBindings[className] = [];

				return core.classes[className];
			
		},
		class: function(className) {
			/*
			Получаем класс
			*/
			if ("function"===typeof core.classes[className]) {
				return core.classes[className];
			} else {
				throw 'Class `'+className+'` not exists';
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
			var realModuleName = 'module'+moduleName.charAt(0).toUpperCase()+moduleName.substr(1);
			if ("function"===typeof core.classes[realModuleName]) {
				return core.classes[realModuleName];
			} else {
				return null;
			}
		},
		moduleExists: function(moduleName) {
			var realModuleName = 'module'+moduleName.charAt(0).toUpperCase()+moduleName.substr(1);
			if ("function"===typeof core.classes[realModuleName]) {
				return true;
			} else {
				return false;
			}
		}

	});
});