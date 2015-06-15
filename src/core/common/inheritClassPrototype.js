define(['./../../common/mixin.js'],function(mixin) {
	/*
	Перемешивание прототипов двух абстрактных классов. Вначале суперпрототип класса смешивается с суперпрототипом наследуемого класса,
	затем суперпрототип смешивается с прототипом наследуемого класса. Таким образом весь миксинг происходит в суперпрототипе класса.
	*/
	return function(target, proto) {
		if (target._superPrototype_) {
			/* Расширяем прототип */
			mixin(target._superPrototype_, proto._superPrototype_);
			mixin(target._superPrototype_, proto._prototype_);
		} else if (target.__proto__ && "function"!==typeof target) {

			/* Мы имеем дело с непропатченым объетом, поэтому копируем прототип класса прямо в __proto__ */
			mixin(target.__proto__, proto._superPrototype_);
			mixin(target.__proto__, proto._prototype_);
			
		} else {
			/* Отсутсивие поддержки __proto__, пишем прямо в объект */
			mixin(target, proto._superPrototype_);
			mixin(target, proto._prototype_);
		}
		
	}
});