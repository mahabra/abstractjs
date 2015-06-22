define(['$//$','$//system/var/moduleCreator'], function(core, moduleCreator) {
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		createModule: function(moduleName, constructor) {
			var fullClassName = 'module'+moduleName.charAt(0).toUpperCase()+moduleName.substr(1);
			/*
			Создаем новый класс
			*/
			core.classes[fullClassName] = moduleCreator(moduleName, constructor||false);
			

			return core.classes[fullClassName];
		}
	});
});