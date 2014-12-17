var score = document.getElementById('score').value
var grammar = document.getElementById('grammar').value

var parser = PEG.buildParser(grammar);
var cst = parser.parse(score);
console.log(cst);
