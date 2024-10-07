import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';



// Define priority and category colors
const priorityButtonColors = {
  Low: 'bg-green-400 text-green-800',
  Medium: 'bg-yellow-400 text-yellow-800',
  High: 'bg-orange-400 text-orange-800',
  Urgent: 'bg-red-400 text-red-800',
};

const categoryColors = {
  Orders: 'bg-blue-400 text-blue-800',
  Stocks: 'bg-purple-400 text-purple-800',
  'Livestock Health': 'bg-teal-400 text-teal-800',
  Products: 'bg-yellow-400 text-yellow-800',
  Employees: 'bg-pink-400 text-pink-800',
  Maintenance: 'bg-gray-400 text-gray-800',
  Plantation: 'bg-green-400 text-green-800',

};

const ShowTask = () => {
  const [task, setTask] = useState({});
  const [employee, setEmployee] = useState(null); // State for the employee
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchTaskAndEmployee = async () => {
      setLoading(true);
      try {
        // Fetch the task
        const taskResponse = await axios.get(`http://localhost:5000/tasks/${id}`);
        setTask(taskResponse.data);

        // Fetch the assigned employee if there is one
        if (taskResponse.data.assignedEmployee) {
          const employeeResponse = await axios.get(`http://localhost:5000/employees/${taskResponse.data.assignedEmployee}`);
          setEmployee(employeeResponse.data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndEmployee();
  }, [id]);

  const priorityClass = priorityButtonColors[task.priority] || 'bg-gray-200 text-gray-800';
  const categoryClass = categoryColors[task.category] || 'bg-gray-200 text-gray-800';

  return (
    <div className='p-4'>
      <h1 className='text-3xl my-4 text-center font-serif'>Show Task</h1>
      <div className='flex flex-col border-2 border-dark-green rounded-xl w-fit p-4 mx-auto bg-light-green'>
        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Task No:</span>
          <span className='text-lg'>{task.taskNo}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Title:</span>
          <span className='text-lg'>{task.title}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Description:</span>
          <span className='text-lg'>{task.description}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Due Date:</span>
          <span className='text-lg'>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Category:</span>
          <span className={`px-2 py-1 rounded ${categoryClass}`}>{task.category}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Assigned Employee:</span>
          <span className='text-lg'>{employee ? employee.name : 'No employee assigned'}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Tags:</span>
          <span className='text-lg'>{Array.isArray(task.tags) ? task.tags.join(', ') : 'No tags'}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Priority:</span>
          <span className={`px-2 py-1 rounded ${priorityClass}`}>{task.priority}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Status:</span>
          <span className='text-lg'>{task.isCompleted ? 'Completed' : 'Incomplete'}</span>
        </div>

        <div className='my-4'>
          <span className='text-xl font-medium mr-4 text-gray-600'>Created At:</span>
          <span className='text-lg'>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default ShowTask;
