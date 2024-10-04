import React from 'react';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';


const TaskModal = ({ task, onClose }) => {
  return (
    <div
      className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-[600px] max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative'
      >
        <AiOutlineClose
          className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
          onClick={onClose}
        />
        <h2 className={`w-fit px-4 py-1 rounded-lg ${priorityButtonColors[task.priority]}`}>
          {task.priority}
        </h2>
        <h4 className='my-2 text-gray-500'>Task No: {task.taskNo}</h4>
        <div className='flex justify-start items-center gap-x-2'>
          <BsInfoCircle className='text-green-300 text-2xl' />
          <h2 className='my-1'>{task.title}</h2>
        </div>
        <p className='mt-4'>
          <span className='font-bold'>Description:</span> {task.description}
        </p>
        <p className='my-2'>
          <span className='font-bold'>Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
        </p>
        <p className='my-2'>
          <span className='font-bold'>Category:  </span> 
          <span className={`inline-block px-2 py-1 rounded-lg ${categoryColors[task.category]}`}>
            {task.category}
          </span>
        </p>
        <p className='my-2'>
          <span className='font-bold'>Assigned Employee:</span> 
          {task.assignedEmployee ? `${task.assignedEmployee.FirstName} ${task.assignedEmployee.LastName}` : 'No employee assigned'}
        </p>
        <p className='my-2'>
          <span className='font-bold'>Tags:</span> {Array.isArray(task.tags) ? task.tags.join(', ') : 'No tags'}
        </p>
        <p className='my-2'>
          <span className='font-bold'>Status:</span> {task.isCompleted ? 'Completed' : 'Incomplete'}
        </p>
        <div className='flex justify-between items-center mt-4'>
          <Link to={`/tasks/edit/${task._id}`}>
            <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-black cursor-pointer' />
          </Link>
          <Link to={`/tasks/delete/${task._id}`}>
            <MdOutlineDelete className='text-2xl text-red-600 hover:text-black cursor-pointer' />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Define the colors
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


export default TaskModal;
