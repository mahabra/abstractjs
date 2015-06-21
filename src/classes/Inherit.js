define(['$//$','$//gist/common/mixin.js','$//internals/classes','$//gist/common/mixin'], function($, mixin) {
	var Inherit = $.registerClass('Inherit', function() {
		if (this.__subject__ && "function"!==typeof this.__subject__.inherit) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Inherit.prototype);
		}
	});

	Inherit.assignTo('Function');
	Inherit.embeddable=true;

	return Inherit;
});