define(['$//gist/strings/firstUpper.js'], function(firstUpper) {
	
	return function(subject) {
			var variants = [];
			var resourceType = typeof (subject),
			abstractClass = firstUpper(resourceType);
			variants.push(abstractClass);

			if (this.sings[resourceType]) {

				for (var s in this.sings[resourceType]) {

					if (this.sings[resourceType].hasOwnProperty(s)) {

						if (this.sings[resourceType][s](subject)) {
							variants.push(firstUpper(s));
						}
					}
				}
			}

			return variants;
	}
});