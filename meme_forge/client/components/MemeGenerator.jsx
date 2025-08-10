import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause, Settings, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import TextControls from './TextControls';
import { drawMemeOnCanvas, drawMemeOnVideo } from '../utils/canvas';

const MemeGenerator = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image', 'video', 'gif'
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [downloadQuality, setDownloadQuality] = useState(0.9);
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
    setShowDownloadModal(true);
  };

  const downloadImageMeme = (format = 'png', quality = 0.9) => {
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

        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const extension = format === 'jpeg' ? 'jpg' : 'png';
        
        const link = document.createElement('a');
        link.download = `meme-${Date.now()}.${extension}`;
        link.href = canvas.toDataURL(mimeType, quality);
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

  const downloadVideoMeme = (quality = 'high') => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size based on quality
    let width, height;
    switch (quality) {
      case 'low':
        width = Math.min(video.videoWidth || 640, 640);
        height = Math.min(video.videoHeight || 480, 480);
        break;
      case 'medium':
        width = Math.min(video.videoWidth || 1280, 1280);
        height = Math.min(video.videoHeight || 720, 720);
        break;
      case 'high':
      default:
        width = video.videoWidth || 1920;
        height = video.videoHeight || 1080;
        break;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw text overlays with proper scaling
    const scale = Math.min(width / 500, height / 500);
    const scaledTopText = { ...topText, fontSize: Math.max(topText.fontSize * scale, 24) };
    const scaledBottomText = { ...bottomText, fontSize: Math.max(bottomText.fontSize * scale, 24) };
    
    drawMemeOnVideo(canvas, scaledTopText, scaledBottomText);

    // Download as high-quality image
    const link = document.createElement('a');
    link.download = `video-meme-${quality}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    if (mediaType === 'video') {
      downloadVideoMeme(downloadQuality);
    } else {
      downloadImageMeme(downloadFormat, downloadQuality);
    }
    setShowDownloadModal(false);
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
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Download Options</h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {mediaType === 'image' ? (
                <>
                  {/* Image Format Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Image Format
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setDownloadFormat('png')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          downloadFormat === 'png'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">PNG</div>
                        <div className="text-xs text-gray-500">Lossless, larger file</div>
                      </button>
                      <button
                        onClick={() => setDownloadFormat('jpeg')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          downloadFormat === 'jpeg'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">JPEG</div>
                        <div className="text-xs text-gray-500">Compressed, smaller file</div>
                      </button>
                    </div>
                  </div>

                  {/* Quality Slider for JPEG */}
                  {downloadFormat === 'jpeg' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality: {Math.round(downloadQuality * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={downloadQuality}
                        onChange={(e) => setDownloadQuality(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Lower quality</span>
                        <span>Higher quality</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Video Quality Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Export Quality (Current Frame as Image)
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'low', label: 'Low (640x480)', desc: 'Smaller file size' },
                        { value: 'medium', label: 'Medium (1280x720)', desc: 'Balanced quality' },
                        { value: 'high', label: 'High (Original)', desc: 'Best quality' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDownloadQuality(option.value)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            downloadQuality === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="text-yellow-600 text-sm">
                        <strong>Note:</strong> Video export captures the current frame as a high-quality image. 
                        For full video export with text overlays, consider using video editing software.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MemeGenerator;