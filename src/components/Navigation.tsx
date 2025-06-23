import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Award, Settings, Shield, ArrowLeft, Video, Sparkles } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/app', icon: Home, label: 'Home' },
    { path: '/app/videos', icon: Video, label: 'My Videos' },
    { path: '/app/lessons', icon: BookOpen, label: 'Lessons' },
    { path: '/app/ai-lessons', icon: Sparkles, label: 'AI Lessons' },
    { path: '/app/chat', icon: MessageCircle, label: 'Safety Chat' },
    { path: '/app/achievements', icon: Award, label: 'Achievements' },
    { path: '/app/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="bg-white shadow-sm border-t md:border-t-0 md:border-r border-gray-200 fixed bottom-0 left-0 right-0 md:static md:w-64 md:h-screen z-40">
      <div className="flex md:flex-col md:p-4">
        {/* Logo - Desktop only */}
        <div className="hidden md:flex items-center justify-between mb-8 px-2">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-xl font-bold text-gray-800">SafetyLearn</span>
          </div>
          <Link
            to="/"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex md:flex-col w-full md:space-y-2 overflow-x-auto md:overflow-x-visible">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start p-3 md:px-4 md:py-3 rounded-lg transition-all duration-200 flex-1 md:flex-none min-w-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-t-2 md:border-t-0 md:border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 md:mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium mt-1 md:mt-0 truncate">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Back to Landing - Mobile only */}
        <div className="md:hidden flex items-center justify-center p-3 min-w-0">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-medium mt-1">Back</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;