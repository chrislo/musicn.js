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
