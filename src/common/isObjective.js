define(function() {
	/*
	Функция возвращает объект, если он объект и false, если нет.
	*/
	return function(subject) {
		if ("object"===typeof subject || "function"===typeof subject) return subject;
		return false;
	}
});