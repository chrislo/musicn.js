var Model = require('./model.js');

var AST = {};

AST.InstrumentDefinition = function(time, number, unit_generators) {
    this.time = time;
    this.number = number;
    this.unit_generators = unit_generators;
};

AST.InstrumentDefinition.prototype.add_to_score = function(score) {
  var instrument = new Model.Instrument();

  this.unit_generators.forEach(function(unit_generator) {
    if(unit_generator.add_to_instrument) { unit_generator.add_to_instrument(instrument) };
  });

  score.instruments[this.number] = instrument;
};

AST.Oscillator = function(amplitude, frequency, output, stored_function, initial_value) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.output = output;
    this.stored_function = stored_function;
    this.initial_value = initial_value;
};

AST.Oscillator.prototype.add_to_instrument = function(instrument) {
  instrument.unit_generators.push(new Model.Oscillator() );
};

AST.Output = function(input, output) {
    this.input = input;
    this.output = output;
};

AST.Output.prototype.add_to_instrument = function(instrument) {
  instrument.unit_generators.push(new Model.Output() );
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
    score.notes.push(new Model.Note(this.time, this.instrument_number, this.duration, amplitude, frequency, score));
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

AST.Score.prototype.to_score = function(parameters) {
    var score = new Model.Score(parameters);
    this.data_statements.forEach(function(statement) {
        if(statement.add_to_score) { statement.add_to_score(score) };
    });
    return score;
};

module.exports = AST;
