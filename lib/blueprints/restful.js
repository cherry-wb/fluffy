var _ = require('underscore')
/*
akin to rails / backbone.js

comments      GET       /comments(.:format) 
              POST      /comments(.:format)
new_comment   GET       /comments/new(.:format)
edit_comment  GET       /comments/:id/edit(.:format)
comment       GET       /comments/:id(.:format)
              PUT       /comments/:id(.:format)
              DELETE    /comments/:id(.:format) 

*/

exports.restful = function(base, resource, id, fmt){

	var format = function(path){
		if (fmt)
			path.push(fmt)
		return path
	}

	var restapi = {
		LIST	: { 
			method: 'GET', 		
			path: format([(base || ''), resource]).join('/')
		},
		CREATE 	: { 
			method: 'POST', 	
			path: format([(base || ''), resource]).join('/')			
		},
		NEW    	: { 
			method: 'GET',	
			path: format([(base || ''), resource, 'new']).join('/')
		},
		EDIT 	: { 
			method: 'GET',
			path: format([(base || ''), resource, (id || '{0}'), 'edit']).join('/')
		},
		SHOW	: { 
			method: 'GET', 
			path: format([(base|| ''), resource, (id || '{0}')]).join('/')
		},
		UPDATE	: { 
			method: 'PUT',
			path: format([(base|| ''), resource, (id || '{0}')]).join('/')
		},
		DESTROY : { 
			method: 'DELETE', 	
			path: format([(base|| ''), resource]).join('/')
		}
	}

	var content_type = 'application/json'
	if (fmt && fmt === '.xml')
		content_type = 'text/xml' // <-- is that right?
    
    _.each(_.keys(restapi), function(k){

        var apicall = restapi[k];
        apicall['headers'] = { 
            'Accept'        : '*/*',
            'Content-Type'  : content_type
        }

        if (apicall.method !== 'POST' && apicall.method === 'PUT') {
            var headers = apicall['headers']
            delete headers['Content-Type']
        }

    })

	return {
		actions : restapi,
		required: '', 
		optional: '' 
	}
}
