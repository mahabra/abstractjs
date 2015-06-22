define(['$//$','./../RichArray', '$//classes/Eacher/each', '$//internals/frendly'], function($, RichArray) {
	RichArray.extend({
		map: function(cb) {
			var r = [];

			this.each(function(el, i) {
				var uresult = cb(el, i);
				if (uresult!==null) r.push(uresult)
			});

			return $.$frendly(r);
		}
	});
});