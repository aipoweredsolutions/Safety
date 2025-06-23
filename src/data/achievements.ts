import { Achievement } from '../types';

export const availableAchievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Safety Explorer',
    description: 'Completed your first safety lesson',
    icon: 'Award',
    unlockedAt: new Date(),
    category: 'progress'
  },
  {
    id: 'week-streak',
    title: 'Consistent Learner',
    description: 'Learned something new for 7 days in a row',
    icon: 'Calendar',
    unlockedAt: new Date(),
    category: 'streak'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Champion',
    description: 'Scored 100% on 5 different quizzes',
    icon: 'Trophy',
    unlockedAt: new Date(),
    category: 'mastery'
  },
  {
    id: 'helper',
    title: 'Safety Helper',
    description: 'Shared safety tips with friends',
    icon: 'Heart',
    unlockedAt: new Date(),
    category: 'completion'
  }
];