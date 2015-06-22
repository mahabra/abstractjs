define(['$//$'], function($) {
	$.registerSing('object', 'RichArray', function(res) {
		if (!(res instanceof Array) && res.hasOwnProperty('length') && "number"===typeof res.length) return true; return false;
	});
});