define(['./../core.js'], function(core) {

	return function(id,subject) {
		
		var scope, __abstractClass__ = core.detectAbstractClass(subject);
		scope = function(data) {
			
		};

		/*
		Судьект размещаем в более глубоком слое прототипа. Соответственно абстракция получит все свойства исходного объекта.
		*/
		scope.prototype = Object.create(subject, {
			/*
			Scope id is index in stack
			*/
			__abstractId__: {
				configurable: false,
				enumerable: true,
				writable: false,
				value: id
			},
			/*
			Абстрактный класс представляет из себя происхождение объекта, которое доступно для расширения средставми abstract.
			Любой объект может быть приведен к определенному одному или нескольким абстрактным классам.
			*/
			__abstractClass__: {
				configurable: false,
				enumerable: true,
				writable: false,
				value: __abstractClass__
			},
			/*
			Субьект содержит ссылку на операнд - объект который мы обернули в абстракцию
			*/
			__subject__: {
				configurable: false,
				enumerable: true,
				writable: true,
				value: subject
			}
		});

		/*
		Исходя из абстрактного класса объекта, мы его заряжаем соответсвующим API.
		Для этого используется функция ядра charge, которая принимает ссылку на
		объект и список абстрактных классов.
		*/
		scope = core.charge(scope, __abstractClass__);
		
		return new scope();
	}
});