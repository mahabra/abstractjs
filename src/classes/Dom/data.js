define(['$//$', './../Dom.js',  '$//internals/supports/dataset.js', '$//classes/Strings/camelize', '$//classes/Strings/dasherize', '$//classes/Eacher/each'], function(core, Dom) {
	var cache=[],tieid='__abstractdata__'+Math.round(Math.random()*10000),
	allowdataset=core.supports('dataset'),
	regValidAttrValue=/^[^\n\r\"]*$/,
	api = {
		hasKey: function(elem, key) {
			var dashKey = $(key).dasherize();
			var camKey = $(key).camelize();
			if (allowdataset) {
				if ("undefined"!==typeof elem.dataset[camKey]) return true;
			} else {
				if (elem.hasAttribute("data-"+dashKey)) return true;
			}
			var cache = this.cache(elem);
			if ("undefined"!==typeof cache) return true;
			return false;
		},
		deleteKey: function(elem, key) {
			var dashKey = $(key).dasherize();
			var camKey = $(key).camelize();

			if (allowdataset) {
				delete elem.dataset[camKey];
			} else {
				elem.removeAttribute("data-"+dashKey);
			}
			var cache = this.cache(elem);
			delete cache[camKey]
			return true;
		},
		getKey: function(elem, key) {
			var dashKey = $(key).dasherize();
			var camKey = $(key).camelize();
			if (allowdataset) {
				if ("undefined"!==typeof elem.dataset[camKey]) return elem.dataset[camKey];
			} else {
				if (elem.hasAttribute("data-"+dashKey)) return elem.getAttribute("data-"+dashKey);
			}
			var cache = this.cache(elem);
			return cache[camKey];
		},
		setKey: function(elem, key, value) {
			var dashKey = $(key).dasherize();
			var camKey = $(key).camelize();

			var cache = this.cache(elem);
			if (this.attrValidValue(value)&&"undefined"===typeof cache[key]) {

				if (allowdataset) {
					elem.dataset[camKey] = value;
				} else {
					elem.setAttribute("data-"+dashKey, value);
				}
			} else {				
				cache[camKey]=value;
				/*
				Создание дата в кеше свойства предполагает, что это свойство полностью переходит в кеш, и в тэге оно больше не требуется.
				*/
				if (allowdataset) {
					delete elem.dataset[camKey];
				} else {
					elem.removeAttribute("data-"+dashKey);
				}
			}
			return this;
		},
		/*
		Проверяет данные на валидность записи в data-аттрибут
		*/
		attrValidValue: function(somedata) {
			if ("string"===typeof somedata || "number"===typeof somedata && regValidAttrValue.test(somedata)) {
				return true;
			} else {
				return false;
			}
		},
		cache: function(elem) {
			if ("object"!==typeof elem) return null;
			if ("undefined"===typeof elem[tieid]) {
				cache.push({});
				Object.defineProperty(elem, tieid, {
					writable: false,
					enumerable: false,
					configurable: false,
					value: cache.length-1
				});
			}
			return cache[cache.length-1];
		}
	}

	Dom.extend({
		data: function() {
			var args=arguments,
			key = args[0];
			/*
			Логика этой функции такая, что при чтении data key мы вначале ищем значение в  dataset элемента, если там не находим,
			тогда ищем в кеше для этого элемента.
			При присваивании данных строки, строка анализируется по принципу plainRecord. Если это простая строка, то она сохраняется
			в data-аттрибут, если это не строка или строка, превышающая 255 символов или соедержащая переносы строк, то она сохраняется
			в кеш.
			Я не считаю, что полное использование кеш-объекта, как в jQuery, не вполне удачно. Иногда нужно отображаться данные в 
			data-аттрибуте.
			*/
			
			if (args.length>1) {
				this.each(function(el) {
					if (args[1]===null) {
						api.deleteKey(el, key);
					} else {
						api.setKey(el, key, args[1]);
					};
				});
			} else {
				return api.getKey(this[0], key);
			}
			
			return this;
		}
	});
});