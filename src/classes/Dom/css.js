define(['./../Dom.js','$//classes/Eacher/each'], function(Dom) {
	Dom.extend({
		css: function() {
			
			var data, polymorph=[];
			("object"===typeof arguments[0]) 
			? 
			((arguments[0] instanceof Array) ? (polymorph=arguments[0],data=arguments[1]) : (data=arguments[0])) 
			: ( (arguments.length>1) ? (data={},data[arguments[0]]=arguments[1]) : (data=arguments[0]) );
			if ("object"===typeof data) {
				this.each(function() {
					for (var i in data) {
						if (polymorph.length!==0) for (var p = 0;p<polymorph.length;p++)
						this.style[polymorph[p]+i] = data[i];
						this.style[i] = data[i];
					};	
				});
				
				return this;
			} else {
				return this[0].style[data];
			}
		}
	});
});