import { geminiService } from './geminiService';
import { elevenLabsService } from './elevenLabsService';
import { Lesson, LessonContent, Quiz, AgeGroup, SafetyCategory } from '../types';

interface GeminiLessonRequest {
  topic: string;
  ageGroup: AgeGroup;
  category: SafetyCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
}

interface GeminiLessonResponse {
  title: string;
  description: string;
  introduction: string;
  keyPoints: string[];
  scenarios: Array<{
    situation: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  tips: string[];
  quiz: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

class GeminiLessonService {
  private supabaseUrl: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!this.supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL environment variable is required');
    }
  }

  async generateLesson(request: GeminiLessonRequest): Promise<Lesson> {
    try {
      console.log('🤖 Generating lesson with Gemini AI:', request);

      const response = await fetch(`${this.supabaseUrl}/functions/v1/gemini-lesson-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const lessonData: GeminiLessonResponse = await response.json();
      
      if (!lessonData) {
        throw new Error('No lesson data received from Gemini');
      }

      // Transform Gemini response to our Lesson interface
      const lesson: Lesson = {
        id: `gemini-${Date.now()}`,
        title: lessonData.title,
        description: lessonData.description,
        ageGroups: [request.ageGroup],
        duration: request.duration,
        difficulty: request.difficulty,
        category: request.category,
        content: {
          introduction: lessonData.introduction,
          keyPoints: lessonData.keyPoints,
          scenarios: lessonData.scenarios.map((scenario, index) => ({
            id: `scenario-${index}`,
            situation: scenario.situation,
            options: scenario.options,
            correctAnswer: scenario.correctAnswer,
            explanation: scenario.explanation
          })),
          tips: lessonData.tips
        },
        quiz: {
          questions: lessonData.quiz.questions.map((question, index) => ({
            id: `question-${index}`,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
          }))
        }
      };

      console.log('✅ Lesson generated successfully:', lesson.title);
      return lesson;
    } catch (error) {
      console.error('❌ Error generating lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generateLessonAudio(lesson: Lesson, userAge: number): Promise<Map<string, Blob>> {
    try {
      console.log('🔊 Generating audio for lesson:', lesson.title);
      
      const audioMap = new Map<string, Blob>();
      
      // Generate audio for introduction
      const introAudio = await elevenLabsService.generateSpeech(
        `Welcome to ${lesson.title}. ${lesson.content.introduction}`,
        userAge
      );
      audioMap.set('introduction', introAudio);

      // Generate audio for key points
      const keyPointsText = `Here are the key points you'll learn: ${lesson.content.keyPoints.join('. ')}`;
      const keyPointsAudio = await elevenLabsService.generateSpeech(keyPointsText, userAge);
      audioMap.set('keyPoints', keyPointsAudio);

      // Generate audio for scenarios
      for (let i = 0; i < lesson.content.scenarios.length; i++) {
        const scenario = lesson.content.scenarios[i];
        const scenarioText = `Scenario ${i + 1}: ${scenario.situation}. The options are: ${scenario.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ')}`;
        const scenarioAudio = await elevenLabsService.generateSpeech(scenarioText, userAge);
        audioMap.set(`scenario-${i}`, scenarioAudio);
      }

      // Generate audio for quiz questions
      for (let i = 0; i < lesson.quiz.questions.length; i++) {
        const question = lesson.quiz.questions[i];
        const questionText = `Question ${i + 1}: ${question.question}. The options are: ${question.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ')}`;
        const questionAudio = await elevenLabsService.generateSpeech(questionText, userAge);
        audioMap.set(`question-${i}`, questionAudio);
      }

      // Generate audio for tips
      const tipsText = `Here are some important safety tips: ${lesson.content.tips.join('. ')}`;
      const tipsAudio = await elevenLabsService.generateSpeech(tipsText, userAge);
      audioMap.set('tips', tipsAudio);

      console.log(`✅ Generated audio for ${audioMap.size} lesson components`);
      return audioMap;
    } catch (error) {
      console.error('❌ Error generating lesson audio:', error);
      throw new Error('Failed to generate lesson audio');
    }
  }

  async generateQuickLesson(topic: string, ageGroup: AgeGroup, userAge: number): Promise<{
    lesson: Lesson;
    audio: Map<string, Blob>;
  }> {
    try {
      console.log(`🚀 Generating quick lesson: ${topic} for age group ${ageGroup}`);

      // Determine category and difficulty based on age group and topic
      const category = this.categorizeTopicByKeywords(topic);
      const difficulty = ageGroup === '5-10' ? 'easy' : ageGroup === '11-15' ? 'medium' : 'hard';
      const duration = ageGroup === '5-10' ? 10 : ageGroup === '11-15' ? 15 : 20;

      // Generate the lesson
      const lesson = await this.generateLesson({
        topic,
        ageGroup,
        category,
        difficulty,
        duration
      });

      // Generate audio for the lesson
      const audio = await this.generateLessonAudio(lesson, userAge);

      console.log('✅ Quick lesson generated with audio');
      return { lesson, audio };
    } catch (error) {
      console.error('❌ Error generating quick lesson:', error);
      throw error;
    }
  }

  private categorizeTopicByKeywords(topic: string): SafetyCategory {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('online') || topicLower.includes('internet') || topicLower.includes('cyber') || topicLower.includes('digital')) {
      return 'online';
    } else if (topicLower.includes('bully') || topicLower.includes('friend') || topicLower.includes('peer') || topicLower.includes('social')) {
      return 'social';
    } else if (topicLower.includes('emergency') || topicLower.includes('911') || topicLower.includes('help')) {
      return 'emergency';
    } else if (topicLower.includes('feeling') || topicLower.includes('emotion') || topicLower.includes('mental') || topicLower.includes('stress')) {
      return 'emotional';
    } else {
      return 'physical';
    }
  }

  // Generate lesson suggestions based on user's age and progress
  async generateLessonSuggestions(ageGroup: AgeGroup, completedTopics: string[] = []): Promise<string[]> {
    try {
      console.log(`💡 Generating lesson suggestions for age group: ${ageGroup}`);

      const response = await fetch(`${this.supabaseUrl}/functions/v1/gemini-lesson-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ageGroup,
          completedTopics
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const suggestions = await response.json();
      console.log(`✅ Generated ${suggestions.length} lesson suggestions`);
      return suggestions;
    } catch (error) {
      console.error('❌ Error generating lesson suggestions:', error);
      throw new Error('Failed to generate lesson suggestions');
    }
  }
}

export const geminiLessonService = new GeminiLessonService();