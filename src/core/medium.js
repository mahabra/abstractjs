define(['./core.js','./medium/scope.js','./../common/clone.js','./../common/isObjective.js'], function(core, scope, clone, isObjective) {
	var stack = {},index=1;
	
	core.extend({
		scope: function(subject) {
			/*
			Массив с контекстными объектами. Предположим мы работает в контесте window abs(window) и иницализируем переменную abd(window).static('a', 123).
			Данная переменная будет содержаться в Abstact.mediums.object1
			*/
			if (isObjective(subject)===false) {
				/*
				Субьект не является объектом, поэтому мы создаем анонимную абстракцию
				*/
				return scope(0, subject)
			}
			if (!subject.hasOwnProperty('__abstract__')) {
				stack[index] = scope(index, subject);
				Object.defineProperty(subject, '__abstract__', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: index
				});
				++index;
				return stack[subject.__abstract__];
			} else {
				return stack[subject.__abstract__];
			}
		}
	});
})
