define(['$//$'], function($) {
	$.registerSing('object', 'HTMLElement', function(res) {
		if (res.toString().substr(0,12)==="[object HTML") return true; return false;
	});
});