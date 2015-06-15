define(['./../core.js','./../../common/mixin.js', './../ext/assignClassToClass.js'], function(core, mixin) {

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
			return core.charge(abstractClass.className, aClass);
		}
		/*
		Расширение самого себя
		*/
		abstractClass.proto = function(data) {
			mixin(abstractClass.prototype, data);
			return abstractClass;
		}
		/*
		Собственное имя класса
		*/
		abstractClass.className = className;

		return abstractClass;
	}
});