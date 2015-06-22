define(['$//$'], function($) {
	$.registerSing('object', 'Array', function(res) {
		if (res instanceof Array) return true; return false;
	});
});