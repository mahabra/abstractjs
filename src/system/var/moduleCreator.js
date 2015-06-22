define(['$//$','$//gist/common/mixin.js','$//gist/common/extend.js','$//classes/Inherit/inherit','$//internals/charge','$//classes/Eacher/each','$//classes/Widget'], 
	function(core, mixin, extend) {

	return function(moduleName, constructor) {

		var abstractClass = core(constructor||function() {}).inherit(core.class('Widget'));
		abstractClass.properties = {};
		var constructProperties = function() {
			if (this!==window&&"object"===typeof this.constructor.properties) {
				var constr = this;
				core(this.constructor.properties).each(function(value, key) {
					constr[key] = extend(value);
				});
			}
		}
		abstractClass = abstractClass.inherit(constructProperties);
		
		window.abstractClass = abstractClass;
		
		/*
		Расширить этот класс другим классом
		*/
		abstractClass.charge = function(aClass) {
			return core.charge(abstractClass, aClass);
		}
		/*
		Расширение самого себя. Не смотря на название функции в действительности объекты миксуются.
		*/
		abstractClass.extend = function(data) {

			var methods=[],properties=[];
			
			core(data).each(function(value, key) {
				if ("function"===typeof value) methods[key]=value;
				else properties[key]=value;
			});
			abstractClass.prototype = mixin(abstractClass.prototype||{},methods);
			extend(abstractClass.properties, properties);

			return abstractClass;
		}

		/*
		Собственное имя класса
		*/
		abstractClass.moduleName = moduleName;

		return abstractClass;
	}
});