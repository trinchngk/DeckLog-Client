import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import { useState } from 'react';
import classNames from "classnames";
import CustomCarousel from '../Carousel';
import EditModal from './EditModal';
import dayjs from 'dayjs';

const MoveModal = ({ move, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const slides = move.clips;

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[1200px] max-w-full h-[750px] bg-[#2E2E33] rounded-xl p-4 flex relative"
      >        
        <AiOutlineClose
          className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer hover:text-white"
          onClick={onClose}
        />
        <div className='flex flex-col mx-5 my-5 w-1/3 overflow-y-auto'>

          <div className='flex gap-x-2'>
            <h1 className="mb-10 text-xl">{move.name}</h1>
            <AiOutlineEdit
              className="text-3xl text-gray-600 hover:text-white"
              onClick={() => setShowModal(true)}
            />            
          </div>
          <div className='flex gap-x-4'>
            {move.finished ? (
              <h2 className='text-lg px-4 py-1 bg-green-500 text-white rounded-lg'>
                Finished
              </h2>
            ) : (
              <h2 className='text-lg px-4 py-1 bg-orange-500 text-white rounded-lg whitespace-nowrap'>
                In Progress
              </h2>

            )}
            <h2 className='text-lg px-4 py-1 bg-white text-[#3B3B3B] rounded-lg'>
              {dayjs(move.updatedAt).format("MM/DD/YYYY")}
            </h2>                
          </div>
          <p className="my-2">{move.desc}</p> 
        </div>
        {/* {move.clips.map((clip) => (
          <div className={classNames("relative m-10 overflow-hidden w-2/3 flex flex-col border-2 border-gray-500 p-4 rounded-xl", {
            'border-green-500': move.finished === true,
            'border-orange-500': move.finished === false,
          })}>
            <video 
              src={move.clips[0].clipUrl} 
              controls 
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>           
        ))} */}
         <div className="w-2/3 h-full flex items-center">
          <div 
              className={classNames(
                "w-full h-[600px] relative border-2 border-gray-500 rounded-xl mr-5",
                {
                  'border-green-500': move.finished,
                  'border-orange-500': !move.finished,
                }
              )}
            >   
            {move.clips[1] ? (
              <CustomCarousel slides={slides} />   
            ) : (
              <video 
                src={move.clips[0].clipUrl} 
                controls 
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
              />              
            )}
            </div>
          
        </div>

      </div>
      {showModal && (
        <EditModal move={move} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MoveModal;
