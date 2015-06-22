
define(['$//$','$//internals/classes','$//system/sings/sRichArray'], function(core) {
	/* Расширяем абстрактный класс Function */
	
	var Eacher = core.registerClass('Eacher', function() {
		
	});
	
	Eacher.assignTo('Object');
	Eacher.assignTo('Selector');
	Eacher.assignTo('RichArray');

	return Eacher;
});

