const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  const pathName = requestURL.pathname;
  const query = requestURL.searchParams;
  if (pathName === '/overview' || pathName === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHTML = dataObj.map((el) => replaceTemplate(templateCard, el));
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);

    //
  } else if (pathName === '/product' && query.get('id')) {
    const product = dataObj[query.get('id')];
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);

    //
  } else if (pathName === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(400);
    res.end('Page not found');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
