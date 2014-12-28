var parser = require('./lib/musicn_parser.js')

var score_source = document.getElementById('score').value;

var ast = parser.parse(score_source);
console.log(ast);

var score = ast.to_score();
console.log(score);

var context = new AudioContext();
var data = score.to_data(context.sampleRate, 2047, 511, 20000);
var buffer = context.createBuffer(1, data.length, context.sampleRate);
buffer.copyToChannel(data, 0);

var source = context.createBufferSource();
source.buffer = buffer;
source.connect(context.destination);
source.start();
