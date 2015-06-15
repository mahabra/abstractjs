define(function() {
	return function(elem, type, userEventHandler, once) {
		var eventHandler;

		eventHandler = function(e) {
			if (once) {
				if ( elem.addEventListener ) {
					elem.removeEventListener(type, eventHandler, false);
				}  else if ( elem.attachEvent ) {
					 element.detachEvent("on" + type, eventHandler);
				} else {
					elem["on"+type] = null;
				};
			};

			// Prevent default event handler if user returns false
			if ((function(r) { return (typeof r==="boolean" && r===false) })(userEventHandler.apply(this, arguments))) {

				e.preventDefault();
			};
		};
	    if (elem == null || typeof(elem) == 'undefined') return;
	    if ( elem.addEventListener ) {

	        elem.addEventListener( type, eventHandler, false );
	    } else if ( elem.attachEvent ) {
	        elem.attachEvent( "on" + type, eventHandler );
	    } else {
	        elem["on"+type]=eventHandler;
	    }
	}
});