import React from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import { Task } from '../../types';

function TaskList() {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return <div className="alert alert-info text-center">No tasks yet.</div>;
  }

  return (
      <ul className="list-group">
        {tasks.map((task: Task, index: number) => (
            <TaskItem key={index} task={task} index={index} />
        ))}
      </ul>
  );
}

export default TaskList;