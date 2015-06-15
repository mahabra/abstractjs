define(['./../core.js','./../theme.js'], function(core, theme) {
	
	core.extend({
		warn: function() {
			var args = Array.prototype.slice.call(arguments, 1);
			args.unshift('color:'+theme.textColor+';font-weight:bold');
			args.unshift('%c'+arguments[0]);
			console.log.apply(console, args);
			return this;
		}
	});
});