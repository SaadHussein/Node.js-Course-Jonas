console.log(arguments);
console.log(require('module').wrapper);

const C = require('./test-module-one');
const calcTwo = require('./test-module-two');
const calcOne = new C();
console.log(calcOne.add(2, 5));
console.log(calcTwo.add(2, 5));
require('./test-module-three')();
require('./test-module-three')();
require('./test-module-three')();
