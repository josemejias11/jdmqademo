import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

function Task() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Task Manager</h1>

      <TaskForm />

      <TaskList />
    </div>
  );
}

export default Task;
