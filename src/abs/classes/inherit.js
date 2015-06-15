define('./../../core.js','./../common/mixin.js','./../common/inherit.js', function(core, mixin, inherit) {
	/* Расширяем абстрактный класс Function */
	
	var Inherit = core.registerClass('Inherit');
	Inherit.prototype = {
		constructor: Inherit,
		inherit: function() {
			var classes = Array.prototype.slice.apply(arguments);
			return Abstract(inherit(this.__subject__||this, classes));
		},
		/*
		Создает или расширяет прототип класса 
		*/
		proto: function(proto) {
			this.prototype = mixin((this.__subject__||this).prototype||{},proto,{
				constructor: proto
			});
			return this;
		},
		/*
		Принудительно создает экземпляр. Эта функция создана для того, что бы можно было вызвать конструктор
		класса через apply с передачей аргументов в виде массива.
		*/
		construct: function() {
			(this.__subject__||this).__proto__.__disableContructor__ = true;
			var module = new this();
			(this.__subject__||this).__subject__.apply(module, arguments);
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
	Inherit.assignTo('Function');
});