import React from "react";
import {
  ArrowLeft,
  Zap,
  Users,
  Download,
  Palette,
} from "lucide-react";

const AboutPage = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="container mx-auto max-w-5xl">
        {/* Top Navigation */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Generator
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About MemeForge</h1>
            <p className="text-gray-600">
              The ultimate AI-powered meme creation platform
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-10 text-center text-black shadow-lg mb-12 border border-gray-200">
          <img
            src="/client/assets/logo.webp"
            alt="MemeForge Logo"
            className="h-20 w-20 mx-auto mb-4"
          />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Create Viral Memes in Seconds
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            MemeForge blends the power of AI with intuitive design tools so you
            can make professional-quality memes that grab attention — instantly.
          </p>
        </div>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-2 mb-16">
          {[
            {
              icon: <Zap className="h-6 w-6 text-blue-600" />,
              bg: "bg-blue-100",
              title: "AI-Powered Generation",
              text: "Our AI understands context and humor to turn simple descriptions into spot-on memes.",
            },
            {
              icon: <Palette className="h-6 w-6 text-green-600" />,
              bg: "bg-green-100",
              title: "Professional Editor",
              text: "Adjust fonts, colors, layouts, and effects to craft the perfect punchline.",
            },
            {
              icon: <Download className="h-6 w-6 text-purple-600" />,
              bg: "bg-purple-100",
              title: "High-Quality Downloads",
              text: "Export in crystal-clear resolution, ready for social or print.",
            },
            {
              icon: <Users className="h-6 w-6 text-pink-600" />,
              bg: "bg-pink-100",
              title: "Template Library",
              text: "Pick from trending meme formats or upload your own image to start fresh.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${f.bg} rounded-lg`}>{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
              </div>
              <p className="text-gray-600">{f.text}</p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-10 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: 1,
                color: "text-blue-600 bg-blue-100",
                title: "Choose Your Method",
                desc: "Upload an image, select a template, or describe your idea for AI generation.",
              },
              {
                step: 2,
                color: "text-green-600 bg-green-100",
                title: "Customize & Edit",
                desc: "Add captions, tweak styles, and fine-tune your meme with our editor.",
              },
              {
                step: 3,
                color: "text-purple-600 bg-purple-100",
                title: "Share & Go Viral",
                desc: "Download in HD and share on your favorite platforms.",
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4 ${s.color}`}
                >
                  <span className="text-lg font-bold">{s.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Choose MemeForge?
          </h2>
          <div className="grid gap-8 md:grid-cols-4 text-center">
            {[
              { value: "∞", label: "Unlimited Creations", sub: "No limits" },
              { value: "HD", label: "High Quality", sub: "Pro resolution" },
              { value: "AI", label: "Smart Generation", sub: "Advanced AI" },
              { value: "Free", label: "No Cost", sub: "Always free" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-600">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-md p-10 border border-gray-200">
          <img
            src="/client/assets/logo.webp"
            alt="MemeForge Logo"
            className="h-16 w-16 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Create?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of creators making viral content with MemeForge.
            Your next masterpiece is just a click away.
          </p>
          <button
            onClick={onBackToHome}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Creating Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
