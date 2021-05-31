const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const endpoints = {
  '^/hello$': (req, res) => {
    return "Hello World";
  },
  '^/hello/([^/]+)$': (req, res, m) => {
    return `Hello ${m[1]}`;
  }
};

const server = http.createServer((req, res) => {
  console.log(`Request ${req.url}`);

  let match = null;
  const handler = (Object.entries(endpoints)
    .find(([ k, _ ]) => ((match = (new RegExp(k)).exec(req.url)) !== null)) || []) [1]

  if(handler) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.end(handler(req, res, match));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end();
  }
  
});

server.listen(port, hostname, () => {
  console.log(`Server running in http://${hostname}:${port}/`);
});

