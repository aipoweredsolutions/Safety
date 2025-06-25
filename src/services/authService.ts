import { supabase } from '../lib/supabase'
import { User, AgeGroup } from '../types'

export interface AuthUser {
  id: string
  email: string
  name: string
  age: number
  ageGroup: AgeGroup
  avatar: string
  progress: {
    currentLevel: number
    totalLessonsCompleted: number
    streakDays: number
    totalPoints: number
    completedTopics: string[]
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: Date
    category: 'progress' | 'streak' | 'completion' | 'mastery'
  }>
  createdAt: Date
}

class AuthService {
  private currentUserPromise: Promise<AuthUser | null> | null = null
  private authStateListenerSetup = false

  async signUp(email: string, password: string, userData: {
    name: string
    age: number
    ageGroup: AgeGroup
  }): Promise<{ user: AuthUser | null; error: string | null }> {
    console.log('🔐 Starting sign up process for:', email)
    
    try {
      // Clear any existing cache
      this.clearCache()

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: userData.name,
            age: userData.age,
            age_group: userData.ageGroup,
            avatar: ''
          },
          emailRedirectTo: `${window.location.origin}/app`
        }
      })

      if (error) {
        console.error('❌ Supabase sign up error:', error.message)
        
        // Provide user-friendly error messages
        let userFriendlyError = error.message
        if (error.message.includes('User already registered')) {
          userFriendlyError = 'An account with this email already exists. Please try signing in instead.'
        } else if (error.message.includes('Invalid email')) {
          userFriendlyError = 'Please enter a valid email address.'
        } else if (error.message.includes('Password should be at least')) {
          userFriendlyError = 'Password must be at least 6 characters long.'
        } else if (error.message.includes('Signup is disabled')) {
          userFriendlyError = 'Account creation is currently disabled. Please contact support.'
        }
        
        return { user: null, error: userFriendlyError }
      }

      if (data.user) {
        console.log('✅ Supabase Auth user created, ID:', data.user.id)
        console.log('📧 Email confirmation required:', !data.session)
        
        // If email confirmation is required
        if (!data.session) {
          console.log('📬 Email confirmation required - user will need to check their email')
          return { 
            user: null, 
            error: 'Please check your email and click the confirmation link to complete your account setup.' 
          }
        }

        // If user is immediately signed in (email confirmation disabled)
        console.log('✅ User signed up and logged in immediately')
        
        // Create user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: userData.name,
            age: userData.age,
            age_group: userData.ageGroup,
            avatar: ''
          })

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError)
          // Don't fail the signup if profile creation fails - we can retry later
          console.log('⚠️ Profile creation failed, but user auth succeeded')
        } else {
          console.log('✅ User profile created successfully')
        }

        // Create initial user progress record
        const { error: progressError } = await supabase
          .from('user_progress')
          .insert({
            user_id: data.user.id,
            current_level: 1,
            total_lessons_completed: 0,
            streak_days: 1,
            total_points: 0,
            completed_lesson_ids: [],
            last_activity_date: new Date().toISOString().split('T')[0]
          })

        if (progressError) {
          console.error('❌ Error creating user progress:', progressError)
          // Don't fail the signup if progress creation fails
          console.log('⚠️ Progress creation failed, but user auth succeeded')
        } else {
          console.log('✅ User progress created successfully')
        }

        // Fetch the complete user profile
        const user = await this.getCurrentUser()
        return { user, error: null }
      }

      console.error('❌ No user returned from Supabase signup')
      return { user: null, error: 'Failed to create account. Please try again.' }
    } catch (error) {
      console.error('❌ Unexpected signup error:', error)
      return { user: null, error: 'An unexpected error occurred. Please try again.' }
    }
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    console.log('🔐 Starting sign in process for:', email)
    
    try {
      // Clear any existing cache first
      this.clearCache()
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        console.error('❌ Supabase sign in error:', error.message)
        
        // Provide more user-friendly error messages
        let userFriendlyError = error.message
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyError = 'Invalid email or password. Please check your credentials and try again.'
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyError = 'Please check your email and click the confirmation link before signing in.'
        } else if (error.message.includes('Too many requests')) {
          userFriendlyError = 'Too many sign-in attempts. Please wait a moment and try again.'
        } else if (error.message.includes('User not found')) {
          userFriendlyError = 'No account found with this email address. Please check your email or create a new account.'
        } else if (error.message.includes('Invalid password')) {
          userFriendlyError = 'Incorrect password. Please try again.'
        }
        
        return { user: null, error: userFriendlyError }
      }

      if (data.user && data.session) {
        console.log('✅ Supabase Auth user signed in successfully, ID:', data.user.id)
        console.log('✅ Session established:', !!data.session)
        console.log('📧 User email:', data.user.email)
        console.log('✅ Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No')
        
        // Wait a moment for the session to be fully established
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Fetch the complete user profile
        const user = await this.getCurrentUser()
        
        if (!user) {
          console.error('❌ Failed to fetch user profile after sign in')
          return { user: null, error: 'Failed to load user profile. Please try again.' }
        }
        
        console.log('✅ User profile loaded successfully:', user.name)
        return { user, error: null }
      }

      console.error('❌ No user or session returned from Supabase signin')
      return { user: null, error: 'Sign in failed. Please try again.' }
    } catch (error) {
      console.error('❌ Unexpected signin error:', error)
      return { user: null, error: 'An unexpected error occurred. Please try again.' }
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    console.log('🔐 Starting sign out process')
    
    try {
      // Clear cache first to ensure clean state
      this.clearCache()
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Supabase sign out error:', error.message)
        return { error: error.message }
      }
      
      console.log('✅ Successfully signed out from Supabase')
      return { error: null }
    } catch (error) {
      console.error('❌ Unexpected signout error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Return existing promise if one is already running
    if (this.currentUserPromise) {
      console.log('🔄 Returning existing getCurrentUser promise')
      return this.currentUserPromise
    }

    console.log('👤 Starting fresh getCurrentUser process')
    
    // Create new promise and cache it
    this.currentUserPromise = this._fetchCurrentUser()
    
    try {
      const result = await this.currentUserPromise
      return result
    } catch (error) {
      // Clear cache on error
      this.clearCache()
      throw error
    }
  }

  private async _fetchCurrentUser(): Promise<AuthUser | null> {
    try {
      console.log('📡 Fetching current user from Supabase Auth...')
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.warn('⚠️ Supabase Auth session issue:', authError.message)
        
        // Check for stale session errors and clean up
        if (authError.message.includes('Auth session missing!') || 
            authError.message.includes('Invalid JWT') ||
            authError.message.includes('session_not_found') ||
            authError.message.includes('JWT expired')) {
          console.log('🧹 Detected stale session, cleaning up...')
          
          // Force sign out to clear any stale session data
          try {
            await supabase.auth.signOut()
            console.log('✅ Stale session cleaned up')
          } catch (signOutError) {
            console.error('❌ Error during stale session cleanup:', signOutError)
          }
        }
        
        return null
      }
      
      if (!authUser) {
        console.log('❌ No authenticated user found in Supabase')
        return null
      }

      console.log('✅ Supabase Auth user found, ID:', authUser.id)
      console.log('📧 Email:', authUser.email)
      console.log('✅ Email confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No')

      // Fetch user profile from our users table
      console.log('📊 Fetching user profile from users table...')
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      let userProfile = profile

      // If profile doesn't exist, create it from auth metadata
      if (profileError && profileError.code === 'PGRST116') {
        console.log('⚠️ User profile not found, creating from auth metadata...')
        
        const metadata = authUser.user_metadata || {}
        const defaultProfile = {
          id: authUser.id,
          name: metadata.name || authUser.email?.split('@')[0] || 'User',
          age: metadata.age || 12,
          age_group: metadata.age_group || '11-15' as AgeGroup,
          avatar: metadata.avatar || ''
        }

        console.log('📋 Creating profile with data:', defaultProfile)

        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert(defaultProfile)
          .select()
          .single()

        if (createError) {
          console.error('❌ Error creating user profile from metadata:', createError)
          return null
        }

        console.log('✅ User profile created from metadata')
        userProfile = newProfile
      } else if (profileError) {
        console.error('❌ Error fetching user profile:', profileError)
        
        // Check if this is also a session-related error
        if (profileError.message?.includes('JWT') || profileError.code === '401') {
          console.log('🧹 Profile fetch failed due to auth issue, cleaning up session...')
          try {
            await supabase.auth.signOut()
            console.log('✅ Session cleaned up due to profile fetch auth error')
          } catch (signOutError) {
            console.error('❌ Error during session cleanup:', signOutError)
          }
        }
        
        return null
      } else {
        console.log('✅ User profile found')
      }

      if (!userProfile) {
        console.error('❌ No user profile available')
        return null
      }

      // Fetch user progress
      console.log('📊 Fetching user progress...')
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      let userProgress = progress

      // If progress doesn't exist, create it
      if (progressError && progressError.code === 'PGRST116') {
        console.log('⚠️ User progress not found, creating default progress...')
        
        const defaultProgress = {
          user_id: authUser.id,
          current_level: 1,
          total_lessons_completed: 0,
          streak_days: 1,
          total_points: 0,
          completed_lesson_ids: [],
          last_activity_date: new Date().toISOString().split('T')[0]
        }

        const { data: newProgress, error: createProgressError } = await supabase
          .from('user_progress')
          .insert(defaultProgress)
          .select()
          .single()

        if (createProgressError) {
          console.error('❌ Error creating user progress:', createProgressError)
          return null
        }

        console.log('✅ User progress created')
        userProgress = newProgress
      } else if (progressError) {
        console.error('❌ Error fetching user progress:', progressError)
        
        // Check if this is also a session-related error
        if (progressError.message?.includes('JWT') || progressError.code === '401') {
          console.log('🧹 Progress fetch failed due to auth issue, cleaning up session...')
          try {
            await supabase.auth.signOut()
            console.log('✅ Session cleaned up due to progress fetch auth error')
          } catch (signOutError) {
            console.error('❌ Error during session cleanup:', signOutError)
          }
        }
        
        return null
      } else {
        console.log('✅ User progress found')
      }

      if (!userProgress) {
        console.error('❌ No user progress available')
        return null
      }

      // Fetch user achievements
      console.log('📊 Fetching user achievements...')
      const { data: achievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          unlocked_at,
          achievements (
            id,
            title,
            description,
            icon,
            category
          )
        `)
        .eq('user_id', authUser.id)

      if (achievementsError) {
        console.error('❌ Error fetching user achievements:', achievementsError)
        
        // Check if this is also a session-related error
        if (achievementsError.message?.includes('JWT') || achievementsError.code === '401') {
          console.log('🧹 Achievements fetch failed due to auth issue, cleaning up session...')
          try {
            await supabase.auth.signOut()
            console.log('✅ Session cleaned up due to achievements fetch auth error')
          } catch (signOutError) {
            console.error('❌ Error during session cleanup:', signOutError)
          }
          return null
        }
      } else {
        console.log('✅ User achievements fetched, count:', achievements?.length || 0)
      }

      const userAchievements = (achievements || []).map(ua => ({
        id: ua.achievements.id,
        title: ua.achievements.title,
        description: ua.achievements.description,
        icon: ua.achievements.icon || 'Award',
        unlockedAt: new Date(ua.unlocked_at || ''),
        category: ua.achievements.category as 'progress' | 'streak' | 'completion' | 'mastery'
      }))

      const finalUser = {
        id: userProfile.id,
        email: authUser.email || '',
        name: userProfile.name,
        age: userProfile.age,
        ageGroup: userProfile.age_group as AgeGroup,
        avatar: userProfile.avatar || '',
        progress: {
          currentLevel: userProgress.current_level || 1,
          totalLessonsCompleted: userProgress.total_lessons_completed || 0,
          streakDays: userProgress.streak_days || 1,
          totalPoints: userProgress.total_points || 0,
          completedTopics: userProgress.completed_lesson_ids || []
        },
        achievements: userAchievements,
        createdAt: new Date(userProfile.created_at || '')
      }

      console.log('✅ User data successfully loaded for:', finalUser.name, '(', finalUser.email, ')')
      return finalUser
    } catch (error) {
      console.error('❌ Unexpected error in getCurrentUser:', error)
      
      // Check if the error is related to authentication/session issues
      if (error instanceof Error && 
          (error.message.includes('JWT') || 
           error.message.includes('session') || 
           error.message.includes('401') ||
           error.message.includes('403'))) {
        console.log('🧹 Unexpected auth-related error, cleaning up session...')
        try {
          await supabase.auth.signOut()
          console.log('✅ Session cleaned up due to unexpected auth error')
        } catch (signOutError) {
          console.error('❌ Error during unexpected error session cleanup:', signOutError)
        }
      }
      
      return null
    }
  }

  async updateProfile(updates: Partial<{
    name: string
    age: number
    ageGroup: AgeGroup
    avatar: string
  }>): Promise<{ error: string | null }> {
    console.log('👤 Starting updateProfile process')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('❌ Not authenticated for profile update')
        return { error: 'Not authenticated' }
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          age: updates.age,
          age_group: updates.ageGroup,
          avatar: updates.avatar
        })
        .eq('id', user.id)

      if (error) {
        console.error('❌ Error updating profile:', error.message)
      } else {
        console.log('✅ Profile updated successfully')
        // Clear cache to force refresh
        this.clearCache()
      }

      return { error: error?.message || null }
    } catch (error) {
      console.error('❌ Unexpected error in updateProfile:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  async completeLesson(lessonId: string): Promise<{ error: string | null }> {
    console.log('📚 Starting completeLesson process for:', lessonId)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('❌ Not authenticated for lesson completion')
        return { error: 'Not authenticated' }
      }

      // Get current progress
      const { data: progress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError || !progress) {
        console.error('❌ Failed to fetch progress for lesson completion:', fetchError)
        return { error: 'Failed to fetch progress' }
      }

      const completedLessons = progress.completed_lesson_ids || []
      
      // Don't add if already completed
      if (completedLessons.includes(lessonId)) {
        console.log('⚠️ Lesson already completed:', lessonId)
        return { error: null }
      }

      const newCompletedLessons = [...completedLessons, lessonId]
      const newTotalCompleted = newCompletedLessons.length
      const newLevel = Math.floor(newTotalCompleted / 3) + 1
      const newPoints = (progress.total_points || 0) + 100

      // Update progress
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          completed_lesson_ids: newCompletedLessons,
          total_lessons_completed: newTotalCompleted,
          current_level: newLevel,
          total_points: newPoints,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('❌ Error updating lesson progress:', updateError.message)
        return { error: updateError.message }
      }

      console.log('✅ Lesson progress updated')

      // Check for new achievements
      await this.checkAndUnlockAchievements(user.id, newTotalCompleted, newPoints)

      // Clear cache to force refresh
      this.clearCache()

      console.log('✅ completeLesson process finished')
      return { error: null }
    } catch (error) {
      console.error('❌ Unexpected error in completeLesson:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  private async checkAndUnlockAchievements(userId: string, lessonsCompleted: number, totalPoints: number) {
    console.log('🏆 Checking achievements for user:', userId)
    
    try {
      const achievementsToUnlock = []

      // First lesson achievement
      if (lessonsCompleted === 1) {
        achievementsToUnlock.push('first-lesson')
      }

      // Quiz master achievement (5 lessons)
      if (lessonsCompleted >= 5) {
        achievementsToUnlock.push('quiz-master')
      }

      // Safety scholar achievement (25 lessons)
      if (lessonsCompleted >= 25) {
        achievementsToUnlock.push('safety-scholar')
      }

      // Point collector achievement (1000 points)
      if (totalPoints >= 1000) {
        achievementsToUnlock.push('point-collector')
      }

      // Insert new achievements using upsert with ignoreDuplicates
      for (const achievementId of achievementsToUnlock) {
        await supabase
          .from('user_achievements')
          .upsert({
            user_id: userId,
            achievement_id: achievementId
          }, {
            onConflict: 'user_id,achievement_id',
            ignoreDuplicates: true
          })
      }

      console.log('✅ Achievement check completed')
    } catch (error) {
      console.error('❌ Error checking achievements:', error)
    }
  }

  private clearCache() {
    this.currentUserPromise = null
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (this.authStateListenerSetup) {
      console.log('⚠️ Auth state listener already set up, skipping')
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    console.log('🔄 Setting up Supabase auth state change listener')
    this.authStateListenerSetup = true
    
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase auth state changed:', event, session?.user?.id || 'no user')
      console.log('📧 User email:', session?.user?.email || 'no email')
      
      // Clear cache on auth state change
      this.clearCache()
      
      if (session?.user) {
        // Wait a moment for the session to be fully established
        await new Promise(resolve => setTimeout(resolve, 100))
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  // Helper method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return !!user
    } catch {
      return false
    }
  }

  // Helper method to get current session
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()