import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { compressVideo } from '../Compress';
import { cloudinaryUpload } from '../Cloudinary';
import MoveEditor from './MoveEditor';
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
    console.log(e)
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

  const handleClipDescChange = (index, newDesc, isAddedClip = false) => {
    if (isAddedClip) {
      const updatedAddedClips = addedClips.map((clip, i) => {
        if (i === index) {
          return { ...clip, desc: newDesc };
        }
        return clip;
      });
      setAddedClips(updatedAddedClips);
    } else {
      const updatedClips = clips.map((clip, i) => {
        if (i === index) {
          return { ...clip, desc: newDesc };
        }
        return clip;
      });
      setClips(updatedClips);
    }
  };

  return (
    <MoveEditor
      handleClose={handleClose}
      name={name}
      setName={setName}
      desc={desc}
      setDesc={setDesc}
      tags={tags}
      setTags={setTags}
      status={status}
      setStatus={setStatus}
      handleSaveMove={handleSaveMove}
      clips={clips}
      addedClips={addedClips}
      handleClipDescChange={handleClipDescChange}
      clipLoad={clipLoad}
      note={note}
      setNote={setNote}
      handleClipChange={handleClipChange}
      previewUrl={previewUrl}
      handleAddClip={handleAddClip}
      loading={loading}
    />
  );
};

export default MoveModal;
