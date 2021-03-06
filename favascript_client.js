/* Copyright (c) 2012, Michael Patraw
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
* * Redistributions of source code must retain the above copyright
* notice, this list of conditions and the following disclaimer.
* * Redistributions in binary form must reproduce the above copyright
* notice, this list of conditions and the following disclaimer in the
* documentation and/or other materials provided with the distribution.
* * The name of Michael Patraw may not be used to endorse or promote
* products derived from this software without specific prior written
* permission.
*
* THIS SOFTWARE IS PROVIDED BY Michael Patraw ''AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL Michael Patraw BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY ,WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
 /* Add meta information that executes word content? */
var favascript = {parse: function (code) {
    var core, parse, include;
    core = [
        'var F = {};',
        'F.S = [];',
        'F.X = {',
            '"runjs": {"value": function(F) {',
                'new Function("F", F.S.pop().value)(F);',
            '}, "type": "block"}',
        '};',
        'var _ = function (word, type) {',
            'if (type === "word") {',
                'if (F.X[word].type === "block")',
                    'F.X[word].value(F);',
                'else ',
                    'F.S.push(F.X[word]);',
            '}',
            'else ',
                'F.S.push({"value": word, "type": type});',
        '};',
    ].join('');
    parse = function (str) {
  			var output = []; // [mod]

        var word, results, i;
        word = /(#[^\n]*\n)|("[^"]*")|([^\s]+)/g;
        results = str.match(word);
        for (i = 0; i < results.length; ++i) {
            word = results[i];
            if (word === '' || word[0] === '#') {
            }
            else if (!isNaN(word)) {
                // process.stdout.write('_(' + word + ', "number");');
								output.push('_(' + word + ', "number");');
            }
            else if (word === '[') {
                // process.stdout.write('_(function(F) {');
								output.push('_(function(F) {');
            }
            else if (word === ']') {
                // process.stdout.write('}, "block");');
								output.push('}, "block");');
            }
            else if (word[0] === '"') {
                // process.stdout.write('_(' + word.replace(/\n/g, '\\\n') + ', "string");');
								output.push('_(' + word.replace(/\n/g, '\\\n') + ', "string");');
            }
            else if (word[0] === ':') {
                // process.stdout.write('_("' + word.slice(1) + '", "string");');
								output.push('_("' + word.slice(1) + '", "string");');
            }
            else if (word === 'include') {
								output.push('include');
								/*
                i++;
                if (i != results.length)
                {
                    if (results[i][0] === '"')
                        include(results[i].slice(1, -1) + '.fava');
                    else
                        include(results[i] + '.fava');
                }
								*/
            }
            else {
                // process.stdout.write('_("' + word + '", "word");');
								output.push('_("' + word + '", "word");');
            }
        }
				return output;
    }
    include = function (source) {
//        var source = require('fs').readFileSync(require('path').resolve(file), 'utf8');
        return parse(source).join('');
    }

//        process.stdout.write('(function() {');
//        process.stdout.write(core);
//        include(args[1]);
//        process.stdout.write('})(this);');

			return '(function(){\n// flava core:\n\n'+core+'\n\n// input (include is not supported in clientside, but you can catch it):\n\n'+include(code)+'\n\n})(this);';
}
};
