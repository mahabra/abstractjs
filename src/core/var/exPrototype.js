define(['./../../common/extend.js'], function(extend) {
	return {
		create: function(construct, ext) {
			var prototypeConstructor = function() {
				this.constructor = construct;
			},
			superPrototype = prototypeConstructor.prototype = extend(ext, {
				constructor: prototype
			}),
			prototype = new prototypeConstructor();

			Object.defineProperty(prototype, '_prototype_', {
				configurable: false,
				enumerable: false,
				writable: false,
				value: prototype
			});

			Object.defineProperty(prototype, '_superPrototype_', {
				configurable: false,
				enumerable: false,
				writable: false,
				value: superPrototype
			});

			return prototype;
		}
	}
})