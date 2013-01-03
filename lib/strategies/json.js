var _ = require('underscore')

module.exports = (function(){

    var used            = []
    var states          = []
    var blueprint       = null;
    var knowledge       = {}
    var limit           = 100;
    var nesting         = 10;
    var counter         = 0;
    var url_parameter   = false;
    var required_value  = undefined;

    function remember(keyword, value){

        if (typeof knowledge[keyword] === 'undefined'){
            knowledge[keyword] = [ value ]
        } else {
            if (knowledge[keyword].indexOf(value) < 0)
                knowledge[keyword].push(value)
        }
        console.log(knowledge)
    }

    function recall(keyword){
        return knowledge[keyword]
    }

    function random(xs){

        var ks = _.keys(xs)
        var exceptions = ['custom', 'object', 'array'] 
        var picks = _.difference(ks, exceptions)
        var k = picks[_.random(0, picks.length-1)]
        var f = xs[k]
        f();
    }

   function nested(){

        var i = 0;
        _.each(states, function(s){
            if (s === 'object') 
                i++
        })
        return i > nesting 
    }


    function toomany(){
        
        switch (state()){
        
            case 'string':
            case 'number': 
            case 'exponent': 
                counter ++;
                if (counter > limit){
                    counter = 0;
                    return true;
                }
                break;
            case 'object': 
            case 'array' : 
                return nested()
            
            default: 
                return false
        }
    }


    function state(){
        return states[states.length-1]
    }


    function optional(opts){

        var option = _.first(_.keys(opts))
   	    if (! _.contains(used, option)){
            if (_.random(0, 1) === 0){
                var f = opts[option];
                used.push(option)
                f()
            }
        }
    }

    function choose(from){

        console.log('choose - ' + state())
        switch (state()){

            case 'key'      : 

                var requirements =  _.filter(blueprint.required, function(k){
                                return _.indexOf(used, k.name) === -1
                            })

                var req = requirements.shift()
                if (! req){

                    var f = from['string']
                    f()

                } else {

                    var known = recall(req.name)
                    if (known){
                        required_value = known[_.random(0, known.length)]

                    } else if (req.defaults && req.defaults.length > 0 && req.valid.length <= 0){
                        required_value  = req.defaults[0]

                    } else if (req.valid && req.valid.length > 0){
                        required_value = req.valid[_.random(0, req.valid.length-1)]

                    } else { 
                        required_value = undefined;
                    }
                    var f = from['custom']
                    f('"' + req.name + '"')
                    used.push(req.name)
                }

                break;
                
            case 'value'    : 
                
                if (! url_parameter){
                    if (required_value){
                        var f = from['custom']
                        f('"' + required_value + '"')

                    } else {
                        random(from)
                    }
                }
                required_value = undefined;
                url_parameter = false;
                break;

            default: 
                random(from)
        }
    }

    function more() {


        switch(state()){
            case 'object'   : 
            case 'array'    : 
            case 'key'      : 
            case 'value'    : 
                var met = 0;
                var needed = blueprint.required.length
                _.each(blueprint.required, function(k){
                    console.log('k = ' + k.name)
                    if (_.contains(used, k.name)){
                        met++;
                    }
                })
                console.log('met - ' + met)
                console.log('needed - ' + needed)
                return needed > met;

            default: 
                return !toomany()
        }
    }

    function enter(type){
        console.log('-->' + type)
        states.push(type)    
    }

    function leave(type){

        if (type === 'key' || type === 'value'){
            counter = 0;
        }

        if (type !==  states.pop()){
            throw ("Transitioned from an unexpected type: " + type)
        }
        console.log('<--' + type)
    }

    function init(plan){
        blueprint = plan
    }


    return { 
        init    : init, 
        enter   : enter, 
        leave   : leave, 
        more    : more, 
        choose  : choose, 
        optional: optional, 
        remember: remember,
        recall  : recall
    }

}())
