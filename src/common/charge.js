define(['./extend.js','./mixin.js'], function(extend, mixin) {
	/* Расширяет объект классом */
	return function(target, exhibitor) {
		/*
		Создаем единый слой свойств из прототипов класса
		*/
		var overprototype = {};
		if ("object"===typeof exhibitor.prototype.__super__) {
			mixin(overprototype, exhibitor.prototype.__super__);
		}
		mixin(overprototype, exhibitor.prototype);
		
		/*
		Если мы имеем доступ к __proto__ то расширяем прототип, если нет - то придется расширять сам объек
		*/
		if ("object"===typeof target.__proto__) {
			/*
			Производим слияние прототипа цели с прототипом экспонента
			*/
			mixin(target.__proto__, overprototype);
		} else {
			extend(target, overprototype);
		}

		/*
		Воспроизводим конструкторы
		*/
		exhibitor.apply(target);
		
		return target;
	}

});