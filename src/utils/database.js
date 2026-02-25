import fs from "node:fs/promises";
//escreve no tasks.json
export function saveTasks(tasks) {
    fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2))
}