define(['./../../core/core.js','./../../common/extend.js','./../../common/isRichObjective.js'], function(core, extend, isRichObjective) {
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
		map: function(cb) {
			var r = [];

			this.each(function(el) {
				var uresult = cb(el);
				if (uresult!==null) r.push(uresult)
			});

			return core.$frendly(r);
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