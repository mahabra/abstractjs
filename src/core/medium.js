define(['./core.js','./medium/scope.js','./../common/clone.js'], function(core, scope, clone) {
	var stack = {},index=1;
	
	core.extend({
		scope: function(subject) {
			/*
			Массив с контекстными объектами. Предположим мы работает в контесте window abs(window) и иницализируем переменную abd(window).static('a', 123).
			Данная переменная будет содержаться в Abstact.mediums.object1
			*/
			if (!subject.hasOwnProperty('__abstract__')) {
				stack[index] = scope(index, subject);
				Object.defineProperty(subject, '__abstract__', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: index
				});
				return stack[index];
			} else {
				return stack[subject.__abstract__];
			}
		}
	});
})
