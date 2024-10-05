import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { BiShow } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { useState } from 'react';
import TaskModal from './TasksModel';


// Define priority and category colors directly in the component
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

const TasksSingleCard = ({ task }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      key={task.taskNo}
      className='bg-wwhite border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl'
    >
      {/* Priority Button */}
      <h2 className={`absolute top-1 right-2 px-4 py-1 rounded-lg ${priorityButtonColors[task.priority]}`}>
        {task.priority}
      </h2>
      
      <h4 className='my-2 text-gray-500'>{task.taskNo}</h4>
      <div className='flex flex-col'>
        <div className='my-2'>
          <span className='font-bold'>Title:</span> {task.title}
        </div>
        <div className='my-2'>
          <span className='font-bold'>Description:</span> {task.description}
        </div>
        <div className='my-2'>
          <span className='font-bold'>Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className='my-2'>
          <span className='font-bold'>Category:  </span> 
          <span className={`inline-block px-2 py-1 rounded-lg ${categoryColors[task.category]}`}>
            {task.category}
          </span>
        </div>
        
        <div className='my-2'>
          <span className='font-bold'>Assigned Employee: </span> 
          {task.assignedEmployee ? `${task.assignedEmployee.FirstName} ${task.assignedEmployee.LastName}` : 'No employee assigned'}
        </div>

        <div className='my-2'>
          <span className='font-bold'>Tags:</span> {Array.isArray(task.tags) ? task.tags.join(', ') : 'No tags'}
        </div>
        <div className='my-2'>
          <span className='font-bold'>Status:</span> {task.isCompleted ? 'Completed' : 'Incomplete'}
        </div>
      </div>
      <div className='flex justify-between items-center mt-4'>
        
        <BiShow
          className='text-2xl text-blue-600 hover:text-black cursor-pointer'
          onClick={() => setShowModal(true)}
        />
        
        <Link to={`/tasks/details/${task._id}`}>
          <BsInfoCircle className='text-2xl text-green-800 hover:text-black' />
        </Link>
        <Link to={`/tasks/edit/${task._id}`}>
          <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-black' />
        </Link>
        <Link to={`/tasks/delete/${task._id}`}>
          <MdOutlineDelete className='text-2xl text-red-600 hover:text-black' />
        </Link>
      </div>

      {showModal && (
        <TaskModal task={task} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default TasksSingleCard;
