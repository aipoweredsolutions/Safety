import React, { useState } from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm, { AuthFormData } from '../components/AuthForm'
import { authService } from '../services/authService'

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setError(null)

    try {
      let result
      if (mode === 'signin') {
        console.log('🔐 Attempting sign in for:', data.email)
        result = await authService.signIn(data.email, data.password)
      } else {
        if (!data.name || !data.age || !data.ageGroup) {
          setError('Please fill in all required fields')
          setLoading(false)
          return
        }
        console.log('🔐 Attempting sign up for:', data.email)
        result = await authService.signUp(data.email, data.password, {
          name: data.name,
          age: data.age,
          ageGroup: data.ageGroup
        })
      }

      if (result.error) {
        console.error('❌ Auth error:', result.error)
        setError(result.error)
      } else if (result.user) {
        console.log('✅ Auth successful for user:', result.user.name)
        console.log('🔄 Redirecting to dashboard...')
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate('/app', { replace: true })
        }, 100)
      } else {
        console.error('❌ No user returned but no error')
        setError('Authentication failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Unexpected auth error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SafetyLearn</span>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-md w-full">
          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {mode === 'signin' ? 'Welcome Back!' : 'Join SafetyLearn'}
              </h1>
              <p className="text-gray-600">
                {mode === 'signin' 
                  ? 'Sign in to continue your safety learning journey'
                  : 'Create your account to start learning essential safety skills'
                }
              </p>
            </div>

            <AuthForm
              mode={mode}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />

            {/* Mode Toggle */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin')
                    setError(null)
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  disabled={loading}
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Your Safety & Privacy</h3>
                <p className="text-sm text-blue-700">
                  We take your privacy seriously. Your personal information is secure and will never be shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage