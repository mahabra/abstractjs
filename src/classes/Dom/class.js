define(['./../Dom.js','$//classes/Eacher/each'], function(Dom) {
	Dom.extend({
		addClass: function() {

			var className = arguments[0].split(' '),i;
			this.each(function() {
				for (i=0;i<className.length;++i) {
					var st = this.className.split(' ');
					(st.indexOf(className[i])<0) && (st.push(className[i]), this.className = st.join(' '));
				}
			});
			return this;
		},
		removeClass: function() {
			var className = arguments[0].split(' '),i;
			this.each(function() {
				for (i=0;i<className.length;++i) {
					var st = this.className.split(' ');
					var index = st.indexOf(className[i]);
					if (index>-1) {
						st.splice(index, 1);
						this.className = st.join(' ');
					};
				}
			});
			return this;
		}
	});
});