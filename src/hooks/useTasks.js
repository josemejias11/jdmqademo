import { useEffect, useState } from 'react';

const STORAGE_KEY = 'taskManager.tasks';

function useTasks(task, setTask) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        try {
            const storedTasks = localStorage.getItem(STORAGE_KEY);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (task.trim() === '') return;
        setTasks([...tasks, { text: task.trim(), done: false }]);
        setTask('');
    };

    const toggleTaskDone = (index) => {
        const newTasks = [...tasks];
        newTasks[index].done = !newTasks[index].done;
        setTasks(newTasks);
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return {
        tasks,
        handleAddTask,
        toggleTaskDone,
        deleteTask
    };
}

export default useTasks;