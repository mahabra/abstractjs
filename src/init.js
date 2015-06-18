define([
	'./core/core.js',
	'./core/core-ext.js',
	'./core/medium.js',
	/* Абслуживание абстрактных классов */
	'./classes/defaults.js',
	'./polyfills/forEach.js'
	], function(core) {

		window.Abstract = window.abs = window.$ = core;
});