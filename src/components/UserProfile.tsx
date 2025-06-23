import React, { useState } from 'react';
import { User, Camera, Award, TrendingUp, LogOut } from 'lucide-react';
import { AuthUser } from '../services/authService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: AuthUser;
  onUpdateProfile: (userData: Partial<AuthUser>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    setLoading(true);
    await onUpdateProfile({ name });
    setIsEditing(false);
    setLoading(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    console.log('🔐 Starting sign out process...');
    
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        // Even if there's an error, we should still redirect to be safe
      } else {
        console.log('✅ Successfully signed out');
      }
      
      // Always redirect to landing page after sign out attempt
      console.log('🔄 Redirecting to landing page...');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
      // Still redirect even on unexpected error
      navigate('/', { replace: true });
    } finally {
      setSigningOut(false);
    }
  };

  const progressPercentage = Math.min((user.progress.totalLessonsCompleted / 10) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 transition-colors">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            {isEditing ? (
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Edit
                </button>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign Out"
            >
              {signingOut ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="text-sm">{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2 mx-auto">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{user.progress.currentLevel}</p>
              <p className="text-sm text-gray-600">Level</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2 mx-auto">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{user.progress.totalLessonsCompleted}</p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-2 mx-auto">
                <span className="text-orange-600 font-bold">🔥</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{user.progress.streakDays}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2 mx-auto">
                <span className="text-purple-600 font-bold">⭐</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{user.progress.totalPoints}</p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress to Next Level</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Age Group Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Age Group: {user.ageGroup}
            </div>
            <div className="text-sm text-gray-500">
              Member since {user.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;