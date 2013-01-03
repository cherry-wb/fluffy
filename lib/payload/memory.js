// Copyright (c) Grant Murphy
//----------------------------
// shitty in memory list 
// buffer / payload storage
//
var _ = require('underscore')

module.exports  = (function(){
	
	var buffer = [];
	
	return {

		reset : function(){
			buffer = []
		},

		write : function (c){
			buffer.push(c)
		},

		// Undo an entry within the payload 
		// unless one of the specified delimiters 
		// are encountered first
		undo : function(entry, delimiters){
			
			var delim = delimiters
			if (typeof delim === 'undefined')
				delim = []

			if (_.contains(delim, entry))
				return

			var index = buffer.lastIndexOf(entry)
			if (index >= 0){
				
				for (var pos = buffer.length-1; pos > index; pos--){
					if (_.contains(delim, buffer[pos]))
						return;
				}

				buffer.splice(index,1)
			}
		},

	 	peek : function(){
			return buffer[buffer.length-1]
		}, 

		get : function(){
			return buffer.join("")
		}
	}

}())

