define(['./../../../core/core.js', './../Dom.js','../extras/determineNodeObject.js','./../../../common/toArray.js'], function(core, Dom, determineNodeObject,toArray) {
	Dom.proto({
		shift: function(subject, data) {
			var kit = [];
			var objects = determineNodeObject(subject, data);
				this.each(function(element) {
					for (i=0;i<objects.length;++i) {
						if (element.firstChild!==null)
						element.insertBefore(objects[i], element.firstChild);
						else element.appendChild(objects[i]);
						kit.push(objects[i]);
					}
				});
			
			return core(kit, 'HTMLElement');
		}
	});
});