define(function() {
	/*
	В этой функции первым аргументом идет ключ, а не value. Посему я считаю её морально устаревшей. Обратка в forEach или через обертку.
	*/
	return function(obj, fn, ctx) {
		ctx = ctx || this;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				fn.call(ctx, prop, obj[prop]);
			}
		}
		return obj;
	}
});