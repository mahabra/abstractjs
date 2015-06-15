define(['./../common/extend.js', './class/api.js','./var/exPrototype.js'], function(extend, api, exPrototype) {
	
	return {
		create: function(name,proto) {
			/*
			Функция конструктор
			*/
			var abstractClass,i,construct = function(args) {
				/*
				Прежде чем строить собственный класс, мы должны произвести построение объекта из наследуемых классов
				*/

				for (i=0;i<abstractClass._inherits.length;i++) {

					abstractClass._scope.class(abstractClass._inherits[i]).constructWithin(this, args);
				}
				/*
				После построения наследуюемых классов, проводим собственную постройку
				*/
				abstractClass.constructWithin(this, args);
			},
			abstractClass = function() {

				if (!abstractClass._lazyConstructor) { construct.call(this, arguments); }
				else { abstractClass._lazyConstructor=false; }
			};
			abstractClass.prototype = exPrototype.create(abstractClass, {
				_abstractClassName_: name,
				static: abstractClass
			});
			/*
			Расширяем API класса. Пока что через extend, но позже нужно будет проработать вариант расширения прототипа функции конструктора 
			для браузеров поддерживающих __proto__
			*/
			extend(abstractClass, api);

			/*
			Расширяем функция простроения самого себя
			*/
			abstractClass.construct = function() {
				/*
				Отключаем собственный конструктор класса
				*/
				abstractClass._lazyConstructor = true;
				var module = new abstractClass();
				construct.call(module, arguments);
				return module;
			}
			abstractClass._lazyConstructor = false;
			/*
			Собственное имя класса
			*/
			abstractClass._name = name||null;
			/*
			Ссылка на область видимости
			*/
			abstractClass._scope = null;
			/*
			Перечень классов, которые наследует этот класс
			*/
			abstractClass._inherits = [];
			/*
			Произвольные данные, которые могут использовать другие классы и модули
			*/
			abstractClass._own = {};
			/*
			Прототип будущего объекта
			*/
			abstractClass._prototype = abstractClass.prototype;
			/*
			Свойства будущего объекта
			*/
			abstractClass._properties = {};
			/*
			Дополнительные конструкторы
			*/
			abstractClass._constructors = [];

			/*
			Если в аргументах функции указан второй аргумент, значит это или прототип или конструктор
			*/
			if (arguments.length>1) {
				if ("object"===typeof arguments[1]) {
					abstractClass.extend(arguments[1]);
				} else if ("function"===typeof arguments[1]) {
					abstractClass.construct(arguments[1]);
				}
			}

			return abstractClass;
		}
	}
});