// Copyright (c) Grant Murphy	
var _ = require('underscore')
var fs = require('fs')

module.exports = (function(){

	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890"; 
	var symbols  = "`~!@#$%^&*()_-=+[]{}|;:<>,./?'";
	var dict = __dirname + '/dict.txt'
	var word_size = 64 // wc -L = 28.

	return { 
		seq : function(){

			try { 

				var stat = fs.statSync(dict)
				var buf  = new Buffer(word_size)
				var fd   = fs.openSync(dict, 'r')
				var nread = fs.readSync(fd, buf, 0, word_size, _.random(0, stat.size))
				fs.closeSync(fd)

				var choices = buf.toString('utf8', 0, nread).split('\n')
				choices.splice(0,1)
				choices.splice(choices.length-1, 1)
				return choices[_.random(0, choices.length-1)]

			} catch (e){
				console.log(e)
				return "doh";
			}

		},

		one: function(){

			if (_.random(0, 1) == 0){
				return alphabet[_.random(0, alphabet.length-1)]
			} 

			return symbols[_.random(0, symbols.length-1)]
		}
	}

}())
