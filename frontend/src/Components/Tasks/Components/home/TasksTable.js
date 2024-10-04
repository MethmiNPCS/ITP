import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';


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
};

const TasksTable = ({ tasks }) => {
    return (
        <table className='min-w-full bg-white border-2 border-gray-300 border-collapse'>
            <thead>
                <tr>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300'>No</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300'>Title</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300 max-md:hidden'>Description</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300 max-md:hidden'>Due Date</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300 max-md:hidden'>Category</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300 max-md:hidden'>Tags</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300 max-md:hidden'>Priority</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300 max-md:hidden'>Status</th>
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300'>Assigned Employee</th> {/* New Employee Column */}
                    
                    <th className='bg-green-200 text-green-800 text-lg font-semibold px-6 py-3 border-b-2 border-gray-300'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task._id} className='h-12'>
                        <td className='border border-slate-700 text-center px-4 py-2'>{task.taskNo}</td>
                        <td className='border border-slate-700 text-center px-4 py-2'>{task.title}</td>
                        <td className='border border-slate-700 text-center px-4 py-2 max-md:hidden'>{task.description}</td>
                        <td className='border border-slate-700 text-center px-4 py-2 max-md:hidden'>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td className={`border border-slate-700 text-center px-4 py-2 max-md:hidden ${categoryColors[task.category]}`}>
                            {task.category}
                        </td>
                        <td className='border border-slate-700 text-center px-4 py-2 max-md:hidden'>{task.tags.join(', ')}</td>
                        <td className={`border border-slate-700 text-center px-4 py-2 max-md:hidden ${priorityButtonColors[task.priority]}`}>
                            {task.priority}
                        </td>
                        <td className='border border-slate-700 text-center px-4 py-2 max-md:hidden'>{task.isCompleted ? "Completed" : "Not Completed"}</td>
                        <td className='border border-slate-700 text-center px-4 py-2'> {task.assignedEmployee ? 
                                `${task.assignedEmployee.FirstName || ''} ${task.assignedEmployee.LastName || ''}`.trim() || 'Employee data incomplete' 
                                : 'No employee assigned'}</td> {/* New Employee Data */}
                        
                        <td className='border border-slate-700 text-center px-4 py-2'>
                            <div className='flex justify-center gap-x-4'>
                                <Link to={`/tasks/details/${task._id}`}>
                                    <BsInfoCircle className='text-2xl text-green-800' />
                                </Link>
                                <Link to={`/tasks/edit/${task._id}`}>
                                    <AiOutlineEdit className='text-2xl text-yellow-600' />
                                </Link>
                                <Link to={`/tasks/delete/${task._id}`}>
                                    <MdOutlineDelete className='text-2xl text-red-600' />
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TasksTable;
