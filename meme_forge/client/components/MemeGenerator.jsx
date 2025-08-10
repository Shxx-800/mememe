import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause } from 'lucide-react';
import ImageUpload from './ImageUpload';
import TextControls from './TextControls';
import { drawMemeOnCanvas, drawMemeOnVideo } from '../utils/canvas';

const MemeGenerator = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image', 'video', 'gif'
  const [isPlaying, setIsPlaying] = useState(false);
  const [topText, setTopText] = useState({
    content: 'TOP TEXT',
    fontSize: 48,
    color: '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 3,
    y: 50
  });
  const [bottomText, setBottomText] = useState({
    content: 'BOTTOM TEXT',
    fontSize: 48,
    color: '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 3,
    y: 90
  });

  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleAIMemeGenerated = (imageUrl, topTextContent, bottomTextContent) => {
    setTopText(prev => ({ ...prev, content: topTextContent }));
    setBottomText(prev => ({ ...prev, content: bottomTextContent }));
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    
    // Detect media type
    if (imageUrl.includes('data:video/') || imageUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
      setMediaType('video');
    } else if (imageUrl.includes('data:image/gif') || imageUrl.match(/\.gif$/i)) {
      setMediaType('gif');
    } else {
      setMediaType('image');
    }
  };

  const updatePreview = useCallback(() => {
    if (!selectedImage) return;

    if (mediaType === 'video') {
      updateVideoPreview();
    } else {
      updateImagePreview();
    }
  }, [selectedImage, topText, bottomText, mediaType]);

  const updateImagePreview = () => {
    if (!previewRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        drawMemeOnCanvas(previewRef.current, img, topText, bottomText);
      } catch (error) {
        console.error('Error drawing meme on canvas:', error);
      }
    };

    img.onerror = error => {
      console.error('Error loading image:', error);
    };

    img.src = selectedImage;
  };

  const updateVideoPreview = () => {
    if (!videoRef.current || !previewRef.current) return;

    const video = videoRef.current;
    const canvas = previewRef.current;
    const ctx = canvas.getContext('2d');

    const drawFrame = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = Math.min(video.videoWidth, 600);
        canvas.height = Math.min(video.videoHeight, 600);
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw text overlays
        drawMemeOnVideo(canvas, topText, bottomText);
      }
      
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    if (isPlaying) {
      drawFrame();
    } else {
      // Draw single frame when paused
      if (video.videoWidth && video.videoHeight) {
        canvas.width = Math.min(video.videoWidth, 600);
        canvas.height = Math.min(video.videoHeight, 600);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawMemeOnVideo(canvas, topText, bottomText);
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const downloadMeme = () => {
    if (!selectedImage) return;

    if (mediaType === 'video') {
      downloadVideoMeme();
    } else {
      downloadImageMeme();
    }
  };

  const downloadImageMeme = () => {
    if (!canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        canvas.width = Math.min(img.width, 1920);
        canvas.height = Math.min(img.height, 1920);

        const scale = Math.min(canvas.width / 500, canvas.height / 500);
        const downloadTopText = { ...topText, fontSize: Math.max(topText.fontSize * scale, 24) };
        const downloadBottomText = { ...bottomText, fontSize: Math.max(bottomText.fontSize * scale, 24) };

        drawMemeOnCanvas(canvas, img, downloadTopText, downloadBottomText);

        const link = document.createElement('a');
        link.download = `meme-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading meme:', error);
        alert('Error downloading meme. Please try again.');
      }
    };

    img.onerror = error => {
      console.error('Error loading image for download:', error);
      alert('Error loading image for download. Please try again.');
    };

    img.src = selectedImage;
  };

  const downloadVideoMeme = () => {
    // For video download, we'll create a canvas with the current frame
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw text overlays
    drawMemeOnVideo(canvas, topText, bottomText);

    // Download as image (current frame)
    const link = document.createElement('a');
    link.download = `video-meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetMeme = () => {
    setTopText(prev => ({ ...prev, content: 'TOP TEXT' }));
    setBottomText(prev => ({ ...prev, content: 'BOTTOM TEXT' }));
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
      {/* Image Upload - Smaller box */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            {mediaType === 'video' ? (
              <Video className="h-6 w-6 text-blue-600" />
            ) : (
              <ImageIcon className="h-6 w-6 text-blue-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">Choose Media</h3>
          </div>
          <ImageUpload
            onImageSelect={handleImageSelect}
            onAIMemeGenerated={handleAIMemeGenerated}
          />
        </div>
      </div>

      {/* Preview - Compact white box, big placeholder */}
      <div className="flex-1 min-w-[450px] flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          {mediaType === 'video' && selectedImage && (
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play
                </>
              )}
            </button>
          )}
        </div>
        
        {selectedImage ? (
          <div className="relative">
            {mediaType === 'video' && (
              <video
                ref={videoRef}
                src={selectedImage}
                className="hidden"
                onLoadedMetadata={updatePreview}
                onTimeUpdate={updateVideoPreview}
                loop
                muted
              />
            )}
            <canvas
              ref={previewRef}
              className="w-full max-w-[600px] max-h-[550px] rounded-xl shadow-md border border-gray-300"
              width={600}
              height={600}
            />
            {mediaType === 'video' && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {isPlaying ? 'Playing' : 'Paused'} • Click Play to preview
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-base text-gray-600 font-medium">
                Select media to start
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Images, videos, GIFs supported
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Text Settings & Actions */}
      <div className="w-full lg:w-1/4 space-y-5">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Text Settings</h3>
          </div>
          <div className="space-y-5">
            <TextControls
              text={topText}
              onChange={setTopText}
              placeholder="Enter top text..."
            />
            <TextControls
              text={bottomText}
              onChange={setBottomText}
              placeholder="Enter bottom text..."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={resetMeme}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-lg text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={downloadMeme}
              disabled={!selectedImage}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors text-white rounded-lg text-sm font-medium disabled:opacity-50"
              title={mediaType === 'video' ? 'Download current frame as image' : 'Download meme'}
            >
              <Download className="h-4 w-4" />
              {mediaType === 'video' ? 'Frame' : 'Download'}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MemeGenerator;
