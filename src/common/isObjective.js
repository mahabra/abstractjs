define(function() {
	/*
	Функция возвращает объект, если он объект и false, если нет.
	*/
	return function(subject) {
		if ( ("object"===typeof subject && (subject.toString().substr(0,12)!=="[object HTML")) || "function"===typeof subject) return subject;
		return false;
	}
});