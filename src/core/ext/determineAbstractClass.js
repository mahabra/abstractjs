define(['./../core.js','./../../common/firstToUpper.js','./../var/htmlTags.js'], function(core, firstToUpper, htmlTags) {
	
	var determineAbstractClass = {
		"object": {
			"Null": function(res) {
				if (res===null)  return true; return false;
			},
			// Detect Array
			"Array": function(res) {
				if (res instanceof Array) return true; return false;
			},
			// Detect HTMLElement
			"HTMLElement": function(res) {
				if (res.toString().substr(0,12)==="[object HTML") return true; return false;
			},
			// Detect date object
			"Date": function(res) {
				if (res instanceof Date) return true; return false;
			},
			// Detect Rich object
			"RichArray": function(res) {
				if (!(res instanceof Array) && res.hasOwnProperty('length') && "number"===typeof res.length) return true; return false;
			}
		},
		"string": {
			// Detect selector
			"Selector": function(res) {
				var tsp = res.split(/[> ]+/),wrong=false;
				console.log('tsp', tsp);
				core(tsp).each(function(piece) {
					if (htmlTags.indexOf(piece.toUpperCase())>=0) return false;
					if (/^[>#\.[]]{0,2}[^'", ]+[a-zA-Z0-9\-\[]+/.test(piece)) { return false; } else { console.log('piece', piece); wrong=true; }
				});
				return !wrong;
			},
			// Json
			"Json": function(res) {
				if (/^[\{]{1}[\s\S]*[\}]{1}$/gi.test(res)) return true; return false;
			}
		}
	} 

	
	/*
	Регистрирует в системе новый класс на основе шаблона дефолтного абстрактного класса
	*/

	core.extend({
		determineAbstractClass: function(subject) {
			var variants = [];
			var resourceType = typeof (subject),
			abstractClass = firstToUpper(resourceType);
			variants.push(abstractClass);
			if (determineAbstractClass[resourceType]) {

				for (var s in determineAbstractClass[resourceType]) {

					if (determineAbstractClass[resourceType].hasOwnProperty(s)) {

						if (determineAbstractClass[resourceType][s](subject)) {
							variants.push(firstToUpper(s));
						}
					}
				}
			}

			return variants;
		}
	});
});