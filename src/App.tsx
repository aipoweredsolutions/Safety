import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService, AuthUser } from './services/authService';

// Components
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import GeminiLessons from './pages/GeminiLessons';
import Chat from './pages/Chat';
import Achievements from './pages/Achievements';
import LessonViewer from './pages/LessonViewer';
import PersonalizedVideos from './pages/PersonalizedVideos';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing SafetyLearn authentication...');
        
        // Check for existing session
        const currentUser = await authService.getCurrentUser();
        
        if (mounted) {
          setUser(currentUser);
          setAuthInitialized(true);
          setLoading(false);
          
          if (currentUser) {
            console.log('✅ Authentication initialized, user:', `${currentUser.name} (${currentUser.email})`);
          } else {
            console.log('✅ Authentication initialized, no user session found');
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener only once
    const { data: { subscription } } = authService.onAuthStateChange((newUser) => {
      if (mounted) {
        if (newUser) {
          console.log('🔄 Auth state updated: user signed in ->', `${newUser.name} (${newUser.email})`);
        } else {
          console.log('🔄 Auth state updated: user signed out');
        }
        setUser(newUser);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  const updateProfile = async (userData: Partial<AuthUser>) => {
    if (!user) return;

    const { error } = await authService.updateProfile({
      name: userData.name,
      age: userData.age,
      ageGroup: userData.ageGroup,
      avatar: userData.avatar
    });

    if (!error) {
      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  const completeLesson = async (lessonId: string) => {
    if (!user) return;

    const { error } = await authService.completeLesson(lessonId);

    if (!error) {
      // Refresh user data to get updated progress and achievements
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  const startLesson = (lessonId: string) => {
    window.location.href = `/app/lesson/${lessonId}`;
  };

  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading SafetyLearn...</h2>
          <p className="text-gray-600">Connecting to your account...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Route - redirect to dashboard if already signed in */}
        <Route path="/auth" element={
          user ? (
            <Navigate to="/app" replace />
          ) : (
            <AuthPage />
          )
        } />
        
        {/* App Routes - redirect to auth if not signed in */}
        <Route path="/app/*" element={
          !user ? (
            <Navigate to="/auth" replace />
          ) : (
            <div className="min-h-screen bg-gray-50">
              <div className="flex flex-col md:flex-row">
                <Navigation />
                <main className="flex-1 md:ml-0 pb-20 md:pb-0">
                  <Routes>
                    <Route 
                      path="/" 
                      element={<Dashboard user={user} onUpdateProfile={updateProfile} />} 
                    />
                    <Route 
                      path="/lessons" 
                      element={<Lessons user={user} onStartLesson={startLesson} />} 
                    />
                    <Route 
                      path="/ai-lessons" 
                      element={<GeminiLessons user={user} />} 
                    />
                    <Route 
                      path="/lesson/:lessonId" 
                      element={<LessonViewer user={user} onCompleteLesson={completeLesson} />} 
                    />
                    <Route 
                      path="/videos" 
                      element={<PersonalizedVideos user={user} />} 
                    />
                    <Route 
                      path="/chat" 
                      element={<Chat user={user} />} 
                    />
                    <Route 
                      path="/achievements" 
                      element={<Achievements user={user} />} 
                    />
                    <Route 
                      path="/settings" 
                      element={<div className="p-6 text-center"><h1 className="text-2xl font-bold text-gray-800">Settings</h1><p className="text-gray-600 mt-2">Settings page coming soon!</p></div>} 
                    />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          )
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;