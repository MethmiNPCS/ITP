import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';


const EditTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low'); // Default priority
  const [category, setCategory] = useState('Orders'); // Default category
  const [tags, setTags] = useState('');
  const [isCompleted, setIsCompleted] = useState(false); // Checkbox for status
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/tasks/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setDescription(response.data.description);
        setDueDate(response.data.dueDate);
        setPriority(response.data.priority);
        setCategory(response.data.category);
        setTags(response.data.tags);
        setIsCompleted(response.data.isCompleted);
        setLoading(false);
      })
      .catch(error => {
        console.log(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleEditTask = () => {
    const data = {
      title,
      description,
      dueDate,
      priority,
      category,
      tags,
      isCompleted
    };
    setLoading(true);

    axios
      .put(`http://localhost:5555/tasks/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Task updated successfully', { variant: 'success' });
        navigate('/');
      })
      .catch(error => {
        console.log(error.message);
        setLoading(false);
        enqueueSnackbar('Failed to update task', { variant: 'error' });
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4 text-center font-serif">Edit Task</h1>
      <div className="flex flex-col border-2 border-dark-green rounded-xl w-[600px] p-4 mx-auto bg-light-green">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-700 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-700 font-semibold">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full h-24"
          />
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-700 font-semibold">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-700 font-semibold">Priority</label>
          <div className="flex gap-4">
            {['Low', 'Medium', 'High', 'Urgent'].map((level) => (
              <label key={level} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={level}
                  checked={priority === level}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-6 h-6 accent-green-500"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-700 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          >
            {['Orders', 'Stocks', 'Livestock Health', 'Products', 'Employees', 'Maintenance'].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-700 font-semibold">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <div className="my-4 flex justify-end items-center gap-4">
          <label className="text-xl text-gray-700 font-semibold flex items-center gap-4">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="w-6 h-6 accent-green-500"
            />
            Completed
          </label>
        </div>

        <div className="my-4 flex justify-center">
          <button className="p-3 bg-sky-300 text-white font-bold rounded-lg w-full max-w-xs hover:bg-sky-400 transition-all" onClick={handleEditTask} disabled={loading}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
