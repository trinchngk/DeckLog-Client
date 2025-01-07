import { AiOutlineClose } from 'react-icons/ai';
import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Switch } from 'pretty-checkbox-react';
import { PropagateLoader } from 'react-spinners';
import '@djthoms/pretty-checkbox';

const CreateModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [finished, setFinished] = useState(false);
  const [clip, setClip] = useState(null); // Single file object
  const [previewUrl, setPreviewUrl] = useState(null); // Temporary URL for video preview
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();


  const handleClipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClip(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate temporary URL for video preview
    }
  };

  const handleSaveMove = () => {
    if (!name || !desc || !tags || !clip) {
      enqueueSnackbar('Please fill in all fields and upload a video', { variant: 'warning' });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('tags', tags);
    formData.append('finished', finished);
    formData.append('clip', clip); // Append the video file

    axios
      .post(`${import.meta.env.VITE_API_URL}/moves`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then(() => {
        enqueueSnackbar('Move Created successfully', { variant: 'success' });
        onClose();
        setLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        enqueueSnackbar('Error creating move', { variant: 'error' });
        console.error('Error creating move:', error.response?.data || error.message);
        setLoading(false);
      });
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
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
          className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
          onClick={handleClose}
        >        
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-[1400px] max-w-full max-h-[800px] bg-[#2E2E33] rounded-xl p-4 flex relative"
          >
            <AiOutlineClose
              className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer hover:text-white"
              onClick={handleClose}
            />
            {/* Left Section */}
            <div className="w-1/3 h-full overflow-y-auto p-4">
              <h1 className="text-xl mb-4">New Move</h1>
              <input
                type="text"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                className="mb-4 bg-[#2E2E33] border-2 border-gray-500 px-4 py-2 w-full text-white rounded-xl"
              />
              <textarea
                value={desc}
                placeholder="Description"
                rows={14}
                onChange={(e) => setDesc(e.target.value)}
                className="mb-4 bg-[#2E2E33] border-2 border-gray-500 px-4 py-2 w-full text-white rounded-xl resize-none"
              />
              <input
                type="text"
                value={tags}
                placeholder="Separate tags with commas"
                onChange={(e) => setTags(e.target.value)}
                className="mb-4 bg-[#2E2E33] border-2 border-gray-500 px-4 py-2 w-full text-white rounded-xl"
              />
              <Switch
                shape="fill"
                color={finished ? 'success' : 'danger'}
                animation="smooth"
                checked={finished}
                onChange={() => setFinished(!finished)}
              >
                Finished
              </Switch>
              <button
                className="w-full mt-6 py-4 px-8 bg-sky-300 text-white rounded-xl hover:bg-white hover:text-sky-300"
                onClick={handleSaveMove}
              >
                Save
              </button>          
            </div>

            {/* Right Section */}
            <div className="w-2/3 mt-[59px] h-[500px] p-4 flex flex-col border-2 border-gray-500 px-4 py-2 rounded-xl" >
              
              <h2 className="text-xl text-gray-500 mb-4 text-center">Upload Clip</h2>
              <input type="file" accept="video/*" onChange={handleClipChange} />
              {previewUrl && (
                <video className="mt-4 max-h-[500px] rounded-xl" src={previewUrl} controls  />
              )}
            </div>
          </div>
        </div>        
      )}      
    </section>


  );
};

export default CreateModal;
