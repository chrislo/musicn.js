# musicn.js #

The code in this repository is the beginnings of a compiler for a
MUSIC-V-like language. It is based on a tutorial example given in Max
Mathew's 1969 book "The Technology of Computer Music" (MIT Press).

This code was developed to support a talk I gave at the 1st Web Audio
Conference at IRCAM in Paris in January 2015.

## Notes ##

This compiler barely does enough to generate the first score in the
tutorial given by Mathews in his book, "The technology of computer
music". But it is flexible enough to be extended to do more if I, or
any of you reading this, have the time and inclination to do so. We
wrote a parser for the language using `peg.js` and it should be
straightforward to extend that to support the missing unit generators.

To compile the score and play it arrange for `app/index.html` to be
served on your machine and visit `index.html`.

To run the unit tests, first install the dependencies

```
npm install
```

Then

```
npm test
```

To incorporate your changes into the application, they need turning
into a bundle with browserify

```
npm run-script build
```
