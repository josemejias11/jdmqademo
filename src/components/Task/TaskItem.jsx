import React from 'react';

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <div>
        <button
          className={`btn btn-sm ${task.done ? 'btn-secondary' : 'btn-success'} me-2`}
          onClick={onToggle}
        >
          {task.done ? 'Undo' : 'Done'}
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;