
var generator 	= require('../').generators.general
var payload 	= require('../').payload.memory
var strategy 	= require('../').strategies.jiberish
var builder 	= require('../').builders.json
var should 		= require('should')

function dump (str){
	console.log('--------------------------------------')
	console.log(str)
	console.log('--------------------------------------')
}

describe('Garbage JSON payloads', function(){

	it('JSON produced is both valid and random', function(){

		for (var t = 0; t < 1000; t++){
			
			payload.reset()
			if (t % 2 == 0)
				builder.buildPayload(payload, strategy, generator, 'object')
			else
                builder.buildPayload(payload, strategy, generator, 'array')

			var obj = null;
			try { 
				obj = JSON.parse(payload.get())//.should.not.throw();
				if (typeof obj === 'undefined' || obj === null){
					dump(payload.get())	
				}
			} catch (e){
				dump(payload.get())
				console.log(e)
			}	
			should.exist(obj)	
			//dump(payload.get())
		}

	})

})
