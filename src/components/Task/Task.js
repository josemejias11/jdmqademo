import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import useTasks from '../../hooks/useTasks';

function Task() {
    const [task, setTask] = useState('');
    const {
        tasks,
        handleAddTask,
        toggleTaskDone,
        deleteTask
    } = useTasks(task, setTask);

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Task Manager</h1>

            <TaskForm
                task={task}
                setTask={setTask}
                handleAddTask={handleAddTask}
            />

            <TaskList
                tasks={tasks}
                toggleTaskDone={toggleTaskDone}
                deleteTask={deleteTask}
            />
        </div>
    );
}

export default Task;