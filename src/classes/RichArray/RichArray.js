define(['./../../core/core.js','./../../common/extend.js','./../../common/isObjective.js'], function(core, extend, isObjective) {
	/* Расширяем абстрактный класс Function */
	
	var RichArray = core.registerClass('RichArray', function() {
		
	});
	RichArray.prototype = {
		extend: function(data) {
			var operand = isObjective(this.__subject__)||this;
			if ("object"!==typeof data) {
				throw (typeof (operand))+'cant be extended by non-object';
				
			} else {
				extend(operand, data);
			}
			return this;
		},
		each: function(callback) {
			var operand = isObjective(this.__subject__)||this;
			if ("number"===typeof operand.length)
			for (var i = 0;i<operand.length;++i) {
				callback.call(operand[i], operand[i], i);
			}
			return operand;
		}
	}
	Object.defineProperty(RichArray, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: RichArray
	});
	RichArray.assignTo('HTMLElement');
	RichArray.assignTo('Array');
	RichArray.assignTo('Selector');
});