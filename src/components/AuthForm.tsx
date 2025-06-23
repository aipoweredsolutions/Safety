import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Calendar } from 'lucide-react'
import { AgeGroup } from '../types'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSubmit: (data: AuthFormData) => void
  loading: boolean
  error: string | null
}

export interface AuthFormData {
  email: string
  password: string
  name?: string
  age?: number
  ageGroup?: AgeGroup
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    age: 12,
    ageGroup: '10-14'
  })
  const [showPassword, setShowPassword] = useState(false)

  const ageGroups = [
    { value: '5-9' as AgeGroup, label: 'Ages 5-9 (Young Learners)' },
    { value: '10-14' as AgeGroup, label: 'Ages 10-14 (Teen Guardians)' },
    { value: '15-19' as AgeGroup, label: 'Ages 15-19 (Young Adults)' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleAgeChange = (age: number) => {
    let ageGroup: AgeGroup = '10-14'
    if (age >= 5 && age <= 9) ageGroup = '5-9'
    else if (age >= 10 && age <= 14) ageGroup = '10-14'
    else if (age >= 15 && age <= 19) ageGroup = '15-19'

    setFormData(prev => ({ ...prev, age, ageGroup }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {mode === 'signup' && (
        <>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="age"
                required
                min="5"
                max="19"
                value={formData.age}
                onChange={(e) => handleAgeChange(parseInt(e.target.value) || 12)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
              />
            </div>
          </div>

          {/* Age Group Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Group
            </label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                {ageGroups.find(group => group.value === formData.ageGroup)?.label}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {mode === 'signup' && (
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          mode === 'signin' ? 'Sign In' : 'Create Account'
        )}
      </button>
    </form>
  )
}

export default AuthForm