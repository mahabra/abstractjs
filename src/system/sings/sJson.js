define(['$//$','$//gist/html/tags.js'], function($, tags) {
	$.registerSing('string', 'Json', function(res) {
		if (/^[\{]{1}[\s\S]*[\}]{1}$/gi.test(res)) return true; return false;
	});
});