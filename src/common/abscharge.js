define(['./inherit.js', './clone.js'], function(inherit, clone) {
	/*
	Фабрика инициализации методов
	*/
	var definePropertiesFabric = function(props) {
		return function() {
			for (var prop in props) {
				if (props.hasOwnProperty(prop)) {
					this[prop] = clone(props[prop]);
				}
			}
		}
	}

	/*
	Функция расширяет subject через специальный абстрактный класс. Класс должен содержать свойства [object proto],[function construct]
	и [object properties].
	Суть функции заключается в том, что бы расширить прототип (через inherit) функциями из proto, создать новые свойства (которые будут 
	уникальны для данного объекта) из properties и применить конструктор из construct. По существу properties можно оставить пустым, т.к.
	все необходимые свойства можно создать через construct.

	В случае если subject - функция, происходит создание фабрики объекта, расширенного абстрактынм классом. Т.е. те же самые действия, которые
	происходит при расширении объекта как бы откладываются на потом, когда функция будет использована как конструктор нового объекта.

	Аргументы:
	subject : объект или функция
	absClass : класс abstrctClass
	patchFunctionObject : при значении true, методы и свойства класса, а так же конструктор будет применен к объекту функции, а не к её прототипу.
	*/
	return function(subject, absClass, patchFunctionObject) {

		if ("function"===typeof subject) {

			if (patchFunctionObject) {
				resubject = subject;
			} else {
				var initials = [],
				// Create new Function object
				resubject = function() { for (var i=0;i<initials.length;i++) { initials[i].apply(this, arguments); } },
				subjectPrototype={},
				subjectProperties={};

				// Dettach subject prototype
				if ("object"===typeof subject.prototype) {
					subjectPrototype=subject.prototype;
					subject.prototype={};
				}

				// Dettach subject properties
				for (prop in subject) {
					if (subject.hasOwnProperty(prop)) {
						subjectProperties[prop] = subject[prop];
						delete subject[prop];
					}
				}

				/*
				Re-prototype by self prototype
				*/
				resubject.prototype = subjectPrototype;
			}

			/*
			Append constructor from class
			*/
			if ("function"===typeof absClass.construct) {
				if (patchFunctionObject) absClass.construct.apply(resubject);
				else initials.push(new Object(absClass.construct));
			}

			/*
			Add class methods to prototype
			*/
			if ("object"===typeof absClass.proto) {
				if (patchFunctionObject) extend(resubject, absClass.proto);
				else inherit(resubject.prototype, absClass.proto);
			}

			/*
			Append constructor to initial unique properties
			*/
			if ("object"===typeof absClass.properties) {
				if (patchFunctionObject) extend(resubject, absClass.properties);
				else initials.push(definePropertiesFabric(absClass.properties));
			}

			if (!patchFunctionObject) {
				/*
				Append subject constructor
				*/
				initials.push(subject);

				/*
				Append Function properties
				*/
				for (var prop in subjectProperties) {
					if (subjectProperties.hasOwnProperty(prop)) {
						resubject[prop] = subjectProperties[prop];
					}
				}
			}

			return resubject;
		} else {
			/*
			Append constructor to initial unique properties
			*/

			if ("object"===typeof absClass.properties) {

				for (prop in absClass.properties) {
					if (absClass.properties.hasOwnProperty(prop)) {

						subject[prop] = clone(absClass.properties[prop]);

					}
				}
			}
			
			/*
			Add class methods to prototype
			*/
			if ("object"===typeof absClass.proto) {
				subject = inherit(subject, absClass.proto);
			}

			/*
			Append constructor from class
			*/
			if ("function"===typeof absClass.construct) {
				absClass.construct.apply(subject);
			}

			
			return subject;
		}
	}
});