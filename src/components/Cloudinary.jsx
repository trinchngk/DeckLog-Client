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
  try {
    const { signature, timestamp } = await getCloudinarySignature();

    const formData = new FormData();
    formData.append('file', clip);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);


    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
      formData,
      {
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.response?.data || error.message);
  }
};