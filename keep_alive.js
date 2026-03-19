const http = require('http');

module.exports = function keepAlive(port = process.env.PORT || 8080) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end("I'm alive");
  });

  server.listen(port, () => {
    console.log(`[keep_alive] HTTP en écoute sur :${port}`);
  });

  return server;
};
