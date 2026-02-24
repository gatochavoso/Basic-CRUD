import { v4 as uuidv4 } from "uuid";
import { parseBody } from "../middleware/chunks.js";
import { Response } from "../utils/status.js";
import { filterTasks } from "../utils/filter.js";

const tasks = [];

export const routes = [
  {
    method: "GET",
    path: "/tasks/:id",
    handler: async (req, res) => {
      const response = new Response(res);

      try {
        const [pathUrl] = req.url.split("?");
        const [, , id] = pathUrl.split("/");
        const task = tasks.find((task) => task.id === id);
        if (!task) {
          return response.error(404, "TASK NOT FOUND");
        }

        response.success(200, task);
      } catch (err) {
        response.error(404, err.message);
      }
    },
  },
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const response = new Response(res);

      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const filters = {
          title: url.searchParams.get("title"),
          description: url.searchParams.get("description"),
        };
        const result = filterTasks(tasks, filters);
        response.success(200, result);
      } catch {
        response.error(404, "ROUTE NOT FOUND");
      }
    },
  },

  {
    method: "POST",
    path: "/tasks",
    handler: async (req, res) => {
      const response = new Response(res);

      try {
        const body = await parseBody(req);

        if (!body.title || !body.description) {
          return response.error(400, "MUST HAVE TITLE AND DESCRIPTION");
        }

        const task = {
          id: uuidv4(),
          ...body,
          createdAt: new Date().toISOString(),
        };
        tasks.push(task);
        response.success(201, task);
      } catch (err) {
        response.error(400, err.message);
      }
    },
  },
  {
    method: "PUT",
    path: "/tasks/:id",
    handler: async (req, res) => {
      const response = new Response(res);

      try {
        const body = await parseBody(req);
        const [pathUrl] = req.url.split("?");
        const [, , id] = pathUrl.split("/");
        const task = tasks.find((task) => task.id === id);
        if (!task) {
          return response.error(404, "TASK NOT FOUND");
        }

        Object.assign(task, body);
        response.success(200, task);
      } catch (err) {
        response.error(400, err.message);
      }
    },
  },
];
