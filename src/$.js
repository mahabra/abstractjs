define(['$//gist/common/extend.js','$//system/api/determineClass.js','$//system/api/chargeClass.js','$//system/api/isNativeClass.js'], function(extend,determineClass,chargeClass, isNativeClass) {
	/*
	Ядро движка абстракт является функцией-оберткой. Любой объект может быть обернут в функцию
	и в зависимости от подключенных компонентов, он будет снабжен определнным количеством функционала.
	*/
	var Abstract = function(subject, forcetype){
		var abstraction,i;
		if ("object"===typeof subject && subject.__abstract__) {
			/*
			В обертку передана абстракция, мы можем просто вернуть её, но должны добавить к её типу forcetype, 
			если он есть.
			*/
			if (forcetype) {
				subject = chargeClass.call(Abstract,abstraction,forcetype);
			}
			return subject;
		} else {
		/*
		Определение абстрактного класса происходит путем прогонки объекта через функцию determineClass
		*/
		var abstractClasses= determineClass.call(Abstract, subject);
		}
		/*
		Если указан принудительный тип, то он добавляется к списку
		*/
		if (forcetype&&abstractClasses.indexOf(forcetype)<0) abstractClasses.push(forcetype);
		/*
		В целях раскрытия потенциала движка, абстрация так же является функций. В данный момент она
		не выполняет никакой роли. Это оставлено на будущее.
		*/
		abstraction=function() {};
		/*
		Прототип абстрации снабжается рядом ключевых свойств, которые позволяют расширениям получать
		доступ к исходному субьекту или к его абстрактным классам
		*/
		abstraction.prototype = Object.create({}, {
			/*
			Каждая абстракция хранит в себе сведение о самой себе, такие как абстрактные классы и прочее, что
			в этой версии пока не декларировано.
			*/
			__abstract__: {
				configurable: false, enumerable: true, writable: true,
				value: {
					classes: abstractClasses
				}
			},
			/*
			Самым главным свойством абстрактного класса является __subject__, он хранит ссылку на объект, который
			был обернут в абстракцию. Это свойство невозможно перезаписать.
			*/
			__subject__: {
				configurable: false, enumerable: true, writable: true,
				value: subject
			}
		});
		/*
		Финальным этапом формирования абстракции является микширование его протипа расширениями, которые 
		привязаны к его абстрактным классам.
		*/
		
		for (i=0;i<abstractClasses.length;++i) {
			
			abstraction = chargeClass.call(Abstract,abstraction,abstractClasses[i]);
		}

		return new abstraction();

	};
	/*
	Для удобства расширения движка оно снабжено встроенной функцией extend.
	*/
	Abstract.extend = function(data) {
		extend(Abstract, data);
		return Abstract;
	};
	/*
	Ядро имеет базовый массив classes, в котором хранятся классы, расширяющие абстракции.
	К примеру класс RichArray снабжает все объекты и массивы функциями each и map. Однако для использования each и map,
	это методы класса так же должны быть подключены.
	*/
	Abstract.classes = {};
	/*
	Когда создается абстракция объекта, ему присваивается несколько абстрактных классов. Исходя из этих абстрактных классов
	абстракция миксуется с расширениями привязанным к этим классам. 
	Когда в системе регистрируется новое расширение оно добавляет сведения о том к каким именно абстрактным классам они
	привязаны. Сведения об этих связях содержатся в массиве движка classesBindings
	*/
	Abstract.classesBindings = {};
	/*
	Регистрация новой привязки. Первый аргумент - это имя абстрактого класса, который будет привязан. Второй - иия абстрактного
	класса, к которому этот класс будет привязан. Когда будет создаваться абстракция функционал всех привязанных классов будет 
	передан абстракции.
	*/
	Abstract.bindClass = function(className, detClassName) {
		if ("undefined"===typeof Abstract.classesBindings[detClassName]) Abstract.classesBindings[detClassName] = [];
		if (Abstract.classesBindings[detClassName].indexOf(className)<0) {
			Abstract.classesBindings[detClassName].push(className);
		}
		return this;
	}
	/*
	Функция determineClass, играющая ключевую роль в построении абстракции определяет абстрактный класс объекта по 
	особым признакам, функции для определения которых хранятся в корневом объекта движка sings
	*/
	Abstract.sings = {};
	/*
	Любое расширение может зарегистрировать новый опозновательный признак через функцию registerSing.
	Функция требует указание названия класса, базового типа объекта и функции распознователя.
	*/
	Abstract.registerSing = function(type, name, determiner) {
		if ("object"!==typeof Abstract.sings[type]) Abstract.sings[type]={};
		Abstract.sings[type][name] = determiner;
		return Abstract;
	}

	return Abstract;
});