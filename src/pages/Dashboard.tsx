import React from 'react';
import { BookOpen, MessageCircle, Award, TrendingUp, Users, Shield, Sparkles } from 'lucide-react';
import { AuthUser } from '../services/authService';
import UserProfile from '../components/UserProfile';
import DailySafetyStory from '../components/DailySafetyStory';

interface DashboardProps {
  user: AuthUser;
  onUpdateProfile: (userData: Partial<AuthUser>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateProfile }) => {
  const quickActions = [
    {
      title: 'AI Lessons',
      description: 'Generate custom lessons',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      href: '/app/ai-lessons'
    },
    {
      title: 'Continue Learning',
      description: 'Pick up where you left off',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      href: '/app/lessons'
    },
    {
      title: 'Safety Chat',
      description: 'Ask questions anytime',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      href: '/app/chat'
    },
    {
      title: 'View Achievements',
      description: 'See your progress',
      icon: Award,
      color: 'from-orange-500 to-red-600',
      href: '/app/achievements'
    }
  ];

  const recentActivity = [
    {
      title: 'Generated AI lesson on "Online Privacy"',
      time: '30 minutes ago',
      icon: '🤖',
      type: 'ai-lesson'
    },
    {
      title: 'Watched personalized safety video',
      time: '1 hour ago',
      icon: '🎬',
      type: 'video'
    },
    {
      title: 'Completed "Stranger Safety Basics"',
      time: '2 hours ago',
      icon: '🛡️',
      type: 'lesson'
    },
    {
      title: 'Earned "Safety Explorer" badge',
      time: '1 day ago',
      icon: '🏆',
      type: 'achievement'
    },
    {
      title: 'Asked about cyberbullying',
      time: '2 days ago',
      icon: '💬',
      type: 'chat'
    }
  ];

  const weeklyStats = [
    { label: 'Lessons Completed', value: '3', icon: BookOpen, color: 'text-blue-600' },
    { label: 'AI Lessons Generated', value: '2', icon: Sparkles, color: 'text-purple-600' },
    { label: 'Questions Asked', value: '12', icon: MessageCircle, color: 'text-green-600' },
    { label: 'Learning Streak', value: `${user.progress.streakDays}`, icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Safety Points', value: user.progress.totalPoints.toString(), icon: Shield, color: 'text-indigo-600' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Ready to continue your safety learning journey?
        </p>
      </div>

      {/* User Profile */}
      <UserProfile user={user} onUpdateProfile={onUpdateProfile} />

      {/* Daily Safety Story */}
      <div className="mb-8">
        <DailySafetyStory userAge={user.age} ageGroup={user.ageGroup} />
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {weeklyStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-2xl font-bold text-gray-800">{value}</span>
            </div>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map(({ title, description, icon: Icon, color, href }) => (
          <a
            key={title}
            href={href}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.type === 'ai-lesson' ? 'bg-purple-100 text-purple-800' :
                activity.type === 'video' ? 'bg-pink-100 text-pink-800' :
                activity.type === 'lesson' ? 'bg-blue-100 text-blue-800' :
                activity.type === 'achievement' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {activity.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tip of the Day */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Safety Tip of the Day
        </h2>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-700 mb-2">
            <strong>Remember:</strong> Trust your instincts! If something feels wrong or makes you uncomfortable, 
            it's always okay to say "no" and seek help from a trusted adult.
          </p>
          <p className="text-sm text-gray-500">
            Your safety is the most important thing, and there are always people ready to help you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;