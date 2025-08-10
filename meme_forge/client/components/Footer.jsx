import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left - Brand */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>
              Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> by
            </span>
            <span className="font-semibold text-gray-800">MemeForge</span>
          </div>
          
          {/* Center - Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Support</a>
          </nav>
          
          {/* Right - Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-all"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            © 2025 MemeForge. All rights reserved. Create, Share, Go Viral! 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
