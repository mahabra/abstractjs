/*
Get element abstract class
*/
define(function() {
	var detectors = {
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
			// Detecting absApplication
			"absApplication": function(res) {
				if (res.hasOwnProperty('app__')) return true; return false;
			},
			// Detect Rich object
			"RichArray": function(res) {
				if (!(res instanceof Array) && "integer"===typeof res.index) return true; return false;
			}
		},
		"string": {
			// Detect selector
			"Selector": function(res) {
				if (/^[>#\.]{0,2}[^'"]+[a-zA-Z0-9\[]+/.test(res)) return true; return false;
			},
			// Json
			"JSON": function(res) {
				if (/^[\{]{1}[\s\S]*[\}]{1}$/gi.test(res)) return true; return false;
			}
		}
	};
	return function(subject) {
		if (detectors[typeof subject]) {
			for (var s in detectors[typeof subject]) {
				if (detectors[typeof subject].hasOwnProperty(s)) {

					if (detectors[typeof subject][s](subject)) {
						return s;
					}
				}
			}
		}
	}
});