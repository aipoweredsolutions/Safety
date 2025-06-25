import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Calendar, AlertCircle } from 'lucide-react'
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
    ageGroup: '11-15'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const ageGroups = [
    { value: '5-10' as AgeGroup, label: 'Ages 5-10 (Young Learners)' },
    { value: '11-15' as AgeGroup, label: 'Ages 11-15 (Teen Guardians)' },
    { value: '16-19' as AgeGroup, label: 'Ages 16-19 (Young Adults)' }
  ]

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    // Sign up specific validations
    if (mode === 'signup') {
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long'
      }

      if (!formData.age || formData.age < 5 || formData.age > 19) {
        errors.age = 'Age must be between 5 and 19'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Clean and prepare data
    const cleanData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      ...(mode === 'signup' && {
        name: formData.name?.trim(),
        age: formData.age,
        ageGroup: formData.ageGroup
      })
    }

    onSubmit(cleanData)
  }

  const handleAgeChange = (age: number) => {
    let ageGroup: AgeGroup = '11-15'
    if (age >= 5 && age <= 10) ageGroup = '5-10'
    else if (age >= 11 && age <= 15) ageGroup = '11-15'
    else if (age >= 16 && age <= 19) ageGroup = '16-19'

    setFormData(prev => ({ ...prev, age, ageGroup }))
    
    // Clear age validation error when user changes age
    if (validationErrors.age) {
      setValidationErrors(prev => ({ ...prev, age: '' }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Global Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age *
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
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  validationErrors.age ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your age"
                disabled={loading}
              />
            </div>
            {validationErrors.age && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.age}</p>
            )}
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
              <p className="text-blue-600 text-sm mt-1">
                Content will be tailored for your age group
              </p>
            </div>
          </div>
        </>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            disabled={loading}
            autoComplete="email"
          />
        </div>
        {validationErrors.email && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
            disabled={loading}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
        )}
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

      {/* Email Confirmation Notice for Sign Up */}
      {mode === 'signup' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Email Confirmation</h3>
              <p className="text-blue-700 text-sm mt-1">
                After creating your account, you may need to check your email and click the confirmation link before you can sign in.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default AuthForm