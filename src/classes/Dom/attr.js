define(['./../Dom.js','$//gist/common/toArray.js','$//classes/Eacher/each'], function(Dom, toArray) {
	Dom.extend({
		attr: function() {
			var args = toArray(arguments);
			if (arguments.length>0) {
				switch(typeof args[0]) {
					case 'object':
						this.each(function() {
							for (var i in args[0]) {
								this.setAttribute(i, args[0][i]);
							};	
						});
					break;
					case "string":
						if (args.length>1) {
							this.each(function() {							
								this.setAttribute(args[0], args[1]);
							});
							return this;
						} else {
							return this[0].getAttribute(args[0]);
						}
					break;
					default:
						return this[0].attributes;
					break;
				};
				return this;
			} else {
				return this[0].attributes;
			};
		}
	});
});