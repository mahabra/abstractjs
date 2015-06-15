
define(['./../../core/core.js','./../../common/mixin.js','./../../common/inherit.js','./../../core/core-ext.js'], function(core, mixin, inherit) {
	/* Расширяем абстрактный класс Function */
	
	var Events = core.registerClass('Events', function() {
		if (this.__subject__ && "function"!==typeof this.__subject__.trigger) {
			/*
			Патчим объект
			*/
			mixin(this.__subject__, Events.prototype);
		}
	});
	Events.prototype = {
		eventListners : {},
		bind : function(e, callback, once) {
			if (typeof this.eventListners[e] != 'object') this.eventListners[e] = [];
			
			this.eventListners[e].push({
				callback: callback,
				once: once
			});

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
});