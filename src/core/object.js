define(['./var/exPrototype.js', './common/inheritClassPrototype.js','./common/extendsObject.js'], function(exPrototype, inheritClassPrototype, extendsObject) {
	return {
		create: function(scope) {
			var abstractObject = function(scope) {
				this._prototype_._scope = scope;
			}
			abstractObject.prototype = exPrototype.create(abstractObject, {
				extends: function(classes) {
					if (arguments.length>1&&!(classes instanceof Array)) {
						classes = Array.prototype.slice.apply(arguments);
					} else {
						if (!(classes instanceof Array)) classes = [classes];
					}
					for (var i = 0;i<classes.length;i++) {
						
						if ("string"!==typeof classes[i]) {
							// ERROR! Classname must be a string
							continue;
						}

						
						extendsObject(this, this._prototype_._scope.class(classes[i]));
						
					}
					return this;
				}
			});

			return new abstractObject(scope);
		}
	}
});