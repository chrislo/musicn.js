score
  = data_statements:data_statement* { return new AST.Score(data_statements); }

data_statement
  = data_statement: (generated_function
  / note
  / terminator
  / instrument_definition) eol { return data_statement; }

instrument_definition
  = begin_instrument:begin_instrument eol unit_generators:unit_generator_data_statement* end_instrument { return new AST.InstrumentDefinition(begin_instrument.time, begin_instrument.number, unit_generators); }

unit_generator_data_statement
  = unit_generator: (oscillator
  / output) eol { return unit_generator; }

terminator
  = "TER" whitespace time:variable  { return new AST.Terminator(parseFloat(time)); }

begin_instrument
  = "INS" whitespace time:variable number:variable  { return {time:parseFloat(time), number:parseInt(number)}; }

oscillator
  = "OSC" whitespace amplitude:variable frequency:variable output:variable stored_function:variable initial_value:variable  { return new AST.Oscillator(amplitude, frequency, output, stored_function, initial_value); }

output
  = "OUT" whitespace input:variable output:variable  { return new AST.Output(input, output); }

end_instrument
  = "END" whitespace

generated_function
  = "GEN" whitespace time:variable subroutine_number:variable function_number:variable points:point*  { return new AST.GeneratedFunction(parseFloat(time), subroutine_number, function_number, points); }

point
  = amplitude:variable index:variable { return {amplitude: parseFloat(amplitude), index: parseInt(index)}; }

note
  = "NOT" whitespace time:variable instrument_number:variable duration:variable params:variable* { return new AST.Note(parseFloat(time), parseInt(instrument_number), parseFloat(duration), params); }

variable
  = letters:[^ ;]+ whitespace* { return letters.join(""); }

whitespace
  = " "

eol
  = ";\n"
