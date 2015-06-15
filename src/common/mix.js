define(['./clone.js'], function(clone) {
	/*
	Перемешивает функции. В результате получая новую функцию, содеражщую тела обоих функций.
	Прототипы и личные свойства функций так же миксуются, если имеют место быть. Приоритет на второй функции.
	*/
	return function(func1, func2) {
		if ("function"===typeof func1 && "function"===typeof func2) {
			var func3 = function() {
				func2.apply(this, arguments);
				func1.apply(this, arguments);
			}

			if ("object"===typeof func1.prototype || "object"===typeof func2.prototype) {
				if (func1.prototype) {
					func3.prototype = func1.prototype;
					func1.prototype=null;
				}
				if (func2.prototype) {
					if ("undefined"!==typeof func3.prototype) 
					func3.prototype = inherit(func3.prototype, func2.prototype);
					else func3.prototype = func2.prototype;
					func2.prototype=null;
				}
			}

			for (var prop in func1) {
				if (func1.hasOwnProperty(prop)&&prop!=="prototype")
				func3[prop] = func1[prop];
			}

			for (var prop in func2) {
				if (func1.hasOwnProperty(prop)&&prop!=="prototype")
				func3[prop] = func2[prop];
			}

			return func3;
		} else if ("object"===typeof func1 && "object"===typeof func2) {
			for (var prop in func2) {
				if (func2.hasOwnProperty(prop)) {
					func1[prop] = clone(func2[prop]);
				}
			}
			return func1; 
		}
	}
})