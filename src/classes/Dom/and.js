define(['./../Dom.js', './extras/determineNodeObject.js','$//classes/Eacher/each'], function(Dom, determineNodeObject) {
	Dom.extend({
		and: function(subject, data) {
			// This function return Array anyway
			var objects = determineNodeObject(subject, data);
			
			this.each(function() {
			    var parent = this.parentNode;
			   
			    if(parent.lastChild === this) {
			        for (i=0;i<objects.length;++i) {
			       		parent.appendChild(objects[i]);
			    	}
			    } else {
			    	for (i=0;i<objects.length;++i) {
				        parent.insertBefore(objects[i], this.nextSibling);
				    }
			    }
			});

			return core(objects, 'HTMLElement');
		}
	});
});