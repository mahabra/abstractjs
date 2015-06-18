define(['./../core.js'], function(core) {
	var Register;
	Register = function(path, value) {
		var p = path.split(':'),current=Register;
		for (var i = 0; i<p.length-1;++p) {
			if (!("function"===typeof current || "object"===typeof current)) {
				throw "Cant get property of non-object register element `"+path+"`";
			} else {
				if ("object"!==typeof current[p]) {
					current[p] = {};
				}
			}
		}
		if ("undefined"!==typeof value) {
			current[p+1] = value;
			return this;
		} else {
			return current[p+1];
		}
	}
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/
	core.extend({
		register: Register
	});
});