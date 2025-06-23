import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Volume2, VolumeX, Loader2, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { AuthUser } from '../services/authService';
import { Lesson, AgeGroup } from '../types';
import { geminiLessonService } from '../services/geminiLessonService';
import GeminiLessonViewer from '../components/GeminiLessonViewer';

interface GeminiLessonsProps {
  user: AuthUser;
}

const GeminiLessons: React.FC<GeminiLessonsProps> = ({ user }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [customTopic, setCustomTopic] = useState('');
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<{
    lesson: Lesson;
    audio: Map<string, Blob>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load lesson suggestions on component mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        setError(null);
        
        console.log('💡 Loading lesson suggestions...');
        const suggestedTopics = await geminiLessonService.generateLessonSuggestions(
          user.ageGroup,
          user.progress.completedTopics
        );
        
        setSuggestions(suggestedTopics);
        console.log(`✅ Loaded ${suggestedTopics.length} suggestions`);
      } catch (err) {
        console.error('❌ Error loading suggestions:', err);
        setError('Failed to load lesson suggestions. Please try again.');
      } finally {
        setLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [user.ageGroup, user.progress.completedTopics]);

  const handleGenerateLesson = async (topic: string) => {
    try {
      setGeneratingLesson(true);
      setError(null);
      
      console.log(`🚀 Generating lesson for topic: ${topic}`);
      const result = await geminiLessonService.generateQuickLesson(topic, user.ageGroup, user.age);
      
      setCurrentLesson(result);
      console.log('✅ Lesson generated successfully');
    } catch (err) {
      console.error('❌ Error generating lesson:', err);
      setError('Failed to generate lesson. Please try again.');
    } finally {
      setGeneratingLesson(false);
    }
  };

  const handleCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      handleGenerateLesson(customTopic.trim());
      setCustomTopic('');
    }
  };

  const getAgeGroupContent = () => {
    switch (user.ageGroup) {
      case '5-10':
        return {
          title: 'AI Safety Lessons for Young Learners',
          subtitle: 'Fun, personalized lessons created just for you!',
          description: 'Ask our AI to create custom safety lessons about any topic you want to learn about.',
          color: 'from-pink-400 to-purple-400',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-800',
          borderColor: 'border-pink-200'
        };
      case '11-15':
        return {
          title: 'AI-Powered Safety Education',
          subtitle: 'Smart lessons that adapt to your learning needs',
          description: 'Generate personalized safety lessons with voice narration on any topic that interests you.',
          color: 'from-blue-400 to-cyan-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case '16-19':
        return {
          title: 'Advanced AI Safety Training',
          subtitle: 'Sophisticated lessons for complex safety topics',
          description: 'Create in-depth safety lessons with AI that understands the nuances of adult relationships and independence.',
          color: 'from-green-400 to-teal-400',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      default:
        return {
          title: 'AI Safety Lessons',
          subtitle: 'Personalized learning experience',
          description: 'Generate custom safety lessons tailored to your needs.',
          color: 'from-blue-400 to-purple-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
    }
  };

  const content = getAgeGroupContent();

  if (currentLesson) {
    return (
      <GeminiLessonViewer
        lesson={currentLesson.lesson}
        audio={currentLesson.audio}
        user={user}
        onBack={() => setCurrentLesson(null)}
        onComplete={() => {
          // Handle lesson completion
          setCurrentLesson(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${content.color} rounded-full flex items-center justify-center`}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {content.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {content.description}
        </p>
      </div>

      {/* Custom Topic Input */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
          Create Your Own Lesson
        </h2>
        
        <form onSubmit={handleCustomTopicSubmit} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="What safety topic would you like to learn about?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={generatingLesson}
            />
          </div>
          <button
            type="submit"
            disabled={!customTopic.trim() || generatingLesson}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {generatingLesson ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Lesson</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Suggested Topics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          Suggested Topics for You
        </h2>

        {loadingSuggestions ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading personalized suggestions...</p>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleGenerateLesson(topic)}
                disabled={generatingLesson}
                className="group text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 group-hover:text-blue-800 transition-colors">
                      {topic}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      AI-generated lesson with voice narration
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-2" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No suggestions available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Try creating a custom lesson above!</p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className={`mt-8 ${content.bgColor} ${content.borderColor} border rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${content.textColor} mb-4`}>
          How AI Lessons Work
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${content.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className={`font-semibold ${content.textColor} mb-2`}>AI Generation</h4>
            <p className={`text-sm ${content.textColor}`}>
              Our AI creates a complete lesson with scenarios, quizzes, and tips tailored to your age
            </p>
          </div>

          <div className="text-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${content.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h4 className={`font-semibold ${content.textColor} mb-2`}>Voice Narration</h4>
            <p className={`text-sm ${content.textColor}`}>
              Every lesson includes professional voice narration to help you learn better
            </p>
          </div>

          <div className="text-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${content.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h4 className={`font-semibold ${content.textColor} mb-2`}>Interactive Learning</h4>
            <p className={`text-sm ${content.textColor}`}>
              Practice with scenarios and test your knowledge with personalized quizzes
            </p>
          </div>
        </div>
      </div>

      {/* Generation Status */}
      {generatingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Creating Your Lesson
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI is generating a personalized safety lesson with voice narration just for you...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiLessons;