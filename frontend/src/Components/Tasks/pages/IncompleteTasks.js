import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TasksTable from '../Components/home/TasksTable';

const IncompleteTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5555/tasks')
            .then(response => {
                const incompleteTasks = response.data.data.filter(task => !task.isCompleted);
                setTasks(incompleteTasks);
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
            <h1 className='text-4xl font-extrabold text-center font-serif'>Incomplete Tasks</h1>
        </div>

        {/* Table */}
        <div className='mt-8'>
            {loading ? <p className='text-center'>Loading...</p> : <TasksTable tasks={tasks} />}
        </div>
    </div>
    );
};

export default IncompleteTasks;
