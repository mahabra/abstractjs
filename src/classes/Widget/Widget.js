
define(['./../../core/core.js','./../../common/mixin.js'], function(core,mixin) {
	/* Расширяем абстрактный класс Function */
	
	var Widget = core.registerClass('Widget', function(subject, config) {
		console.log('Widget inited');
		this.__subject__ = subject;
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