// Copyright (c) Grant Murphy
//------------------------------- 
// Throws some random ruby code into
// the mix. Not in any intelligent 
// way though..
//
var _ = require('underscore')

var needle = '0xbadf00d'

var comments = [ 
    '# comment', 
    '# comment\\n' + needle 
]

var docstring = [
    "=begin\\nThis is a docstring\\n=end",
    "=begin\\nThis is a docstring\\n=end\\n"+ needle
]

var reserved = [
    '__FILE__', 
    '__LINE__', 
    'ARGV', 
    'ARGF', 
    'BEGIN', 
    'END', 
    'alias', 
    'and', 
    'begin',
    'break',
    'case',
    'class',
    'def',
    'defined?',
    'do',
    'else',
    'elsif',
    'end',
    'ensure',
    'false',
    'for',
    'if',
    'in', 
    'or',
    'redo',
    'rescue',
    'retry',
    'return',
    'self',
    'super',
    'then',
    'true',
    'undef',
    'unless',
    'until',
    'when',
    'while',
    'yield'
]

var injections = [

    'eval(' + needle + ')', 
    'x%{' + needle + ')', 
    'system(' + needle + ')', 
    '`' + needle + '`',
    '.define_singleton_method(:length) do\\n\\t' + needle + '\\nend',
    needle + '.instance_of?(Object)',
    needle + '.nil?()',
    needle + '.send :system, ' + needle,
    needle + '.public_send(:system,' + needle + ')',
    '#{`' + needle + '` and true}'
]

module.exports = (function(){

    return {
        seq: function(){
            var choices = _.union(injections, comments, docstring, reserved)
            return (choices[_.random(0, choices.length-1)] + ' ')
        }, 

        one: function(){
            // technically some of these aren't 'one'
            var opts = [
                '= ' + needle + ' ',
                '+ ' + needle + ' ',
                '/ ' + needle + ' ',
                '- ' + needle + ' ', 
                '#{' + needle + '}',
                '< ' + needle + ' ', 
                '> ' + needle + ' ', 
                ' |' + needle + '| ', 
                ' `' + needle + '` ',
                '\`', 
                ',',
                '.', 
                '{',
                '=>',
                '}',
                '!', 
                '?',
                '(', 
                ')',
                ';', 
                '!~', 
                '<=>', 
                '===', 
                '=~', 
                '.an_object',
                '.eql?', 
                '.equal?',
            ]
            return (opts[_.random(0, opts.length-1)])
        }
    }
}())
