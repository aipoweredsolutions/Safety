interface ChatResponse {
  response: string;
  conversationHistory: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}

interface QuizResponse {
  explanation: string;
  isCorrect: boolean;
  encouragement: string;
}

class GeminiService {
  private supabaseUrl: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!this.supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL environment variable is required');
    }
  }

  async sendChatMessage(
    message: string, 
    userAge: number, 
    conversationHistory: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = []
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/gemini-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message,
          userAge,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  async getQuizExplanation(
    question: string,
    userAnswer: number,
    correctAnswer: number,
    options: string[],
    userAge: number,
    lessonTitle: string
  ): Promise<QuizResponse> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/gemini-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          question,
          userAnswer,
          correctAnswer,
          options,
          userAge,
          lessonTitle
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error getting quiz explanation:', error);
      throw new Error('Failed to get explanation. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();