define(['./../core.js','./../var/classCreator.js'], function(core, classCreator) {
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
			core.classesAssignmentsMap[className] = [];

			return core.classes[className];
		}

	});
});