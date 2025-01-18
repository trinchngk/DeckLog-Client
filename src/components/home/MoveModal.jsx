import { AiOutlineClose } from 'react-icons/ai';
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { PropagateLoader } from 'react-spinners';
import { compressVideo } from '../Compress';
import { cloudinaryUpload } from '../Cloudinary';
import '@djthoms/pretty-checkbox';

const MoveModal = ({ move, onClose, onSave }) => {
  const [name, setName] = useState(move.name);
  const [desc, setDesc] = useState(move.desc);
  const [tags, setTags] = useState(move.tags.toString());
  const [status, setStatus] = useState(move.status);
  const [note, setNote] = useState('')
  const [clip, setClip] = useState(null);
  const [clips, setClips] = useState(move.clips);
  const [addedClips, setAddedClips] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clipLoad, setClipLoad] = useState(false);
  const [saved, setSaved] = useState(false);


  const { enqueueSnackbar } = useSnackbar();

  const handleAddClip = async () => {
    if (!clip) {
      enqueueSnackbar('Please upload a video', { variant: 'warning' });
      return;
    }

    setClipLoad(true);
    
    try {
      
      const originalSize = (clip.size / 1024 / 1024).toFixed(2);
      enqueueSnackbar(`Processing ${originalSize}MB video...`, { variant: 'info' });
      
      // Skip compression for small files
      let fileToUpload;
      if (clip.size < 10 * 1024 * 1024) {
        fileToUpload = clip;
        enqueueSnackbar('File small enough, skipping compression', { variant: 'info' });
      } else {
        fileToUpload = await compressVideo(clip);
        const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
        enqueueSnackbar(`Compressed from ${originalSize}MB to ${compressedSize}MB, now uploading`, { variant: 'success' });
      }

      const cloudinaryRes = await cloudinaryUpload(fileToUpload);



      const clipData = {
        clipUrl: cloudinaryRes.secure_url,
        clipId: cloudinaryRes.public_id,
        desc: note
      }

      setAddedClips([...addedClips, clipData]);

      enqueueSnackbar('Clip added successfully!', { variant: 'success' });
      setNote('');
      setClip(null);
      setPreviewUrl(null);

      setClipLoad(false);

    } catch (error) {
      enqueueSnackbar('Error uploading clip', { variant: 'error' });
      console.error('Error adding clip:', error.message);
      setClipLoad(false);
    }


  };

  const handleClipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClip(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate temporary URL for video preview
    }
  };

  const handleSaveMove = async () => {
    if (!name || !desc || !tags || !status || clips.length == 0) {
      enqueueSnackbar('Please fill in all fields and upload a video', { variant: 'warning' });
      return;
    }

    setLoading(true);

    const moveData = {
      name,
      desc,
      tags,
      status,
      clips: [...clips, ...addedClips]
    };  

    axios
      .put(`${import.meta.env.VITE_API_URL}/moves/${move._id}`, moveData, {
        withCredentials: true,
      })
      .then(() => {
        setSaved(true);
        setAddedClips([]);
        enqueueSnackbar('Move Updated Successfully', { variant: 'success' });
        onSave();
        onClose(); 
        setLoading(false);

      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });

  };

  const handleCleanup = async () => {
    if (addedClips[0] && !saved) {
      
      const controller = new AbortController();

      try {
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await axios.delete(`${import.meta.env.VITE_API_URL}/moves/cloudinary/delete-clips`, {
          data: { clips: addedClips },
          withCredentials: true,
          signal: controller.signal
        });          

        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error deleting clips:', error.response?.data || error.message);
      } finally {
        controller.abort();
      }
    
    }
  };

  const handleClose = async (event) => {
    event.stopPropagation()
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    await handleCleanup();

    onClose();
  };

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (!saved) {
        await handleCleanup();
        event.preventDefault();
        event.returnValue = '';        
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clips, previewUrl, saved]);

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
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-[1400px] max-w-full h-[800px] bg-[#2E2E33] rounded-xl p-4 flex relative"
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
                className="mb-4 bg-gray-500 px-4 py-2 w-full text-white rounded-xl font-semibold text-xl focus:outline-none"
              />
              <textarea
                value={desc}
                placeholder="Description"
                rows={17}
                onChange={(e) => setDesc(e.target.value)}
                className="mb-2 bg-gray-500 px-4 py-2 w-full text-white rounded-xl focus:outline-none resize-none"
              />
              <input
                type="text"
                value={tags}
                placeholder="Separate tags with commas"
                onChange={(e) => setTags(e.target.value)}
                className="mb-4 bg-gray-500 px-4 py-2 w-full text-white rounded-xl focus:outline-none"
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
            
            <div className="w-2/3 mb-8 p-4 flex flex-col" >
              <h2 className="mb-4 text-xl text-gray-500">Iterations</h2>       
              <div className='overflow-y-auto flex flex-col'>
                {clips.map((item, index) => (
                  <div key={index} className='border border-gray-500 bg-gray-500 rounded-xl p-4 flex gap-4 mb-4'>
                    <textarea 
                      className="overflow-y-auto bg-gray-600 px-6 py-4 w-full text-white rounded-xl focus:outline-none"
                      type="text"   
                      value={item.desc}
                    />
                    <video className="max-h-[600px] max-w-[600px] rounded-xl" src={item.clipUrl} controls />                  
                  </div>
                ))}
                {addedClips.map((item, index) => (
                  <div key={index} className='border border-blue-500 bg-gray-500 rounded-xl p-4 flex gap-4 mb-4'>
                    <textarea 
                      className="overflow-y-auto bg-gray-600 px-6 py-4 w-full text-white rounded-xl focus:outline-none"
                      type="text"   
                      value={item.desc}   
                    />                    
                    <video className="max-h-[600px] max-w-[600px] rounded-xl" src={item.clipUrl} controls />                  
                  </div>
                ))}

                {clipLoad ? (
                  <div className='flex gap-4 justify-center items-center'>
                    <PropagateLoader color="#3c82f6" className='m-4 bg-gray-500'/>
                  </div>
                ) : (
                  <>
                    <div className='border border-gray-500 rounded-xl p-4 flex gap-4 mb-2'>
    
                      <div className='w-full'>
                        <textarea
                          type="text"
                          value={note}
                          placeholder="Notes about this iteration..."
                          onChange={(e) => setNote(e.target.value)}
                          className="mb-4 bg-gray-500 px-4 py-2 w-full text-white rounded-xl focus:outline-none"
                        />
                        <input className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-500 cursor-pointer" 
                              id="file_input" type="file" accept="video/*" onChange={handleClipChange}></input>                     
                      </div>
                      {previewUrl && (
                        <video className="h-[200px] rounded-xl" src={previewUrl} controls  />
                      )}                                     
                    </div> 
                    <button
                          className="text-blue-500 rounded-xl hover:text-white"
                          onClick={handleAddClip}
                        >
                          Add this Clip +
                    </button>                  
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

export default MoveModal;
