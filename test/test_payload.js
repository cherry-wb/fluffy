var payload = require('../').payload.memory
var should = require('should')

describe('Test Undo', function(){

	it('Should find the last comma and remove it.', function(){

		var expected = '{\n"key":"value"\n}'
		payload.reset()
		payload.write('{')
		payload.write('\n')
		payload.write('"key"')
		payload.write(':')
		payload.write('"value"')
		payload.write(',')
		payload.write('\n')
		payload.undo(',')
		payload.write('}')

		var actual = payload.get()
		should.equal(expected, actual)

	})

})
