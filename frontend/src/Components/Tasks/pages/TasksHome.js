import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import { AiOutlineTable, AiOutlineAppstore } from 'react-icons/ai';
import { MdOutlineAddBox } from 'react-icons/md';
import TasksTable from '../Components/home/TasksTable';
import TasksCard from '../Components/home/TasksCard';
import SearchBar from '../Components/home/SearchBar';
import BackToHome from '../../Home/BackToHome';


const TasksHome = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showType, setShowType] = useState('table');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/tasks')
            .then(response => {
                setTasks(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error.message);
                setLoading(false);
            });
    }, []);

    // Filter tasks based on search query
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate counts
    const incompleteTasks = tasks.filter(task => !task.isCompleted).length;
    const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.isCompleted).length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const urgentTasks = tasks.filter(task => task.priority === 'Urgent' && !task.isCompleted).length;

    // Upcoming tasks (within 7 days)
    const upcomingTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() + 7));
        return dueDate >= new Date() && dueDate <= nextWeek && !task.isCompleted;
    });

    // Group tasks by category
    const tasksByCategory = tasks.reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = 0;
        }
        acc[task.category] += 1;
        return acc;
    }, {});

    // PDF Report Generation Function
    const generateReport = () => {
        const doc = new jsPDF();

        // Add current date
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(currentDate, doc.internal.pageSize.getWidth() - 40, 10);

        // Add a black border
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setDrawColor(0);  // Black color
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);  // Add padding by adjusting the margins

        // Center and underline the report title
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        const title = "Task Report";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, 30);
        doc.line((pageWidth - titleWidth) / 2, 32, (pageWidth + titleWidth) / 2, 32);  // Underline

        // "Task Overview" section
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        const overviewTitle = "Task Overview";
        const overviewTitleWidth = doc.getTextWidth(overviewTitle);
        doc.text(overviewTitle, (pageWidth - overviewTitleWidth) / 2, 50);
        doc.line((pageWidth - overviewTitleWidth) / 2, 52, (pageWidth + overviewTitleWidth) / 2, 52);

        // Task Overview Table
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Total Tasks', 30, 65);
        doc.text('Completed Tasks', 30, 75);
        doc.text('Incomplete Tasks', 30, 85);
        doc.text('Overdue Tasks', 30, 95);
        doc.text('Upcoming Tasks (7 days)', 30, 105);

        doc.text(`${tasks.length}`, 130, 65);
        doc.text(`${completedTasks}`, 130, 75);
        doc.text(`${incompleteTasks}`, 130, 85);
        doc.text(`${overdueTasks}`, 130, 95);
        doc.text(`${upcomingTasks.length}`, 130, 105);

        doc.line(25, 60, 160, 60);  // Top horizontal line
        doc.line(25, 110, 160, 110);  // Bottom horizontal line
        doc.line(25, 60, 25, 110);  // Left vertical line
        doc.line(160, 60, 160, 110);  // Right vertical line

        // "Progress Bar" section
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        const progressBarTitle = "Progress Bar";
        const progressBarTitleWidth = doc.getTextWidth(progressBarTitle);
        doc.text(progressBarTitle, (pageWidth - progressBarTitleWidth) / 2, 130);
        doc.line((pageWidth - progressBarTitleWidth) / 2, 132, (pageWidth + progressBarTitleWidth) / 2, 132);

        // Progress Bar Simulation (Task Completion)
        const completionRate = (completedTasks / tasks.length) * 100;
        const progressBarWidth = pageWidth - 40;
        doc.setDrawColor(0);  // Outline color
        doc.rect(20, 140, progressBarWidth, 10);  // Full progress bar
        doc.setFillColor(0, 128, 0);  // Green color for completed portion
        doc.rect(20, 140, (completionRate / 100) * progressBarWidth, 10, 'F');  // Completed portion filled

        doc.setFontSize(12);
        doc.text(`Task Completion: ${completionRate.toFixed(2)}%`, 20, 160);

        // "Tasks by Category" section
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        const tasksByCategoryTitle = "Tasks by Category";
        const tasksByCategoryTitleWidth = doc.getTextWidth(tasksByCategoryTitle);
        doc.text(tasksByCategoryTitle, (pageWidth - tasksByCategoryTitleWidth) / 2, 180);
        doc.line((pageWidth - tasksByCategoryTitleWidth) / 2, 182, (pageWidth + tasksByCategoryTitleWidth) / 2, 182);

        // Tasks by Category Table
        doc.setFontSize(12);
        let y = 195;
        Object.keys(tasksByCategory).forEach((category) => {
            doc.text(category, 30, y);
            doc.text(`${tasksByCategory[category]} tasks`, 130, y);
            y += 10;
        });

        doc.line(25, 190, 160, 190);  // Top horizontal line
        doc.line(25, y, 160, y);  // Bottom horizontal line
        doc.line(25, 190, 25, y);  // Left vertical line
        doc.line(160, 190, 160, y);  // Right vertical line

        // Footer with page number
        doc.text(`Page 1 of 1`, pageWidth - 40, pageHeight - 10);

        // Save the PDF
        doc.save('task_report.pdf');
    };

    return (
        <div className='p-4'>
            <div className="absolute top-4 left-4">
                <BackToHome /> {/* Add the BackToHome button here */}
            </div>
            {/* Centered Title */}
            <div className='flex justify-center my-4'>
                <h1 className='text-4xl font-extrabold text-center font-serif'>Tasks Dashboard</h1>
            </div>

            {/* Task Counts */}
            <div className='flex justify-between mb-4'>
                <Link to='/tasks/IncompleteTasks' className='flex-1 bg-gray-200 p-2 border border-gray-400 rounded-lg shadow-md mx-2 text-center hover:bg-gray-300'>
                    <h2 className='text-lg font-semibold'>Incomplete Tasks</h2> {/* Reduced font size */}
                    <p className='text-2xl font-bold'>{incompleteTasks}</p> {/* Reduced font size */}
                </Link>
                <Link to='/tasks/OverdueTasks' className='flex-1 bg-red-200 p-2 border border-red-400 rounded-lg shadow-md mx-2 text-center hover:bg-red-300'>
                    <h2 className='text-lg font-semibold'>Overdue Tasks</h2>
                    <p className='text-2xl font-bold'>{overdueTasks}</p>
                </Link>
                <Link to='/tasks/UrgentTasks' className='flex-1 bg-yellow-200 p-2 border border-yellow-400 rounded-lg shadow-md mx-2 text-center hover:bg-yellow-300'>
                    <h2 className='text-lg font-semibold'>Urgent Tasks</h2>
                    <p className='text-2xl font-bold'>{urgentTasks}</p>
                </Link>
            </div>


            {/* Search Bar and Create Task Button */}
            <div className='flex justify-end items-center mb-4 gap-x-4'>
                <div className='flex items-center space-x-2'>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} className='w-48' />
                    <Link to='/tasks/create' className='flex items-center bg-slate-300 hover:bg-slate-400 px-3 py-2 rounded-lg'>
                        <MdOutlineAddBox className='text-2xl mr-2' />
                        <span>Create Task</span>
                    </Link>
                    <button
                        onClick={generateReport}
                        className='flex items-center bg-green-300 hover:bg-green-400 px-3 py-2 rounded-lg'
                    >
                        <span>Generate Report</span>
                    </button>
                </div>
            </div>

            {/* View Toggle Buttons */}
            <div className='flex justify-center items-center gap-x-4 mb-4'>
                <button
                    className={`px-4 py-2 border rounded ${showType === 'table' ? 'bg-gray-300' : 'bg-white'}`}
                    onClick={() => setShowType('table')}
                >
                    <AiOutlineTable className='inline mr-2' />
                    Table View
                </button>
                <button
                    className={`px-4 py-2 border rounded ${showType === 'card' ? 'bg-gray-300' : 'bg-white'}`}
                    onClick={() => setShowType('card')}
                >
                    <AiOutlineAppstore className='inline mr-2' />
                    Card View
                </button>
            </div>

            {/* Render filtered tasks */}
            {showType === 'table' ? (
                <TasksTable tasks={filteredTasks} />
            ) : (
                <TasksCard tasks={filteredTasks} />
            )}
        </div>
    );
};

export default TasksHome;
