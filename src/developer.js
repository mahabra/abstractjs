define(['./$.js','$//gist/common/extend'], function(core, extend) {
	/* Разработчик позволяет создавать новые веб-приложения формируя четкую структуру движка */
	core.developer = {};


	/*
	Программа
	config.requares - список компонентов, которые должны быть включены в аргументы функции scope
	config.includes - списоко компонентов, которые должны быть включены в пассивном режиме
	scope - это функия, которая должна возвращать функцию.
	Это сделано для того, что бы программа могла иметь приватные данные. Все приватные переменные указываются в scope,
	а используются в функции, которую scope возвращает.
	*/
	core.developer.programm = function(config, scope) {
		
		var ProgrammConstructor = function(config, scope) {
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
		
		var Programm = new ProgrammConstructor(config, scope);

		Programm.test = function(callback) {
			app=this;

			vendor.anonymModule(null, app.config.requires.concat(app.config.includes), function() {
				app.module = app.scope.apply(core, Array.prototype.slice.call(arguments, 0, app.config.requires.length));
				callback(app.config.interface.call(app));
			}, {
				location: app.config.location
			});
			
		}

		return Programm;
	}

	return core.developer;
});