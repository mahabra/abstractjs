define(['./../Inherit.js','$//gist/common/mixin.js'], function(Inherit, mixin) {
	Inherit.extend({
		/*
		Создает или расширяет прототип класса 
		*/
		proto: function(proto) {
			(this.__subject__||this).prototype = mixin((this.__subject__||this).prototype||{},proto,{
				constructor: proto
			});
			return (this.__subject__||this);
		}
	});
});
		