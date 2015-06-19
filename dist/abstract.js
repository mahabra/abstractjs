;(function() {
var extend = (function () {
	/* Extend function (modified with pseudo Reference) */
	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		'use strict';

		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var has_own_constructor = hasOwn.call(obj, 'constructor');
		var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	return function extend() {
		'use strict';

		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];



					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							if (copy.constructor.name!=='Ref')
							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};
})();

var nativeClasses = (function () {
	return ['Function','Number','String','Array','Object','Boolean','Data'];
})();

var core = (function (extend, nativeClasses) {
	
	var Abstract = function(Subject, forceType){
		return Abstract.scope(Subject, forceType);
	};
	/*
	Функция расширения самого себя
	*/
	Abstract.extend = function(data) {

		extend(Abstract, data);
		
		return Abstract;
	}
	/*
	Классы
	*/
	Abstract.classes = {};
	/*
	Таблица присваиваний классов. По умолчанию заполнена системными классами с пустыми связями.
	*/
	
	Abstract.classesAssignmentsMap = {};
	for (var i = 0;i<nativeClasses.length;i++) {
		Abstract.classesAssignmentsMap[nativeClasses[i]] = [];
	}

	return Abstract;
})(extend,nativeClasses);

var mixin = (function () {
	
	var mixinup = function(a,b) { 
		for(var i in b) { 
			
			if (b.hasOwnProperty(i)) { 
	          
				a[i]=b[i]; 
			} 
		} 
		return a; 
	};

	/*
	Функция слияние двух объектов. Объекты копируются по ссылке, поэтому любые изменения в одном объекте,
	приведут к изменениям во втором.
	Использование:
	mixin(foo, bar1, bar2, bar3 .. barN);
	*/
	return function(a) { 
		var i=1; 
		for (;i<arguments.length;i++) { 
			if ("object"===typeof arguments[i]) {
				mixinup(a,arguments[i]); 
			} 
		} 
		return a;
	}
	
})();


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


var classCreator = (function (core, mixin) {

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
		abstractClass.embeddable=false;
		abstractClass.className = className;

		return abstractClass;
	}
})(core,mixin);

var inherit = (function (mixin) {
	
	/*
	Функция наследования одним классом другого. Расширяет прототип и конструктор. 
	Не требует ручного вызова конструктора родительских классов.
	*/
	return function(aClass, classes) {
		
		var cl=classes.length,
		superconstructor = function(){
			for (var i=0;i<cl;++i) {
				/*
				Мы должны помнить какие конструкторы уже были выполнены для этого объект.
				Поэтому всю историю конструкторов необходимо хранить в прототипе,
				во избежании повторного его вызова. Так как мы можем наследовать классы,
				которые происходят от одного предка. В это случае конструктор предка будет
				вызван несколько раз, чего не требуется.
				*/
				if (this.__proto__.constructors.indexOf(classes[i])>=0) continue;
				this.__proto__.constructors.push(classes[i]);

				classes[i].apply(this, arguments);
			}
		},
		superprototype = superconstructor.prototype = {};

		/*
		Первым делом мы должны позаботиться о том, что если у расширяемого класса уже есть __super__ прототип,
		он должен быть перенесен в новый superprototype.
		*/
		if (aClass.prototype&&aClass.prototype!==null&&aClass.prototype.__super__) mixin(superprototype, aClass.prototype.__super__);
		/*
		Мы должны миксировать данный суперпрототип с прототипами всех наследуемых классов,
		а так же с их суперпрототипами. Так как в их прототипе содержатся собственные методы класса,
		а в __super__ миксины тех классов, которые они, возможно наследовали.
		*/
		for (var i=0;i<cl;++i) {
			if (classes[i].prototype) {
				if (classes[i].prototype.__super__) superprototype = mixin(superprototype, classes[i].prototype.__super__);
				superprototype = mixin(superprototype, classes[i].prototype);
			}
		}

		/*
		Мы связывает суперпрототип с суперконструктором.
		*/
		superprototype.constructor = superconstructor;

		/*
		Польскольку мы не можем взять и подменить тело функции у существующей функции,
		нам придется подменить орегинальную функцию на собственную. 
		*/
		var Mixin = function() {
			/*
			Если в прототипе класса вдруг возникла переменная __disableContructor__, значит кто то 
			не хочет, что бы при создании экземпляра класса происходил вызов конструкторов.
			Это может применять в методе construct абстрактного прототипа Function, для вызова
			контруктора через функцию Apply.
			*/
			if (superconstructor.__proto__.__disableContructor__) { 
				superconstructor.__proto__.__disableContructor__ = false;
				return false;
			}
			if (this!==window) {
				superconstructor.apply(this, arguments)
			}

			aClass.apply(this, arguments);
		}
		Mixin.prototype = Object.create(superprototype,{
			/*
			Поскольку в процессе построения экземпляра будут выполняться функции конструкторы всех наследуемых
			классов, нам необходимо запоминать тех, которые уже были вызваны, во избежании повторного вызова.
			*/
			constructors: {
				configurable: false,
				enumerable: false,
				writable: false,
				value: []
			},
			/*
			Для быстрого кроссбраузерного доступа к суперпроототипу будет использоваться свойство __super__
			*/
			__super__: {
				configurable: false,
				enumerable: false,
				writable: false,
				value: superprototype
			}
		});
		/*
		Все свойства и методы из старого прототипа мы переносим в новый. Нам необходимо сделать так,
		что бы новый класс ничем не отличался от старого, кроме нового суперпрототипа.
		*/
		if (aClass.prototype) mixin(Mixin.prototype, aClass.prototype);
		/*
		Кроме того, все статичные свойства так же должны быть скопированы
		*/
		for (var prop in aClass) {
			if (aClass.hasOwnProperty(prop)) Mixin[prop] = aClass[prop];
		}
		Object.defineProperty(Mixin.prototype, "constructor", {
			configurable: false,
			enumerable: false,
			writable: false,
			value: Mixin
		});
		/*
		Если браузер не поддерживает __proto__, то мы создадим его, хотя он будет
		являться нечто иным, чем оригинальный __proto__, так как __proto__.__proto__
		не вернет прототип прототипа. 
		*/
		if (!Mixin.prototype.__proto__) Mixin.prototype.__proto__ = Mixin.prototype;

		return Mixin;
	}
})(mixin);

var charge = (function (extend, mixin) {
	/* Расширяет объект классом */
	return function(target, exhibitor) {
		/*
		Создаем единый слой свойств из прототипов класса
		*/
		var overprototype = {};
		if ("object"===typeof exhibitor.prototype.__super__) {
			mixin(overprototype, exhibitor.prototype.__super__);
		}
		mixin(overprototype, exhibitor.prototype);
		
		/*
		Если мы имеем доступ к __proto__ то расширяем прототип, если нет - то придется расширять сам объек
		*/
		if ("object"===typeof target.__proto__) {
			/*
			Производим слияние прототипа цели с прототипом экспонента
			*/
			mixin(target.__proto__, overprototype);
		} else {
			extend(target, overprototype);
		}

		/*
		Воспроизводим конструкторы
		*/
		exhibitor.apply(target);
		
		return target;
	}

})(extend,mixin);

var firstToUpper = (function () {
	return function(text) {
		return text.charAt(0).toUpperCase()+text.substr(1);
	}
})();

var htmlTags = (function () {
	return [
		'HTML',
		'DOCUMENT',
		'BODY',
		'A',
		'ABBR',
		'ACRONYM',
		'ADDRESS',
		'APPLET',
		'AREA',
		'BASE',
		'BASEFONT',
		'BIG',
		'BLINK',
		'BLOCKQUOTE',
		'BODY',
		'BR',
		'B',
		'BUTTON',
		'CAPTION',
		'CENTER',
		'CITE',
		'CODE',
		'COL',
		'DFN',
		'DIR',
		'DIV',
		'DL',
		'DT',
		'DD',
		'EM',
		'FONT',
		'FORM',
		'H1',
		'H2',
		'H3',
		'H4',
		'H5',
		'H6',
		'HEAD',
		'HR',
		'HTML',
		'IMG',
		'INPUT',
		'ISINDEX',
		'I',
		'KBD',
		'LINK',
		'LI',
		'MAP',
		'MARQUEE',
		'MENU',
		'META',
		'OL',
		'OPTION',
		'PARAM',
		'PRE',
		'P',
		'Q',
		'SAMP',
		'SCRIPT',
		'SELECT',
		'SMALL',
		'SPAN',
		'STRIKEOUT',
		'STRONG',
		'STYLE',
		'SUB',
		'SUP',
		'TABLE',
		'TD',
		'TEXTAREA',
		'TH',
		'TBODY',
		'THEAD',
		'TFOOT',
		'TITLE',
		'TR',
		'TT',
		'UL',
		'U',
		'VAR'
	];
})();

var moduleCreator = (function (core, mixin, extend) {

	return function(moduleName, constructor) {

		var abstractClass = $(constructor||function() {}).inherit(core.class('Widget'));
		abstractClass.properties = {};
		var constructProperties = function() {
			if (this!==window&&"object"===typeof this.constructor.properties) {
				var constr = this;
				core(this.constructor.properties).each(function(value, key) {
					constr[key] = extend(value);
				});
			}
		}
		abstractClass = abstractClass.inherit(constructProperties);
		
		window.abstractClass = abstractClass;
		
		/*
		Расширить этот класс другим классом
		*/
		abstractClass.charge = function(aClass) {
			return core.charge(abstractClass, aClass);
		}
		/*
		Расширение самого себя. Не смотря на название функции в действительности объекты миксуются.
		*/
		abstractClass.extend = function(data) {
			var methods=[],properties=[];
			
			$(data).each(function(value, key) {
				if ("function"===typeof value) methods[key]=value;
				else properties[key]=value;
			});
			abstractClass.prototype = mixin(abstractClass.prototype||{},methods);
			extend(abstractClass.properties, properties);

			return abstractClass;
		}

		/*
		Собственное имя класса
		*/
		abstractClass.moduleName = moduleName;

		return abstractClass;
	}
})(core,mixin,extend);

var theme = (function () {
	return {
		textColor: '#8e0054'
	}
})();


	core.extend({
		/*
		Функция заносит все расширения в прототипы родных объектов Javascript.
		Тем самым загрязняя прототипы объектов, но делая доступных использование расширенных функций
		без использования функции обертки.
		*/
		globalize : function() {
			for (var i=0;i<nativeClasses.length;++i) {
				if ("object"===typeof Abstract.prototypes[nativeClasses[i]]) {
					(function(protos, className) {
						eval('var essence = '+className+';');
						mixin(essence.prototype, protos);
					})(Abstract.prototypes[nativeClasses[i]], nativeClasses[i]);
				}
			}
		}
	});

	/*
	Другое название функции globalize
	*/
	core.extend({
		apocalypse: core.globalize
	})


;(function (core, charge, inherit, extend) {
	
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
})(core,charge,inherit,extend);

;(function (core, firstToUpper, htmlTags) {
	
	var determineAbstractClass = {
		"object": {
			"Null": function(res) {
				if (res===null)  return true; return false;
			},
			// Detect Array
			"Array": function(res) {
				if (res instanceof Array) return true; return false;
			},
			"Window": function(res) {
				return res===window;
			},
			"Abstract": function(res) {
				return ("undefined"!==typeof res.__abstractClass__);
			},
			// Detect HTMLElement
			"HTMLElement": function(res) {
				if (res.toString().substr(0,12)==="[object HTML") return true; return false;
			},
			// Detect date object
			"Date": function(res) {
				if (res instanceof Date) return true; return false;
			},
			// Detect Rich object
			"RichArray": function(res) {
				if (!(res instanceof Array) && res.hasOwnProperty('length') && "number"===typeof res.length) return true; return false;
			}
		},
		"string": {
			// Detect selector
			"Selector": function(res) {

				var tsp = res.split(/[> ]+/),found=false;
				for (var i = 0;i<tsp.length;i++) {
					(function(piece) {
						if (htmlTags.indexOf(piece.toUpperCase())>=0) { found=true; return true; }
						if (/^[>#\.[]]{0,2}[^'", ]+[a-zA-Z0-9\-\[]+/.test(piece)) { console.log('macthed', res); found=true; return true }
					})(tsp[i]);
				}
				return found;
			},
			// Json
			"Json": function(res) {
				if (/^[\{]{1}[\s\S]*[\}]{1}$/gi.test(res)) return true; return false;
			}
		}
	} 

	
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/

	core.extend({
		determineAbstractClass: function(subject) {
			var variants = [];
			var resourceType = typeof (subject),
			abstractClass = firstToUpper(resourceType);
			variants.push(abstractClass);
			if (determineAbstractClass[resourceType]) {

				for (var s in determineAbstractClass[resourceType]) {

					if (determineAbstractClass[resourceType].hasOwnProperty(s)) {

						if (determineAbstractClass[resourceType][s](subject)) {
							variants.push(firstToUpper(s));
						}
					}
				}
			}

			return variants;
		}
	});
})(core,firstToUpper,htmlTags);


	/*
	Возвращает true, если класс является нативным
	*/
	core.extend({
		isNativeClass: function(className) {
			return nativeClasses.indexOf(className)>=0;
		}
	});



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



	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		registerModule: function(moduleName, constructor) {
			var fullClassName = 'module'+core(moduleName).firstUpper();
			/*
			Создаем новый класс
			*/
			core.classes[fullClassName] = moduleCreator(moduleName, constructor||false);
			
			return core.classes[fullClassName];
		}

	});



	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		class: function(className) {
			/*
			Получаем класс
			*/
			if ("function"===typeof core.classes[className]) {
				return core.classes[className];
			} else {
				return null;
			}
		},
		classExists: function(className) {
			if ("function"===typeof core.classes[className]) {
				return true;
			} else {
				return false;
			}
		},
		module: function(moduleName) {
			var realModuleName = 'module'+core(moduleName).firstUpper();
			if ("function"===typeof core.classes[realModuleName]) {
				return core.classes[realModuleName];
			} else {
				return null;
			}
		},
		moduleExists: function(moduleName) {
			var realModuleName = 'module'+core(moduleName).firstUpper();
			if ("function"===typeof core.classes[realModuleName]) {
				return true;
			} else {
				return false;
			}
		}

	});



	var supports = function(test) {
		if (core.supports[test] && "function"===typeof core.supports[test]) core.supports[test] = core.supports[test]();
		if (core.supports[test]) return core.supports[test]; else return false;
	}
	supports.extend = function(data) {
		mixin(this, data);
		return this;
	}
	core.extend({
		supports: supports
	});



	
	core.extend({
		warn: function() {
			var args = Array.prototype.slice.call(arguments, 1);
			args.unshift('color:'+theme.textColor+';font-weight:bold');
			args.unshift('%c'+arguments[0]);
			console.log.apply(console, args);
			return this;
		}
	});



	var Register;
	Register = function(path, value) {
		var p = path.split(':'),current=Register;
		for (var i = 0; i<p.length-1;++p) {
			if (!("function"===typeof current || "object"===typeof current)) {
				throw "Cant get property of non-object register element `"+path+"`";
			} else {
				if ("object"!==typeof current[p]) {
					current[p] = {};
				}
			}
		}
		if ("undefined"!==typeof value) {
			current[p+1] = value;
			return this;
		} else {
			return current[p+1];
		}
	}
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		register: Register
	});



	
	core.extend({
		eventListners: {},
		bind: function(events, callback, once) {
			if (typeof this.eventListners[events] != 'object') this.eventListners[events] = [];
			
			this.eventListners[events].push({
				callback: callback,
				once: once
			});
			return this;
		},
		trigger: function() {
			if (typeof arguments[0] == 'integer') {
				var uin = arguments[0];
				var e = arguments[1];
				var args = (arguments.length>2) ? arguments[2] : [];
			} else {
				var uin = false;
				var e = arguments[0];
				var args = (arguments.length>1) ? arguments[1] : [];
			};
			
			var response = false;

			if (typeof this.eventListners[e] == 'object' && this.eventListners[e].length>0) {
				var todelete = [];
				for (var i = 0; i<this.eventListners[e].length; i++) {
					if (typeof this.eventListners[e][i] === 'object') {
						if (typeof this.eventListners[e][i].callback === "function") response = this.eventListners[e][i].callback.apply(this, args);
						
						if (this.eventListners[e][i].once) {

							todelete.push(i);
						};
					};
				};
				
				if (todelete.length>0) for (var i in todelete) {
					this.eventListners[e].splice(todelete[i], 1);
				};
			};
			return response;
		}
	});



	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		module: function(className) {
			var constructor=null,proto=null;
			if (arguments.length>1) {
				(typeof arguments[1]==="function") && (constructor=arguments[1], ("object"===typeof arguments[2] && (proto=arguments[2])));
				(typeof arguments[1]==="object") && (proto=arguments[1], ("function"===typeof arguments[2] && (constructor=arguments[2])));
			}

			var realModuleName = 'module'+core(className).firstUpper();
			
			if (!core.moduleExists(className)) {
				core.registerModule(className, constructor||function() {});

			};
			var widget = core.classes[realModuleName];
			
			//if (proto!==null) core.classes[realModuleName]  = widget.proto(proto);
			/*
			Сохраняем виджет
			*/
			
			return widget;
		}

	});


;(function (core, nativeClasses) {
	/*
	Возвращает true, если класс является нативным
	*/
	core.extend({
		/* Функция снабжает любой объект геттером $, который позволяет получить абстракцию этого объекта */
		$frendly: function(object) {
			var tar;
			
			if ("object"===typeof object || "function"===typeof object) {
				if (object.__proto__) {
					tar = object.__proto__;
				} else {
					tar = object;
				}
				if ("undefined"===typeof tar.$) Object.defineProperty(tar, '$', {
					enumerable: false,
					configurable: false,
					get: function() {
						
						return core.scope(this);
					}
				})
			} else {
				core.warn('Non-object can`t be abstract frendly');
			}
			return object;
		}
	});
})(core);


	/* 
@ Vendor 1.3
@ author: Vladimir Morulus
@ license: MIT 
*/
(function(_w) {
	'use strict';
	var httpmin_expr = /^([a-z]*):\/\/([^\?]*)$/i;
	var normalize = function(url) {
		var protocol,domain;
		url=url.split('\\').join('/');
		if (httpmin_expr.test(url)) {
			var protdom = httpmin_expr.exec(url);
			protocol=protdom[1];
			domain=protdom[2];
		} else {
			protocol='http://';
			domain=url;
		}

		var urlp = domain.split('/');
		
		var res = [];
		for (var i = 0;i<urlp.length;++i) {
			if (urlp[i]==='') continue;
			if (urlp[i]==='.') continue;
			if (urlp[i]==='..') { res.pop(); continue; }
			res.push(urlp[i]);
		}

		return protocol+'://'+res.join('/');
	};

	// Несколько приватных данных
	var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
	var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
	var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
	var is_safari = navigator.userAgent.indexOf("Safari") > -1;
	var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
	if ((is_chrome)&&(is_safari)) {is_safari=false;}

	// Fix for IE
	if ("undefined"==typeof Array.prototype.indexOf)
	Array.prototype.indexOf = function(obj, start) {
	     for (var i = (start || 0), j = this.length; i < j; i++) {
	         if (this[i] === obj) { return i; }
	     }
	     return -1;
	}
	if (!_w.location.origin) {
	  _w.location.origin = _w.location.protocol + "//" + _w.location.hostname + (_w.location.port ? ':' + _w.location.port: '');
	}
	
	_w.vendor = function(userresources, callback) {
		
		if ("object"===typeof this && this.constructor==Object) {
			var config = this; 

		} else var config = {};
		
		var progressor = new (function(userresources, callback, config) {

			this.config = {
				ownerLocation: false,
				ownerScriptName: 'root'
			};

			for (var i in config) {
				if (config.hasOwnProperty(i)) this.config[i] = config[i];
			}

			this.userresources = userresources;
			this.callback = callback;
			this.loadings = 0;
			this.queue = [];
			this.execute = function() {
				if ("string"===typeof this.userresources) this.userresources = [userresources];
				this.max=this.loadings=this.userresources.length;
				for (var i = 0;i<this.userresources.length;i++) {

					this.determine(this.userresources[i]);
				}
			};
			this.loaded = function(module) {
				
				this.loadings--;
				this.progress = 1-(this.loadings/this.max);
				if (this.eachCallback) this.eachCallback.call(this, module);
				if (this.loadings===0) {

					if ("function"===typeof this.callback) this.callback.apply(window,this.queue);
				}
			}
			this.determine = function(path) {

				

				/* Проверяем наличие точки вначале пути, это будет сведетельствовать о том, что это относительный путь. В случае, если файл исполняется из другого модуля мы сможем загрузить файл по относительному пути */
				if (path.substring(0,2)==='./') {

					var rawpath = path;
					/* Проверяет преднастройки данного объекта, если относительный путь был взыван в define, то define должен был передать местоположение модуля, который вызвал define */
					
					if (this.config.ownerLocation) {
						var path = this.config.ownerLocation+rawpath.substring(2, rawpath.length);
					} 
						
				};

				var that = this;
				this.queue.push(null);

				var q = this.queue.length-1;
				var pure = (function(path) { var qp = path.lastIndexOf('?'); if (qp<0) qp = path.length; return path.substring(0,qp); })(path);



				// Js file
				if (pure.substr(pure.length-3, 3).toLowerCase()=='.js') {
					
					vendor.require(path, function(module) {
						that.queue[q] = module;
						that.loaded(module);
					});
					return;
				}
				// Css file
				if (pure.substr(pure.length-4, 4).toLowerCase()=='.css') {
					
					vendor.requirecss(path, function() {
						that.queue[q] = null;
						that.loaded(null);
					});
					return;
				}
				
				// bower.json file
				if (pure.substr(pure.length-10, 10).toLowerCase()=='bower.json') {
					
					vendor.bower(path, function(module) {
						that.queue[q] = module;
						that.loaded(module);
					});
					return;
				}
				// Json file
				if (pure.substr(pure.length-5, 5).toLowerCase()=='.json') {
					
					vendor.getJson(path, function(module) {
						that.queue[q] = module;
						that.loaded(module);
					});
					return;
				}
				// Bower
				if ('bower//'===pure.substr(0,7)) {
					
					vendor.bower(path.substring(5), function(module) {
						that.queue[q] = module;
						that.loaded(module);
					});
					return;
				}
				// Images
				if (vendor.constants.imagesRegExpr.test(path)) {
					
					vendor.images(path, function(module) {
						that.queue[q] = module;
						that.loaded(module);
					});
					return;
				}
				/* Проверяем наличие точки в имени файла. Если она есть, значит это не js файл. Скорей всего это файл неизестного типа данных и там нужно подключить его как текстовый файл */
				if (pure.lastIndexOf('.')>pure.lastIndexOf('/')) {
					vendor.load(path, function(module) {
						that.queue[q] = module;
						that.loaded(module);
					});
					return;
				}
				// Если ни один из форматов не подошел, тогда мы воспринимает запрос как alias
				vendor.require(path, function(module) {
					that.queue[q] = module;

					that.loaded(module);
				});
			};
			this.each = function(callback) {
				this.eachCallback = callback;
			};
			this.execute();
		})(userresources, callback, config);

		return progressor;
	};
	/* Готовит преднастройки перед вызовом vendor */
	_w.vendor.optional = function(config) {
		var config = arguments[0];
		var args = Array.prototype.slice.call(arguments);

		args.shift();
		
		return vendor.apply(config,args);
	}
	_w.vendor.debug = function() {
		this._config.debugMode = true;

		return vendor.apply(this.config,arguments);
		return this;
	}
	_w.vendor.watch = function() {
		this._config.debugMode = true;
		this._config.watchMode = true;
		this._config.watchResource = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];

		var args = Array.prototype.slice.call(arguments, 1);

		return vendor.apply(this.config,args);
		return this;
	}
	_w.vendor.watchin = function(src) {
		if (this._config.watchMode==false) return true;
		if ("string"!==typeof src) return false;
		for (var i = 0;i<this._config.watchResource.length;++i) {
			if (src.indexOf(this._config.watchResource[i])>-1) return true;
		}
		return false;
	}
	_w.vendor.debuglog = function() {
		if (!this._config.debugMode||"function"!==typeof console.log) return false;
		var args = Array.prototype.slice.call(arguments, 1);
		args.unshift('color:green;font-weight:bold');
		args.unshift('%c'+arguments[0]+':');
		console.log.apply(console, args);
	}
	_w.vendor.debugGroup = function(name) {
		if (!this._config.debugMode||"function"!==typeof console.group) return false;
		console.group(name);
	}
	_w.vendor.debugGroupEnd = function(name) {
		if (!this._config.debugMode||"function"!==typeof console.groupEnd) return false;
		console.groupEnd(name);
	}
	_w.vendor.alert = function() {
		if (!this._config.debugMode||"function"!==typeof console.log) return false;
		var args = Array.prototype.slice.apply(arguments);
		args.unshift('color:red;font-weight:bold');
		args.unshift('%cImportant:');
		console.log.apply(console, args);
	}
	_w.vendor.constants = {
		imagesRegExpr: /\.[jpg|jpeg|gif|png|bmp]*$/i
	};
	_w.vendor.state = {
		interactive: false // Определяет иной способ обработки анонимный define функций через статус interactive
	}
	_w.vendor.isInteractiveMode = function(j) {
		return (j.attachEvent && !(j.attachEvent.toString && j.attachEvent.toString().indexOf('[native code') < 0) &&
	                   			 !(typeof opera !== 'undefined' && opera.toString() === '[object Opera]'));
	}
	_w.vendor.getInteractiveScript = function(execute, infoonly) {

		for (var i=0;i<vendor._freezed.length;i++) {
			
			if (vendor._freezed[i]!==null && vendor._freezed[i].node.readyState === 'interactive') {

				if (infoonly) {
					execute(vendor._freezed[i]);
				} else {
					// Устаналиваем last, т.к. далее последует инициализация
					_w.vendor.define._last = execute;
					// Интерактивный скрипт найден, разморашиваем инициализацию

					vendor._freezed[i].unfreeze();
				}
				return true;
			}
		}
		return false;
	}
	// Events support
	_w.vendor.eventListners = {};
	_w.vendor.bind = function(e, callback, once) {
			var once = once;
			if (typeof this.eventListners[e] != 'object') this.eventListners[e] = [];
			this.eventListners[e].push({
				callback: callback,
				once: once
			});
			return this;
	};
	_w.vendor.trigger = function() {
			
			
			if (typeof arguments[0] == 'integer') {
				var uin = arguments[0];
				var e = arguments[1];
				var args = (arguments.length>2) ? arguments[2] : [];
			} else {
				var uin = false;
				var e = arguments[0];
				var args = (arguments.length>1) ? arguments[1] : [];
			};
			
			var response = false;

			if (typeof this.eventListners[e] == 'object' && this.eventListners[e].length>0) {
				var todelete = [];
				for (var i = 0; i<this.eventListners[e].length; i++) {
					if (typeof this.eventListners[e][i] == 'object') {
						if (typeof this.eventListners[e][i].callback == "function") response = this.eventListners[e][i].callback.apply(this, args);
						if (this.eventListners[e][i].once) {
							todelete.push(i);
						};
					};
				};
				
				if (todelete.length>0) for (var i in todelete) {
					this.eventListners[e].splice(todelete[i], 1);
				};
			};
			return response;
	};
	// Require Javascript file
	_w.vendor.require = function(c, b, phantom) {

		var phantom = phantom || false;
		var a = new function(e, d) {
			
			if (typeof e == "string") {
				e = [e]
			}
			this.loads = e.length;
			this.src = e;
			this.stop = false;
			this.callback = d || false;
			this.fabrics = [];
			this.init = function() {
				
				var h = this;
				/* Перебираем каждый адрес */

				for (var i = 0; i < this.src.length; i++) {

					var g = this.src[i];

					// [upload_module] >>
					/* 
						Это фунционал вынесен в отдельну функция для поддержка относительного позиционаирования подключаемого модуля 
						Этой функции должен быть передан путь к файлу
					*/
					var upload_module = function(f) {
						var f = f;
						/* Добавляем расширение .js если оно отсутствует */
						var k = f.substr(f.length - 3, 3) != ".js" ? f + ".js" : f;
						/* Нормализуем url */
						var normalsrc = normalize((!/^http/.test(k) ? _w.vendor._config.baseUrl : "") + k + (function(l) {
							if (l != "") {
								return "?" + l
							}
							return ""
						})(_w.vendor._config.urlArgs));

						if (vendor.watchin(normalsrc)) vendor.debuglog('Require', normalsrc);

						/* Преопределяем fabric для данного ресурс. Это нужно для того, что бы ... */
						h.fabrics.push(normalsrc);

						/* Если данный адрес уже был загружен, то пропускаем этам загрузки и сразу сообщаем, что компонент загружен */
						try {

							if (_w.vendor._defined.indexOf(normalsrc) > -1) {

								h.loaded(normalsrc);
								return false;
							} else {

							}
						} catch(e) {
							/* IE 8 */
							
						}

						/* --- Continue: элемент был найден в списках загруженных элементов */
						/* ---------------------------------------------------------------- */
						

						/* Проверяем надичие элемента в списке vendor.define.modules. Ведь запрашиваемвый элемент мог быть просто предопределен через vendor.define. */
						
						if ('undefined' !== typeof _w.vendor.define._modules[normalsrc]) {
							if (vendor.watchin(normalsrc)) vendor.debuglog("Download interrupted, the module already exists", normalsrc);
							h.loaded(normalsrc);
							return false;
						}
						
						/* --- Continue: элемент был найден в списках vendor.define. 				*/
						/* ---------------------------------------------------------------- */
						

						/* Поскольку один и тот же ресурс может быть запрошен в разных ветках, мы должны его проверить на присутствие в специальных списках vendor._detained, куда мы определяем элементы, которые на данный момент уже проходят загрузку */
						
						if (vendor._detained.indexOf(normalsrc)>-1) {
							if (vendor.watchin(normalsrc)) vendor.debuglog('Download canceled because it is already in progress', normalsrc);
							/* Если ресурс уже подгружается в параллельных ветках, то мы начинаем слушать завершения его подгрузки*/
							vendor._onRedetain(normalsrc, function() {
								/* Если ресурс не попал в define списки, т.е. он не поддерживает архитектуру AMD, тогда мы его просто закидываем в список загруженных модулей.
								Здесь g - это пользовательское имя ресурса, f - это полное имя ресурса, в том виде в каком он присутствует в _config.paths, k  - это реальный путь до файла */
								if ("undefined" == typeof _w.vendor.define._modules[normalsrc])
								if (_w.vendor._defined.indexOf(normalsrc)<0) _w.vendor._defined.push(normalsrc);
								/* Учитывая, что загрузка свершилась, мы вызываем loaded() */	
								h.loaded(normalsrc)
							});
							return false;
						} else {

							/* Если ресурс запрошен впервые, мы его определяем в список detained, что бы параллельные ветки загрузок могли знать, что ресурс уже загружается */
							vendor._detained.push(normalsrc); 

							/* Согласно вопросу совместимости с синхронными загрузками, нам нужно произвести тест на подгрузку данного ресурса нативно. Нативная подгрузка лишает нас возможности использовать AMD интерфейс, но дает возможность работы с сайтами, на которых нативная подгрузка уже не отъемлена. 
							Мы тестируем страницу на присутствие тэга SCRIPT с подгружаемым адресом.
							Функция test требует аргумента - реальный путь до файла.
							Поскольку все асинхронные загрузки так или иначе попадают в detained, и так или иначе, не доходят до данной точки кода, если уже были асиенхронно подключены, конфликт с сгененрированными тэгами исключен. */
							var test = (function(scriptp) {
					            var exi = document.getElementsByTagName("SCRIPT");
					            for (var j in exi) {
					              // Search for src
					              if (typeof exi[j].attributes == "object") {
					                var srci = false;
					                for (var z=0;z<exi[j].attributes.length;z++) {
					                  if (exi[j].attributes[z].name.toLowerCase()=='src') {
					                    
					                    srci = z;
					                    break;
					                  };
					                }
					              }
					      
					              if (srci!==false && typeof exi[j].attributes == "object" && typeof exi[j].attributes[srci] == "object" && exi[j].attributes[srci] != null && exi[j].attributes[srci].value == scriptp) {
					                return exi[j];
					              }
					            }
					            return false;
					        })(k);
					        /* Передав в функцию k (полный адрес ресурса), мы получили значение его присутствие в нативных тэгах. */
					        if (test!==false) {
					         	/* Если test !=== false, значит он содержит ссылку на node нативного скрипта. 
					         	asynch нам нужен, что бы позже определить как мы будет проверять загружен ли скрипт.
					         	*/
								var asynch = false;
								/* В j мы помещаем ссылку на элемент SCRIPT.*/
									var j = test;
					        } else {
					          	/* Если нативного скрипта не существует, то мы можем создать его на лету. */
					            var asynch = true;
					            /* Создаем элемент SCRIPT без присвоения к документу, это вынужденное действие для работы с IE8 */
					            var j = document.createElement("SCRIPT");
					           
					            j.setAttribute("type", "text/javascript");
					            j.setAttribute("async", true);
					         };
					          	/* (!) Возможно depricated функция */
								var define = function(f) {
									
								};

								/* Итак мы дошли до данного кода, так как элемент загружается впервые или он загружен (загружается) нативно. Это значит, что нам нужно определить загружен ли он. */
								(function(s, j) {

					              /* Определяем функцию, которая так или иначе будет выполнена при загрузке ресурса */
					              var lse = function(interactive) {
					              	if (vendor.watchin(normalsrc)) vendor.debuglog('Loaded ', j.src);
					              	if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" || interactive) {
					              		
					              		vendor.trigger('moduleLoaded', [j]);
						              	/* Если внутри ресурса была определена функция define с зависимостями, значит помимо загрузки основного скрипта нам нужно ждать так же загрузки саб-ресурсов.
						              	Т.е. если происходит внутренний include, мы должны ждать его завершения. 
						              	Поэтому, нужно произвести тестирование */

						              	/* Создаем функцию, которая определяет 100% загрузку компонента */
						              	var ok = function(defi) {
						              		
						              		 /* Если ресурс не определен в vendor.define._modules, нам нужно проследить, были вызвана функция vendor.define. 
							                Фабрики фиксируются в переменной _last модуля vendor.define. Здесь мы выполняем данную функцию и получаем переменную, которую вернула fabric компонента. 
							                В типичном случае присвоение знаения vendor.define._modules происходит в самой функции define, однако программист может вызвать define без указания имени компонента, тогда фабрика будет присваиваться последнему вызванному ресурсу. */             
							                if ("undefined" == typeof _w.vendor.define._modules[normalsrc]) {
							                	
								                _w.vendor.define._modules[normalsrc] = {
								                  fabric: defi || null
								                };  
							            	};
						              		/* Если ресурс присутствует в списках _detained, мы должна сообщить глобально о том, что он загружен */

						                	if (vendor._detained.indexOf(normalsrc)>-1) vendor.releaseDetained(normalsrc);
						                	 /* Определяем ресурс как загруженный, более для него не будет производиться никаких действий при следующем вызове. */
							                if (_w.vendor._defined.indexOf(normalsrc)<0) 
							                {				                  
							                  	_w.vendor._defined.push(normalsrc);
							                };
							                /* Сообщаем ветке о том, что ресурс был загружен */

							                h.loaded(normalsrc)
						              	};


						              	/* проверяем last на наличие функции */
						              	if ("function"===typeof _w.vendor.define._last) {
						              		/* Если last - функция, мы должны выполнить её передав callback код завершения загрузки данного модуля */
						              		
						              		_w.vendor.define._last(ok, j);

						              		/* 
						              		! _w.vendor.define._last = false; 
						              		Данная процедура была удалена из-за совместимости с IE9. Необходимо провести тщательные тесты касательно
						              		данной функции.
						              		*/

						              	} else {

						              		ok();
						              	};
						              	/* Чистим память */
						              	j.onload = j.onreadystatechange = null;
						              	/* Удаляем скрипт */
						              	try {
							              	(function() {
							                  return document.documentElement || document.getElementsByTagName("HEAD")[0];
							                })().removeChild(j);
							            } catch(e) {
							            	if (typeof console=="object" && "function"==typeof console.log)
							            	if (_w.vendor.debugMode) console.log('vendor.js: script node is already removed by another script', j);
							            }
					               	 };
					              };


					              /* Определяем метод распознавания загрузки */				        
					              if (asynch) {
					              	/* Загрузка созданного на лету элемента SCRIPT 
									IE ведет себя очень плохо, он может выполнять скрипт не сразу после загрузки, что вызывает проблемы с анонимным define.
									Решение пришлось подсмотреть в requirejs. Использовать статус `interactive` readyStage.
					              	*/

					              	if (vendor.isInteractiveMode(j)) {

					        				vendor.state.interactive = true;
					       			 		/* Если модуль работает в режиме статуса интерактив, мы должны отложить его инициализацию до момента когда define из модуля будет вызван */
					       			 		

								 				/* Нам подходит только loaded или complete */
								 				
					   			 			var id = vendor._freezed.length;

					   			 			vendor._freezed.push({
					              				unfreeze: function() {
					              					
					              					vendor._freezed[id] = null; // Обнуляем сами себя
					              					lse(true); // Начинаем инициализацию
					              				},
					              				node: j
					              			});

					              			/*
												Если в модуле не присутствует define, что vendor может предполагать, мы должны призвести инициализацию принудительно
					              			*/
					              			setTimeout(function() {

					              			},50);
					              			// Подчищаем хвосты
					       			 		
					       			 		j.onload = j.onreadystatechange = function() {
					       			 			if (j.readyState==='loaded'||j.readyState==='complete') {

					       			 				lse();
					       			 			}
					       			 		}

					       			 } else {
					       			 		j.onload = j.onreadystatechange = lse;
					       			 };
					               
					              }
					              else {
						               /* Загрузка по событию onload документа, так как оследить загружен ли несинхронный скрипт мы не можем.
						               Скрипт подгрузки документа взят отсюда: https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
						                */
						                /*!
										 * contentloaded.js
										 *
										 * Author: Diego Perini (diego.perini at gmail.com)
										 * Summary: cross-browser wrapper for DOMContentLoaded
										 * Updated: 20101020
										 * License: MIT
										 * Version: 1.2
										 *
										 * URL:
										 * http://javascript.nwbox.com/ContentLoaded/
										 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
										 *
										 */
						                (function (win, fn) {
							                  var done = false, top = true,
							              
							                  doc = win.document, root = doc.documentElement,
							              
							                  add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
							                  rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
							                  pre = doc.addEventListener ? '' : 'on',
							              
							                  init = function(e) {
							                      if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
							                      (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
							                      if (!done && (done = true)) fn.call(win, e.type || e);
							                  },
							              
							                  poll = function() {
							                      try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
							                      init('poll');
							                  };
							              
							                  if (doc.readyState == 'complete') fn.call(win, 'lazy');
							                  else {
							                      if (doc.createEventObject && root.doScroll) {
							                          try { top = !win.frameElement; } catch(e) { }
							                          if (top) poll();
							                      }
							                      doc[add](pre + 'DOMContentLoaded', init, false);
							                      doc[add](pre + 'readystatechange', init, false);
							                      win[add](pre + 'load', init, false);
							                  }
							              
						            	})(window, lse);
					       			};
					        })(normalsrc, j); // normalsrc - пользовательское имя скрипта, j - ссылка на элемент SCRIPT
							
							/* Если мы дошли до этой части скрипта, значит мы создали асинхронный SCRIPT и теперь должны инициализировать загрузку ресурса */
						
					        if (asynch) {
					        	
					        	//vendor.debuglog('Async loading resouce', src);

								j.src = normalsrc;
								
								/* Лишь после присвоения src мы вставляем скрипт на страницу */
								
								(function() {
					              return document.documentElement || document.getElementsByTagName("HEAD")[0];
					            })().appendChild(j);
							};
						};
					};
					// < [upload_module]

					
					/* Устанавливаем реальный адрес исходя из предустановок _config.paths */
					var f = (typeof _w.vendor._config.paths[this.src[i]] == "string") ? _w.vendor._config.paths[this.src[i]] : this.src[i];
					
					upload_module(f);
					
					
					
				}
			};
			/* Функция сообщает о том, что модуль загружен */
			this.loaded = function(j, f) {

				if (this.stop) {
					return;
				}
				this.loads--;
				
				if (this.loads < 1) {

					if (typeof this.callback == "function") {

						var h = [];
						
						for (var g = 0; g < this.fabrics.length; g++) {
							
							if ("undefined" != typeof _w.vendor.define._modules[this.fabrics[g]]) {
								
								h.push(null != _w.vendor.define._modules[this.fabrics[g]] ? _w.vendor.define._modules[this.fabrics[g]].fabric : null)
							} else {
								
								h.push(null)
							}
						}
						this.callback.apply(window, h)
					}
					this.stop = true
				}
			};
			this.init()
		}(c, b || false)
	};
	_w.vendor.ext = _w.vendor.prototype = {
		selector: "",
		constructor: _w.vendor,
		init: function() {
			return _w.vendor.ext.constructor
		}
	};
	_w.selfLocationdefined = false; // Means we know our location
	_w.vendor.defineDataImport = false;
	_w.vendor._detained = [];
	_w.vendor._freezed = [];
	_w.vendor.queue = {

	};
	_w.vendor._onRedetain = function(d, f) {
		typeof _w.vendor.queue[d] != "object" && (_w.vendor.queue[d] = []);
		_w.vendor.queue[d].push(f);
	};
	_w.vendor.releaseDetained = function(d){
		
		var nd = [];
		for (var dt = 0;dt<_w.vendor._detained.length;dt++) {
			if (_w.vendor._detained[dt]!=d) nd.push(_w.vendor._detained[dt]);
		}
		_w.vendor._detained = nd;
		
		
		typeof _w.vendor.queue[d] == "object" && (function(d, q) {

			for (var i=0;i<q[d].length;i++) {
				
				q[d][i]();
			};
			delete q[d];
		})(d, _w.vendor.queue);


	};
	_w.vendor._defined = [];
	_w.vendor._config = {
		baseUrl: "",
		urlArgs: "",
		bowerComponentsUrl: _w.location.origin+"/bower_components/",
		noBowerrc: true, // Не читать файл .bowerrc в корне сайта
		paths: {},
		debugMode: false,
		watchMode: false,
		watchResource: []
	};

	_w.vendor.brahmaInside = true;
	_w.vendor.config = function(f) {
		
		var f = f || {};
		if (typeof f.paths == "object") {
			for (var b in f.paths) {
				_w.vendor._config.paths[b] = f.paths[b]
			}
			delete f.paths
		}
		for (var a in f) {
			_w.vendor._config[a] = f[a]
		}
	}
		
	_w.vendor.define = function(g, e, b) {
		
		// Если передана только фабрика
		if (arguments.length==1) {
			b=g; g=null; e=null;
		}

		// Если передано два аргумента
		else if (arguments.length==2) {
			// Переданы зависимости и фабрика
			("object"==typeof g) && (b=e,e=g,g=null);
			// Передано имя и фабрика
			("string"==typeof g) && (b=e,e=0);
		}
		// Переданы все аргументы
		else {
			"string" != typeof g && (b = e, e = g, g = null);
			!(e instanceof Array) && (b = e, e = 0);
		}

		// Формируем humanfrendly переменные
		var name = g || null;
		var depends = e || null;
		var fabric = b || null;

		if (vendor.watchin()) vendor.debuglog('Define', name, depends, fabric);

		// После того как include выполняет модуль переменная initialed принимает значение true
		// Если этого не происходит, то черещ 0,010 секунду выполнение модуля происходит автоматически
		// (см. #autoexecute)
		var initialed = false;

		// Функция генерирует фабрику
		var initial = function() {
			initialed = true;
			_w.vendor.define.synchCode = null;
			switch(typeof fabric) {
				case "function":
					var product = fabric.apply(window, arguments);
				break;
				default:
					var product = fabric;
				break;
			}

			// Здесь происходит присваивание фабрики

			if (name) {
				_w.vendor.define._modules[name] = {
					fabric: product
				}
			}

			return product;
		}

		// Генерируем код синхроного исполнения, который будет удален функцией include, в случае успешного присваивания модуля имени файла
		var synchCode = _w.vendor.define.synchCode = Math.random();

		// В случае отсутствия имени, мы предполагаем, что данная функция вызывана из подключаемого файла, поэтому её активацию необходимо передать в специальную функцию _last, которая будет выполнена объектом include, сразе загрузки файла

		if (depends instanceof Array && depends.length>0) {
			var rand = Math.random();
			// В случае если у данного модуля присутствуют зависимости, нам необходимо вначале загрузить их, а уже после производить активацию модуля
			var execute = function(callback, script) {
				
				_w.vendor.define._last = null;
				var src,scriptName;
				
				// Вычисляем url модуля
				if ("object"===typeof script) {
					(script.src.lastIndexOf('/')>-1) ? 
					(src = script.src.substring(0,script.src.lastIndexOf('/')+1),
					scriptName = script.src.substring(script.src.lastIndexOf('/')+1)) : 
					(src=script.src,scriptName=script.src);
				} else {
					scriptName = 'root';
					src = vendor._config.baseUrl;
				}
				
				if (vendor.watchin(scriptName)) vendor.debugGroup(scriptName+':');
				if (vendor.watchin(scriptName)) vendor.debuglog('Define', depends);
				vendor.optional({
					ownerLocation: src, // Директория в которой лежит файл, взывавший define
					ownerScriptName: scriptName
				}, depends, function() {
					if (vendor.watchin(scriptName)) vendor.debuglog('Complete ', arguments);
					if (vendor.watchin(scriptName)) vendor.debugGroupEnd(scriptName+':');

					// Передаем в callback продукт фабрики
					callback(initial.apply(window, arguments));
				});
			};

		} else {
			
			var execute = function(callback, script) {
				_w.vendor.define._last = null;
				callback(initial.apply(window, arguments));
			}

			// Дополнительный функционал для обеспечения использования define без асинхронной загрузке
			initial();
		}

		/* Если обработка define идет в режтме interactive мы не должны присваивать _last, а необходимо найти скрипт, который в состоянии interactive */
		if (vendor.state.interactive) {
			vendor.getInteractiveScript(execute);
		} else {
			_w.vendor.define._last = execute;
		}
		

		// #autoexecute
		// Защита от использования функции define в синхронных файлах
		// Мы должны выполнить модуль сами, если это не сделал функционал include, сразу после вызова define
		// Исключением является случай когда у нас отсутствуют зависимости и указано имя, в таком случае мы можем инициализировать модуль моментально
		if (depends===null && name!==null) {
			
			//execute(function(){});
		} else {
			/*
			Этот код не верно рабоатет когда вызвается файл, содержащий Define в зависимостями
			*/
			/*setTimeout(function() {
				if (!initialed) {
					console.log('Calling execure', 804);
					execute(function(){});
				}
			}, 10);*/
		};
	}


	_w.vendor.define._modules = {
		'module' : null,
		'exports' : null,
		'vendor' : vendor
	};
	_w.vendor.define._last = null;
	vendor.define.amd = {}


	_w.vendor.requirecss = function(b, f) {

		if (typeof b != "object") {
			b = [b]
		}
		for (var c = 0; c < b.length; c++) {
			var a = b[c].substr(b[c].length - 4, 4) != ".css" ? b[c] + ".css" : b[c];

			a = vendor.makeAbsFilePath(a);

			if (is_safari) {
				/* 
				Safari отказывается слушать событие onload link эелемента, поэтому мы его обманем
				Это решение от ZACH LEATHERMAN (http://www.zachleat.com/web/load-css-dynamically/)
				*/
				var id = 'dynamicCss' + (new Date).getTime();
				var s = document.createElement("STYLE");
				s.setAttribute("type","text/css");
				s.setAttribute("id",id);
				s.innerHTML = '@import url(' + a + ')';
				s = function() {
					return document.documentElement || document.getElementsByTagName("HEAD")[0]
				}().appendChild(s);
				var poll,poll = function() {
				    try {
				        var sheets = document.styleSheets;
				        for(var j=0, k=sheets.length; j<k; j++) {
				            if(sheets[j].ownerNode.id == id) {
				                sheets[j].cssRules;
				            }
				        }
				       
				        f();
				    } catch(e) {
				        window.setTimeout(poll, 50);
				    }
				};
				window.setTimeout(poll, 50);
			} else {
				var d = document.createElement("LINK");

				d.onload = function(e) { 
					
					f(e);
				};
				var d = function() {
					return document.documentElement || document.getElementsByTagName("HEAD")[0]
				}().appendChild(d);
				d.setAttribute("rel", "stylesheet");
				d.href = a
			}
		}
	}

	_w.vendor.getJson = function(path, callback) {

		var xobj = new XMLHttpRequest();
	    if (xobj.overrideMimeType) xobj.overrideMimeType("application/json");

		xobj.onreadystatechange = function (e) {
			
	          if (xobj.readyState === 4 && xobj.status == "200") {
	            
	            var actual_JSON = JSON.parse(xobj.responseText);

	            callback(actual_JSON);
	          }
	    };

	    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
	       
		xobj.send(null);
	}

	_w.vendor.load = function(path, callback) {

		var xobj = new XMLHttpRequest();
	    if (xobj.overrideMimeType) xobj.overrideMimeType("application/octet-stream");

		xobj.onreadystatechange = function (e) {
			
	          if (xobj.readyState === 4 && xobj.status == "200") {
	            
	            callback(xobj.responseText);
	          }
	    };

	    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
	       
		xobj.send(null);
	}

	/* 
	Функция преобраузет относительный путь в абсолютный, основываясь на знаниях местонахождения домашней директории vendor.
	! Путь, начинающийся с / всегда подставляется к домену сайта (_w.location.origin)
	! Если вначале пути не следует / то будет подставлено текущее глобальное значение _config.baseUrl или baseUrl, указанный во втором аргументе
	*/
	_w.vendor.makeAbsPath = function(path, baseUrl) {
		var absloc = (path.length>0) ? (path + (path.substr(-1, 1)==='/' ? '' : '/')) : path;
		(absloc.substr(0,4).toLowerCase()!='http') && ( (absloc.substring(0,1)==='/') ? (absloc = _w.location.origin+absloc) : (absloc = (baseUrl||_w.vendor._config.baseUrl)+absloc));
		return absloc;
	}

	/*
	Аналог makeAbsPath, только без указания / в конце
	*/
	_w.vendor.makeAbsFilePath = function(fn, baseUrl) {
		var filename = (function(path) { var qp = path.lastIndexOf('/'); if (qp<0) qp = -1; return path.substring(qp+1,path.length); })(fn);
		var path = fn.substring(0,fn.length-filename.length);
		var absloc = (path.length>0) ? (path + (path.substr(-1, 1)==='/' ? '' : '/')) : path;
		(absloc.substr(0,4).toLowerCase()!='http') && ( (absloc.substring(0,1)==='/') ? (absloc = _w.location.origin+absloc) : (absloc = (baseUrl||_w.vendor._config.baseUrl)+absloc));
		
		return absloc+filename;
	}

	_w.bower = _w.vendor.bower = function(r, callback) {
		if ("object"!==typeof r) r = [r];
		
		var run = function() {
			new (function(paths, callback) {

				this.paths = paths;
				this.bpackages = [];
				this.callback = callback;
				this.loadings = 0;

				this.execute = function() {
					
					for (var i = 0;i<this.paths.length;i++) {
						if ("string"!==typeof this.paths[i]) {
							// Throw error
							throw "vendor.js: The path to bower component is not a string"; 
							return false;
						};
						this.getBowerPackage(this.paths[i]);
					}
				}

				this.getBowerPackage = function(path) {
					var thisbower = this;
					this.bpackages.push({
						path: path,
						module: null
					});
					var bpackage = this.bpackages[this.bpackages.length-1];
					this.loadings++;
					/* Определяем тип запроса */
					
					if (path.substring(0,2)==='//')
					var absloc = vendor.makeAbsPath(path.substring(2), vendor._config.bowerComponentsUrl);
					else var absloc = vendor.makeAbsPath(path.substring(0,path.length-10));

					new (function(absloc,bowerMng,callback) {
						this.callback = callback;
						this.loadings = 0;
						this.absloc = absloc;
						this.mainModule = null;
						this.execute = function() {
							var that = this;			
							// Определяет директорию компонентов Bower
							this.componentsLocation = (function(loca) { for(var i=0;i<=1;i++) loca = loca.substring(0,loca.lastIndexOf('/')); return loca+'/'; })(this.absloc);		
							vendor.getJson(this.absloc+'bower.json', function(config) {
								
								if ("object"!==typeof config) {
									throw "vendor.js: bower.json not found"; 
									return false;
								}
								if ("undefined"===typeof config.main) {
									throw "vendor.js: bower.json has no main key"; 
									return false;
								}

								
								/* Функция продолжит загружать пакет при условии что остальные зависимости загружены */
								var cont = function() {
									if ("string"===typeof config.main) config.main = [config.main];
									var js=[],css=[];
									for (var i=0;i<config.main.length;i++) {
										// Js file
										
										var pure = (function(path) { var qp = path.lastIndexOf('?'); if (qp<0) qp = path.length; return path.substring(0,qp); })(config.main[i]);
										
										if (pure.substr(pure.length-3, 3).toLowerCase()=='.js') {

											js.push(absloc + config.main[i]);
										}
										// Css file
										if (pure.substr(pure.length-4, 4).toLowerCase()=='.css') {
											css.push(absloc + config.main[i]);
										}
									}

									if (js.length>0) {
										that.loadings++;
										
										vendor.require(js, function() {
											
											
											that.catchMainModule(arguments); // Подхватываем модуль, который вернем функции bower
											that.loaded();
											
										});
									}
									if (css.length>0) {

										that.loadings++;
										vendor.requirecss(css, function() {
											that.loaded();
										});
									}
								}

								/* Загружаем зависимости */
								var deps = [];
								if (config.dependencies) {
									for (var prop in config.dependencies) {
										if (config.dependencies.hasOwnProperty(prop)) {
											/* Формируем правильный адрес зависимостей */
											deps.push(that.componentsLocation+prop+'/bower.json');
										}
									}
								}
								if (deps.length>0) {
									vendor.bower(deps, cont);
								} else {
									cont();
								}
								
							});
						};
						this.loaded = function() {
							this.loadings--;
							if (this.loadings===0) {

								this.callback(this.mainModule);
							}
						};
						/* 
						Функция получает список полученных модулей, но выбирает только первый из них, который не является NUll или undefindd, как основной
						При полном завершеии загрузки Bower-компонента этот модуль будет возвращен в callback функцию
						*/
						this.catchMainModule = function(modules) {

							if (!modules instanceof Array) return false;
							for (var i=0;i<modules.length;i++) {
								if (modules[i]!==null && "undefined"!==typeof modules[i]) {

									this.mainModule = modules[i]; break;
								}
							}
						}

						this.execute();
					})(absloc, this, function(module) {
						bpackage.module = module;

						thisbower.loaded();
					});
				},
				this.loaded = function() {
					this.loadings--;
					if (this.loadings===0) {
						var callbackModules = [];
						for (var i = 0;i<this.bpackages.length;i++) {
							callbackModules.push(this.bpackages[i].module)
						}
						this.callback.apply(window, callbackModules);
					}
				}
				this.execute();
			})(r, callback || false);
		}

		/* Автоопределение расположения bower компонентов */
		if (!vendor._config.noBowerrc) {
			vendor.getJson(_w.location.origin+'/.bowerrc', function(data) {
				if ("object"===typeof data && "string"===typeof data.directory) {
					
					vendor._config.bowerComponentsUrl = vendor.makeAbsPath(data.directory, _w.location.origin+'/');
				}
				run.call(this);
			})
		} else {
			run.call(this);
		}
		
	}

	_w.vendor.images = function(imgs, callback) {
		var progressor = new (function(imgs, callback) {
			this.imgs = ("object"===typeof imgs) ? imgs : [imgs];

			this.callback = callback;
			this.images = [];
			this.loadings=0;
			this.eachCallback = false;
			this.progress = 0;
			this.execute = function() {

				for (var i=0;i<this.imgs.length;i++) {

					var absloc = vendor.makeAbsFilePath(this.imgs[i]);
					
					this.loadImage(absloc);
				}

				this.max = this.loadings;
			}
			this.loadImage = function(src, first) {
				this.loadings++;
				var that = this,				
				img = new Image();

				img.onload = img.onerror = function() {

					that.loaded(img);
				}
				this.images.push(img);
				img.src = src;
			};
			this.loaded = function(res) {
				this.loadings--;
				this.progress = 1-(this.loadings/this.max);
				if (this.eachCallback) this.eachCallback.call(this, res);
				if (this.loadings===0) this.done();
			};
			this.done = function() {
				if ("function"===typeof this.callback) this.callback.apply(window, this.images);
			};
			// Позволяет вместо единой функции callback указать callback для каждого загруженного ресурса
			this.each = function(callback) {
				this.eachCallback = callback;
			}
			this.execute();
		})(imgs, callback);
		return progressor;
	}

	/* Register global */
	_w.define = _w.vendor.define;
	_w.require = _w.vendor.require;

	/* Автоопределение положения vendor */
	if (typeof _w.vendor === "function" && typeof _w.vendor.brahmaInside === "boolean") {

		(function() {
			var g = document.getElementsByTagName("SCRIPT");
			var srci = false, bsk = false, bwk = false;
			for (var j in g) {
				
				if (typeof g[j].attributes == "object") {
					// Search for src					
					for (var z=0;z<g[j].attributes.length;z++) {
						if (g[j].attributes[z].name.toLowerCase()==='src') {
							
							if (z!==false && typeof g[j].attributes === "object" && typeof g[j].attributes[z] === "object" && g[j].attributes[z] != null && /vendor\.js/.test(g[j].attributes[z].value)) {
								
								srci = z;
								break;
							};
						};
					}
				}
				if (srci!==false) {
					
					// Search for baseUrl					
					for (var z=0;z<g[j].attributes.length;z++) {

						if (g[j].attributes[z].name.toLowerCase()==='baseurl') {

							bsk = z;
							break;
						};
					}
					// Search for bowerComponents					
					for (var z=0;z<g[j].attributes.length;z++) {
						if (g[j].attributes[z].name.toLowerCase()==='bower-components') {
							bwk = z;
							break;
						};
					}
					// Parse location
					var f = document.location.href;
					if (f.lastIndexOf('/')>7) f = f.substring(0, f.lastIndexOf('/'));
					
					if (f.substr(-1)=='/') f = f.substr(0,-1);

					if (bsk!==false) {
						
						var h = g[j].attributes[bsk].value;
						
						if (h.substr(0,1)==='/') {
							var match = f.match(/^(http?[s]?:\/\/[^\/]*)/);
							if (match!==null) f = match[1];
						}
						var baseUrl = (h.substr(0,5).toLowerCase()==='http:') ? h : (f + (h.substr(0,1)==='/' ? '' : '/') + h);
						
					}
					else {
						
						var i = g[j].attributes[srci].value.toLowerCase();
						var h = i.split("vendor.js");
						var baseUrl = (h[0].substr(0,5)=='http:') ? h[0] : (f + (h[0].substr(0,1)=='/' ? '' : '/') + h[0])+(h[0].substr(h[0].length-1, 1)==='/' ? '' : '');
							
					}
					if (baseUrl.substr(baseUrl.length-1, 1)!=='/') baseUrl=baseUrl+'/';
					
					_w.vendor.config({
						baseUrl: baseUrl,
						bowerComponentsUrl: ((bwk!==false) ? (function() {
						var h = g[j].attributes[bwk].value;
						return (h.substr(0,5).toLowerCase()==='http:') ? h : (f + (h.substr(0,1)=='/' ? '' : '/') + h)+(h.substr(h.length-1, 1)==='/' ? '' : '');
					})() : baseUrl+"bower_components/"),
						noBowerrc: g[j].getAttribute('no-bowerrc') ? true : false
					});
					// import
					vendor.selfLocationdefined = true;
					// Search for import
					if (g[j].getAttribute('data-import')) {
						vendor.defineDataImport = g[j].getAttribute('data-import');
						vendor.require(g[j].getAttribute('data-import'));
					}
					break;
				}				
			}
		})()
	};

	
})(window);
	core.extend({
		vendor : function() {
			vendor.apply(vendor, arguments);
			return;
		}
	});




var querySelector = (function () {
	/*
	IE не поддерживает scope: в querySelector, поэтому требуется альтернативное решение.
	Решение найдено здесь: https://github.com/lazd/scopedQuerySelectorShim
	*/

	(function() {
	  if (!HTMLElement.prototype.querySelectorAll) {
	    throw new Error('rootedQuerySelectorAll: This polyfill can only be used with browsers that support querySelectorAll');
	  }

	  // A temporary element to query against for elements not currently in the DOM
	  // We'll also use this element to test for :scope support
	  var container = document.createElement('div');

	  // Check if the browser supports :scope
	  try {
	    // Browser supports :scope, do nothing
	    container.querySelectorAll(':scope *');
	  }
	  catch (e) {
	    // Match usage of scope
	    var scopeRE = /^\s*:scope/gi;

	    // Overrides
	    function overrideNodeMethod(prototype, methodName) {
	      // Store the old method for use later
	      var oldMethod = prototype[methodName];

	      // Override the method
	      prototype[methodName] = function(query) {
	        var nodeList,
	            gaveId = false,
	            gaveContainer = false;

	        if (query.match(scopeRE)) {
	          // Remove :scope
	          query = query.replace(scopeRE, '');

	          if (!this.parentNode) {
	            // Add to temporary container
	            container.appendChild(this);
	            gaveContainer = true;
	          }

	          parentNode = this.parentNode;

	          if (!this.id) {
	            // Give temporary ID
	            this.id = 'rootedQuerySelector_id_'+(new Date()).getTime();
	            gaveId = true;
	          }

	          // Find elements against parent node
	          nodeList = oldMethod.call(parentNode, '#'+this.id+' '+query);

	          // Reset the ID
	          if (gaveId) {
	            this.id = '';
	          }

	          // Remove from temporary container
	          if (gaveContainer) {
	            container.removeChild(this);
	          }

	          return nodeList;
	        }
	        else {
	          // No immediate child selector used
	          return oldMethod.call(this, query);
	        }
	      };
	    }

	    // Browser doesn't support :scope, add polyfill
	    overrideNodeMethod(HTMLElement.prototype, 'querySelector');
	    overrideNodeMethod(HTMLElement.prototype, 'querySelectorAll');
	  }
	}());

	return function(query, root) {
		var prefix;
		(root) ? (prefix=':scope ') : (prefix=''); 
		var root = root||document;

		switch(typeof query) {
			case 'string':
				var queryExpr = /<([a-zA-Z0-9_]+) \/>/i,
				argsExpr = /\[([a-zA-Z0-9_\-]*)[ ]?=([ ]?[^\]]*)\]/i;

				if (query.indexOf('[')>-1 && argsExpr.exec(query)) {
					/*
					Значения в запросах по поиск аттрибутов необходимо возводить в ковычки
					*/
					var patch = true;
					query = query.replace(argsExpr, "[$1=\"$2\"]");
				} 

				if (queryExpr.exec(query) === null) {
					if (query.length===0) return new Array();
					
					// Нативный селектор
					try {
						return root.querySelectorAll(prefix+query);
					} catch(e) {
						throw 'querySelectorAll not support query: '+query;
					}
								
				} else {
					return [document.createElement(result[1].toUpperCase())];
				};
			break;
			case 'function':
				return [];
			break;
			case 'object':
				
				if (query instanceof Array) {
					
					return query;
				} if (query===null) {
					return [];
				} else {
					// test for window
					if (query==window) {
						return [query];
					}
					// test for jquery
					else if (query.jquery) {
						var elements = [];
						for (var j=0;j<query.length;j++) elements.push(query[j]);
						return elements;
					// test for self
					} else if (query.brahma) {
						var elements = [];
						for (var j=0;j<query.length;j++) elements.push(query[j]);
						return elements;				
					} else {
						
						return [query];
					};
				}
			break;
			case "undefined":
			default:
				return [query];
			break;
		};
	}
})();

var Dom = (function (core, mixin, querySelector, and) {
	/* Расширяем абстрактный класс Function */
	
	var Dom = core.registerClass('Dom', function() {
		
		this.selector=this.__subject__;
		/*
		Delete subject we dont need it anymore
		*/
		//this.__subject__ = false;

		/*
		Perform query
		*/

		var elements = querySelector.call(this, this.selector);
		/*
		Safari ведет себя очень странно, querySelectorAll возвращает функцию со свойствами, вместо массива, поэтому нам необходимо тестировать и на тип "function".
		*/
		if ( ("object"===typeof elements || "function"===typeof elements) && elements.length) {
			for (index=0;index<elements.length;index++) {
				this[index] = elements[index];
			}
		}

		/*
		Контекст по умолчанию
		*/
		this.length = elements.length;
		this.context = document;
		this.brahma = true;

		return this;
	});
	Dom.prototype = {
		
	}
	// And
	mixin(Dom.prototype, and);
	Object.defineProperty(Dom, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Dom
	});
	Dom.assignTo('Selector');
	Dom.assignTo('HTMLElement');

	return Dom;
})(core,mixin,querySelector,null);

var warns = (function () {
	return {
		"b_selector_uncom_format": "Incompatible format of query selector",
		"not_valid_nodename": "Not valid node name",
		"undefined_absclass": "Undefined class",
		"undefined_factory": "Undefined factory"
	}
})();

var toArray = (function () {
	return function(ob) {
		return Array.prototype.slice.call(ob);
	}
})();

var createChild = (function (core,warns) {

	return function(nodeName, data, prepend) {
		var context = (this===window) ? document.body : this;
		data = data||{};
		try {
			var newElement = document.createElement(nodeName);
		} catch(e) {
			core.warn(warns['not_valid_nodename']+' '+nodeName);
			return null;
		}

		;(!(prepend||false))?context.appendChild(newElement):(function() {
			
			if (context.firstChild!==null)
			context.insertBefore(newElement, context.firstChild);
			else context.appendChild(context);
		})();

		for (var name in data) {
			if (data.hasOwnProperty(name)) {
				newElement.setAttribute(name, data[name]);
			}
		}

		return core([newElement],'HTMLElement');
	}

})(core,warns);

var determineNodeObject = (function (core, warns, createChild, toArray) {
	return function(subject, data) {
		var objects = [],
		absClass=core.determineAbstractClass(subject);
		switch(absClass[0]) {
			case "HTMLELement":
				/* Force HTML Elements */
				objects = [subject];
			break;
			case "Selector":
			case "String":
				/* Create element */
				objects = createChild(subject, data||{});
			break;
			case "Brahma":
			case "jQuery":
			case "Array":
			case 'RichArray':
				objects = toArray(subject);
			break;
			default:
				core.warn(warns['b_selector_uncom_format']+' '+absClass[0]);
			break;
		};

		return objects;
	}
})(core,warns,createChild,toArray);

var addEvent = (function () {
	return function(elem, type, userEventHandler, once) {
		var eventHandler;

		eventHandler = function(e) {
			if (once) {
				if ( elem.addEventListener ) {
					elem.removeEventListener(type, eventHandler, false);
				}  else if ( elem.attachEvent ) {
					 element.detachEvent("on" + type, eventHandler);
				} else {
					elem["on"+type] = null;
				};
			};

			// Prevent default event handler if user returns false
			if ((function(r) { return (typeof r==="boolean" && r===false) })(userEventHandler.apply(this, arguments))) {

				e.preventDefault();
			};
		};
	    if (elem == null || typeof(elem) == 'undefined') return;
	    if ( elem.addEventListener ) {

	        elem.addEventListener( type, eventHandler, false );
	    } else if ( elem.attachEvent ) {
	        elem.attachEvent( "on" + type, eventHandler );
	    } else {
	        elem["on"+type]=eventHandler;
	    }
	}
})();

var removeEvent = (function () {
	return function(elem, type, userEventHandler) {
		if ( elem.addEventListener ) {
			elem.removeEventListener(type, userEventHandler||false, false);
		}  else if ( elem.attachEvent ) {
			 element.detachEvent("on" + type, userEventHandler);
		} else {
			elem["on"+type] = null;
		};
	};
})();


	/* Расширяем абстрактный класс Function */
	
	var Strings = core.registerClass('Strings', function() {
		
	});
	Strings.prototype = {
		/*
		Преобразует стиль строки dashes в camel
		*/
		camelize: function() {
			return (this.__subject__||this).replace(/-([\da-z])/gi, function( all, letter ) {
				return letter.toUpperCase();
			});
		},
		/*
		Преобразует стиль строки camel в dashes
		*/
		dasherize: function(text) {
			return (this.__subject__||this).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		},
		/*
		Преобразует первый символ в заглавный
		*/
		firstUpper: function() {
			return (this.__subject__||this).charAt(0).toUpperCase()+(this.__subject__||this).substr(1);
		}
	}
	Object.defineProperty(Strings, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Strings
	});
	Strings.assignTo('String');



	Dom.proto({
		parent: function() {
			var parentList = [];
			this.each(function() {
				if (parentList.indexOf(this.parentNode)<0) parentList.push(this.parentNode);
			});
			return core(parentList, 'HTMLElement');
		}
	})




var isObjective = (function () {
	/*
	Функция возвращает объект, если он объект и false, если нет.
	*/
	return function(subject) {
		if ( ("object"===typeof subject && (subject.toString().substr(0,12)!=="[object HTML")) || "function"===typeof subject) return subject;
		return false;
	}
})();

var isRichObjective = (function () {
	/*
	Функция возвращает объект, если он объект типа RichArray
	*/
	return function(subject) {
		if (("object"===typeof subject || "function"===typeof subject) && "number"===typeof subject.length) return subject;
		return false;
	}
})();

;(function (core, extend, isRichObjective) {
	/* Расширяем абстрактный класс Function */
	
	var RichArray = core.registerClass('RichArray', function() {
		
	});
	RichArray.prototype = {
		extend: function(data) {
			var operand = isObjective(this.__subject__)||this;
			if ("object"!==typeof data) {
				throw (typeof (operand))+'cant be extended by non-object';
				
			} else {
				extend(operand, data);
			}
			return this;
		},
		map: function(cb) {
			var r = [];

			this.each(function(el) {
				var uresult = cb(el);
				if (uresult!==null) r.push(uresult)
			});

			return core.$frendly(r);
		}
	}
	Object.defineProperty(RichArray, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: RichArray
	});
	RichArray.assignTo('HTMLElement');
	RichArray.assignTo('Array');
	RichArray.assignTo('Selector');
})(core,extend,isRichObjective);


	core.supports.extend({
		dataset: function() {
			return (typeof document.createElement('div').dataset !== "undefined");
		}
	});


var pseusoQueryMatch = (function () {
	return function(subject,pqs) {
		switch(pqs) {
			case 'visible':
				return (function(cstyle) {
					return !(cstyle.display==="none" || cstyle.visibility==="hidden" || parseInt(cstyle.opacity)===0);
				})(window.getComputedStyle(subject));
			break;

		}
	}
})();

;(function (core, mixin, inherit) {
	/* Расширяем абстрактный класс Function */
	
	var Inherit = core.registerClass('Inherit', function() {
		if (this.__subject__ && "function"!==typeof this.__subject__.inherit) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Inherit.prototype);
		}
	});
	Inherit.prototype = {
		inherit: function() {
			var classes = Array.prototype.slice.apply(arguments);
			return inherit(this.__subject__||this, classes);
		},
		/*
		Создает или расширяет прототип класса 
		*/
		proto: function(proto) {
			(this.__subject__||this).prototype = mixin((this.__subject__||this).prototype||{},proto,{
				constructor: proto
			});
			return (this.__subject__||this);
		},
		/*
		Принудительно создает экземпляр. Эта функция создана для того, что бы можно было вызвать конструктор
		класса через apply с передачей аргументов в виде массива.
		*/
		construct: function() {

			(this.__subject__||this).__proto__.__disableContructor__ = true;
			
			var module = new (this.__subject__||this)();
			(this.__subject__||this).apply(module, arguments);
			return module;
		},
		/*
		Позволяет добавлять статическое свойство для класса. Статические свойства могут быть вызваны без создания экземпляров класса, 
		кроме того при наследовании, таки свойства не перезаписываются, а миксуются между собой.
		*/
		static: function(name, value) {
			(this.__subject__||this)[name] = value;
			return this;
		}
	}
	Object.defineProperty(Inherit, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Inherit
	});
	Inherit.assignTo('Function');
	Inherit.embeddable=true;
})(core,mixin,inherit);


	/* Расширяем абстрактный класс Function */
	
	var Json = core.registerClass('Json', function() {
		
	});
	Json.prototype = {
		parse: function() {
			if ("string"!==typeof (this.__subject__||this)) {
				return (this.__subject__||this);
			}
			var args = Array.prototype.slice.apply(arguments);
			args.unshift(this.__subject__||this);

			return JSON.parse.apply(JSON, args);
		}
	}
	Object.defineProperty(Json, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Json
	});
	Json.assignTo('Object');


;(function (core, Dom, determineNodeObject) {
	Dom.proto({
		and: function(subject, data) {
			// This function return Array anyway
			var objects = determineNodeObject(subject, data);
			
			this.each(function() {
			    var parent = this.parentNode;
			   
			    if(parent.lastChild === this) {
			        for (i=0;i<objects.length;++i) {
			       		parent.appendChild(objects[i]);
			    	}
			    } else {
			    	for (i=0;i<objects.length;++i) {
				        parent.insertBefore(objects[i], this.nextSibling);
				    }
			    }
			});

			return core(objects, 'HTMLElement');
		}
	});
})(core,Dom,determineNodeObject);


	Dom.proto({
		attr: function() {
			var args = toArray(arguments);
			if (arguments.length>0) {
				switch(typeof args[0]) {
					case 'object':
						this.each(function() {
							for (var i in args[0]) {
								this.setAttribute(i, args[0][i]);
							};	
						});
					break;
					case "string":
						if (args.length>1) {
							this.each(function() {							
								this.setAttribute(args[0], args[1]);
							});
							return this;
						} else {
							return this[0].getAttribute(args[0]);
						}
					break;
					default:
						return this[0].attributes;
					break;
				};
				return this;
			} else {
				return this[0].attributes;
			};
		}
	});



	Dom.proto({
		addClass: function() {

			var className = arguments[0].split(' '),i;
			this.each(function() {
				for (i=0;i<className.length;++i) {
					var st = this.className.split(' ');
					(st.indexOf(className[i])<0) && (st.push(className[i]), this.className = st.join(' '));
				}
			});
			return this;
		},
		removeClass: function() {
			var className = arguments[0].split(' '),i;
			this.each(function() {
				for (i=0;i<className.length;++i) {
					var st = this.className.split(' ');
					var index = st.indexOf(className[i]);
					if (index>-1) {
						st.splice(index, 1);
						this.className = st.join(' ');
					};
				}
			});
			return this;
		}
	});



	Dom.proto({
		css: function() {
			
			var data, polymorph=[];
			("object"===typeof arguments[0]) 
			? 
			((arguments[0] instanceof Array) ? (polymorph=arguments[0],data=arguments[1]) : (data=arguments[0])) 
			: ( (arguments.length>1) ? (data={},data[arguments[0]]=arguments[1]) : (data=arguments[0]) );
			if ("object"===typeof data) {
				this.each(function() {
					for (var i in data) {
						if (polymorph.length!==0) for (var p = 0;p<polymorph.length;p++)
						this.style[polymorph[p]+i] = data[i];
						this.style[i] = data[i];
					};	
				});
				
				return this;
			} else {
				return this[0].style[data];
			}
		}
	});



	Dom.proto({
		data: function() {
			var args=arguments,
			key = core(args[0]).camelize(),
			allowdataset=core.supports('dataset');
			if (args.length>1) {
				this.each(function() {
					if (args[1]===null) {
						if (allowdataset)
						delete this.dataset[key];
						else this.removeAttribute("data-"+args[0]);
					} else {
						if (allowdataset)
						this.dataset[key] = args[1];
						else this.setAttribute("data-"+args[0], args[1]);
					};
				});
			} else {
				if (allowdataset)
				return ("undefined"!==typeof this[0].dataset[key]) ? this[0].dataset[key] : null;
				else
				return this[0].getAttribute("data-"+args[0]);
			}
			
			return this;
		}
	});



	Dom.proto({
		empty: function() {
			this.each(function() {
				this.innerHTML = '';
			});
			return this;
		}
	});


;(function (Dom, addEvent, removeEvent, toArray) {
	Dom.proto({
		bind : function() {
			var args = arguments;
			var events = args[0].split(' ');
			return this.each(function() {
				if (events[e]==='') return true;
				for (var e = 0;e<events.length;++e) {
					addEvent(this, events[e], args[1], args[2]||false);
				}
			});
		},
		on : function() {
			return this.bind.apply(this, arguments);
		},
		once: function() {
			var args = toArray(arguments);
			args[2] = true;
			return this.bind.apply(this, args);
		},
		unbind : function() {
			var args = arguments;
			var events = args[0].split(' ')
			return this.each(function() {
				for (var e = 0;e<events.length;++e) {
			   		removeEvent(this, events[e], args[1]||false);
			   	}
			});
		}
	});
})(Dom,addEvent,removeEvent,toArray);

;(function (core, Dom, querySelector) {
	Dom.proto({
		find: function(selector) {
			var suit = [],elements;

			this.each(function(root) {
				
				elements = querySelector(selector, root);
				
				if (elements.length) for (var i=0;i<elements.length;i++) {
					suit.push(elements[i]);
				};
			});

			
			return core(suit, 'HTMLElement');
		}
	});
})(core,Dom,querySelector);


	Dom.proto({
		html: function(html) {
			if ("undefined"===typeof html) {
				if (this.length<=0) return null;
				return this[0].innerHTML;
			}
			else
			return this.each(function() {
				this.innerHTML = html;
			});
		}
	});


;(function (core, Dom, determineNodeObject) {
	Dom.proto({
		put: function(subject, data) {
			// This function return Array anyway
			var objects = determineNodeObject(subject, data);

			// Append child
			this.each(function() {
				for (i=0;i<objects.length;++i) {
					this.appendChild(objects[i]);
				}
			});

			return core(objects, 'HTMLElement');
		}
	});
})(core,Dom,determineNodeObject);


	core.register('document:ready', false);
	(function (win, fn) {
	      var done = false, top = true,
	  
	      doc = win.document, root = doc.documentElement,
	  
	      add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	      rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	      pre = doc.addEventListener ? '' : 'on',
	  
	      init = function(e) {
	          if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
	          (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
	          if (!done && (done = true)) fn.call(win, e.type || e);
	      },
	  
	      poll = function() {
	          try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
	          init('poll');
	      };
	  
	      if (doc.readyState == 'complete') fn.call(win, 'lazy');
	      else {
	          if (doc.createEventObject && root.doScroll) {
	              try { top = !win.frameElement; } catch(e) { }
	              if (top) poll();
	          }
	          doc[add](pre + 'DOMContentLoaded', init, false);
	          doc[add](pre + 'readystatechange', init, false);
	          win[add](pre + 'load', init, false);
	      }
	  
	})(window, function() {
		core.register('document:ready', true);
		core.trigger('DOMReady');
	});
	

	Dom.proto({
		ready: function(callback) {
			var self = this;
			if (this[0]===window||this[0]===document) {
				if (core.register('document:ready')) callback.apply(this);
				else core.bind('DOMReady', function() {
					callback.apply(self);
				});
			}
		}
	});



	Dom.proto({
		wrapAll: function(subject, data) {
			var objects = determineNodeObject(subject, data),i=0;
			if (subject.length===0) return null;

			for (i = 0; i<objects.length; i++) {
				this.parent()[0].appendChild(objects[i]);
			}

			this.each(function() {
				objects[0].appendChild(this);
			});

			return Brahma(objects);
		}
	});


;(function (core, Dom, determineNodeObject,toArray) {
	Dom.proto({
		shift: function(subject, data) {
			var kit = [];
			var objects = determineNodeObject(subject, data);
				this.each(function(element) {
					for (i=0;i<objects.length;++i) {
						if (element.firstChild!==null)
						element.insertBefore(objects[i], element.firstChild);
						else element.appendChild(objects[i]);
						kit.push(objects[i]);
					}
				});
			
			return core(kit, 'HTMLElement');
		}
	});
})(core,Dom,determineNodeObject,toArray);


	Dom.proto({
		offset: function() {
			return {
				top: this[0].offsetTop,
				left: this[0].offsetLeft
			}
		}
	});



	Dom.proto({
		scrollTop: function(value) {
			if ("undefined"!==typeof value) {
				this.scrollTo(value);
				return this;
			} else {
				if (this===window) {
					return this.pageYOffset || this.documentElement.scrollTop;
				} else {
					return this.scrollTop;
				}
			}
		}
	});



	Dom.proto({
		/* Создает экземпляр модуля передав ему данный селектор */
		module: function(moduleName) {
			var args = Array.prototype.slice.apply(arguments);
			args.unshift(this);
			
			var module = core.class('module'+core(moduleName).firstUpper());
			return module.construct.apply(module, args);
		},
		/*
		Так же вызывает модуль, но делает это для каждого элемента в селекторе, возвращяя селектор, а не ссылку на модуль
		*/
		use: function(moduleName) {
			var widget = core.class('module'+moduleName);
			this.each(function() {
				widget.construct(this, config||{});
			});
			return this;
		}
	});



	Dom.proto({
		first: function(selector) {
			return core(this[0]);
		}
	});



	Dom.proto({
		/* Преобразует объект-селектор в массив */
		toArray: function() {
			return core.$frendly(Array.prototype.slice.apply(this));
		}
	});


;(function (core, Dom, querySelector) {
	Dom.proto({
		/*
`		Search в отличии от find производит проверку самого элемента на соответствие условием поиска
		*/
		search: function(selector) {
			var suit = [],elements;

			this.each(function(root) {
				
				if ($(root).is('img')) {
					suit.push(root);
				} else {
					elements = querySelector(selector, root);

					if (elements.length) for (var i=0;i<elements.length;i++) {
						suit.push(elements[i]);
					};
				}
			});

			return core(suit, 'HTMLElement');
		}
	});
})(core,Dom,querySelector);


	Dom.proto({
		is: function(origq) {
			var subject,test,pqs,qs;
			var nativetest = function(subject) {

				test = subject && ( subject.matches || subject[ 'webkitMatchesSelector' ] || subject[ 'mozMatchesSelector' ] || subject[ 'msMatchesSelector' ] );
				if (!(!!test && test.call( subject, origq ))) return false;
				return true;
			};
			(function(p) { qs=p[0].trim(); pqs=p[1]?p[1].trim():false; })(origq.split(':'));
				var accept=true;
				this.each(function(elem){

					try {
						if (!nativetest(elem)) {
							accept = false;
						}
					} catch(e) {
						// Test for pseudo selector
						if (pqs&&!pseusoQueryMatch(elem, pqs)) accept=false;
					}
				});
			return accept;
		}
	});


;(function (Dom,determineNodeObject) {
	Dom.proto({
		width: function() {
			if (this[0]===window) {
				var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0];
			    return w.innerWidth || e.clientWidth || g.clientWidth;
			} else {
				return this[0].offsetWidth;
			}
		}
	});
})(Dom);

;(function (Dom,determineNodeObject) {
	Dom.proto({
		height: function() {
			if (this[0]===window) {
				var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0];
			    return w.innerWidth || e.clientHeight || g.clientHeight;
			} else {
				return this[0].offsetHeight;
			}
		}
	});
})(Dom);


	/* Расширяем абстрактный класс Function */
	
	var Objective = core.registerClass('Objective', function() {
		
	});
	Objective.prototype = {
		stringify: function() {
			var args = Array.prototype.slice.apply(arguments);
			args.unshift(this.__subject__||this);

			try {
				return JSON.stringify.apply(JSON, args);
			} catch(e) {
				return null;
			}
		}
	}
	Object.defineProperty(Objective, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Objective
	});
	Objective.assignTo('Object');



	/* Расширяем абстрактный класс Function */
	
	var Functional = core.registerClass('Functional', function() {
		if (this.__subject__!==window && this.__subject__ && "function"!==typeof this.__subject__.delay) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Functional.prototype);
		}
	});
	Functional.prototype = {
		delay: function(timeout) {
			var steamStart = new Date();
			var callback = (this.__subject__||this);
			var timer = setTimeout(function() {
				callback((new Date())-steamStart);
			}, timeout);

			return function(set) {
				if (timer>0)
				clearTimeout(timer);
				if (set) callback((new Date())-steamStart); else return callback;
			}
		},
		interval: function(delay) {
			var steamStart = new Date();
			var streamStep = steamStart;
			var callback = (this.__subject__||this);
			var timer = setInterval(function() {
				var stopTime = new Date();
				callback(stopTime-steamStart, stopTime-streamStep);
				streamStep = new Date();
			}, delay);

			return function(set) {
				if (set) {
					var stopTime = new Date();
					callback(stopTime-steamStart, stopTime-streamStep);
				} else {
					if (timer>0)
					clearInterval(timer);
					return callback;
				}
			}
		},
		/*
		Загружает ресурсы и затем выполняет функцию
		*/
		load: function(resources) {
			var callback = (this.__subject__||this);
			
			$.vendor(resources, function(res) {

				var args = Array.prototype.slice(arguments);
				args.unshift(false);
				callback.apply(window, args);
			});
			return true;
		}
	}
	Object.defineProperty(Functional, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Functional
	});
	Functional.assignTo('Function');


;(function (core, mixin, inherit, addEvent, removeEvent) {
	/* Расширяем абстрактный класс Function */
	var Events = core.registerClass('Events', function() {
		if (this.__subject__!==window && this.__subject__ && "function"!==typeof this.__subject__.trigger) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Events.prototype);
		}
	});
	Events.prototype = {
		eventListners : {},
		bind : function(events, callback, once) {

			if ( (this.__subject__||this)===window ) {
				if (!(events instanceof Array)) events = [events];
				for (var e = 0;e<events.length;++e) {
					addEvent((this.__subject__||this), events[e], arguments[1], arguments[2]||false);
				}
			} else {

				if (typeof this.eventListners[events] != 'object') this.eventListners[events] = [];
				
				this.eventListners[events].push({
					callback: callback,
					once: once
				});
			}

			return this;
		},
		on: function() {
			this.bind.apply(this, arguments);
			return this;
		},	
		once : function(e, callback) {
			this.bind(e, callback, true);
			return this;
		},
		trigger : function() {
			
			
			if (typeof arguments[0] == 'integer') {
				var uin = arguments[0];
				var e = arguments[1];
				var args = (arguments.length>2) ? arguments[2] : [];
			} else {
				var uin = false;
				var e = arguments[0];
				var args = (arguments.length>1) ? arguments[1] : [];
			};
			
			var response = false;

			if (typeof this.eventListners[e] == 'object' && this.eventListners[e].length>0) {
				var todelete = [];
				for (var i = 0; i<this.eventListners[e].length; i++) {
					if (typeof this.eventListners[e][i] === 'object') {
						if (typeof this.eventListners[e][i].callback === "function") response = this.eventListners[e][i].callback.apply(this, args);
						
						if (this.eventListners[e][i].once) {

							todelete.push(i);
						};
					};
				};
				
				if (todelete.length>0) for (var i in todelete) {
					this.eventListners[e].splice(todelete[i], 1);
				};
			};
			return response;
		}
	}
	Object.defineProperty(Events, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Events
	});
	Events.assignTo('Window');
})(core,mixin,inherit,addEvent,removeEvent);


	/* Расширяем абстрактный класс Function */
	
	var Widget = core.registerClass('Widget', function(subject, config) {
		
		this.__subject__ = this.subject = subject;
		this.config = mixin(this.config||{}, config);
	});
	Widget.prototype = {
		
	}
	Object.defineProperty(Widget, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Widget
	});



	/* Расширяем абстрактный класс Function */
	
	var Eacher = core.registerClass('Eacher', function() {
		
	});
	Eacher.prototype = {
		each: function(callback) {
			var operand, method=0;
			if (this.__subject__ && isRichObjective(this.__subject__)) {
				operand=this.__subject__;method=1;
			} else if (this.__subject__ && isObjective(this.__subject__)) {
				operand=this.__subject__;method=0;
			} else if (isRichObjective(this)) {
				operand=this;method=1;
			} else {
				operand=this;method=0;
			}
			
			if (method===1) {
				if ("number"===typeof operand.length)
				for (var i = 0;i<operand.length;++i) {
					callback.call(operand[i], operand[i], i);
				}
				return operand;
			} else {
				for (var prop in operand) {
					if (operand.hasOwnProperty(prop)) {
						callback.call(operand[prop], operand[prop], prop);
					}
				}
			}
		}
	}
	Object.defineProperty(Eacher, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Eacher
	});
	Eacher.assignTo('Object','RichArray');



	/* Расширяем абстрактный класс Function */
	
	var NumbersArray = core.registerClass('NumbersArray', function() {
		
	});
	NumbersArray.prototype = {
		/*
		Функция находит в массиве чисел те числа, которые собой дают сумму sum
		*/
		termsOf: function(sum,branche) {
			var numbers = (this.__subject__|this);
		    var branche = branche || [];
		    var collect = [];
		    this.each(function(value,key) {
		        clonebranche = branche.slice(0);
		        clonebranche.push(value);        
		        if (sum-value==0) {
		           collect.push(clonebranche);
		        } else if (sum-value>0) {
		            var go = numbers.slice(0);
		            go.splice(key,1);
		            var res = Math.searchTerms(go,sum-value,clonebranche);
		            if (!res) return false;
		            else {
		                for (var q = 0;q<res.length;q++) {
		                    collect.push(res[q]); 
		                }
		            }
		        }
		        return false;
		    });
		    return collect;
		}
	}
	Object.defineProperty(NumbersArray, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: NumbersArray
	});
	NumbersArray.assignTo('RichArray');
	NumbersArray.assignTo('Array');


var scope = (function (core, isObjective) {

	return function(id,subject,forceType) {
		
		var scope, __abstractClass__ = core.determineAbstractClass(subject, true);
		if (forceType!==undefined) {
			if (__abstractClass__.indexOf(forceType)<0) __abstractClass__.push(forceType);
		}


		scope = function(data) {
			
		};

		/*
		Судьект размещаем в более глубоком слое прототипа. Соответственно абстракция получит все свойства исходного объекта.
		*/

		scope.prototype = Object.create(isObjective(subject)||{}, {
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
		
		__abstractClass__.forEach(function(aClass) {
			
			scope = core.charge(scope, aClass);
		});
		
		
		
		var sc = new scope();
		return sc;
	}
})(core,isObjective);

var clone = (function () {
	var self;
	self = function(prototype) {

		if (prototype instanceof Array) {
			var clone = [];
			clone.length=prototype.length;
		} else if ("object"!==typeof prototype) {
			return prototype;
		} else {
			var clone = {};
		};
		
		for (var prop in prototype) {
			if (!prototype.hasOwnProperty(prop)) continue;
			if (prototype[prop]===null || "object"!==typeof prototype[prop] || prototype[prop].constructor.name==='Ref') {
				clone[prop] = prototype[prop];
			} else {
				clone[prop] = self(prototype[prop]);
			}
		};

		return clone;
	}
	return self;
})();

;(function (core, scope, clone, isObjective) {
	var stack = {},index=1;
	
	core.extend({
		scope: function(subject, forceType) {
			
			if ("object"!==typeof subject || "number"!==typeof subject.__abstractId__) {

				stack[index] = scope(index, subject, forceType);

				Object.defineProperty(stack[index], '__abstractId__', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: index
				});

				++index;

				return stack[stack[index-1].__abstractId__];
			} else {
				return stack[subject.__abstractId__];
			}
		}
	});
})(core,scope,clone,isObjective);

;(function () {
	if (!Array.prototype.forEach) Array.prototype.forEach = function(callback) {
		for (var i = 0;i<this.length;i++) {
			callback.call(window, this[i], i);
		}
	}
})();



		window.Abstract = window.abs = window.$ = core;
})();