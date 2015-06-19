define(['./core.js','./medium/scope.js','./../common/clone.js','./../common/isObjective.js'], function(core, scope, clone, isObjective) {
	var stack = {},index=1;
	
	core.extend({
		scope: function(subject, forceType) {
			
			if ("object"!==typeof subject || "number"!==typeof subject.__abstractId__) {

				stack[index] = scope(index, subject, forceType);

				Object.defineProperty(stack[index], '__abstractId__', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: index
				});

				++index;

				return stack[stack[index-1].__abstractId__];
			} else {
				return stack[subject.__abstractId__];
			}
		}
	});
})
