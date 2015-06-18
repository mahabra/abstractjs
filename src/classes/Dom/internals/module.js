define(['./../../../core/core.js', './../Dom.js'], function(core, Dom) {
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
});