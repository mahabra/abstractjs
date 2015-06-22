define(['$//$', './../Dom.js',  '$//internals/supports/dataset.js', '$//extensons/Strings/camelize','$//classes/Eacher/each'], function(core, Dom) {
	Dom.extend({
		data: function() {
			var args=arguments,
			key = core(args[0]).camelize(),
			allowdataset=core.supports('dataset');
			if (args.length>1) {
				this.each(function() {
					if (args[1]===null) {
						if (allowdataset)
						delete this.dataset[key];
						else this.removeAttribute("data-"+args[0]);
					} else {
						if (allowdataset)
						this.dataset[key] = args[1];
						else this.setAttribute("data-"+args[0], args[1]);
					};
				});
			} else {
				if (allowdataset)
				return ("undefined"!==typeof this[0].dataset[key]) ? this[0].dataset[key] : null;
				else
				return this[0].getAttribute("data-"+args[0]);
			}
			
			return this;
		}
	});
});