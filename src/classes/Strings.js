define(['$//$','$//internals/classes'], function(core) {
	/* Расширяем абстрактный класс Function */
	
	var Strings = core.registerClass('Strings', function() {
		return this;
	});
	
	Strings.assignTo('String');

	return Strings;
});