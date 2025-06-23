import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ConversationRequest {
  conversationName?: string
  conversationalContext?: string
  customGreeting?: string
  callbackUrl?: string
  properties?: {
    max_call_duration?: number
    participant_left_timeout?: number
    participant_absent_timeout?: number
    enable_recording?: boolean
    enable_closed_captions?: boolean
    apply_greenscreen?: boolean
    language?: string
  }
}

interface TavusConversationResponse {
  conversation_id: string
  conversation_name: string
  status: string
  conversation_url: string
  replica_id: string
  persona_id: string
  created_at: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody: ConversationRequest = await req.json()

    // Retrieve Tavus API key from Supabase secrets
    const tavusApiKey = Deno.env.get('TAVUS_API_KEY')

    if (!tavusApiKey) {
      throw new Error('TAVUS_API_KEY not configured in Supabase secrets')
    }

    console.log('🚀 Creating Tavus conversation for children and teens safety expert')

    // Build the conversation request payload
    const conversationPayload = {
      replica_id: "rb17cf590e15",
      persona_id: "ped36e04551b",
      conversation_name: requestBody.conversationName || "Safety Expert Consultation",
      conversational_context: requestBody.conversationalContext || 
        "You are speaking with someone who may need guidance on children and teens safety. " +
        "Be empathetic, professional, and provide age-appropriate safety advice. " +
        "Focus on creating a safe, supportive environment for discussion about safety concerns, " +
        "online safety, bullying prevention, and general wellbeing. " +
        "Always prioritize the safety and comfort of the person you're speaking with.",
      custom_greeting: requestBody.customGreeting || 
        "Hello! I'm here to help with any questions or concerns you might have about children and teen safety. " +
        "Feel free to share what's on your mind - this is a safe space for discussion.",
      callback_url: requestBody.callbackUrl,
      properties: {
        max_call_duration: requestBody.properties?.max_call_duration || 1800, // 30 minutes default
        participant_left_timeout: requestBody.properties?.participant_left_timeout || 60,
        participant_absent_timeout: requestBody.properties?.participant_absent_timeout || 300,
        enable_recording: requestBody.properties?.enable_recording || false,
        enable_closed_captions: requestBody.properties?.enable_closed_captions || true,
        apply_greenscreen: requestBody.properties?.apply_greenscreen || false,
        language: requestBody.properties?.language || "english"
      }
    }

    console.log(`📋 Conversation details:`)
    console.log(`   Name: ${conversationPayload.conversation_name}`)
    console.log(`   Replica ID: ${conversationPayload.replica_id}`)
    console.log(`   Persona ID: ${conversationPayload.persona_id}`)

    // Call Tavus API to create conversation
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': tavusApiKey,
        'User-Agent': 'SafetyLearn-Platform/1.0'
      },
      body: JSON.stringify(conversationPayload)
    })

    if (!tavusResponse.ok) {
      const errorText = await tavusResponse.text()
      console.error(`❌ Tavus API error: ${tavusResponse.status} - ${errorText}`)
      throw new Error(`Tavus API error: ${tavusResponse.status} - ${errorText}`)
    }

    const conversationData: TavusConversationResponse = await tavusResponse.json()
    
    console.log('✅ Tavus conversation created successfully')
    console.log(`🔗 Conversation URL: ${conversationData.conversation_url}`)
    console.log(`🆔 Conversation ID: ${conversationData.conversation_id}`)

    // Return the conversation details
    return new Response(
      JSON.stringify({
        success: true,
        conversation: {
          id: conversationData.conversation_id,
          name: conversationData.conversation_name,
          status: conversationData.status,
          url: conversationData.conversation_url,
          replicaId: conversationData.replica_id,
          personaId: conversationData.persona_id,
          createdAt: conversationData.created_at
        },
        message: 'Safety expert conversation created successfully',
        instructions: {
          joinUrl: conversationData.conversation_url,
          note: "Click the URL above to join the conversation with the children and teens safety expert. The conversation will timeout after 30 minutes by default."
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error in create-safety-conversation function:', error)
    
    // Determine if this is a configuration error or runtime error
    const isConfigError = error.message.includes('not configured') || 
                         error.message.includes('TAVUS_')
    
    const statusCode = isConfigError ? 500 : 400
    const errorType = isConfigError ? 'Configuration Error' : 'Request Error'
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorType,
        message: 'Failed to create safety expert conversation',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})