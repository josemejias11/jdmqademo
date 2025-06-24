export function generateUniqueTask(title = 'Task') {
  return `${title}-${Date.now()}`;
}
