define(function() {
	var self;
	self = function(prototype) {

		if (prototype instanceof Array) {
			var clone = [];
			clone.length=prototype.length;
		} else if ("object"!==typeof prototype) {
			return prototype;
		} else {
			var clone = {};
		};
		
		for (var prop in prototype) {
			if (!prototype.hasOwnProperty(prop)) continue;
			if (prototype[prop]===null || "object"!==typeof prototype[prop] || prototype[prop].constructor.name==='Ref') {
				clone[prop] = prototype[prop];
			} else {
				clone[prop] = self(prototype[prop]);
			}
		};

		return clone;
	}
	return self;
});