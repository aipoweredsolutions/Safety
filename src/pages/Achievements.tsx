import React from 'react';
import { Trophy, Award, Star, Calendar, Target, Lock } from 'lucide-react';
import { User } from '../types';
import { availableAchievements } from '../data/achievements';

interface AchievementsProps {
  user: User;
}

const Achievements: React.FC<AchievementsProps> = ({ user }) => {
  const iconMap = {
    Award: Award,
    Calendar: Calendar,
    Trophy: Trophy,
    Heart: Star,
    Target: Target
  };

  const categoryColors = {
    progress: 'from-blue-400 to-blue-600',
    streak: 'from-orange-400 to-orange-600',
    mastery: 'from-purple-400 to-purple-600',
    completion: 'from-green-400 to-green-600'
  };

  const upcomingAchievements = [
    {
      title: 'Streak Master',
      description: 'Learn for 14 days in a row',
      progress: user.progress.streakDays,
      target: 14,
      icon: Calendar,
      category: 'streak'
    },
    {
      title: 'Safety Scholar',
      description: 'Complete 10 lessons',
      progress: user.progress.totalLessonsCompleted,
      target: 10,
      icon: Award,
      category: 'completion'
    },
    {
      title: 'Point Collector',
      description: 'Earn 1000 safety points',
      progress: user.progress.totalPoints,
      target: 1000,
      icon: Star,
      category: 'progress'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Your Achievements
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Celebrate your safety learning milestones and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{user.achievements.length}</div>
          <div className="text-sm text-gray-600">Earned</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{availableAchievements.length - user.achievements.length}</div>
          <div className="text-sm text-gray-600">To Unlock</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{user.progress.totalPoints}</div>
          <div className="text-sm text-gray-600">Points</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{user.progress.streakDays}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earned Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
            Earned Achievements
          </h2>
          
          {user.achievements.length > 0 ? (
            <div className="space-y-4">
              {user.achievements.map((achievement) => {
                const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Award;
                const colorClass = categoryColors[achievement.category];
                
                return (
                  <div key={achievement.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            achievement.category === 'progress' ? 'bg-blue-100 text-blue-800' :
                            achievement.category === 'streak' ? 'bg-orange-100 text-orange-800' :
                            achievement.category === 'mastery' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {achievement.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {achievement.unlockedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No achievements earned yet.</p>
              <p className="text-gray-500 text-sm mt-2">Keep learning to unlock your first achievement!</p>
            </div>
          )}
        </div>

        {/* Progress Towards Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-500" />
            Progress Towards Next
          </h2>
          
          <div className="space-y-4">
            {upcomingAchievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              const colorClass = categoryColors[achievement.category as keyof typeof categoryColors];
              const progress = Math.min((achievement.progress / achievement.target) * 100, 100);
              
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} opacity-60 flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {achievement.description}
                      </p>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">
                        {achievement.progress} / {achievement.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {Math.round(progress)}% complete
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;