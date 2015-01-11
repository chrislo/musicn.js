var Model = {};

Model.Note = function(time, instrument_number, duration, params, score) {
  this.instrument_number = instrument_number;
  this.start = time;
  this.end = this.start + duration;
  this.params = params;
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
  this.output = 0;
};

Model.Oscillator = function() {
};

Model.Oscillator.prototype.to_data = function(index, note, instrument, score, sampleRate) {
  var amplitude = note.params['P5'] / score.maxAmplitude;
  var frequency = note.params['P6'] / (score.blockSize / score.rate);
  var angular_frequency = 2*Math.PI*frequency;
  var t = index / sampleRate;

  instrument.output = Math.sin(t*angular_frequency) * amplitude;
};

Model.Output = function() {
};

Model.Output.prototype.to_data = function(index, note, instrument, sampleRate) {
};

Model.Instrument.prototype.to_data = function(note, score, sampleRate) {
  var size = (note.end - note.start) * sampleRate;
  var note_data = new Float32Array(Math.round(size));

  for (var i = 0; i < note_data.length; i++) {
    this.unit_generators.forEach(function(unit_generator) {
      unit_generator.to_data(i, note, this, score, sampleRate);
    }, this);

    note_data[i] = this.output;
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
    var note_data = instrument.to_data(note, this, sampleRate);

    var start = note.start * sampleRate;

    for (var i = 0; i < note_data.length; i++) {
      data[start+i] += note_data[i];
    };
  }, this);

  return data;
};

module.exports = Model;
