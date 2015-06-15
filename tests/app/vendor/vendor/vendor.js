;(function() {

	/*
	Полифилы и константы
	*/
	var httpmin_expr = /^([a-z]*):\/\/([^\?]*)$/i;
	var domain_expr = /^([a-z]*):\/\/([^\/]*)/i;
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
	/* Возвращает домен по url. Включая протокол и слеш в конце. */
	var domain = function(url) {
		url=url.split('\\').join('/');
		if (domain_expr.test(url)) {
			return domain_expr.exec(url)[1]+'/';
		} else {
			return url;
		}
	}

	/*
	Возвращает имя директории, в которой лежит файл
	*/
	var dirname = function(url) {
		url=url.split('\\').join('/').split('?')[0];
		return url.substring(0, url.lastIndexOf('/')+1);
	}

	/*
	forEach
	*/
	if (!Array.prototype.forEach) Array.prototype.forEach = function(callback) {
		for (var i = 0;i<this.length;i++) {
			callback.call(this[i], this[i], i);
		}
	}

	/*
	Bind
	*/
	if (!Function.prototype.bind) Function.prototype.bind = function(obj) {
		var fn = this,
		args = slice.call(arguments, 1);
		return function(){
		    return fn.apply(obj, args.concat(slice.call(arguments)));
		}
	}

	/*
	Interactive mode
	*/
	var isInteractiveMode = function(j) {
		return (j.attachEvent && !(j.attachEvent.toString && j.attachEvent.toString().indexOf('[native code') < 0) && !(typeof opera !== 'undefined' && opera.toString() === '[object Opera]'));
	}

	var charge = function(object, proto) {
		for (var prop in proto) {
			if (proto.hasOwnProperty(prop)) {
				if ("object"===typeof proto[prop]) {
					object[prop] = new Object(proto[prop]);
				} else {
					object[prop] = proto[prop];
				}
			}
		}
	}

	var events = {
		bind : function(e, callback, once) {
			if (typeof this.eventListners[e] != 'object') this.eventListners[e] = [];
			
			this.eventListners[e].push({
				callback: callback,
				once: once
			});

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
		},
		ready : function() {

			if (arguments.length===0) {
				this.isready = true;
				this.trigger('ready');
			} else if ("function"===typeof arguments[0]) {

				if (this.isready) arguments[0].apply(this);
				else this.bind('ready', arguments[0]);
			}
			return this;
		}
	}

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

	/* mixin */
	var mixin = (function() {
	  var mixinup = function(a,b) { 
	  	for(var i in b) { 
	  		
	  		if (b.hasOwnProperty(i)) { 
	              
	  			a[i]=b[i]; 
	  		} 
	  	} 
	  	return a; 
	  } 
	  
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

	if (!window.location.origin) {
	  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}

	/*
	Абстрактный скрипт
	*/
	var Resource = function(url) {
		this.url = url;
		this.location = dirname(url);
		this.module = null;
		this.script = null;
		this.eventListners = {};
		this.isready = false;
		charge(this, events);
		
		this.load(url);
		
	}

	Resource.prototype = {
		constructor: Resource,
		load: function(url) {

			/* Создаем элемент SCRIPT без присвоения к документу, это вынужденное действие для работы с IE8 */
            this.script = document.createElement("SCRIPT");
           
            this.script.setAttribute("type", "text/javascript");
            this.script.setAttribute("async", true);

            /*
			Проверка на interactive необходимо для правильного связывания define со скриптом.
			В IE срабатывание скрипта может происходить не сразу после загрузки скрипта. 
			Поэтому данный скрипт должен быть заморожен до момета вызова define.
            */
            if (isInteractiveMode(this.script)) {
            	this.interactive = true;
            	this.script.onload = this.script.onreadystatechange = function() {
		 			if (this.script.readyState==='loaded'||this.script.readyState==='complete') {
		 				this.readytest();
		 			}
		 		}.bind(this)
			} else {
				this.script.onload = this.script.onreadystatechange = function() {
					this.readytest();
				}.bind(this);
			}

            this.script.src = url;

            (function() {
              return document.documentElement || document.getElementsByTagName("HEAD")[0];
            })().appendChild(this.script);
		},
		readytest: function(interactive) {

			if (!this.script.readyState || this.script.readyState === "loaded" || this.script.readyState === "complete" || interactive) {

				/* Чистим память */
				this.script.onload = this.script.onreadystatechange = null;
				/* Удаляем скрипт */
              	try {
	              	(function() {
	                  return document.documentElement || document.getElementsByTagName("HEAD")[0];
	                })().removeChild(this.script);
	            } catch(e) {
	            	if (typeof console=="object" && "function"==typeof console.log)
	            	if (_w.vendor.debugMode) console.log('vendor.js: script node is already removed by another script', j);
	            }
	            /*
				После завершения загрузки скрипта мы должны обеспечить обратное связывание с define
	            */	    
	               

	            this.throughDefine(function() {

	            	this.ready();
	            }.bind(this));
			}
		},
		/*
		Функция проверяет был ли вызван define внутри файла
		*/
		throughDefine: function(callback) {

			if ("object"===typeof window.define.last) {

				this.module = new Module(window.define.last.name||this.url, window.define.last.depends, window.define.last.factory, this);
			} else {
				this.module = new Module(this.url, [], null, this);
			}

			this.module.ready(function() {
				callback()
			});
		}
	}

	if ("object"!==typeof Resource.prototype.__proto__) Resource.prototype.__proto__ = Resource.prototype;

	/*
	Модуль. Состоит из лчиного имени, списка зависимостей и скрипта владельца.
	Скрипт отличается от модуля тем, что скрипт - это файл Javascript, а модуль AMD сущность, которая помещается внутрь define.
	Модуль должен инициализироваться и иметь свойство ready не равным false;
	*/
	var Module = function(name, dependencies, factory, caller) {
		this.name = name;
		this.ready = false;
		this.exports = null;
		this.caller = caller;
		this.factory = factory;
		this.eventListners = {};
		this.isready = false;

		/*
		Расширяем модуль событиями
		*/
		charge(this, events);
		/*
		Перечень компонентов необходимых для работы модуля. Он формируется на основе списка dependencies.
		*/
		this.resources = [];
		/*
		Приводим ресурсы к массиву
		*/
		if (dependencies===null) dependencies = [];
		if (!(dependencies instanceof Array)) dependencies = [dependencies];
		
		/*
		Формируем данные для сбора статистики
		*/
		this.total = dependencies.length; /* Общее количество ресурсов */
		this.left = this.total; /* Сколько осталось загрузить */

		/*
		Запускаем таймер, который будет осчитывать время до момента, когда будет выброшено исключение
		по слишком долгой загрузке скрипта. Время таймаута указывается в настройках.
		*/
		this.timeout = setTimeout(function() {
			if (this.left>0) {
				throw 'Timeout for module '+caller.url;
			}
		}.bind(this), vendor.config.timeout);

		/*
		Приводим url зависимостей к абсолютному формату
		*/
		dependencies.forEach(function(src, index) {
			var url = this.determine(src);
			this.resources[index] = Vendor.get(url);
		}.bind(this));

		/*
		Создаем визуальный дебагинг
		*/
		this.debugVisualElements = {};
		this.debugVisualElements.box = document.createElement('div');
		this.debugVisualElements.box.style.width = "30%";
		this.debugVisualElements.box.style.float = "left";
		this.debugVisualElements.box.style.boxSizing = "border-box";
		this.debugVisualElements.box.style.border = "1px gray solid";
		this.debugVisualElements.box.style.padding = "10px";
		this.debugVisualElements.box.style.margin = "1%";
		document.body.appendChild(this.debugVisualElements.box);
		this.debugVisualElements.box.innerHTML = '<strong>'+this.name+'</strong>';

		this.debugVisualElements.dependsBox = document.createElement('ul');
		this.debugVisualElements.box.appendChild(this.debugVisualElements.dependsBox);
		this.debugVisualElements.depends = {};
		this.resources.forEach(function(res, index) {
			this.debugVisualElements.depends[res.url] = document.createElement('li');
			this.debugVisualElements.depends[res.url].innerHTML = res.url;
			this.debugVisualElements.dependsBox.appendChild(this.debugVisualElements.depends[res.url]);
		}.bind(this));
		
		this.load();
	}

	Module.prototype = {
		constructor: Module,
		/*
		Приведение url к абсолютному виду
		*/
		determine: function(url) {

			if (url.substring(0,2)==='./') {
				url = this.caller.location+url.substr(2);
			} else if (url.substring(0,1)==='/') {
				url = domain(this.caller.location)+url.substr(2);
			} else {
				url = this.caller.location+url;
			}

			return normalize(url);
		},
		/*
		Обеспечиваем запуск модуля по готовности его ресурсов
		*/
		load: function() {
			if (this.resources.length===0)
			this.perform();
			else
			this.resources.forEach(function(resource, i) {
				var that = this;

				resource.ready(function() {
					that.debugVisualElements.depends[this.url].style.color = 'green';
					that.left--;
					
					if (that.left<=0) {
						
						that.perform();
					}
				});
			}.bind(this));
		},
		/*
		Выполнение модуля
		*/
		perform: function() {

			var args = [];
			this.resources.forEach(function(resource) {
				args.push(resource.module.exports);
			}.bind(this));
			if ("function"===typeof this.factory) {
				this.exports = this.factory.apply(window, args);
			} else {
				this.exports = this.factory;
			}

			setTimeout(function() {
				this.ready();
			}.bind(this), 0);
		}
	};

	if ("object"!==typeof Module.prototype.__proto__) Module.prototype.__proto__ = Module.prototype;

	/*
	Основная функция vendor
	*/
	var Vendor = function(resources, callback) {
		/*
		Создаем имитацию ресурса
		*/
		var caller = mixin({
			location: Vendor.config.baseUrl,
			module: {
				exports: null
			}, /* Исходный путь */
			script: null
		}, ("object"===typeof this && this.constructor==Object) ? this : {});

		new Module('root', resources, callback, caller);
	}

	Vendor.resources = {};

	Vendor.config = function(data) {
		mixin(Vendor.config, data);
	}

	Vendor.config({
		baseUrl: '/',
		timeout: 5000,
		visualDebug: true
	});

	/*
	Эта функция принимает только абсолютный путь или он будет преобразован в абсолютный самым примитивным образом
	*/
	Vendor.get = function(src) {
		if ("object"!==typeof Vendor.resources[src]) {
			Vendor.resources[src] = new Resource(src);
		}
		return Vendor.resources[src];
	}

	window.define = function(g, e, b) {
		
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
		var factory = b || null;

		window.define.last = {
			name: name,
			depends: depends,
			factory: factory
		}
	}

	/* Автоопределение положения vendor */
	

		;(function() {

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
					
					Vendor.config({
						baseUrl: baseUrl,
						bowerComponentsUrl: ((bwk!==false) ? (function() {
						var h = g[j].attributes[bwk].value;
						return (h.substr(0,5).toLowerCase()==='http:') ? h : (f + (h.substr(0,1)=='/' ? '' : '/') + h)+(h.substr(h.length-1, 1)==='/' ? '' : '');
					})() : baseUrl+"bower_components/"),
						noBowerrc: g[j].getAttribute('no-bowerrc') ? true : false
					});
					// import
					Vendor.selfLocationdefined = true;
					// Search for import
					if (g[j].getAttribute('data-import')) {
						Vendor.defineDataImport = g[j].getAttribute('data-import');
						Vendor.require(g[j].getAttribute('data-import'));
					}
					break;
				}				
			}
		})();
	

	window.vendor = Vendor;

})();