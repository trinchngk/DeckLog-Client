import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { AiOutlineClose } from 'react-icons/ai';
import Stream from './CameraStream';

const RecModal = ({ onClose, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: true });

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
    setFinished(true);
  };

  const handleSave = () => {
    fetch(mediaBlobUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });

        const event = {
          target: {
            files: [file],
          },
        };
        onSave(event);
        onClose();
      });
  };

  return (
    <div 
      className="bg-[#202020] rounded-lg py-8 px-10 w-[800px]" 
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex justify-between mb-4 mt-2">
        <h2 className="text-xl rounded-xl">Record a New Clip</h2>
        <AiOutlineClose
          className="text-3xl text-red-600 cursor-pointer hover:text-white"
          onClick={onClose}
        />              
      </div>

      <div className="relative">
        <div className="w-full p-2 rounded-xl p-4 bg-[#2E2E33]">
          {!finished && <Stream/>}
          {finished && <video className="rounded-xl w-full" src={mediaBlobUrl} controls />}
        </div>
        
        <div className="absolute top-8 right-8">
          {!isRecording && !finished && (
            <button 
              className="text-sm font-semibold text-white bg-green-500 py-2 px-4 rounded-md hover:bg-white hover:text-green-500"
              onClick={handleStartRecording}
            >
              Start Recording
            </button>
          )}
          
          {isRecording && (
            <button 
              className="text-sm font-semibold text-red-500 bg-white py-2 px-4 rounded-md hover:bg-red-500 hover:text-white"
              onClick={handleStopRecording}
            >
              Stop Recording
            </button>
          )}
          
          {mediaBlobUrl && (
            <button 
              className="text-sm font-semibold text-white bg-blue-500 py-2 px-4 rounded-md hover:bg-white hover:text-blue-500"
              onClick={handleSave}
            >
              Save Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecModal;
