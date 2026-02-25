import type { Task } from "../types.js";

export function filterTasks(
  tasks: Task[],
  filters: { title: string | null; description: string | null },
) {
  const { title, description } = filters;

  return tasks.filter((task) => {
    const matchTitle = title ? task.title.includes(title) : true;
    const matchDesc = description ? task.title.includes(description) : true;
    return matchTitle && matchDesc;
  });
}
