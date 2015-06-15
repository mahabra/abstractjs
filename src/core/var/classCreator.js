define(['./../core.js','./../ext/assignClassToClass.js'], function(core) {

	return function(className, constructor) {

		var abstractClass = constructor || function() {};
		/*
		Привязать класс с абстрктному классу. Его функционал будет доступ через абстракцию.
		*/
		abstractClass.assignTo = function(aClass) {

			core.assignClassToClass(abstractClass.className, aClass);
			return abstractClass;
		}
		/*
		Расширить этим классом другой абстрактный класс
		*/
		abstractClass.charge = function(aClass) {
			core.charge(abstractClass.className, aClass);
		}
		/*
		Собственное имя класса
		*/
		abstractClass.className = className;

		return abstractClass;
	}
});