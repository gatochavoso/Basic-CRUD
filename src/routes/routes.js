import { v4 as uuidv4 } from "uuid";
import { parseBody } from "../middleware/chunks.js";
import { Response } from "../utils/status.js";
import { filterTasks } from "../utils/filter.js";
import { getIdFromUrl } from "../utils/router.js";
import { saveTasks } from "../utils/database.js";

export const tasks = [];

export const routes = [
  {
    method: "GET",
    path: "/tasks/:id",
    handler: async (req, res) => {
      const response = new Response(res);

      try {
        const id = getIdFromUrl(req.url);
        const task = tasks.find((task) => task.id === id);

        if (!id || !task) {
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
          created_at: new Date().toISOString(),
          completed_at: null,
        };

        const exists = tasks.find((task) => task.title === body.title);
        if (exists) {
          return response.error(409, "TASK ALREADY EXISTS");
        }
        tasks.push(task);
        saveTasks(tasks)
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
        const id = getIdFromUrl(req.url);

        const task = tasks.find((task) => task.id === id);

        if (!id || !task) {
          return response.error(404, "TASK NOT FOUND");
        }

        Object.assign(task, body, { updated_at: new Date().toISOString() });
        saveTasks(tasks)
        response.success(200, task);
      } catch (err) {
        response.error(400, err.message);
      }
    },
  },
  {
    method: "PATCH",
    path: "/tasks/:id/complete",
    handler: (req, res) => {
      const response = new Response(res);

      try {
        const id = getIdFromUrl(req.url);
        const task = tasks.find((task) => task.id === id);

        if (!id || !task) {
          return response.error(404, "TASK NOT FOUND");
        }
        const completed_at = task.completed_at
          ? null
          : new Date().toISOString();
        Object.assign(task, { completed_at });
        saveTasks(tasks)
        response.success(200, task);
      } catch (err) {
        response.error(400, err.message);
      }
    },
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    handler: (req, res) => {
      const response = new Response(res);

      try {
        const id = getIdFromUrl(req.url);
        const index = tasks.findIndex((task) => task.id === id);

        if (index === -1 || !id) {
          return response.error(404, "TASK NOT FOUND");
        }
        tasks.splice(index, 1);
        saveTasks(tasks)
        response.success(200, "TASK DELETED");
      } catch (err) {
        response.error(400, err.message);
      }
    },
  },
];
