import React from 'react';
import { Clock, Users, BookOpen, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onStartLesson: (lessonId: string) => void;
  isCompleted?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStartLesson, isCompleted = false }) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const categoryIcons = {
    online: '🌐',
    physical: '🛡️',
    social: '👥',
    emotional: '💝',
    emergency: '🚨'
  };

  // Get content metadata
  const keyPointsCount = lesson.metadata?.keyPointsCount || lesson.content.keyPoints.length;
  const scenariosCount = lesson.metadata?.scenariosCount || lesson.content.scenarios.length;
  const hasRequiredContent = keyPointsCount > 0 && scenariosCount > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header with category icon */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{categoryIcons[lesson.category]}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {lesson.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}
            {!hasRequiredContent && (
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full" title="Missing content">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            )}
          </div>
        </div>

        {/* Lesson details */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{lesson.ageGroups.join(', ')}</span>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[lesson.difficulty]}`}>
            {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
          </span>
        </div>

        {/* Content Overview */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            What you'll learn:
          </h4>
          
          {/* Key Points Preview */}
          {lesson.content.keyPoints.length > 0 ? (
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              {lesson.content.keyPoints.slice(0, 2).map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {point}
                </li>
              ))}
              {lesson.content.keyPoints.length > 2 && (
                <li className="text-xs text-gray-500 italic">
                  +{lesson.content.keyPoints.length - 2} more key points...
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic mb-3">Key points will be loaded when you start the lesson</p>
          )}

          {/* Content Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>{keyPointsCount} Key Points</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{scenariosCount} Practice Scenarios</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>Interactive Quiz</span>
            </div>
          </div>
        </div>

        {/* Content Validation Warning */}
        {!hasRequiredContent && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-800">Content Notice</p>
                <p className="text-xs text-orange-700">
                  This lesson may be missing some content. It will be generated when you start the lesson.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onStartLesson(lesson.id)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
        >
          <Play className="w-5 h-5" />
          <span>{isCompleted ? 'Review Lesson' : 'Start Learning'}</span>
        </button>
      </div>
    </div>
  );
};

export default LessonCard;