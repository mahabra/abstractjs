define(['./../common/extend', './../common/map', './../assay/isPlainObject', './../assay/isArray', './../common/each', './../common/trim'], function(extend, map, isPlainObject, isArray, each, trim) {
	
     var patterns = [];
    patterns.push('([a-z][a-z1-6]*)?');                 // tag
    patterns.push('(?:#([a-z][-\\w]*))?');              // id
    patterns.push('((?:\\.[a-z][-\\w]*)+)?');           // class
    patterns.push('((?:\\[[a-z][^=]*=[^\\]]+\\])+)?');  // attributes
    patterns.push('(?:\\{(.+)\\})?');            
    regScope = /\([^\(\)]*\)/g;
    regScopeId = /^\{#([\d]+)\}$/;
  	// content
    var pattern = '^' + patterns.join('') + '$';

    function trim(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function enumerate(array, callback) {
        for (var i = 0; i < array.length; i++) {
            callback.call(array, array[i], i);
        }
    }

    function decl(spec) {
        spec = spec || '';

        var match = spec.match(pattern);
        if (!match) return null;

        // tag
        var tagName = match[1] || 'div';
        var node = document.createElement(tagName);

        // id
        var id = match[2];
        if (id) {
            node.id = id;
        }

        // class
        var classNames = match[3] ? match[3].split(/\./) : null;
        if (classNames) {
            enumerate(classNames, function(className) {
                node.className += ' ' + className;
            });
            node.className = trim(node.className);
        }

        // attributes
        var attr_spec = match[4];
        var attr_pattern = /\[([a-z][^=]*)=([^\]]+)\]/gi;
        if (attr_spec) {
            var attr_match = attr_pattern.exec(attr_spec);
            while (attr_match) {
                node.setAttribute(trim(attr_match[1]), trim(attr_match[2]));
                attr_match = attr_pattern.exec(attr_spec);
            }
        }

        // content
        var html = match[5];
        if (html) {
            if (false) {
                html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            node.innerHTML = html;
        }

        return node;

    };

    function minbabs(a,b) {
    	
    	if (a>=0 && a<b) return a;
    	else if (b>=0 && b<a) return b;
    	else if (b>=0 && a<0) return b;
    	else if (a>=0 && b<0) return a
    	else return false;
    }

    function appendSublink(el, nel) {
    	window.el = el;
    	var parent = el.parentNode;
	   
	    if(parent.lastChild === el) {
	       	parent.appendChild(nel);
	    	
	    } else {
		     parent.insertBefore(nel, el.nextSibling);
	    }
    }

    var lifes = 9;
    function die() {
    	lifes--;
    	if (lifes>0) return false;
    	return true;
    }

    var id=0,chunks=[];

    var parser = function(htmlcode) {
    	this.el = null;
    	this.op = '>';
    	
    	this.htmlcode = htmlcode;
    }

    parser.prototype = {
    	constructor: parser,
    	renderTo: function(el, op) {
    		var i,scopes;
	    	/*
			Ищим scope и создаем из них chunks
	    	*/
	    	while (regScope.test(this.htmlcode)) {
	    		var scopes = this.htmlcode.match(regScope);

	    		for (i=0;i<scopes.length;i++) {
	    			chunks.push(new parser(scopes[i].substring(1,scopes[i].length-1)));
	    			this.htmlcode=this.htmlcode.replace(scopes[i], '{#'+(chunks.length-1)+'}');
	    		}
	    	}

	    	return this.parse(this.htmlcode, el, op);
    	},
    	parse: function(htmlcode, el, uop, repeat) {
    		
    		uop=uop||'>';
            
	    	var el=el||document.createElement('DIV'),fact=1,nel,al=0,ac,o,op=op||'>',np = minbabs(htmlcode.indexOf('>'),htmlcode.indexOf('+'));
	    	
            if (np===0) {
               
                this.parse(htmlcode.substr(1), el, htmlcode.substr(0,1));
            }
	    	else if (np!==false && np>=0) {
	    		op=htmlcode.substr(np,1)
	    	} else {
	    		op=false;np=htmlcode.length;
	    	}
	    		ac=htmlcode.substr(0, np);
	    		if (ac.indexOf('*')>=0) {
	    			ac = ac.split('*');

	    			
	    			if (isNaN(fact=parseInt(ac[1]))) fact=1;

	    			al=ac[1].length;
	    			ac=ac[0];


	    		}
	    		
	    		if (ac.length>0) {
	    			
	    			if (regScopeId.test(ac)) {
	    				
	    				var nel = chunks[parseInt(ac.match(regScopeId)[1])].renderTo(el, uop, true);

	    					this.parse(htmlcode.substr(ac.length+1), nel, '>', fact);
	    				
	    			} else {

	    				nel = decl(ac);


		    			if (uop==='>') {
		    				try {

		    					el.appendChild(nel);
		    					if (fact>1) {
		    						for (i=1;i<fact;++i) {
		    							el.appendChild(nel.cloneNode(true));
		    						}
		    					}
		    				} catch(e) {
		    					throw 'Zen code has wrong syntax on `'+ac+'`';
		    				}
		    			} else {
                            appendSublink(el, nel);
		    			}
		    			if (htmlcode.length>ac.length+1+al)
						this.parse(htmlcode.substr(ac.length+1), nel, op, fact);
		    			
	    			}
	    			
	    		} else {

	    		}
	    	return el;
    	}
    }

    var parse = function(htmlcode, el) {

    	var parsering = new parser(htmlcode, el, '>');
    	return parsering.renderTo(el);
    }

    return parse;
	
});