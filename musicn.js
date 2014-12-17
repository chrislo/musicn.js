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
}

Model.Instrument.prototype.to_data = function(note, context, maxAmplitude, blockSize, rate) {
    var note_buffer = context.createBuffer(1, (note.end - note.start) * context.sampleRate, context.sampleRate);
    var note_data = note_buffer.getChannelData(0);

    var amplitude = note.amplitude / maxAmplitude;
    var frequency = note.frequency / (blockSize/rate);
    var angular_frequency = 2*Math.PI*frequency;

    for (var i = 0; i < note_buffer.length; i++) {
        var t = i / context.sampleRate;
        note_data[i] = Math.sin(t*angular_frequency) * amplitude;
    }

    return note_data;
}

Model.Score.prototype.getInstrument = function(instrument_number) {
    return new Model.Instrument();
};

Model.Score.prototype.play = function(context, maxAmplitude, blockSize, rate) {
    var buffer = context.createBuffer(1, this.duration * context.sampleRate, context.sampleRate);
    var data = buffer.getChannelData(0);

    this.notes.forEach(function(note) {
        var instrument = this.getInstrument(note.instrument_number);
        var note_data = instrument.to_data(note, context, maxAmplitude, blockSize, rate);

        var start = note.start * context.sampleRate;

        for (var i = 0; i < note_data.length; i++) {
            data[start+i] += note_data[i];
        };
    }, this);

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
score.play(context, 2047, 511, 20000);
