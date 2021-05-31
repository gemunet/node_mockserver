const http = require('http');
const fs = require("fs")

const hostname = '127.0.0.1';
const port = 3000;

// edit/add mock endpoints
const endpoints = {

  '^/user/?$': (req, res) => {
    return fs.readFileSync('responses/useridentitymanagerservice_user.json', 'utf8');
  },

  '^/user/([^/]+)$': (req, res, m) => {
    let user = JSON.parse(fs.readFileSync('responses/useridentitymanagerservice_user.json', 'utf8'))
      .find((obj) => (obj.userName == m[1]));
    if(!user) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
    }
    return user;
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
    response = handler(req, res, match);
    res.end(typeof response === 'string' ? response : JSON.stringify(response));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end();
  }
  
});

server.listen(port, hostname, () => {
  console.log(`Server running in http://${hostname}:${port}/`);
});

