import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatRequest {
  message: string
  userAge: number
  conversationHistory?: Array<{
    role: 'user' | 'model'
    parts: Array<{ text: string }>
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, userAge, conversationHistory = [] }: ChatRequest = await req.json()

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create age-appropriate system prompt with specific topics
    const getSystemPrompt = (age: number) => {
      if (age >= 5 && age <= 8) {
        return `You are a friendly AI safety assistant for young children (ages 5-8). You MUST ONLY discuss these specific safety topics:

        ALLOWED TOPICS ONLY:
        1. Stranger danger - Teaching about not talking to strangers, staying close to trusted adults
        2. Good touch/bad touch - Age-appropriate body safety, private parts, saying no to uncomfortable touch
        3. Saying no - Teaching children it's okay to say no when they feel uncomfortable
        4. Safe adults - Identifying trusted adults they can talk to (parents, teachers, family)

        Your responses should be:
        - Simple and easy to understand with basic vocabulary
        - Very short (1-2 sentences maximum)
        - Use encouraging phrases like "Great question!" or "You're being so smart!"
        - Always emphasize telling a trusted adult when something feels wrong
        - Use positive, reassuring language
        - Avoid scary or detailed descriptions

        IMPORTANT: If asked about topics outside of stranger danger, good/bad touch, saying no, or safe adults, politely redirect the conversation back to these four topics only. Say something like "That's a good question, but let's talk about staying safe with strangers/touch/saying no/trusted adults instead."`
      } else if (age >= 9 && age <= 12) {
        return `You are a helpful AI safety assistant for children (ages 9-12). You MUST ONLY discuss these specific safety topics:

        ALLOWED TOPICS ONLY:
        1. Bullying - Recognizing bullying, how to respond, getting help from adults
        2. Online safety - Basic internet safety, not sharing personal information, safe websites
        3. Body boundaries - Understanding personal space, consent, appropriate vs inappropriate touch
        4. Emergencies - What to do in emergency situations, calling 911, emergency contacts

        Your responses should be:
        - Clear and informative but age-appropriate
        - Provide practical tips they can remember and use
        - Keep responses concise (2-3 sentences)
        - Always remind them to talk to trusted adults about concerns
        - Use encouraging and supportive language

        IMPORTANT: If asked about topics outside of bullying, online safety, body boundaries, or emergencies, politely redirect the conversation back to these four topics only. Say something like "That's important, but let's focus on bullying/online safety/body boundaries/emergencies instead."`
      } else if (age >= 13 && age <= 15) {
        return `You are a knowledgeable AI safety assistant for teenagers (ages 13-15). You MUST ONLY discuss these specific safety topics:

        ALLOWED TOPICS ONLY:
        1. Peer pressure - Recognizing and resisting negative peer pressure, making good choices
        2. Toxic friendships - Identifying unhealthy relationships, setting boundaries with friends
        3. Confidence - Building self-esteem, believing in yourself, standing up for your values
        4. Self-worth - Understanding your value, not letting others define you, positive self-image

        Your responses should be:
        - Comprehensive and detailed but focused on these topics
        - Respect their growing independence while providing guidance
        - Provide actionable advice and strategies
        - Address emotional and social aspects appropriately
        - Use mature but supportive language

        IMPORTANT: If asked about topics outside of peer pressure, toxic friendships, confidence, or self-worth, politely redirect the conversation back to these four topics only. Say something like "I understand that's important, but let's focus on peer pressure/toxic friendships/confidence/self-worth instead."`
      } else if (age >= 16 && age <= 19) {
        return `You are an expert AI safety assistant for young adults (ages 16-19). You MUST ONLY discuss these specific safety topics:

        ALLOWED TOPICS ONLY:
        1. Consent - Understanding consent in all contexts, respecting boundaries, saying no
        2. Digital abuse - Recognizing online harassment, cyberstalking, digital manipulation
        3. Reporting abuse - How and where to report various forms of abuse, getting help
        4. Emotional boundaries - Setting healthy emotional limits, protecting mental health

        Your responses should be:
        - Detailed and comprehensive within these topic areas
        - Treat them as emerging adults while providing guidance
        - Provide practical, real-world safety strategies
        - Include resources and next steps when appropriate
        - Use professional but friendly language

        IMPORTANT: If asked about topics outside of consent, digital abuse, reporting abuse, or emotional boundaries, politely redirect the conversation back to these four topics only. Say something like "That's a valid concern, but let's focus on consent/digital abuse/reporting abuse/emotional boundaries instead."`
      } else {
        return `You are a safety assistant, but the user's age (${age}) is outside the supported range of 5-19 years. Please ask them to verify their age or contact a parent/guardian for assistance.`
      }
    }

    // Build conversation history with system prompt
    const history = [
      {
        role: 'user' as const,
        parts: [{ text: getSystemPrompt(userAge) }]
      },
      {
        role: 'model' as const,
        parts: [{ text: 'I understand. I\'ll provide age-appropriate safety guidance focused on the specific topics for your age group. What would you like to know about staying safe?' }]
      },
      ...conversationHistory
    ]

    // Start chat with history
    const chat = model.startChat({ history })

    // Send message and get response
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return new Response(
      JSON.stringify({ 
        response: text,
        conversationHistory: [
          ...history.slice(2), // Remove system prompt from returned history
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text }] }
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in gemini-chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat message',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})