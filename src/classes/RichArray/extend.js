define(['./../RichArray.js', '$//gist//assay/isObjective.js','$//gist/common/extend.js'], function(RichArray, isObjective, extend) {
	RichArray.extend({
		extend: function(data) {
			var operand = isObjective(this.__subject__)||this;
			if ("object"!==typeof data) {
				throw (typeof (operand))+'cant be extended by non-object';
				
			} else {
				extend(operand, data);
			}
			return this;
		}
	});
});