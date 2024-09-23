import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';


const DeleteTask = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const handleDeleteTask = () => {
    setLoading(true);
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Task deleted successfully', { variant: 'success' });
        navigate('/');
      })
      .catch(error => {
        console.log(error.message);
        setLoading(false);
        enqueueSnackbar('Failed to delete task', { variant: 'error' });
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4 text-center font-serif">Delete Task</h1>
      <div className="flex flex-col items-center border-2 border-dark-green rounded-xl w-[600px] p-8 mx-auto bg-light-green">
        <h3 className="text-2xl my-4 text-gray-700 font-semibold">Are you sure you want to delete this task?</h3>
        <div className="flex justify-between w-full">
          <button
            className="p-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg w-full max-w-xs"
            onClick={handleDeleteTask}
            disabled={loading}
          >
            Yes, Delete it
          </button>
          <button
            className="p-4 bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-lg w-full max-w-xs ml-4"
            onClick={() => navigate('/')}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
