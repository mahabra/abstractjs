var assembler = require('vendorjs').assembler;

assembler.config.out = './dist/abstract.js';
assembler.config.minOut = './dist/abstract.min.js';
var fileContent = assembler.build('./src/init.js');
//console.log('fileContent', fileContent);