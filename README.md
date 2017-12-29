# Perfume.js v0.2.0
[![NPM version](https://badge.fury.io/js/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/ng-tasty.svg)](https://www.npmjs.org/package/ng-tasty) [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js)

> Perfume is a tiny JavaScript library for measuring Short/Long Script, First Meaningful Paint, TTI (Time to Interactivity), annotating them to the DevTools timeline and reporting the results to Google Analytics.


## Installing

npm (https://www.npmjs.com/package/perfume.js):

    npm install --save-dev perfume.js


## Usage

### Importing library

You can import the generated bundle to use the whole library generated by this starter:

```javascript
import Perfume from 'perfume'
```

Additionally, you can import the transpiled modules from `dist/es` in case you have a modular library:

```javascript
import Perfume from 'perfume/dist/es/perfume'
```

### Start measuring

```javascript
const perfume = new Perfume();
```

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)


## Notes

### Credits
Made with ☕️ by [@zizzamia](https://twitter.com/zizzamia) and
I want to thank some friends and projects for the work they did:

- [Appmetrics.js](https://github.com/ebidel/appmetrics.js?files=1) to inspired me to start writing this library and give me some of the base ideas for the class architecture;
- [Popper.js](https://github.com/FezVrasta/popper.js/) for having inspired me in writing my first library in typescript;
- [The Contributors](https://github.com/Zizzamia/perfume.js/graphs/contributors) for their much appreciated Pull Requests and bug reports;
- **you** for the star you'll give to this project and for being so awesome to give this project a try 😄

### Copyright and license
Code and documentation copyright 2017 **Leonardo Zizzamia**. Code released under the [MIT license](LICENSE). Docs released under Creative Commons.
