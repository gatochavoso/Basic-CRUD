import http from "node:http";
import { routes } from "./routes/routes.js";
import { matchRoute } from "./utils/router.js";

const server = http.createServer((req, res) => {
  const [path] = req.url.split("?");
  const route = routes.find(
    (r) => r.method === req.method && matchRoute(r.path, path),
  );

  if (route) {
    return route.handler(req, res);
  }
  res
    .writeHead(404, { "Content-Type": "application/json" })
    .end("ROUTE NOT FOUND");
});

server.listen(3333, () => {
  console.log("SERVER RUNNING");
});
