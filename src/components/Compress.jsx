import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

export const compressVideo = async (file) => {
  try {
    // If file is under 10MB, skip compression
    if (file.size < 10 * 1024 * 1024) {
      return file;
    }

    const ffmpeg = new FFmpeg();
    await ffmpeg.load();
    
    const inputFileName = `input-${Date.now()}.mp4`;
    const outputFileName = `output-${Date.now()}.mp4`;
    
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputFileName, fileData);
    
    // Extremely aggressive compression settings for large files
    const compressionCommands = [
      '-i', inputFileName,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '30',          // More aggressive compression
      '-vf', 'scale=620:-2', // Reduced resolution to 640p width
      '-r', '30',            // Reduced frame rate
      '-c:a', 'aac',
      '-b:a', '96k',         // Lower audio bitrate
      '-movflags', '+faststart',
      outputFileName
    ];

    // If file is extremely large (over 50MB), use even more aggressive settings
    if (file.size > 50 * 1024 * 1024) {
      compressionCommands[7] = '30';  // Even higher CRF
      compressionCommands[9] = 'scale=620:-2';  // Even smaller resolution
    }
    
    await ffmpeg.exec(compressionCommands);
    
    const compressedData = await ffmpeg.readFile(outputFileName);
    
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);
    
    const blob = new Blob([compressedData.buffer], { type: 'video/mp4' });
    const compressedFile = new File([blob], file.name.replace('.mp4', '-compressed.mp4'), {
      type: 'video/mp4'
    });
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing video:', error);
    // If compression fails, return original file
    return file;
  }
};