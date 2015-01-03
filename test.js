var JS = require("jstest")
var parser = require('./lib/musicn_parser.js')
var Model = require('./lib/model.js')

JS.Test.describe("compiling a simple score", function() { with(this) {
  var score_source = "TER 8.00 ;\n"

  it("generates 8 seconds of audio", function() { with(this) {
    var ast = parser.parse(score_source);
    var score = ast.to_score();
    var data = score.to_data(44100);

    assertEqual(44100 * 8, data.length);
  }})
}})

JS.Test.describe("parser", function() { with(this) {
  it("parses stored function definitions", function() { with(this) {
    var ast = parser.parse("GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511 ;\n");
    var statement = ast.data_statements[0]

    assertEqual(0, statement.time);
    assertEqual('1', statement.subroutine_number);
    assertEqual('2', statement.function_number);

    assertEqual(6, statement.points.length);
    assertEqual({amplitude: 0, index: 0}, statement.points[0]);
  }})
}})

JS.Test.describe("Model.Note", function() { with(this) {
  it("normalises the amplitude by the scores max amplitude", function() { with(this) {
    var score = new Model.Score({maxAmplitude: 5});
    var note = new Model.Note(1, 1, 2, 400, score);

    assertEqual(2/5, note.amplitude);
  }})

  it("normalises the frequency by the scores max frequency", function() { with(this) {
    var score = new Model.Score({blockSize: 511, rate: 20000});
    var note = new Model.Note(1, 1, 2, 0.02555, score);

    assertEqual(1, note.frequency);
  }})
}})

JS.Test.autorun()
