# Perchance AI Image Generation Proxy

This Express.js server acts as a proxy to Perchance.org's AI text-to-image generator, allowing your React frontend to generate images without CORS issues.

## Features

- ✅ CORS enabled for frontend integration
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ Timeout handling
- ✅ Polling for async image generation
- ✅ Health check endpoint

## Installation

```bash
cd server
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on port 3001 by default.

## API Endpoints

### POST /api/generate-image

Generate an AI image from a text prompt.

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains"
}
```

**Success Response:**
```json
{
  "success": true,
  "imageUrl": "https://perchance.org/generated-image-url.jpg",
  "prompt": "A beautiful sunset over mountains"
}
```

**Error Response:**
```json
{
  "error": "Invalid input",
  "message": "Prompt is required and must be a non-empty string"
}
```

### GET /health

Health check endpoint to verify server status.

**Response:**
```json
{
  "status": "OK",
  "message": "Perchance AI Image Proxy Server is running"
}
```

## Error Handling

The server handles various error scenarios:

- **400 Bad Request**: Invalid or missing prompt
- **408 Request Timeout**: Image generation timed out
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server errors
- **503 Service Unavailable**: External service unreachable

## Integration with React Frontend

Update your React component to use this proxy:

```javascript
const generateAIMeme = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Use data.imageUrl
      onMemeGenerated(data.imageUrl, 'AI Generated', 'Meme');
    } else {
      setError(data.message || 'Failed to generate image');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  }
};
```

## Notes

- The server mimics real browser requests to Perchance.org
- Includes proper headers and session handling
- Handles both immediate responses and async task polling
- Maximum generation time is 60 seconds with 2-second polling intervals