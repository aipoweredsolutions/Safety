class ElevenLabsService {
  private supabaseUrl: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!this.supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL environment variable is required');
    }
  }

  async generateSpeech(text: string, userAge?: number, voiceId?: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/eleven-labs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          text,
          userAge,
          voiceId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return audioBlob;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw new Error('Failed to generate speech. Please try again.');
    }
  }

  // Get available voices for different age groups
  getAgeAppropriateVoices(age: number) {
    if (age >= 5 && age <= 8) {
      return [
        { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Friendly young female voice' },
        { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Clear educational voice' }
      ];
    } else if (age >= 9 && age <= 12) {
      return [
        { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Clear educational voice' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Friendly female voice' }
      ];
    } else if (age >= 13 && age <= 16) {
      return [
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Teen-friendly female voice' },
        { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Young male voice' }
      ];
    } else if (age >= 17 && age <= 19) {
      return [
        { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Professional male voice' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Professional female voice' }
      ];
    }
    
    return [
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Default voice' }
    ];
  }
}

export const elevenLabsService = new ElevenLabsService();