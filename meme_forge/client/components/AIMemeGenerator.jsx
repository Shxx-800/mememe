import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react";

const AIMemeGenerator = ({ onMemeGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [serverConnected, setServerConnected] = useState(false);

  // Adjust this if your backend is deployed elsewhere
  const backendUrl = "http://localhost:3001";

  // ✅ Check if backend is alive
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const r = await fetch(`${backendUrl}/health`);
      if (r.ok) {
        setServerConnected(true);
        setError("");
      } else {
        setServerConnected(false);
        setError("Backend not healthy");
      }
    } catch {
      setServerConnected(false);
      setError("Backend server is not running. Start it and try again.");
    }
  };

  // ✅ Generate meme image via backend
  const generateAIMeme = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for your meme");
      return;
    }
    if (!serverConnected) {
      setError("Backend not connected. Start the server and try again.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const resp = await fetch(`${backendUrl}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.image) {
        throw new Error(data.error || "Server error");
      }

      // Pass generated image back to parent
      onMemeGenerated(data.image, prompt, "");
      setPrompt("");
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate meme");
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "A cat realizing it's Monday morning",
    "When you finally understand a programming concept",
    "Trying to explain memes to your parents",
    "The feeling when your code works on first try",
    "When someone says they don't like pizza",
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Prompt input */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Describe your meme idea
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A surprised cat when it sees a cucumber..."
          rows={3}
          className="w-full border rounded p-2 text-sm"
          disabled={isGenerating}
        />
        <div className="text-xs text-gray-500 mt-1">{prompt.length}/500</div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs text-red-700">{error}</p>
              {!serverConnected && (
                <p className="text-xs mt-1">
                  Start backend: <code>cd server && npm start</code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={generateAIMeme}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-2 rounded text-white font-medium ${
          isGenerating ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 inline-block animate-spin" />{" "}
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 inline-block mr-2" /> Generate AI Meme
          </>
        )}
      </button>

      {/* Suggestions */}
      <div>
        <p className="text-xs font-medium text-gray-700 mb-1">
          Need inspiration?
        </p>
        <div className="space-y-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              disabled={isGenerating}
              className="text-left w-full text-sm p-1 rounded hover:bg-gray-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Connection status */}
      <div
        className={`p-2 rounded text-xs ${
          serverConnected
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`h-4 w-4 ${
              serverConnected ? "text-green-600" : "text-yellow-600"
            }`}
          />
          <span>
            {serverConnected ? "Backend connected" : "Backend disconnected"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIMemeGenerator;
