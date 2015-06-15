define(['./inheritClassPrototype.js'],function(inheritClassPrototype) {
	return function(object, theclass) {
		
		inheritClassPrototype(object, theclass._prototype);

		/* Конструируем класс */
		theclass.constructWithin(object, [])
		return object;
	}
});