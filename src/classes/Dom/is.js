define(['./../Dom','./extras/pseusoQueryMatch.js','$//classes/Eacher/each'], function(Dom, pseusoQueryMatch) {
	Dom.extend({
		is: function(origq) {
			var subject,test,pqs,qs;
			var nativetest = function(subject) {

				test = subject && ( subject.matches || subject[ 'webkitMatchesSelector' ] || subject[ 'mozMatchesSelector' ] || subject[ 'msMatchesSelector' ] );
				if (!(!!test && test.call( subject, origq ))) return false;
				return true;
			};
			(function(p) { qs=p[0].trim(); pqs=p[1]?p[1].trim():false; })(origq.split(':'));
				var accept=true;
				this.each(function(elem){

					try {
						if (!nativetest(elem)) {
							accept = false;
						}
					} catch(e) {
						// Test for pseudo selector
						if (pqs&&!pseusoQueryMatch(elem, pqs)) accept=false;
					}
				});
			return accept;
		}
	});
});