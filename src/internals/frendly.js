define(['$//$'], function(core) {
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
						
						return core(this);
					}
				})
			} else {
				core.warn('Non-object can`t be abstract frendly');
			}
			return object;
		}
	});
});