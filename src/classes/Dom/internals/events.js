define(['./../Dom.js','./../../../common/addEvent.js','./../../../common/removeEvent.js','./../../../common/toArray.js'], function(Dom, addEvent, removeEvent, toArray) {
	Dom.proto({
		bind : function() {
			var args = arguments;
			var events = args[0].split(' ');
			return this.each(function() {
				if (events[e]==='') return true;
				for (var e = 0;e<events.length;++e) {
					addEvent(this, events[e], args[1], args[2]||false);
				}
			});
		},
		on : function() {
			return this.bind.apply(this, arguments);
		},
		once: function() {
			var args = toArray(arguments);
			args[2] = true;
			return this.bind.apply(this, args);
		},
		unbind : function() {
			var args = arguments;
			var events = args[0].split(' ')
			return this.each(function() {
				for (var e = 0;e<events.length;++e) {
			   		removeEvent(this, events[e], args[1]||false);
			   	}
			});
		}
	});
});