var JS = require("jstest")

JS.Test.describe("compiling a simple score", function() { with(this) {
  var score_source = "TER 8.00 ;\n"

  it("generates 8 seconds of audio", function() { with(this) {
    var parser = require('./lib/musicn_parser.js')
    var ast = parser.parse(score_source);
    var score = ast.to_score();
    var data = score.to_data(44100, 2047, 511, 20000);

    assertEqual(44100 * 8, data.length);
  }})
}})

JS.Test.autorun()
