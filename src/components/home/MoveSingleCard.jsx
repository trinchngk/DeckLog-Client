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

const MoveSingleCard = ({ move, onSave }) => {
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
    <div className= 'h-[300px] rounded-lg px-4 py-2 m-4 relative shadow-xl cursor-pointer ' 
        style={{
          backgroundImage: `url('https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/so_10,c_thumb/${move.clips.at(-1).clipId}.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onClick={(e) => {
          e.stopPropagation(); 
          handleOpenModal(move, "display");
        }}
      >
      <h2 className='absolute top-2 left-2 text-lg text-white px-4 py-1 bg-[#3B3B3B] rounded-md'>{move.name}</h2>     

      <div className="absolute bottom-2 left-2 right-2 flex items-center">
        {/* Status bar */}
        <h2
          className={`flex-grow px-4 py-1 text-white rounded-lg ${
            move.status === 'Designing' ? 'bg-orange-500' :
            move.status === 'Practicing' ? 'bg-blue-500' :
            move.status === 'Finished' ? 'bg-green-500' : ''
          }`}
        >
          {move.status}
        </h2>

        {/* Date */}
        <h2 className="px-4 py-1 bg-[#3B3B3B] text-white rounded-lg ml-2">
          {dayjs(move.updatedAt).format("MM/DD/YYYY")}
        </h2>
      </div>
      <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
      <MdOutlineDelete
        className="text-2xl text-red-600 hover:text-white hover:bg-red-600 cursor-pointer absolute right-2 top-2 bg-[#3B3B3B] p-1 rounded-xl flex items-center justify-center"
        style={{
          width: '35px',
          height: '35px',
        }}
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
          onClose={() => handleCloseModal()}
          onSave={onSave} 
          />
      )}
    </div>
  );
};

export default MoveSingleCard;