define(['./../../common/extend.js','./../../common/clone.js', './../common/inheritClassPrototype.js','./../../common/stratify.js'], function(extend, clone, inheritClassPrototype,stratify) {
	return {
		/*
		Указывает список классов, которые унаследует новый объект
		*/
		extends: function(absClass) {
			if (this._inherits.indexOf(absClass)<0) this._inherits.push(absClass);
			/* Расширяем класс прототипом из наследуемого класса */

			inheritClassPrototype(this._prototype, this._scope.class(absClass)._prototype);
			return this;
		},
		/*
		Дополняет свойства, который будут созданы для нового объекта
		*/
		properties: function(data) {
			extend(this._properties, data);
			return this;
		},
		/*
		Дополняет прототип, который будет унаследован объектом
		*/
		proto: function(data) {
			extend(this._prototype, data);
			return this;
		},
		extend: function(data) {
			/*
			Мы размиксуем свойства от функций, функции передадим в прототип, а свойства создадим в объекте
			*/
			var mixed = stratify(data);

			this.proto(extend({},mixed[1]));
			this.properties(mixed[0]);
			return this;
		},
		/*
		Добавляет новый конструктор
		*/
		constructor: function(c) {
			this._constructors.push(c);
			return this;
		},
		/*
		Сохраняет переменную, являющуюся данными, которые могут использоваться в дальнешем при построении класса в произвольном порядке
		*/
		own: function(name, value) {
			if ("undefined"===typeof this._own[name]) this._own[name] = clone(value);
			else {
				if ("object"===typeof this._own[name] && "object"===typeof value) {
					extend(this._own[name], value);
				} else {
					this._own[name] = clone(value);
				}
			}
			return this;
		},
		/*
		Присваивает свойство, аналогично нативному указанию
		*/
		init: function(name, value) {
			this['_'+name] = value;
		},
		/*
		Выполняет построение класса в контексте объекта. Данная процедура предполагает, что у объекта, в контексте которого происходит построение
		уже наследован прототип класса, построение которого происходит. Т.е. данная процедура выполняет все элементы построения, кроме наследования
		прототипа.
		*/
		constructWithin: function(subject,args) {
			/*
			Создаем собственные свойства
			*/
			
			extend(subject, this._properties);
			/*
			Выполняем конструкторы
			*/
			for (var i=0;i<this._constructors.length;i++) {
				this._constructors[i].apply(subject, args);
			}
			return this;
		}
	}
});