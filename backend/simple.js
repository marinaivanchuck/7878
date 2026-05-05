const http = require('http');
const server = http.createServer((req, res) => {
  console.log('Отримано запит:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});
server.listen(5001, () => {
  console.log('Сервер слухає на порту 5001');
});
