define(['./../../../core/core.js', './../Dom.js','../extras/determineNodeObject.js',], function(core, Dom, determineNodeObject) {
	Dom.proto({
		put: function(subject, data) {
			// This function return Array anyway
			var objects = determineNodeObject(subject, data);

			// Append child
			this.each(function() {
				for (i=0;i<objects.length;++i) {
					this.appendChild(objects[i]);
				}
			});

			return core(objects, 'HTMLElement');
		}
	});
});