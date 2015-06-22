define([
	'$//$','$//internals/classes',
	'$//system/sings/sRichArray',
	'$//system/sings/sArray',
	'$//system/sings/sHTMLElement'
	], function(core, extend, isRichObjective) {
	/* Расширяем абстрактный класс Function */
	
	var RichArray = core.registerClass('RichArray', function() {
		return this;
	});
	
	
	RichArray.assignTo('HTMLElement');
	RichArray.assignTo('Array');
	RichArray.assignTo('Selector');

	return RichArray;
});