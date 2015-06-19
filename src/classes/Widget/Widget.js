
define(['./../../core/core.js','./../../common/mixin.js'], function(core,mixin) {
	/* Расширяем абстрактный класс Function */
	
	var Widget = core.registerClass('Widget', function(subject, config) {
		
		this.__subject__ = this.subject = subject;
		this.config = mixin(this.config||{}, config);
	});
	Widget.prototype = {
		
	}
	Object.defineProperty(Widget, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Widget
	});
});