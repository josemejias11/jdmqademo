import React from 'react';
import TaskItem from './TaskItem';
function TaskList({ tasks, toggleTaskDone, deleteTask }) {
  if (tasks.length === 0) {
    return <div className="alert alert-info text-center">No tasks yet.</div>;
  }

  return (
      <ul className="list-group">
        {tasks.map((task, index) => (
            <TaskItem
                key={index}
                task={task}
                onToggle={() => toggleTaskDone(index)}
                onDelete={() => deleteTask(index)}
            />
        ))}
      </ul>
  );
}

export default TaskList;