import React, { ChangeEvent } from 'react';
import { useTasks } from '../../context/TaskContext';

const TaskForm: React.FC = () => {
  const { task, setTask, handleAddTask } = useTasks();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <form onSubmit={handleAddTask}>
        <input
          className="form-control mb-3"
          placeholder="Enter a task"
          value={task}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;