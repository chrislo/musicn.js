(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Model = require('./model.js');

var AST = {};

AST.InstrumentDefinition = function(time, number, unit_generators) {
    this.time = time;
    this.number = number;
    this.unit_generators = unit_generators;
};

AST.Oscillator = function(amplitude, frequency, output, stored_function, initial_value) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.output = output;
    this.stored_function = stored_function;
    this.initial_value = initial_value;
};

AST.Output = function(input, output) {
    this.input = input;
    this.output = output;
};

AST.GeneratedFunction = function(time, subroutine_number, function_number, points) {
    this.time = time;
    this.subroutine_number = subroutine_number;
    this.function_number = function_number;
    this.points = points;
};

AST.Note = function(time, instrument_number, duration, params) {
    this.time = time;
    this.instrument_number = instrument_number;
    this.duration = duration;
    this.params = params;
};

AST.Note.prototype.add_to_score = function(score) {
    var amplitude = parseInt(this.params[0]);
    var frequency = parseFloat(this.params[1]);
    score.notes.push(new Model.Note(this.time, this.duration, amplitude, frequency));
};

AST.Terminator = function(time) {
    this.time = time;
};

AST.Terminator.prototype.add_to_score = function(score) {
    score.duration = this.time;
}

AST.Score = function(data_statements) {
    this.data_statements = data_statements;
};

AST.Score.prototype.to_score = function() {
    var score = new Model.Score();
    this.data_statements.forEach(function(statement) {
        if(statement.add_to_score) { statement.add_to_score(score) };
    });
    return score;
};

module.exports = AST;

},{"./model.js":2}],2:[function(require,module,exports){
var Model = {};

Model.Note = function(time, duration, amplitude, frequency) {
    this.start = time;
    this.end = this.start + duration;
    this.amplitude = amplitude;
    this.frequency = frequency;
};

Model.Score = function() {
    this.notes = [];
};

Model.Instrument = function() {
};

Model.Instrument.prototype.to_data = function(note, sampleRate, maxAmplitude, blockSize, rate) {
    var size = (note.end - note.start) * sampleRate;
    var note_data = new Float32Array(Math.round(size));

    var amplitude = note.amplitude / maxAmplitude;
    var frequency = note.frequency / (blockSize/rate);
    var angular_frequency = 2*Math.PI*frequency;

    for (var i = 0; i < note_data.length; i++) {
        var t = i / sampleRate;
        note_data[i] = Math.sin(t*angular_frequency) * amplitude;
    }

    return note_data;
};

Model.Score.prototype.getInstrument = function(instrument_number) {
    return new Model.Instrument();
};

Model.Score.prototype.to_data = function(sampleRate, maxAmplitude, blockSize, rate) {
    var data = new Float32Array(this.duration * sampleRate);

    this.notes.forEach(function(note) {
        var instrument = this.getInstrument(note.instrument_number);
        var note_data = instrument.to_data(note, sampleRate, maxAmplitude, blockSize, rate);

        var start = note.start * sampleRate;

        for (var i = 0; i < note_data.length; i++) {
            data[start+i] += note_data[i];
        };
    }, this);

    return data;
};

module.exports = Model;

},{}],3:[function(require,module,exports){
var AST = require('./ast.js')

module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { score: peg$parsescore },
        peg$startRuleFunction  = peg$parsescore,

        peg$c0 = [],
        peg$c1 = function(data_statements) { return new AST.Score(data_statements); },
        peg$c2 = peg$FAILED,
        peg$c3 = function(data_statement) { return data_statement; },
        peg$c4 = function(begin_instrument, unit_generators) { return new AST.InstrumentDefinition(begin_instrument.time, begin_instrument.number, unit_generators); },
        peg$c5 = function(unit_generator) { return unit_generator; },
        peg$c6 = "TER",
        peg$c7 = { type: "literal", value: "TER", description: "\"TER\"" },
        peg$c8 = function(time) { return new AST.Terminator(parseFloat(time)); },
        peg$c9 = "INS",
        peg$c10 = { type: "literal", value: "INS", description: "\"INS\"" },
        peg$c11 = function(time, number) { return {time:parseFloat(time), number:parseInt(number)}; },
        peg$c12 = "OSC",
        peg$c13 = { type: "literal", value: "OSC", description: "\"OSC\"" },
        peg$c14 = function(amplitude, frequency, output, stored_function, initial_value) { return new AST.Oscillator(amplitude, frequency, output, stored_function, initial_value); },
        peg$c15 = "OUT",
        peg$c16 = { type: "literal", value: "OUT", description: "\"OUT\"" },
        peg$c17 = function(input, output) { return new AST.Output(input, output); },
        peg$c18 = "END",
        peg$c19 = { type: "literal", value: "END", description: "\"END\"" },
        peg$c20 = "GEN",
        peg$c21 = { type: "literal", value: "GEN", description: "\"GEN\"" },
        peg$c22 = function(time, subroutine_number, function_number, points) { return new AST.GeneratedFunction(parseFloat(time), subroutine_number, function_number, points); },
        peg$c23 = function(amplitude, index) { return {amplitude: parseFloat(amplitude), index: parseInt(index)}; },
        peg$c24 = "NOT",
        peg$c25 = { type: "literal", value: "NOT", description: "\"NOT\"" },
        peg$c26 = function(time, instrument_number, duration, params) { return new AST.Note(parseFloat(time), parseInt(instrument_number), parseFloat(duration), params); },
        peg$c27 = /^[^ ;]/,
        peg$c28 = { type: "class", value: "[^ ;]", description: "[^ ;]" },
        peg$c29 = function(letters) { return letters.join(""); },
        peg$c30 = " ",
        peg$c31 = { type: "literal", value: " ", description: "\" \"" },
        peg$c32 = ";\n",
        peg$c33 = { type: "literal", value: ";\n", description: "\";\\n\"" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsescore() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsedata_statement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsedata_statement();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsedata_statement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsegenerated_function();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenote();
        if (s1 === peg$FAILED) {
          s1 = peg$parseterminator();
          if (s1 === peg$FAILED) {
            s1 = peg$parseinstrument_definition();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseeol();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c3(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseinstrument_definition() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsebegin_instrument();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseeol();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseunit_generator_data_statement();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseunit_generator_data_statement();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseend_instrument();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c4(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseunit_generator_data_statement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseoscillator();
      if (s1 === peg$FAILED) {
        s1 = peg$parseoutput();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseeol();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c5(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseterminator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c6) {
        s1 = peg$c6;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevariable();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c8(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsebegin_instrument() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c9) {
        s1 = peg$c9;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevariable();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsevariable();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c11(s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseoscillator() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevariable();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsevariable();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsevariable();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsevariable();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsevariable();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c14(s3, s4, s5, s6, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseoutput() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c15) {
        s1 = peg$c15;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevariable();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsevariable();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c17(s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseend_instrument() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c18) {
        s1 = peg$c18;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c19); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsegenerated_function() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c20) {
        s1 = peg$c20;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevariable();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsevariable();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsevariable();
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parsepoint();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parsepoint();
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c22(s3, s4, s5, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepoint() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsevariable();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevariable();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c23(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsenote() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c24) {
        s1 = peg$c24;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c25); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevariable();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsevariable();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsevariable();
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parsevariable();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parsevariable();
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c26(s3, s4, s5, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsevariable() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c27.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c27.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c28); }
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsewhitespace();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsewhitespace();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c29(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsewhitespace() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 32) {
        s0 = peg$c30;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c31); }
      }

      return s0;
    }

    function peg$parseeol() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c32) {
        s0 = peg$c32;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

},{"./ast.js":1}],4:[function(require,module,exports){
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

},{"./lib/musicn_parser.js":3}]},{},[4]);
