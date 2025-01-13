import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";
import { MdConstruction } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { BiShow } from 'react-icons/bi';
import DeleteModal from './DeleteModal';
import MoveModal from "./MoveModal";
import { useState } from "react";
import dayjs from "dayjs";

const MovesTable = ( { moves } ) => {
  const [displayMove, setDisplayMove] = useState(null);
  const [deleteMove, setDeleteMove] = useState(null);
  const maxChars = 30;

  const handleOpenModal = (move, type) => {
    if (type === "delete") {
      setDeleteMove(move);      
    } else if (type === "display") {
      setDisplayMove(move);
    } else {
      setEditMove(move);
    }
  };

  const handleCloseModal = () => {

    setDeleteMove(null);
    setDisplayMove(null);
    setEditMove(null);
  };

  return (
    <>
      <table className='mt-4 w-full border-separate border-spacing-2'>
        <thead className='border border-slate-600 rounded-md'>
          <tr>
            <th className='border border-white rounded-md'>No</th>
            <th className='border border-white rounded-md'>Name</th>
            <th className='border border-white rounded-md max-md:hidden'>Description</th>
            <th className='border border-white rounded-md max-md:hidden'>Tags</th>
            <th className='border border-white rounded-md'>Status</th>
            <th className='border border-white rounded-md'>Started</th>
            <th className='border border-white rounded-md'>Operations</th>

          </tr>
        </thead>
        <tbody>
          {moves.map((move, index) => (
            <tr key={move._id} className='h-8'>
              <td className='border border-gray-500 rounded-md text-center text-white'>
                {index + 1}
              </td>
              <td className='border border-gray-500 rounded-md text-center text-white'>
                {move.name}
              </td>
              <td className='border border-gray-500 rounded-md text-center text-white max-md:hidden'>
                {move.desc.length > maxChars ? `${move.desc.slice(0, maxChars)}...` : move.desc}
              </td>
              <td className='border border-gray-500 rounded-md text-center text-white max-md:hidden'>
                {move.tags}
              </td>
              <td className={`border border-gray-500 rounded-md text-center place-items-center h-full ${
                  move.status === 'Designing' ? 'text-orange-500' :
                  move.status === 'Practicing' ? 'text-blue-500' :
                  move.status === 'Finished' ? 'text-green-500' : 'text-white'
                }`}>
                {move.status}
              </td>
              <td className='border border-gray-500 rounded-md text-center text-white max-md:hidden'>
                {dayjs(move.startDate).format("MM/DD/YYYY")}
              </td>
              <td className='border border-gray-500 rounded-md text-center text-white'>
                <div className='flex justify-center gap-x-4'>
                  <BiShow
                    className='text-3xl text-blue-800 hover:text-white cursor-pointer'
                    onClick={() => handleOpenModal(move, "display")}
                  />
                  {/* <AiOutlineEdit 
                    className='text-2xl text-yellow-600 hover:text-white cursor-pointer'
                    onClick={() => handleOpenModal(move, "edit")}
                    /> */}
                  <MdOutlineDelete 
                    className='text-2xl text-red-600 hover:text-white cursor-pointer' 
                    onClick={() => handleOpenModal(move, "delete")}
                    />
                </div>               
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      {deleteMove && (
        <DeleteModal 
          move={deleteMove} 
          onClose={handleCloseModal} />
      )}  
      {displayMove && (
        <MoveModal 
          move={displayMove}
          onClose={handleCloseModal} />
      )}
      {/* {editMove && (
        <EditModal 
          move={editMove}
          onClose={handleCloseModal} />
      )} */}
    </> 
  )
}

export default MovesTable;