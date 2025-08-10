import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Palette, Type, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';
import TextControls from './TextControls';
import { drawMemeOnCanvas } from '../utils/canvas';

const MemeGenerator = () => {
  const [selectedImage, setSelectedImage] = useState('');
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

  const handleAIMemeGenerated = (imageUrl, topTextContent, bottomTextContent) => {
    setTopText(prev => ({ ...prev, content: topTextContent }));
    setBottomText(prev => ({ ...prev, content: bottomTextContent }));
  };

  const updatePreview = useCallback(() => {
    if (!selectedImage || !previewRef.current) return;

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
  }, [selectedImage, topText, bottomText]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const downloadMeme = () => {
    if (!selectedImage || !canvasRef.current) return;

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

  const resetMeme = () => {
    setTopText(prev => ({ ...prev, content: 'TOP TEXT' }));
    setBottomText(prev => ({ ...prev, content: 'BOTTOM TEXT' }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
      {/* Image Upload - Smaller box */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Choose Image</h3>
          </div>
          <ImageUpload
            onImageSelect={setSelectedImage}
            onAIMemeGenerated={handleAIMemeGenerated}
          />
        </div>
      </div>

      {/* Preview - Compact white box, big placeholder */}
      <div className="flex-1 min-w-[450px] flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Preview</h3>
        {selectedImage ? (
          <canvas
            ref={previewRef}
            className="w-full max-w-[600px] max-h-[550px] rounded-xl shadow-md border border-gray-300"
            width={600}
            height={600}
          />
        ) : (
          <div className="w-full max-w-lg h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-base text-gray-600 font-medium">
                Select an image to start
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Upload, template, or AI generate
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
            >
              <Download className="h-4 w-4" />
              Download
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
