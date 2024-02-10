const fs = require('fs');
const text = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(text);

const textOut = `This is what we know about avocado: ${text}\n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File Written.');