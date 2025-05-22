import React from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import { Task } from '../../types';

const TaskList: React.FC = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <div className="alert alert-info text-center">Loading tasks...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="alert alert-info text-center">No tasks yet.</div>;
  }

  return (
    <ul className="list-group">
      {tasks.map((task: Task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
};

export default TaskList;
