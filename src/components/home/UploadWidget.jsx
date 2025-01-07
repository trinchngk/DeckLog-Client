import { combineSlices } from '@reduxjs/toolkit';
import React, { useEffect, useRef, useState } from 'react';

const UploadWidget = ({ onUploadSuccess, onUploadError, type = 'video' }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [isWidgetOpened, setIsWidgetOpened] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = (error) => {
      console.error('Failed to load Cloudinary script:', error);
      onUploadError?.('Failed to load upload widget');
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onUploadError]);

  useEffect(() => {
    if (isScriptLoaded && window.cloudinary && !isWidgetOpened) {
      cloudinaryRef.current = window.cloudinary;
      
      const imageCompression = {
        quality: "auto:good",
        fetch_format: "auto",
        width: 1920,
        height: 1080,
        crop: "limit",
        format: "jpg"
      };

      const videoCompression = {
        quality: "auto:eco",
        width: 720,
        height: 720,
        crop: "limit",
        format: "mp4",
        bit_rate: "600k",
        audio_codec: "aac",
        video_codec: "h264"
      };

      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'camera'],
          multiple: false,
          maxFiles: 1,
          showAdvancedOptions: false,
          cropping: false,
          showUploadMoreButton: false,
          styles: {
            frame: {
              background: '#2E2E33',
              color: '#FFFFFF',
              fontFamily: '"JetBrains Mono", monospace'
            },
            palette: {
              window: '#2E2E33',
              sourceBg: '#363636',
              windowBorder: '#4A4A4A',
              tabIcon: '#FFFFFF',
              inactiveTabIcon: '#8E8E8E',
              menuIcons: '#FFFFFF',
              link: '#86C3FA',
              action: '#86C3FA',
              inProgress: '#86C3FA',
              complete: '#86C3FA',
              error: '#FF4C4C',
              textDark: '#FFFFFF',
              textLight: '#FCFCFC',
              accent: '#86C3FA'
            },
            fonts: {
              default: {
                active: true,
                size: '14px',
                family: '"JetBrains Mono", monospace'
              }
            },
            text: {
              color: '#FFFFFF',
              size: '14px',
              fontFamily: '"JetBrains Mono", monospace'
            }
          },
          use_rollbar: false,
          inline_container: '#upload-widget-container',
          eager: [type === 'video' ? videoCompression : imageCompression],
          eager_async: true,
          resource_type: type,
          format: type === 'video' ? 'mp4' : 'jpg',
          folder: type === 'video' ? 'moves/videos' : 'moves/images',
        },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            onUploadError?.(error);
            return;
          }

          if (result.event === 'success') {
            console.log(result.info)
            const compressedUrl = result.info.eager?.[0]?.secure_url || result.info.secure_url;
            const publicId = result.info.public_id;
            console.log(publicId);
            onUploadSuccess?.(compressedUrl, publicId);
            setIsWidgetOpened(false);  // Close widget after successful upload
          }
        }
      );

      // Open widget only once when it's first created
      if (!isWidgetOpened) {
        widgetRef.current.open();
        setIsWidgetOpened(true);
      }
    }
  }, [isScriptLoaded, onUploadSuccess, onUploadError, isWidgetOpened]);

  return (
    <div>
      <div id="upload-widget-container" />
    </div>
  );
};

export default UploadWidget;