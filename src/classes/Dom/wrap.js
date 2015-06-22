define(['./../Dom','./extras/determineNodeObject.js','./parent.js','$//classes/Eacher/each'], function(Dom,determineNodeObject) {
	Dom.extend({
		wrapAll: function(subject, data) {
			var objects = determineNodeObject(subject, data),i=0;
			if (subject.length===0) return null;

			for (i = 0; i<objects.length; i++) {
				this.parent()[0].appendChild(objects[i]);
			}

			this.each(function() {
				objects[0].appendChild(this);
			});

			return Brahma(objects);
		}
	});
});