import http from "node:http";
import { routes, tasks } from "./routes/routes.js";
import { matchRoute } from "./utils/router.js";
import { importTasks } from "./utils/import.js";
import fs from "node:fs/promises";
import type { Task } from "./types.js";

fs.readFile("tasks.json", "utf8")
  .then((data) => {
    const savedTasks: Task[] = JSON.parse(data);
    tasks.push(...savedTasks);
  })
  .catch(() => {
    fs.writeFile("tasks.json", JSON.stringify([]));
  });

const server = http.createServer((req, res) => {
  const [path] = req.url!.split("?"); // [path] so pega o indice 0 de /tasks?title=title, sem, pegaria um array inteiro
  const route = routes.find(
    (r) => r.method === req.method && matchRoute(r.path, path ?? ""),
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
  importTasks();
});
