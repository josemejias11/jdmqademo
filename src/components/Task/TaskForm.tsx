import React, { ChangeEvent } from 'react';
import { useTasks } from '../../context/TaskContext';

const TaskForm: React.FC = () => {
  const { task, setTask, handleAddTask, loading, error } = useTasks();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <form onSubmit={handleAddTask}>
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <input
          className="form-control mb-3"
          placeholder="Enter a task"
          value={task}
          onChange={handleChange}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
