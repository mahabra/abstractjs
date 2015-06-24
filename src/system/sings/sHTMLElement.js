define(['$//$'], function($) {
	$.registerSing('object', 'HTMLElement', function(res) {
		if (Object.prototype.toString.call(res).substr(0,12)==="[object HTML") return true; return false;
	});
});