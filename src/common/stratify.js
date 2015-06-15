define(function() {
	/*
	Функция разделяет объект на два объекта. В первом содержаться только свойства, а во втором только функции.
	*/
	return function(source) {
		var res=[{},{}];
		
		for (var prop in source) {

			if (source.hasOwnProperty(prop)) {

				if ("function"===typeof source[prop]) {
					res[1][prop] = source[prop];
				} else {
					res[0][prop] = source[prop];
				}
			}
		}

		return res;
	}
});