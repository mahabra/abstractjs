define(['./../core.js'], function(core) {
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		assignClassToClass: function(className, detClassName) {
			if ("undefined"===typeof core.classesAssignmentsMap[detClassName]) core.classesAssignmentsMap[detClassName] = [];
			if (core.classesAssignmentsMap[detClassName].indexOf(className)<0) {
				core.classesAssignmentsMap[detClassName].push(className);
			}
			return this;
		}
	});
});