// Copyright (c) Grant Murphy
var _  = require('underscore')
var fs = require('fs')

module.exports = (function(){

	// Used to ensure that certain undo actions only 
	// occur within the specified boundaries.
	var boundary = ['[', '{', '"', '[']
	var engine  = null;
	var payload = null;
	var generator = null; 

	function put(c){
		payload.write(c)
	}

	function key(){
		engine.enter('key')
		engine.choose({
            'custom'   : function(str){ put(str || 'foo')  },
			'string'   : function(){ string(true) } 
		})
		engine.leave('key')
	}

	function value(){

		engine.enter('value')
		engine.choose({
            'custom' : function(str){ put(str || 'bar') },
			'string' : function(){ string() }, 
			'number' : function(){ number() }, 
			'object' : function(){ object() }, 
			'array'  : function(){ array() }, 
			't'      : function(){ put('true')},
			'f'      : function(){ put('false')}, 
			'nil'    : function(){ put('null')} 
		})
		engine.leave('value')
	}


	function object(){

		engine.enter('object')
		put('{')
		put('\n')
		while (engine.more()){
			key()
			put(' ')
			put(':')
			put(' ')
			value()
			put(',')
			put('\n')
		}
		payload.undo(',', boundary)
		put('}')
		engine.leave('object')
	}

	function array(){

		engine.enter('array')
		put('[')
		while (engine.more()){
			value()	
			put(',')
		}
		payload.undo(',', boundary)
		put(']')
		engine.leave('array')
	}

	function uenc(n){

		var cs = n.toString(16).split("")
		while (cs.length < 4){
			cs.unshift('0')
		}	
		cs.unshift("\\u")
		return cs.join("")
	}

	function unicode(){
		
		engine.enter('unicode')
		engine.choose({

			'latin'		: function(){ put(uenc( _.random(0x0000, 0x00FF)))},
			'spacing' 	: function(){ put(uenc( _.random(0x02B0, 0x02FF)))},
			'symbols' 	: function(){ put(uenc( _.random(0x20A0, 0x20CF)))}
		})
		engine.leave('unicode')
	}

	function escaped(){

		engine.enter('escaped')
		put('\\')
		engine.choose({
			'quote'  	: function(){put('"')}, 
			'fslash' 	: function(){put('/')}, 
			'bslash' 	: function(){put('\\')},
			'backspace'	: function(){put('b')}, 
			'formfeed' 	: function(){put('f')}, 
			'newline'  	: function(){put('n')}, 
			'carriage' 	: function(){put('r')}, 
			'tab' 		: function(){put('t')} //, 
			// 'unicode' 	: function(){ unicode()}
		})
		engine.leave('escaped')
	
	}

	function string(){
	
		engine.enter('string')
		put('"')

		while (engine.more()){
			engine.choose({
				'sequence'	: function(){ put(generator.seq())}, 
				'single'	: function(){ put(generator.one())}, 
				'escaped'	: function(){ escaped()				},
				'unicode' 	: function(){ unicode() 			}
			})
		}
		put('"')
		engine.leave('string')
	}

	function exponent(){

		engine.enter('exponent')

		put('e')
		engine.choose({
			'positive' : function(){ put('+')}, 
			'negative' : function(){ put('-')}
		})
		put(_.random(1, 9))
		while (engine.more()){
			put(_.random(0, 9))
		}

		engine.leave('exponent')
	}

	function number(){

		engine.enter('number')

		engine.optional({ 'negative' : function(){ put('-')}})
		engine.choose({
			'zero' : function(){ put('0') }, 
			'digit': function(){ put(_.random(1, 9))}
		})

		if (payload.peek() !== '0'){
			while (engine.more()){
				put(_.random(0, 9))
			}
		}
		engine.optional({ 'decimal' : function(){ put('.')}})
		if (payload.peek() === '.'){
			put(_.random(0, 9))
			while (engine.more()){
				put(_.random(0,9))
			}
		}

		engine.optional({ 'exponent' : exponent})
		engine.leave('number')
	}

	return { 

		buildPayload : function(dest, strategy, dict, type){

			payload = dest; 
			engine  = strategy; 
			generator = dict;

			switch (type){
			
				case 'object': 
					object();
					break;
				case 'array': 
					array();
					break;
				case 'key': 
					key();
					break;
				case 'value':
					value()
					break;

				default: 
					throw('Cannot create: ' + type)
			}
		}
	}

}())

// exports.json = json.generate;
// exports.setup = json.setup;

