define(function() {
	return function(str){
	  if (str.trim) return str.trim();
	  return str.replace(/^\s*|\s*$/g, '');
	}
});