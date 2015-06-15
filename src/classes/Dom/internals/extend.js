define(['./../Dom.js','./../../../common/extend.js'], function(Dom, extend) {
	Dom.proto({
		extend: function(data) {
			extend(this, data);
		}
	});
});