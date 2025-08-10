import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import MemeGenerator from './components/MemeGenerator';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage onBackToHome={() => setCurrentPage('home')} />;
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="pt-10 pb-6 px-4">
              <div className="container mx-auto text-center max-w-4xl">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Create Viral Memes in
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Seconds</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
                  Upload your images, choose from trending templates, or let AI generate the perfect meme for you.
                  Share your creativity with the world!
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Badge color="green" text="AI-Powered Generation" />
                  <Badge color="blue" text="Instant Download" />
                  <Badge color="purple" text="Professional Quality" />
                </div>
              </div>
            </section>

            {/* Main Meme Generator - Horizontal Layout */}
            <main className="pb-8 px-4">
              <div className="container mx-auto bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
                <MemeGenerator layout="horizontal" />
              </div>
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Name */}
            <div className="flex items-center gap-3">
              <img
                src="/client/assets/logo.webp"
                alt="MemeForge Logo"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <button onClick={() => setCurrentPage('home')} className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MemeForge
                </h1>
                <p className="text-sm text-gray-600 font-medium">AI-Powered Meme Generator</p>
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {/* Trending Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold shadow-sm border border-green-200">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Trending Now</span>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center gap-6">
                {['home', 'about'].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative font-medium transition-all duration-300 ${
                      currentPage === page
                        ? 'text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                    {/* Animated underline */}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 ${
                        currentPage === page
                          ? 'w-full bg-purple-600'
                          : 'w-0 bg-purple-600 group-hover:w-full'
                      }`}
                    ></span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 text-gray-600 hover:text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {renderPage()}
      <Footer />
    </div>
  );
}

function Badge({ color, text }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${colors[color]}`}>
      <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></div>
      <span>{text}</span>
    </div>
  );
}

export default App;
