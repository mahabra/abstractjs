
define([
	'./../../core/core.js',
	'./../../common/mixin.js',
	'./../../common/inherit.js',
	'./../../common/addEvent.js',
	'./../../common/removeEvent.js',
	'./../../core/core-ext.js'
], function(core, mixin, inherit, addEvent, removeEvent) {
	/* Расширяем абстрактный класс Function */
	var Events = core.registerClass('Events', function() {
		if (this.__subject__!==window && this.__subject__ && "function"!==typeof this.__subject__.trigger) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Events.prototype);
		}
	});
	Events.prototype = {
		eventListners : {},
		bind : function(events, callback, once) {

			if ( (this.__subject__||this)===window ) {
				if (!(events instanceof Array)) events = [events];
				for (var e = 0;e<events.length;++e) {
					addEvent((this.__subject__||this), events[e], arguments[1], arguments[2]||false);
				}
			} else {

				if (typeof this.eventListners[events] != 'object') this.eventListners[events] = [];
				
				this.eventListners[events].push({
					callback: callback,
					once: once
				});
			}

			return this;
		},
		on: function() {
			this.bind.apply(this, arguments);
			return this;
		},	
		once : function(e, callback) {
			this.bind(e, callback, true);
			return this;
		},
		trigger : function() {
			
			
			if (typeof arguments[0] == 'integer') {
				var uin = arguments[0];
				var e = arguments[1];
				var args = (arguments.length>2) ? arguments[2] : [];
			} else {
				var uin = false;
				var e = arguments[0];
				var args = (arguments.length>1) ? arguments[1] : [];
			};
			
			var response = false;

			if (typeof this.eventListners[e] == 'object' && this.eventListners[e].length>0) {
				var todelete = [];
				for (var i = 0; i<this.eventListners[e].length; i++) {
					if (typeof this.eventListners[e][i] === 'object') {
						if (typeof this.eventListners[e][i].callback === "function") response = this.eventListners[e][i].callback.apply(this, args);
						
						if (this.eventListners[e][i].once) {

							todelete.push(i);
						};
					};
				};
				
				if (todelete.length>0) for (var i in todelete) {
					this.eventListners[e].splice(todelete[i], 1);
				};
			};
			return response;
		}
	}
	Object.defineProperty(Events, "constructor", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: Events
	});
	Events.assignTo('Window');
});