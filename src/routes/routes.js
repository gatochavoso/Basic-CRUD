import { v4 as uuidv4 } from "uuid";
import { parseBody } from "../middleware/chunks.js";
import { Response } from "../utils/json.js";

const tasks = [];

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const response = new Response(res);
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const titleFilter = url.searchParams.get("title");
        let filteredTasks = tasks
        if (titleFilter) {
          filteredTasks = tasks.filter(task => {
            return task.title.includes(titleFilter)
          })
        }

        response.success(200, filteredTasks);
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
          CreatedAt: new Date().toISOString(),
        };
        tasks.push(task);
        response.success(201, task);
      } catch (err) {
        response.error(400, err.message);
      }
    },
  },
];
