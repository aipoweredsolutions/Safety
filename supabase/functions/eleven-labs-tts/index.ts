import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TTSRequest {
  text: string
  voiceId?: string
  userAge?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voiceId, userAge }: TTSRequest = await req.json()

    // Get age-appropriate voice
    const getAgeAppropriateVoice = (age?: number) => {
      if (!age) return 'pNInz6obpgDQGcFmaJgB' // Default voice
      
      if (age >= 5 && age <= 8) {
        return 'XB0fDUnXU5powFXDhCwa' // Charlotte - young, friendly female voice
      } else if (age >= 9 && age <= 12) {
        return 'pNInz6obpgDQGcFmaJgB' // Adam - clear, educational male voice
      } else if (age >= 13 && age <= 16) {
        return 'EXAVITQu4vr4xnSDxMaL' // Bella - teen-friendly female voice
      } else if (age >= 17 && age <= 19) {
        return 'TxGEqnHWrfWFTfGW9XjX' // Josh - mature, professional male voice
      }
      
      return 'pNInz6obpgDQGcFmaJgB' // Default
    }

    const selectedVoiceId = voiceId || getAgeAppropriateVoice(userAge)
    const apiKey = Deno.env.get('ELEVEN_LABS_API_KEY')

    if (!apiKey) {
      throw new Error('ELEVEN_LABS_API_KEY not configured')
    }

    // Call Eleven Labs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Eleven Labs API error: ${response.status} - ${errorText}`)
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error('Error in eleven-labs-tts function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate speech',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})