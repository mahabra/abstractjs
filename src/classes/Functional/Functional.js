
define(['./../../core/core.js','./../../common/mixin.js','./../../core/core-ext.js'], function(core,mixin) {
	/* Расширяем абстрактный класс Function */
	
	var Functional = core.registerClass('Functional', function() {
		
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
		}
	}
	Object.defineProperty(Functional, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Functional
	});
	Functional.assignTo('Function');
});