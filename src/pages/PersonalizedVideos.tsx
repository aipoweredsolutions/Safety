import React, { useState } from 'react';
import { Play, CheckCircle, Clock, User } from 'lucide-react';
import { AuthUser } from '../services/authService';
import TavusVideoPlayer from '../components/TavusVideoPlayer';

interface PersonalizedVideosProps {
  user: AuthUser;
}

const PersonalizedVideos: React.FC<PersonalizedVideosProps> = ({ user }) => {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());

  // Get age-appropriate video content
  const getVideoContent = () => {
    switch (user.ageGroup) {
      case '5-10':
        return {
          title: 'Your Personal Safety Adventure',
          subtitle: 'Fun and engaging safety lessons made just for you!',
          description: 'Watch your personalized video to learn about staying safe in a way that\'s perfect for your age.',
          color: 'from-pink-400 to-purple-400',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-800',
          borderColor: 'border-pink-200',
          features: [
            'Your name appears throughout the video',
            'Age-appropriate language and examples',
            'Interactive elements and questions',
            'Colorful animations and friendly characters'
          ]
        };
      case '11-15':
        return {
          title: 'Building Your Safety Skills',
          subtitle: 'Personalized guidance for navigating teenage challenges',
          description: 'Your custom video addresses the specific safety challenges you face as a teenager.',
          color: 'from-blue-400 to-cyan-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          features: [
            'Scenarios relevant to your daily life',
            'Peer pressure and social media guidance',
            'Building confidence and self-esteem',
            'Real-world safety strategies'
          ]
        };
      case '16-19':
        return {
          title: 'Navigating Relationships Safely',
          subtitle: 'Mature guidance for healthy relationships and independence',
          description: 'Your personalized video helps you build healthy relationships and make safe choices as a young adult.',
          color: 'from-green-400 to-teal-400',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          features: [
            'Relationship dynamics and consent',
            'Digital safety and privacy',
            'Supporting friends in crisis',
            'Professional and mature guidance'
          ]
        };
      default:
        return {
          title: 'Your Safety Journey',
          subtitle: 'Personalized safety education',
          description: 'Your custom video provides safety guidance tailored to your needs.',
          color: 'from-blue-400 to-purple-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          features: ['Personalized content', 'Age-appropriate guidance']
        };
    }
  };

  const content = getVideoContent();

  const handleVideoComplete = () => {
    if (currentVideo) {
      setCompletedVideos(prev => new Set(prev).add(currentVideo));
      setCurrentVideo(null);
    }
  };

  const handleWatchVideo = () => {
    setCurrentVideo(user.ageGroup);
  };

  if (currentVideo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentVideo(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <span>← Back to Videos</span>
          </button>
        </div>
        
        <TavusVideoPlayer
          ageGroup={user.ageGroup}
          userName={user.name}
          onComplete={handleVideoComplete}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Your Personalized Safety Videos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Watch videos created specifically for you using AI technology that includes your name and age-appropriate content
        </p>
      </div>

      {/* Main Video Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        {/* Header */}
        <div className={`bg-gradient-to-r ${content.color} p-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
              <p className="text-white/90 text-lg">{content.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Hi {user.name}! 👋
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {content.description}
              </p>

              {/* Features */}
              <div className={`${content.bgColor} ${content.borderColor} border rounded-xl p-4 mb-6`}>
                <h4 className={`font-semibold ${content.textColor} mb-3`}>Your Video Includes:</h4>
                <ul className="space-y-2">
                  {content.features.map((feature, index) => (
                    <li key={index} className={`flex items-start text-sm ${content.textColor}`}>
                      <CheckCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={handleWatchVideo}
                className={`w-full bg-gradient-to-r ${content.color} hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl`}
              >
                <Play className="w-6 h-6" />
                <span>Watch Your Personal Video</span>
              </button>
            </div>

            {/* Video Preview */}
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${content.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Video Preview
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Personalized for {user.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completion Status */}
              {completedVideos.has(user.ageGroup) && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          How Personalized Videos Work
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Your Information</h4>
            <p className="text-gray-600 text-sm">
              We use your name and age group to create content that speaks directly to you
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">AI Generation</h4>
            <p className="text-gray-600 text-sm">
              Tavus AI creates a unique video with your name and age-appropriate safety content
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Personal Learning</h4>
            <p className="text-gray-600 text-sm">
              Watch your custom video and learn safety skills in a way that feels personal to you
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs">🔒</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Privacy & Safety</h4>
            <p className="text-sm text-gray-600">
              Your personalized videos are created securely and are only accessible to you. 
              We never share your personal information, and all videos are generated using safe, 
              age-appropriate content reviewed by safety experts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedVideos;