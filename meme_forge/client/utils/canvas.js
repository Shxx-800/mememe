export const drawMemeOnCanvas = (
  canvas,
  image,
  topText,
  bottomText
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas dimensions to match preview
  const maxWidth = 500;
  const maxHeight = 500;

  let { width, height } = image;

  // Scale image to fit canvas while maintaining aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const scale = Math.min(maxWidth / width, maxHeight / height);
    width *= scale;
    height *= scale;
  }

  canvas.width = width;
  canvas.height = height;

  // Clear canvas and draw image
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  // Configure text rendering with better quality
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw text function
  const drawText = (text) => {
    if (!text.content.trim()) return;

    const fontSize = Math.max(text.fontSize * (width / 500), 12);
    ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;

    const x = width / 2;
    const y = (text.y / 100) * height;

    // Draw stroke (outline)
    if (text.strokeWidth > 0) {
      ctx.strokeStyle = text.stroke;
      ctx.lineWidth = Math.max(text.strokeWidth * (width / 500), 1);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(text.content, x, y);
    }

    // Fill text with subtle shadow
    ctx.fillStyle = text.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(text.content, x, y);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  // Draw both texts
  drawText(topText);
  drawText(bottomText);
};

export const drawMemeOnVideo = (canvas, topText, bottomText) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;

  // Configure text rendering
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw text function for video
  const drawText = (text) => {
    if (!text.content.trim()) return;

    const fontSize = Math.max(text.fontSize * (width / 500), 16);
    ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;

    const x = width / 2;
    const y = (text.y / 100) * height;

    // Draw stroke (outline) - more prominent for video
    if (text.strokeWidth > 0) {
      ctx.strokeStyle = text.stroke;
      ctx.lineWidth = Math.max(text.strokeWidth * (width / 500), 2);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(text.content, x, y);
    }

    // Fill text with stronger shadow for video visibility
    ctx.fillStyle = text.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(text.content, x, y);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  // Draw both texts
  drawText(topText);
  drawText(bottomText);
};
