import React from 'react';

import TasksSingleCard from './TasksSingleCard';


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

const TasksCard = ({ tasks }) => {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
      {tasks.map((task) => (
        <TasksSingleCard key={task._id} task={task} />
      ))}
    </div>
  );
}

export default TasksCard;





