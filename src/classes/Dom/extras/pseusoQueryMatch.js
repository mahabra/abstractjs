define(function() {
	return function(subject,pqs) {
		switch(pqs) {
			case 'visible':
				return (function(cstyle) {
					return !(cstyle.display==="none" || cstyle.visibility==="hidden" || parseInt(cstyle.opacity)===0);
				})(window.getComputedStyle(subject));
			break;

		}
	}
});