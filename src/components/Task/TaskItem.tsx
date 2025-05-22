import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types';

interface Props {
    task: Task;
    index: number;
}

const TaskItem: React.FC<Props> = ({ task, index }) => {
    const { toggleTaskDone, deleteTask } = useTasks();

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
      <span
          onClick={() => toggleTaskDone(index)}
          style={{ textDecoration: task.done ? 'line-through' : 'none', cursor: 'pointer' }}
      >
        {task.text}
      </span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(index)}>
                Delete
            </button>
        </li>
    );
};

export default TaskItem;