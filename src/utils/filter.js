export function filterTasks(tasks, filters) {
  const { title, description } = filters;

  return tasks.filter((task) => {
    const matchTitle = title ? task.title.includes(title) : true;
    const matchDesc = description ? task.title.includes(description) : true;
    return matchTitle && matchDesc;
  });
}
