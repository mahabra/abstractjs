
define(['$//$','$//system/api/chargeClass'], function($, Charger) {
	
	$.extend({
		/*
		Функция расширяет первый класс/объект вторым классом/объектом. В качестве аргументов может быть передана и строка,
		тогда поиск классов будет призводиться в core.classes.
		*/
		charge : function() {
			return Charger.apply($, arguments);
		}
	})
});