var InstrumentDefinition = function(time, number, unit_generators) {
    this.time = time;
    this.number = number;
    this.unit_generators = unit_generators;
};

var Oscillator = function(amplitude, frequency, output, stored_function, initial_value) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.output = output;
    this.stored_function = stored_function;
    this.initial_value = initial_value;
};

var Output = function(input, output) {
    this.input = input;
    this.output = output;
};

var GeneratedFunction = function(time, subroutine_number, function_number, points) {
    this.time = time;
    this.subroutine_number = subroutine_number;
    this.function_number = function_number;
    this.points = points;
};

var Note = function(time, instrument_number, duration, params) {
    this.time = time;
    this.instrument_number = instrument_number;
    this.duration = duration;
    this.params = params;
};

var Terminator = function(time) {
    this.time = time;
};

var Score = function(data_statements) {
    this.data_statements = data_statements;
};


var score = document.getElementById('score').value
var grammar = document.getElementById('grammar').value

var parser = PEG.buildParser(grammar);
var cst = parser.parse(score);
console.log(cst);
