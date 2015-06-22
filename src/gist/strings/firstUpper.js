define(function() {
	/*
	Преобразует первый символ в строке в заглавный
	*/
	return function(text) {
		return text.charAt(0).toUpperCase()+text.substr(1);
	}
});