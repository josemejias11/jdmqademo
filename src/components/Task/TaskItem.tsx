import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types';

interface Props {
    task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
    const { toggleTaskDone, deleteTask, loading } = useTasks();


    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
      <span
          onClick={() => toggleTaskDone(task.id)}
          style={{ 
              textDecoration: task.done ? 'line-through' : 'none', 
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1
          }}
      >
        {task.text}
      </span>
            <button 
                className="btn btn-danger btn-sm" 
                onClick={() => deleteTask(task.id)}
                disabled={loading}
            >
                Delete
            </button>
        </li>
    );
};

export default TaskItem;
