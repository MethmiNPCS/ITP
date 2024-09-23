import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TasksTable from '../Components/home/TasksTable';

const OverdueTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/tasks')
            .then(response => {
                const overdueTasks = response.data.data.filter(task => new Date(task.dueDate) < new Date() && !task.isCompleted);
                setTasks(overdueTasks);
                setLoading(false);
            })
            .catch(error => {
                console.log(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className='p-4'>
        {/* Centered Title */}
        <div className='flex justify-center my-8'>
            <h1 className='text-4xl font-extrabold text-center font-serif'>Overdue Tasks</h1>
        </div>

        {/* Table */}
        <div className='mt-8'>
            {loading ? <p className='text-center'>Loading...</p> : <TasksTable tasks={tasks} />}
        </div>
    </div>
    );
};

export default OverdueTasks;
