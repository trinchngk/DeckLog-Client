import { React, useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSolidVideoRecording } from "react-icons/bi";
import RecModal from './RecModal';
import CameraTest from './CameraStream';

const MoveEditor = ({
  handleClose,
  name,
  setName,
  desc,
  setDesc,
  tags,
  setTags,
  status,
  setStatus,
  handleSaveMove,
  clips = [],
  addedClips,
  handleClipDescChange,
  clipLoad,
  note,
  setNote,
  handleClipChange,
  previewUrl,
  handleAddClip,
  loading
}) => { 
  const totalIterations = clips.length + addedClips.length;

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    const [showPopup, setShowPopup] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState(null);
  
    const handleOpenPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);
  
    const handleSaveRecording = (blob) => {
      setRecordedVideo(blob);
      handleClipChange(blob);
    };

  return (
    <section>
      {loading ? (
        <div
          className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
        > 
          <PropagateLoader color="#3c82f6"/>
        </div>
      ) : (
        <div
          className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
          onClick={handleClose}
        >  
          {showPopup && ( 
            <div
            className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
            onClick={(event) => event.stopPropagation()}
            >  
              <RecModal
                  onClose={handleClosePopup}
                  onSave={handleSaveRecording}
                />
            </div>
          )}
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-[1400px] max-w-full h-[800px] bg-[#202020] rounded-xl p-4 flex relative"
          >
            <AiOutlineClose
              className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer hover:text-white"
              onClick={handleClose}
            />
            {/* Left Section */}
            <div className="w-1/3 h-full overflow-y-auto p-4">
              <h1 className="text-xl mb-4">Edit Move</h1>
              <input
                type="text"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                className="mb-4 bg-[#2E2E33] px-4 py-2 w-full text-white rounded-xl font-semibold text-xl focus:outline-none"
              />
              <textarea
                value={desc}
                placeholder="Description"
                rows={17}
                onChange={(e) => setDesc(e.target.value)}
                className="mb-2 bg-[#2E2E33] px-4 py-2 w-full text-white rounded-xl focus:outline-none resize-none"
              />
              <input
                type="text"
                value={tags}
                placeholder="Separate tags with commas"
                onChange={(e) => setTags(e.target.value)}
                className="mb-4 bg-[#2E2E33] px-4 py-2 w-full text-white rounded-xl focus:outline-none"
              />
              <div className="inline-flex w-full">
                <button
                  className={`font-bold py-2 px-4 rounded-l-lg w-1/3 ${
                    status === 'Designing' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                  onClick={() => setStatus('Designing')}
                >
                  Designing
                </button>
                <button
                  className={`font-bold py-2 px-4 w-1/3 ${
                    status === 'Practicing' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                  onClick={() => setStatus('Practicing')}
                >
                  Practicing
                </button>
                <button
                  className={`font-bold py-2 px-4 rounded-r-lg w-1/3 ${
                    status === 'Finished' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                  onClick={() => setStatus('Finished')}
                >
                  Finished
                </button>
              </div>
              <button
                className="w-full mt-4 py-4 px-8 bg-blue-500 text-white rounded-lg hover:bg-white hover:text-blue-500"
                onClick={handleSaveMove}
              >
                Save
              </button>          
            </div>

            {/* Right Section */}
            
            <div className="w-2/3 mb-8 p-4 flex flex-col">
              <h2 className="mb-4 text-xl text-gray-500">{totalIterations} Iteration{totalIterations === 1 ? '' : 's'}</h2>       
              <div className='overflow-y-auto flex flex-col'>
                {addedClips.toReversed().map((item, index) => (
                  <div key={index} className='border border-blue-500 bg-[#202020] rounded-xl p-4 flex gap-4 mb-4'>
                    <textarea 
                      className="overflow-y-auto bg-[#2E2E33] px-6 py-4 w-full text-white rounded-xl focus:outline-none"
                      value={item.desc}
                      onChange={(e) => handleClipDescChange(index, e.target.value, true)}
                    />                    
                    <video className="max-h-[600px] max-w-[600px] rounded-xl" src={item.clipUrl} controls />                  
                  </div>
                ))}                
                {clips.toReversed().map((item, index) => (
                  <div key={index} className='border border-gray-500 bg-[#202020] rounded-xl p-4 flex gap-4 mb-4'>
                    <textarea 
                      className="overflow-y-auto bg-[#2E2E33] px-6 py-4 w-full text-white rounded-xl focus:outline-none"
                      value={item.desc}
                      onChange={(e) => handleClipDescChange(index, e.target.value)}
                    />
                    <video className="max-h-[600px] max-w-[600px] rounded-xl" src={item.clipUrl} controls />                  
                  </div>
                ))}
                {clipLoad ? (
                  <div className='flex gap-4 justify-center items-center'>
                    <PropagateLoader color="#3c82f6" className='m-4 bg-[#2E2E33]'/>
                  </div>
                ) : (
                  <>
                    <div className='border border-gray-500 rounded-xl p-4 flex gap-4 mb-2 flex-col'>
                      <div className='flex gap-4'>
                        <div className='w-full'>
                          <textarea
                            type="text"
                            value={note}
                            placeholder="Notes about this iteration..."
                            onChange={(e) => setNote(e.target.value)}
                            className="mb-4 bg-[#2E2E33] px-4 py-2 w-full text-white rounded-xl focus:outline-none"
                          />
                          <div className="flex gap-4">
                            <button className="text-sm font-semibold text-red-500 bg-white py-2 px-4 rounded-md hover:bg-red-500 hover:text-white flex gap-2"
                                    onClick={handleOpenPopup}>
                              Record 
                              <BiSolidVideoRecording className='text-xl'/>                              
                            </button>
                            <input className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-500 cursor-pointer" 
                              id="file_input" type="file" accept="video/*" onChange={handleClipChange}>
                            </input>                              
                          </div>


                        </div>
                        {previewUrl && (
                          <video className="h-[200px] rounded-xl" src={previewUrl} controls  />
                        )}                         
                      </div>
                      <button
                            className="bg-blue-500 py-2 rounded-md hover:text-blue-500 hover:bg-white"
                            onClick={handleAddClip}
                          >
                            Add New Clip
                      </button>                                                         
                    </div> 
                 
                  </>       
                )}
              </div>

            </div>
          </div>
        </div>        
      )}      
    </section>
  );
};

export default MoveEditor;