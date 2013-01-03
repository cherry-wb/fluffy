// Copyright (c) Grant Murphy
var _ = require('underscore')

module.exports = (function() {

	// Limits 
	var MAX_UNKNOWN		= 1;
	var MAX_DIGITS		= 1000;
	var MAX_CHARS		= 1000;
	var MAX_OBJECT		= 100;
	var MAX_ARRAY 		= 100;		
	var MAX_EXPONENT 	= 1000;
	var MAX_DEPTH		= 5;

	// Counters
	var digits 			= 0;
	var characters 		= 0;
	var object_size		= 0;
	var array_size 		= 0; 
	var exp 			= 0; 
	var def 			= 0;

	var state = []
	var saved = null;

	// as in heads or tails..
	function heads(){
		var res = _.random(1)
		return 0 == res;
	}

	function init(){

		if (heads()){
			return 'object'
		} 
		return 'array'
	}

	function optional(opts){
		if (heads()){
			var fn = _.values(opts)[0]
			fn()
		}
	}

	function choose(choices){
	
        var callbacks = _.clone(choices)
        var current = state[state.length-1]
        if (current === 'key' || current === 'value'){
            callbacks = _.omit(callbacks, 'custom')
        }
        var ks = _.keys(callbacks)
		var k = ks[_.random(0, ks.length-1)]
		var fn = callbacks[k]
		fn();
	}

	function more(){

		var current = state[state.length-1]
		var depth = state.length;
		var too_deep = false;
		if (depth > _.random(1, MAX_DEPTH)){
			too_deep = true;
		}
	
		var reset_counter = false;
		if (saved !== current){
			reset_counter = true;
			saved = current;
		}

		switch (current){

			case 'number': 
				
				if (reset_counter)
					digits = 0; 

				digits++;
				if (digits >= _.random(1, MAX_DIGITS)){
					return false;
				}
				break;

			case 'string': 
				if (reset_counter)
					characters = 0;
				characters++;
				if (characters >= _.random(1, MAX_CHARS)){
					//characters = 0; 
					return false;
				}
				break;
			
			case 'object': 
				if (reset_counter)
					object_size = 0; 

				if (too_deep)
					return false;

				object_size++;
				if (object_size >= _.random(0, MAX_OBJECT)){
					//object_size = 0; 
					return false;
				}
				break;

			case 'array':
				if (reset_counter)
					array_size = 0; 

				if (too_deep)
					return false;

				array_size++;
				if (array_size >= _.random(0, MAX_ARRAY)){
					//array_size = 0;
					return false;
				}
				break;

			case 'exponent':
				if (reset_counter)
					exp = 0; 

				exp++; 
				if (exp >= _.random(1, MAX_EXPONENT)){
					//exp = 0; 
					return false;
				}
				break;

			default: 
				throw ('Unexpected state')

		}
		return true;	
	}

	return { 
		
		optional: optional, 
		choose: choose, 
		more: more,
		
		enter : function(type){	
			//console.log('enter: ' + type)
			state.push(type)
		},

		leave : function(type){
			//console.log('leaving: ' + type)
			if (type !== state.pop())
				this.err('Transitioning from unexpected state: ' + type)
		},
	}

}())

