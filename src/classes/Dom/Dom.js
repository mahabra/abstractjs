
define([
	'./../../core/core.js',
	'./../../common/mixin.js',
	'./extras/querySelector.js',
	'./../../core/core-ext.js'
], function(core, mixin, querySelector, and) {
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
});