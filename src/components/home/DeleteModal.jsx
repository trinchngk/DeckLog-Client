import { AiOutlineClose } from 'react-icons/ai';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PropagateLoader } from 'react-spinners';


const DeleteModal = ({ move, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const id = move._id;
  const { enqueueSnackbar } = useSnackbar(); 

  const handleDeleteMove = () => {
    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/moves/${id}`, { withCredentials: true })
      .then(() => {
        setLoading(false);
        onClose(); 
        window.location.reload(); 
        enqueueSnackbar('Move Deleted successfully', { variant: 'success' });        
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <section>
      {loading ? (
        <div
          className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
        > 
          <PropagateLoader color="#ffffff"/>
        </div>
      ) : (
        <div
          className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
          onClick={onClose}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className='w-[400px] max-w-full h-[250px] bg-[#2E2E33] rounded-xl p-4 flex flex-col relative'
          >
            <AiOutlineClose
              className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer hover:text-white'
              onClick={onClose}
            />
            <h3 className='mt-2 mb-10 text-xl'>Delete {move.name}?</h3>
            <p >Doing so will delete all current progress and data.</p>
            <button
              className='p-4 bg-red-600 text-white my-10 w-full rounded-xl hover:text-red-600 hover:bg-white '
              onClick={handleDeleteMove}
            >
              Delete
            </button>
          </div>
        </div>
      )}   
    </section>

  );
};

export default DeleteModal;