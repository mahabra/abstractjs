
define(['$//$','$//gist/common/mixin.js','$//internals/classes'], function(core,mixin) {
	/* Расширяем абстрактный класс Function */
	
	var Widget = core.registerClass('Widget', function(subject, config) {
		
		this.__subject__ = this.subject = subject;
		this.config = mixin(this.config||{}, config);

		return this;
	});
	
	return Widget();
});