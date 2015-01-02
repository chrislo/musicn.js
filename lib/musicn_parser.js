module.exports = function() {
  AST = require('./ast.js');
  var PEG = require("pegjs-otf");

  var parser = PEG.buildParserFromFile(
    __dirname + "/musicn_parser.pegjs",
    { optimize: "size" }
  );

  return parser;
}();
