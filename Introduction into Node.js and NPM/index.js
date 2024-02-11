const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const text = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(text);
const textOut = `This is what we know about avocado: ${text}\n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File Written.');

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) {
        return console.log('Error');
    }
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
                console.log('File was Written Successfully.');
            });
        });
    });
});
console.log('Will Read File ?');

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = data.map((el) => slugify(el.productName, { lower: true }));


const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': "text/html" });
        const cardsHtml = dataObj.map((el) => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        res.end(output);
    } else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output);
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-Type': "text/html",
            "My-Own-Header": "Hello World"
        });
        res.end('<h1>Page Not Found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Start Listening');
});