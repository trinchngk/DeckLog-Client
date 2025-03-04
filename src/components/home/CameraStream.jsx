import React, { useRef, useEffect, useState} from 'react';
import { PropagateLoader } from 'react-spinners';


const Stream = ({ isActive = true }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (isActive) {
      const initializeMediaStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          console.log('MediaStream successfully initialized:', stream);
          streamRef.current = stream;

          if (videoRef.current) {
            

            videoRef.current.srcObject = stream;
            console.log('Video srcObject set:', videoRef.current.srcObject);

            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded, stream should now display.');
              videoRef.current.play();
            };

            videoRef.current.onplay = () => {
              console.log('Video is playing.');
            };

            videoRef.current.onerror = (error) => {
              console.error('Video playback error:', error);
            };
          }
        } catch (error) {
          console.error('Error accessing media devices:', error);
          alert('Failed to access camera. Please ensure your camera is connected and permissions are granted.');
        }
      };
      setLoading(false);
      initializeMediaStream();
    } else {
      // Stop camera when isActive becomes false
      stopCamera();
    }

    // Cleanup function to stop the stream when the component unmounts
    return () => {
      stopCamera();
    };
  }, [isActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      console.log('Stopping all media tracks');
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped track: ${track.kind}`);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      {loading ? (
        <div
          className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
        > 
          <PropagateLoader color="#3c82f6"/>
        </div>
      ) : (
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="rounded-xl border-2 border-blue-500"
        style={{ width: '100%', height: 'auto', backgroundColor: 'black', transform: 'scaleX(-1)'}}
      />
      )}
    </div>
  );
};

export default Stream;