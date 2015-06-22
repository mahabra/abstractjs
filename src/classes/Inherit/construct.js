define(['./../Inherit.js','$//gist/common/mixin.js'], function(Inherit, mixin) {
	Inherit.extend({
		/*
		Принудительно создает экземпляр. Эта функция создана для того, что бы можно было вызвать конструктор
		класса через apply с передачей аргументов в виде массива.
		*/
		construct: function() {
			
			(this.__subject__||this).__proto__.__disableContructor__ = true;
			
			var module = new (this.__subject__||this)();
			(this.__subject__||this).apply(module, arguments);
			return module;
		}
	});
});
		