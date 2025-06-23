class TavusService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error('❌ Supabase configuration missing');
    }
  }

  async createConversation(userInput: string, userName?: string, userAge?: number): Promise<{
    conversationUrl: string;
    conversationId: string;
    status: string;
  }> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please check your environment variables.');
    }

    try {
      console.log('🎬 Creating Tavus conversation via Supabase Edge Function...');
      console.log(`📝 User input: ${userInput.substring(0, 100)}${userInput.length > 100 ? '...' : ''}`);
      console.log(`👤 User: ${userName || 'Unknown'}, Age: ${userAge || 'Unknown'}`);

      // Call the Supabase Edge Function instead of Tavus API directly
      const response = await fetch(`${this.supabaseUrl}/functions/v1/tavus-cvi-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          user_input: userInput.trim(),
          user_name: userName,
          user_age: userAge
        }),
      });

      console.log(`📡 Supabase Edge Function response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.message || `HTTP ${response.status}: Failed to create video`;
        console.error(`❌ Edge Function error: ${response.status} - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.success || !data.conversation_url) {
        throw new Error(data.details || data.message || 'Failed to create personalized video');
      }

      console.log('✅ Tavus conversation created successfully via Edge Function');
      console.log(`🔗 Conversation URL: ${data.conversation_url}`);
      console.log(`🆔 Conversation ID: ${data.conversation_id}`);

      return {
        conversationUrl: data.conversation_url,
        conversationId: data.conversation_id,
        status: data.status || 'created'
      };

    } catch (error) {
      console.error('❌ Error creating Tavus conversation:', error);
      throw error;
    }
  }

  // Check if Supabase is properly configured
  isConfigured(): boolean {
    return !!(this.supabaseUrl && this.supabaseAnonKey);
  }

  // Get configuration status for debugging
  getConfigStatus() {
    return {
      hasSupabaseUrl: !!this.supabaseUrl,
      hasSupabaseAnonKey: !!this.supabaseAnonKey,
      supabaseUrlLength: this.supabaseUrl ? this.supabaseUrl.length : 0,
      anonKeyLength: this.supabaseAnonKey ? this.supabaseAnonKey.length : 0
    };
  }
}

export const tavusService = new TavusService();