
define(['./../core.js','./../../common/charge.js','./../../common/inherit.js','./../../common/extend.js'], function(core, charge, inherit, extend) {
	
	core.extend({
		/*
		Функция расширяет первый класс/объект вторым классом/объектом. В качестве аргументов может быть передана и строка,
		тогда поиск классов будет призводиться в core.classes.
		*/
		charge : function(className1, className2) {
			
			var aClass1,aClass2;

			/*
			Приводим все переменные к типу object || function
			*/
			if ("string"===typeof className1) {	aClass1 = core.class(className1); } else { aClass1 = className1; }
			if ("string"===typeof className2) {	aClass2 = core.class(className2); } else { aClass2 = className2; }
			/*
			Проводим валидацию на !undefined. Бросаем исключение.
			*/
			if ("undefined"===typeof aClass1) throw "Undefined class "+className1;
			if ("undefined"===typeof aClass2)  throw "Undefined class "+className2;
			/* Продотвращаем прокачку класса нативным классом */
			if ( !(typeof className2 === "string" && core.isNativeClass(className2)) ) {
				

				if ("function"===typeof aClass1 && "function"===typeof aClass2) {


					/*
					Класс расширяет класс. Используется метод inherit. Мы оставляем метку о том, что 
					этот класс уже был расширен.
					*/
					var inheritedBy = ("object"===typeof aClass1.prototype.inheritedBy) ? aClass1.prototype.inheritedBy : [];
					if (inheritedBy.indexOf(aClass2.className)<0) {

						inheritedBy.push(aClass2.className);
						aClass1 = inherit(aClass1, [aClass2]);
						aClass1.prototype.inheritedBy = inheritedBy;
					}
				} else if ("object"===typeof aClass1) {
					if ("function"===typeof aClass2) {
						/* Класс расширяет объект */
						aClass1 = charge(aClass1, aClass2);

					} else if ("object"===typeof aClass2) {
						/* Объект расширяет объект. Импользуется extend. */

						aClass1 = extend(aClass1, aClass2);
					}
				}
			}

			/* Перебираем классы абстрактно связанные с этим */

			if (typeof className2 === "string" && "object"===typeof core.classesAssignmentsMap[className2]) {
				for (var i = 0; i<core.classesAssignmentsMap[className2].length;++i) {
					aClass1 = core.charge(aClass1, core.classesAssignmentsMap[className2][i]);
				}
			}
			return aClass1;
		}
	})
});