define(['./../../../core/core.js', './../Dom.js'], function(core, Dom) {
	Dom.proto({
		parent: function() {
			var parentList = [];
			this.each(function() {
				if (parentList.indexOf(this.parentNode)<0) parentList.push(this.parentNode);
			});
			return core(parentList, 'HTMLElement');
		}
	})
});