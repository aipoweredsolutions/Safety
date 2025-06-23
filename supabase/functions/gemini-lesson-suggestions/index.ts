import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SuggestionsRequest {
  ageGroup: '5-10' | '11-15' | '16-19'
  completedTopics: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ageGroup, completedTopics }: SuggestionsRequest = await req.json()

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create age-appropriate suggestions prompt
    const getPrompt = (ageGroup: string, completedTopics: string[]) => {
      const basePrompt = `Generate 8-10 safety lesson topic suggestions for children aged ${ageGroup}. 

REQUIREMENTS:
- Topics should be age-appropriate for ${ageGroup} year olds
- Avoid topics already covered: ${completedTopics.join(', ')}
- Focus on practical, relevant safety skills
- Include a mix of online, physical, social, emotional, and emergency safety topics

RESPONSE FORMAT:
Return a JSON array of topic strings, like:
["Topic 1", "Topic 2", "Topic 3", ...]

EXAMPLE TOPICS BY AGE GROUP:`

      if (ageGroup === '5-10') {
        return basePrompt + `
- "Recognizing Safe vs Unsafe Situations"
- "What to Do When Lost in a Store"
- "Understanding Body Boundaries"
- "Identifying Trusted Adults"
- "Basic Internet Safety Rules"
- "Fire Safety at Home"
- "Saying No When Uncomfortable"
- "Emergency Phone Numbers"`
      } else if (ageGroup === '11-15') {
        return basePrompt + `
- "Handling Cyberbullying Situations"
- "Recognizing Peer Pressure Tactics"
- "Social Media Privacy Settings"
- "Building Self-Confidence"
- "Dealing with Toxic Friendships"
- "Understanding Consent Basics"
- "Online Gaming Safety"
- "Recognizing Manipulation"`
      } else {
        return basePrompt + `
- "Healthy vs Unhealthy Relationships"
- "Digital Privacy and Data Protection"
- "Recognizing Emotional Abuse"
- "Supporting Friends in Crisis"
- "Understanding Consent in All Contexts"
- "Workplace Safety and Harassment"
- "Financial Safety and Scams"
- "Reporting Abuse Safely"`
      }
    }

    const prompt = getPrompt(ageGroup, completedTopics)

    console.log(`💡 Generating lesson suggestions for age group: ${ageGroup}`)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    let suggestions
    try {
      // Extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON array found in response')
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      throw new Error('Failed to parse suggestions from AI response')
    }

    // Validate the response
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('Invalid suggestions format received from AI')
    }

    console.log(`✅ Generated ${suggestions.length} lesson suggestions`)

    return new Response(
      JSON.stringify(suggestions),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in gemini-lesson-suggestions function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate lesson suggestions',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})