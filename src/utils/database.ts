import fs from "node:fs/promises";
import type { Task } from "../types.js";

//escreve no tasks.json
export function saveTasks(tasks: Task[]) {
  fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
}
