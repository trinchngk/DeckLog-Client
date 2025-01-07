import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";
import { MdConstruction } from "react-icons/md";
import MoveModal from './MoveModal';
import DeleteModal from './DeleteModal';
import dayjs from "dayjs";

const MoveSingleCard = ({ move }) => {
  const [displayMove, setDisplayMove] = useState(null);
  const [deleteMove, setDeleteMove] = useState(null);
  const maxChars = 55;

  const handleOpenModal = (move, type) => {
    if (type === "delete") {
      setDeleteMove(move);      
    } else if (type === "display") {
      setDisplayMove(move);
    }
  };

  const handleCloseModal = () => {
    setDeleteMove(null);
    setDisplayMove(null);
  };

  return (
    <div className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl cursor-pointer ' 
        onClick={(e) => {
          e.stopPropagation(); 
          handleOpenModal(move, "display");
        }}
      >
      <div className='flex justify-start items-center gap-x-2'>
        <h2 className='my-2 text-xl'>{move.name}</h2>
      </div>      
      <h2 className='mr-2 absolute right-2 px-4 py-1 bg-white text-[#3B3B3B] rounded-lg'>
        {dayjs(move.updatedAt).format("MM/DD/YYYY")}
      </h2>
      {move.finished ? (
        <h2 className='mb-2 px-4 py-1 bg-green-500 text-white rounded-lg'>
          Finished
        </h2>
      ) : (
        <h2 className='mb-2 px-4 py-1 bg-orange-500 text-white rounded-lg'>
          In Progress
        </h2>
      )}

      
      <div className='flex justify-start items-center gap-x-2'>
        <h4 className='my-2 text-gray-500'>{move.desc.length > maxChars ? `${move.desc.slice(0, maxChars)}...` : move.desc}</h4>
      </div>
      <div className='flex justify-start items-center gap-x-2 absolute bottom-4'>
        <h2 className='my-2 text-gray-500'>Began on {dayjs(move.startDate).format("MM/DD/YYYY")}</h2>
      </div>
      <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
        <MdOutlineDelete 
          className='text-2xl text-red-600 hover:text-white cursor-pointer absolute right-4 bottom-4' 
          onClick={(e) => {
            e.stopPropagation(); 
            handleOpenModal(move, "delete");
          }}
        />
      </div>
      {deleteMove && (
        <DeleteModal 
          move={deleteMove} 
          onClose={handleCloseModal}
       />
      )}            
      {displayMove && (
        <MoveModal 
          move={displayMove} 
          onClose={(e) => {
            e.stopPropagation(); 
            handleCloseModal();
          }} />
      )}
    </div>
  );
};

export default MoveSingleCard;