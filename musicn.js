var AST = {}

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

    this.add_to_score = function(score) {
        score.notes.push(new Model.Note(time, duration));
    }
};

AST.Terminator = function(time) {
    this.time = time;

    this.add_to_score = function(score) {
        score.duration = this.time;
    }
};

AST.Score = function(data_statements) {
    this.data_statements = data_statements;

    this.to_score = function() {
        var score = new Model.Score();
        data_statements.forEach(function(statement) {
            if(statement.add_to_score) { statement.add_to_score(score) };
        });
        return score;
    };
};

var Model = {};
Model.Note = function(time, duration) {
    this.start = time;
    this.end = this.start + duration;
};

Model.Score = function() {
    this.notes = [];
};

Model.Score.prototype.play = function(context) {
    var buffer = context.createBuffer(1, this.duration * context.sampleRate, context.sampleRate);
    var data = buffer.getChannelData(0);

    this.notes.forEach(function(note) {
        var start = note.start * context.sampleRate;
        var end = note.end * context.sampleRate;

        for (var i = start; i < end; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    });

    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
};

var score_source = document.getElementById('score').value
var grammar = document.getElementById('grammar').value

var parser = PEG.buildParser(grammar);
var ast = parser.parse(score_source);
console.log(ast);

var score = ast.to_score();
console.log(score);

var context = new AudioContext();
score.play(context);
