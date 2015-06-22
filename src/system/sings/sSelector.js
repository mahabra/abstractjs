define(['$//$','$//gist/html/tags.js'], function($, tags) {
	$.registerSing('string', 'Selector', function(res) {
		var tsp = res.split(/[> ]+/),found=false;
		for (var i = 0;i<tsp.length;i++) {
			(function(piece) {
				if (tags.indexOf(piece.toUpperCase())>=0) { found=true; return true; }
				if (/^[>#\.[]]{0,2}[^'", ]+[a-zA-Z0-9\-\[]+/.test(piece)) { found=true; return true }
			})(tsp[i]);
		}
		return found;
	});
});