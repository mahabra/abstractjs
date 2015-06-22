define(function() {
	/*
	Функция возвращает объект, если он объект типа RichArray
	*/
	return function(subject) {
		if (("object"===typeof subject || "function"===typeof subject) && "number"===typeof subject.length) return subject;
		return false;
	}
});