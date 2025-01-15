import axios from 'axios';

const getCloudinarySignature = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/moves/cloudinary-signature`, {
      withCredentials: true,
    });
    return res.data;

  } catch (error) {
    console.error('Error getting upload signature:', error.response?.data || error.message);
  }
};

export const cloudinaryUpload = async (clip) => {

  const formData = new FormData();

  console.log(clip);
  formData.append('clip', clip);

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/moves/cloudinary/upload`, formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
    .catch((error) => {
      console.error('Error creating clip:', error.response?.data || error.message);
    });

  return response.data;

};