define(function() {
	return function(elem, type, userEventHandler) {
		if ( elem.addEventListener ) {
			elem.removeEventListener(type, userEventHandler||false, false);
		}  else if ( elem.attachEvent ) {
			 element.detachEvent("on" + type, userEventHandler);
		} else {
			elem["on"+type] = null;
		};
	};
});