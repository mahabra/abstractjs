define(['./$.js','$//gist/common/extend'], function(core, extend) {
	/* Разработчик позволяет создавать новые веб-приложения формируя четкую структуру движка */
	core.developer = {};

	function ProgrammConstructor(config, scope) {
		this.config = extend({
			location:'',
			includes:[],
			requires:[],
			interface: function() {
				return app.module;
			}
		}, config);
		this.scope = scope;
		this.module = {};
	};

	/*
	Функция колбэк должна формироваться через фабрику, при примом построение в функции
	происходит очень не хороший глюк, технические подробности которого боюсь останутся
	мне непонятным пока однажды я не загляну в исходники Javascript. Но тем не менее, если
	создавать анонимную функцию непосредственно в аргументах anonymModule, происходит перезапись
	функций, переданной в другом приложении. Не смотря на то, что, казалось бы, функция каждый раз 
	создается анонимно.
	В общем, необходимо использовать фабрики как можно чаще. Такой уж он Javascript, великий и
	загадочный.
	*/
	var moduleTesterFactory = function(app, callback) {
		return function() {
			
			app.module = app.scope.apply(core, Array.prototype.slice.call(arguments, 0, app.config.requires.length));
			callback(app.config.interface.call(app));
		}
	}

	/*
	Программа
	config.requares - список компонентов, которые должны быть включены в аргументы функции scope
	config.includes - списоко компонентов, которые должны быть включены в пассивном режиме
	scope - это функия, которая должна возвращать функцию.
	Это сделано для того, что бы программа могла иметь приватные данные. Все приватные переменные указываются в scope,
	а используются в функции, которую scope возвращает.
	*/
	core.developer.programm = function(config, scope) {
		
		var Programm = new ProgrammConstructor(config, scope);

		Programm.test = function(callback) {
			
			vendor.anonymModule(null, this.config.requires.concat(this.config.includes), moduleTesterFactory(this, callback), {
				location: this.config.location,
				watch: true
			});
			
		}

		return Programm;
	}

	return core.developer;
});