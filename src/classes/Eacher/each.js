define(['./../Eacher.js','$//gist/assay/isObjective/','$//gist/assay/isRichObjective/'], function(Eacher, isObjective, isRichObjective) {
	Eacher.extend({
		each: function(callback) {
			var operand, method=0;
			if (this.__subject__ && isRichObjective(this.__subject__)) {
				operand=this.__subject__;method=1;
			} else if (this.__subject__ && isObjective(this.__subject__)) {
				operand=this.__subject__;method=0;
			} else if (isRichObjective(this)) {
				operand=this;method=1;
			} else {
				operand=this;method=0;
			}

			if (method===1) {
				if ("number"===typeof operand.length)
				for (var i = 0;i<operand.length;++i) {
					if (callback.call(operand[i], operand[i], i)===false) break;
				}
				return operand;
			} else {
				for (var prop in operand) {
					if (operand.hasOwnProperty(prop)) {
						if (callback.call(operand[prop], operand[prop], prop)===false) break;
					}
				}
			}
		}
	});
});