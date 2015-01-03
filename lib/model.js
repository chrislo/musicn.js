var Model = {};

Model.Note = function(time, instrument_number, duration, amplitude, frequency, score) {
  this.instrument_number = instrument_number;
  this.start = time;
  this.end = this.start + duration;
  this.amplitude = amplitude / score.maxAmplitude;
  this.frequency = frequency / (score.blockSize / score.rate);
};

Model.Score = function(parameters) {
  var parameters = typeof parameters !== 'undefined' ? parameters : {};

  this.notes = [];
  this.instruments = {};
  this.maxAmplitude = parameters.maxAmplitude || 1;
  this.blockSize = parameters.blockSize || 1;
  this.rate = parameters.rate || 1;
};

Model.Instrument = function() {
  this.unit_generators = [];
};

Model.Oscillator = function() {
};

Model.Output = function() {
};

Model.Instrument.prototype.to_data = function(note, sampleRate) {
  var size = (note.end - note.start) * sampleRate;
  var note_data = new Float32Array(Math.round(size));

  var amplitude = note.amplitude;
  var frequency = note.frequency;
  var angular_frequency = 2*Math.PI*frequency;

  for (var i = 0; i < note_data.length; i++) {
    var t = i / sampleRate;
    note_data[i] = Math.sin(t*angular_frequency) * amplitude;
  }

  return note_data;
};

Model.Score.prototype.getInstrument = function(instrument_number) {
  return this.instruments[instrument_number];
};

Model.Score.prototype.to_data = function(sampleRate) {
  var data = new Float32Array(this.duration * sampleRate);

  this.notes.forEach(function(note) {
    var instrument = this.getInstrument(note.instrument_number);
    var note_data = instrument.to_data(note, sampleRate);

    var start = note.start * sampleRate;

    for (var i = 0; i < note_data.length; i++) {
      data[start+i] += note_data[i];
    };
  }, this);

  return data;
};

module.exports = Model;
