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

			var fullModuleName = 'module'+core(className).firstUpper();


			if (!core.classExists(fullModuleName)) {

				var widget = $(function() { }).inherit(core.class('Widget'));
				core.registerClass(fullModuleName, widget);

			} else {
				var widget = core.class(fullModuleName);
			}
			if (constructor!==null) {
				core.classes[fullModuleName] = widget.inherit(constructor);
			}
			if (proto!==null) core.classes[fullModuleName]  = widget.proto(proto);
			/*
			Сохраняем виджет
			*/
			
			return widget;
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
		this.length = index;
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

var isObjective = (function () {
	/*
	Функция возвращает объект, если он объект и false, если нет.
	*/
	return function(subject) {
		if ("object"===typeof subject || "function"===typeof subject) return subject;
		return false;
	}
})();

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




;(function (core, extend, isObjective) {
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
		each: function(callback) {
			var operand = isObjective(this.__subject__)||this;
			if ("number"===typeof operand.length)
			for (var i = 0;i<operand.length;++i) {
				callback.call(operand[i], operand[i], i);
			}
			return operand;
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
})(core,extend,isObjective);


	core.supports.extend({
		dataset: function() {
			return (typeof document.createElement('div').dataset !== "undefined");
		}
	});


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
			this.each(function() {
				elements = querySelector(selector, this);
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
			console.log(this);
			return core(this[0]);
		}
	});



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
			$.vendor(resources, function() {
				var args = Array.prototype.slice(arguments);
				args.unshift(false);
				callback(false, args);
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
		console.log('Widget inited');
		this.__subject__ = subject;
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
			
			if ("number"!==typeof subject.__abstractId__) {

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