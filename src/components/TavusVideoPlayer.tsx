import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Loader2, AlertTriangle, Settings } from 'lucide-react';
import { AgeGroup } from '../types';
import { tavusService } from '../services/tavusService';

interface TavusVideoPlayerProps {
  ageGroup: AgeGroup;
  userName: string;
  onComplete?: () => void;
}

const TavusVideoPlayer: React.FC<TavusVideoPlayerProps> = ({ ageGroup, userName, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'config' | 'api' | 'network' | 'unknown'>('unknown');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get age-appropriate video content and styling
  const getAgeGroupContent = (ageGroup: AgeGroup) => {
    switch (ageGroup) {
      case '5-10':
        return {
          title: 'Your Personal Safety Adventure',
          description: `Hi ${userName}! Let's learn about staying safe together in this special video made just for you.`,
          topics: [
            'Recognizing safe vs unsafe situations',
            'Understanding stranger safety',
            'Learning about good and bad touch',
            'Finding trusted adults who can help'
          ],
          duration: '8-10 minutes',
          color: 'from-pink-400 to-purple-400',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-800',
          borderColor: 'border-pink-200',
          userInput: `Create a personalized safety video for ${userName}, a child aged 5-10. Focus on basic safety concepts like stranger danger, body safety, and finding trusted adults. Use simple, friendly language and encouraging examples.`
        };
      case '11-15':
        return {
          title: 'Building Your Safety Skills',
          description: `Welcome ${userName}! This personalized video will help you navigate the challenges of growing up safely.`,
          topics: [
            'Understanding different types of bullying',
            'Staying safe online and on social media',
            'Setting personal boundaries with confidence',
            'Making good decisions under peer pressure'
          ],
          duration: '12-15 minutes',
          color: 'from-blue-400 to-cyan-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          userInput: `Create a personalized safety video for ${userName}, a teenager aged 11-15. Cover topics like cyberbullying, online safety, peer pressure, and building confidence. Use age-appropriate language that respects their growing independence.`
        };
      case '16-19':
        return {
          title: 'Navigating Relationships Safely',
          description: `Hi ${userName}! This video is designed to help you build healthy, respectful relationships as you become more independent.`,
          topics: [
            'Recognizing healthy vs unhealthy relationships',
            'Understanding consent and personal autonomy',
            'Protecting yourself from digital exploitation',
            'Supporting friends and knowing when to get help'
          ],
          duration: '15-20 minutes',
          color: 'from-green-400 to-teal-400',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          userInput: `Create a personalized safety video for ${userName}, a young adult aged 16-19. Focus on relationship safety, consent, digital privacy, and supporting others. Use mature, professional language while remaining supportive and educational.`
        };
      default:
        return {
          title: 'Your Safety Journey',
          description: `Hi ${userName}! Let's learn about staying safe together.`,
          topics: ['General safety awareness'],
          duration: '10-15 minutes',
          color: 'from-blue-400 to-purple-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          userInput: `Create a personalized safety video for ${userName}. Cover general safety topics appropriate for their age group.`
        };
    }
  };

  const content = getAgeGroupContent(ageGroup);

  // Get user age from age group for API call
  const getUserAge = (ageGroup: AgeGroup): number => {
    switch (ageGroup) {
      case '5-10': return 8; // Middle of range
      case '11-15': return 13; // Middle of range
      case '16-19': return 17; // Middle of range
      default: return 12;
    }
  };

  // Determine error type and provide appropriate messaging
  const categorizeError = (errorMessage: string): 'config' | 'api' | 'network' | 'unknown' => {
    if (errorMessage.includes('not configured') || 
        errorMessage.includes('TAVUS_') ||
        errorMessage.includes('Invalid access token') ||
        errorMessage.includes('401')) {
      return 'config';
    }
    if (errorMessage.includes('HTTP') || errorMessage.includes('API error')) {
      return 'api';
    }
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return 'network';
    }
    return 'unknown';
  };

  // Get error message and instructions based on error type
  const getErrorInfo = (type: 'config' | 'api' | 'network' | 'unknown', message: string) => {
    switch (type) {
      case 'config':
        return {
          title: 'Configuration Required',
          message: 'Tavus API credentials need to be configured.',
          instructions: [
            '1. Sign up for a Tavus account at tavus.io',
            '2. Get your API key, Replica ID, and Persona ID from your Tavus dashboard',
            '3. Set these as Supabase secrets:',
            '   • TAVUS_API_KEY=your_api_key',
            '   • TAVUS_REPLICA_ID=your_replica_id', 
            '   • TAVUS_PERSONA_ID=your_persona_id',
            '4. Refresh this page to try again'
          ],
          icon: Settings,
          color: 'orange'
        };
      case 'api':
        return {
          title: 'API Error',
          message: 'There was an issue with the Tavus API service.',
          instructions: [
            '1. Check if your Tavus API key is valid and not expired',
            '2. Verify your Tavus account has sufficient credits',
            '3. Try again in a few moments',
            '4. Contact support if the issue persists'
          ],
          icon: AlertTriangle,
          color: 'red'
        };
      case 'network':
        return {
          title: 'Connection Error',
          message: 'Unable to connect to the video service.',
          instructions: [
            '1. Check your internet connection',
            '2. Try refreshing the page',
            '3. Contact support if the issue continues'
          ],
          icon: AlertTriangle,
          color: 'yellow'
        };
      default:
        return {
          title: 'Unexpected Error',
          message: message || 'An unexpected error occurred.',
          instructions: [
            '1. Try refreshing the page',
            '2. Contact support if the issue persists'
          ],
          icon: AlertTriangle,
          color: 'red'
        };
    }
  };

  // Load Tavus video
  const loadTavusVideo = async () => {
    setIsLoading(true);
    setError(null);
    setErrorType('unknown');
    
    try {
      console.log(`🎬 Loading Tavus video for ${userName}, age group: ${ageGroup}`);
      
      // Create conversation with Tavus via Supabase Edge Function
      const result = await tavusService.createConversation(
        content.userInput,
        userName,
        getUserAge(ageGroup)
      );

      console.log(`✅ Tavus video created successfully for ${userName}`);
      console.log(`🔗 Video URL: ${result.conversationUrl}`);
      
      setVideoUrl(result.conversationUrl);
      setConversationId(result.conversationId);
      
      // Set a realistic duration based on age group
      const estimatedDuration = ageGroup === '5-10' ? 540 : ageGroup === '11-15' ? 810 : 1080;
      setDuration(estimatedDuration);
      
    } catch (err) {
      console.error('❌ Error loading Tavus video:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load personalized video';
      const errorCategory = categorizeError(errorMessage);
      
      setError(errorMessage);
      setErrorType(errorCategory);
    } finally {
      setIsLoading(false);
    }
  };

  // Load video on component mount
  useEffect(() => {
    loadTavusVideo();
  }, [ageGroup, userName, content.userInput]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onComplete) {
      onComplete();
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    const errorInfo = getErrorInfo(errorType, error);
    const colorClasses = {
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        text: 'text-orange-700',
        button: 'bg-orange-600 hover:bg-orange-700'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        title: 'text-red-800',
        text: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-800',
        text: 'text-yellow-700',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      }
    };

    const colors = colorClasses[errorInfo.color as keyof typeof colorClasses] || colorClasses.red;

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="aspect-video bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-2xl">
            <div className={`w-16 h-16 ${colors.bg} ${colors.border} border-2 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <errorInfo.icon className={`w-8 h-8 ${colors.icon}`} />
            </div>
            <h3 className={`text-lg font-semibold ${colors.title} mb-2`}>{errorInfo.title}</h3>
            <p className={`${colors.text} text-sm mb-6 max-w-md mx-auto`}>{errorInfo.message}</p>
            
            {/* Instructions */}
            <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-6 text-left`}>
              <h4 className={`font-medium ${colors.title} mb-3`}>Setup Instructions:</h4>
              <ol className="space-y-2">
                {errorInfo.instructions.map((instruction, index) => (
                  <li key={index} className={`text-sm ${colors.text} flex items-start`}>
                    <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-mono text-xs">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className={`px-4 py-2 ${colors.button} text-white rounded-lg transition-colors text-sm font-medium`}
              >
                Try Again
              </button>
              {errorType === 'config' && (
                <a
                  href="https://tavus.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Get Tavus Account
                </a>
              )}
            </div>

            {/* Technical Details (collapsible) */}
            <details className="mt-6 text-left">
              <summary className={`cursor-pointer text-xs ${colors.text} hover:${colors.title} transition-colors`}>
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono break-all">
                {error}
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        {isLoading ? (
          /* Loading State */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Creating Your Personal Video</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto mb-4">
                We're generating a personalized safety video just for you, {userName}. This may take a moment...
              </p>
              <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
                <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        ) : videoUrl ? (
          /* Tavus Video Iframe */
          <>
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{ border: 'none' }}
            />

            {/* Optional overlay controls for iframe videos */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">
                    Personalized video for {userName}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleRestart}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    title="Restart video"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                  <button 
                    onClick={handleFullscreen}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Fallback State */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className={`w-24 h-24 bg-gradient-to-br ${content.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                <Play className="w-12 h-12 text-white ml-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto mb-4">
                {content.description}
              </p>
              <div className="text-xs text-gray-400">
                Personalized Tavus video for {userName} • {content.duration}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{content.title}</h3>
            <p className="text-gray-600 mb-4">{content.description}</p>
          </div>
          {videoUrl && !isLoading && (
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors ml-4"
            >
              Mark Complete
            </button>
          )}
        </div>

        {/* Learning Topics */}
        <div className={`${content.bgColor} ${content.borderColor} border rounded-xl p-4`}>
          <h4 className={`font-semibold ${content.textColor} mb-3`}>What You'll Learn:</h4>
          <ul className="space-y-2">
            {content.topics.map((topic, index) => (
              <li key={index} className={`flex items-start text-sm ${content.textColor}`}>
                <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-3 flex-shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Tavus Integration Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Powered by Tavus AI • Personalized for {userName}</span>
            </div>
            {conversationId && (
              <div className="text-xs text-gray-500">
                ID: {conversationId.substring(0, 8)}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusVideoPlayer;