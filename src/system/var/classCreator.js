define(['$//$','$//gist/common/mixin.js'], function(core, mixin) {

	return function(className, constructor) {

		var abstractClass = constructor || function() {};
		
		/*
		Привязать класс с абстрктному классу. Его функционал будет доступ через абстракцию.
		*/
		abstractClass.assignTo = function(aClass) {
			core.bindClass(abstractClass.className, aClass);
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
		abstractClass.extend = function(data) {
			mixin(abstractClass.prototype, data);
			return abstractClass;
		}
		
		/*
		Собственное имя класса
		*/
		abstractClass.embeddable=false;
		abstractClass.className = className;

		return abstractClass;
	}
});