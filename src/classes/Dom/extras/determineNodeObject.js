define(['./../../../core/core.js', './../messages/warns.js', './createChild.js', './../../../common/toArray.js'], function(core, warns, createChild, toArray) {
	return function(subject, data) {
		var objects = [],
		absClass=core.determineAbstractClass(subject);
		switch(absClass[0]) {
			case "HTMLELement":
				/* Force HTML Elements */
				objects = [subject];
			break;
			case "Selector":
			case "String":
				/* Create element */
				objects = createChild(subject, data||{});
			break;
			case "Brahma":
			case "jQuery":
			case "Array":
			case 'RichArray':
				objects = toArray(subject);
			break;
			default:
				core.warn(warns['b_selector_uncom_format']+' '+absClass[0]);
			break;
		};

		return objects;
	}
})