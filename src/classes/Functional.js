define(['$//$','$//gist/common/mixin.js','$//internals/classes','$//gist/common/mixin'], function($, mixin) {
	var Functional = $.registerClass('Functional', function() {
		if (this.__subject__!==window && this.__subject__ && "function"!==typeof this.__subject__.delay) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Functional.prototype);
		}
		return this;
	});

	Functional.assignTo('Function');

	return Functional;
});