import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Only log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Configuration:')
  console.log('📍 URL configured:', !!supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co')
  console.log('🔑 Anon key configured:', !!supabaseAnonKey && supabaseAnonKey !== 'your-anon-key')

  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    console.error('❌ VITE_SUPABASE_URL is not configured properly')
    console.log('💡 Please set VITE_SUPABASE_URL in your .env file')
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.error('❌ VITE_SUPABASE_ANON_KEY is not configured properly')
    console.log('💡 Please set VITE_SUPABASE_ANON_KEY in your .env file')
  }
}

// Custom storage adapter that handles localStorage blocking gracefully
const customStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ localStorage access blocked, using memory storage')
      }
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ localStorage write blocked, session will not persist')
      }
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ localStorage remove blocked')
      }
    }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'safetylearn-auth',
    storage: customStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Database types based on our updated three age group schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          age: number
          age_group: '5-10' | '11-15' | '16-19'
          avatar: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          age: number
          age_group: '5-10' | '11-15' | '16-19'
          avatar?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          age?: number
          age_group?: '5-10' | '11-15' | '16-19'
          avatar?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_progress: {
        Row: {
          user_id: string
          current_level: number | null
          total_lessons_completed: number | null
          streak_days: number | null
          total_points: number | null
          completed_lesson_ids: string[] | null
          last_activity_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          current_level?: number | null
          total_lessons_completed?: number | null
          streak_days?: number | null
          total_points?: number | null
          completed_lesson_ids?: string[] | null
          last_activity_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          current_level?: number | null
          total_lessons_completed?: number | null
          streak_days?: number | null
          total_points?: number | null
          completed_lesson_ids?: string[] | null
          last_activity_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_achievements: {
        Row: {
          user_id: string
          achievement_id: string
          unlocked_at: string | null
        }
        Insert: {
          user_id: string
          achievement_id: string
          unlocked_at?: string | null
        }
        Update: {
          user_id?: string
          achievement_id?: string
          unlocked_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string | null
          category: 'progress' | 'streak' | 'completion' | 'mastery'
          created_at: string | null
        }
      }
    }
  }
}

// Helper function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    const { data, error } = await supabase.from('achievements').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection test error:', error)
    return false
  }
}