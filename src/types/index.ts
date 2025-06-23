export interface User {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  avatar: string;
  progress: Progress;
  achievements: Achievement[];
  createdAt: Date;
}

export interface Progress {
  currentLevel: number;
  totalLessonsCompleted: number;
  streakDays: number;
  totalPoints: number;
  completedTopics: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: AchievementCategory;
}

// Updated lesson interfaces to match database schema
export interface Lesson {
  id: string;
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  duration: number; // duration_minutes from DB
  difficulty: 'easy' | 'medium' | 'hard';
  category: SafetyCategory;
  videoUrl?: string;
  content: LessonContent;
  quiz: Quiz;
  metadata?: {
    keyPointsCount: number;
    scenariosCount: number;
  };
}

export interface LessonContent {
  introduction: string; // introduction_text from DB
  keyPoints: string[]; // Simplified to string array for easier handling
  scenarios: LessonScenario[];
  tips: string[];
}

// New interfaces matching database schema
export interface LessonKeyPoint {
  id: string;
  lessonId: string;
  pointText: string;
  orderIndex: number;
}

export interface LessonScenario {
  id: string;
  lessonId?: string;
  situation: string;
  options: string[];
  correctAnswer: number; // correct_answer_index from DB
  explanation: string;
  orderIndex?: number;
}

export interface LessonQuizQuestion {
  id: string;
  lessonId: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // correct_answer_index from DB
  explanation: string;
  orderIndex: number;
}

// Legacy interface for backward compatibility
export interface Scenario {
  id: string;
  situation: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  category?: SafetyCategory;
}

export interface DailyStory {
  id: string;
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  category: SafetyCategory;
  scenarios: StoryScenario[];
  moralLesson: string;
}

export interface StoryScenario {
  id: string;
  dailyStoryId: string;
  situation: string;
  options: string[];
  correctAnswer: number; // correct_answer_index from DB
  explanation: string;
  encouragement: string;
  orderIndex: number;
}

// Updated to match the new age group structure
export type AgeGroup = '5-10' | '11-15' | '16-19';
export type SafetyCategory = 'online' | 'physical' | 'social' | 'emotional' | 'emergency';
export type AchievementCategory = 'progress' | 'streak' | 'completion' | 'mastery';