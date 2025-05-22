import React from 'react';

function TaskForm({ task, setTask, handleAddTask }) {
    return (
        <div className="card p-4 shadow-sm mb-4">
            <form onSubmit={handleAddTask}>
                <input
                    className="form-control mb-3"
                    placeholder="Enter a task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    Add Task
                </button>
            </form>
        </div>
    );
}

export default TaskForm;