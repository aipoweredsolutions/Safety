import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface LessonRequest {
  topic: string
  ageGroup: '5-10' | '11-15' | '16-19'
  category: 'online' | 'physical' | 'social' | 'emotional' | 'emergency'
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, ageGroup, category, difficulty, duration }: LessonRequest = await req.json()

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create age-appropriate lesson generation prompt
    const getPrompt = (ageGroup: string, topic: string, category: string, difficulty: string, duration: number) => {
      const basePrompt = `Create a comprehensive safety lesson about "${topic}" for children aged ${ageGroup}. 

LESSON REQUIREMENTS:
- Duration: ${duration} minutes
- Difficulty: ${difficulty}
- Category: ${category}
- Age-appropriate language and concepts for ${ageGroup} year olds

RESPONSE FORMAT (JSON):
{
  "title": "Engaging lesson title",
  "description": "Brief description of what students will learn",
  "introduction": "Age-appropriate introduction paragraph explaining the topic",
  "keyPoints": [
    "4-6 key learning points as bullet points",
    "Each point should be clear and actionable",
    "Use age-appropriate language"
  ],
  "scenarios": [
    {
      "situation": "Real-world scenario description",
      "options": ["Option 1", "Option 2", "Option 3"],
      "correctAnswer": 1,
      "explanation": "Why this is the correct choice"
    }
  ],
  "tips": [
    "3-5 practical safety tips",
    "Easy to remember and apply"
  ],
  "quiz": {
    "questions": [
      {
        "question": "Quiz question text",
        "options": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        "correctAnswer": 0,
        "explanation": "Detailed explanation of the correct answer"
      }
    ]
  }
}`

      // Add age-specific guidance
      if (ageGroup === '5-10') {
        return basePrompt + `

AGE-SPECIFIC GUIDELINES (5-10 years):
- Use simple, clear language
- Include 2-3 scenarios and 3-4 quiz questions
- Focus on basic safety concepts
- Emphasize telling trusted adults
- Use encouraging, non-scary language
- Include concrete, specific examples
- Avoid complex psychological concepts`
      } else if (ageGroup === '11-15') {
        return basePrompt + `

AGE-SPECIFIC GUIDELINES (11-15 years):
- Use more sophisticated vocabulary
- Include 3-4 scenarios and 4-5 quiz questions
- Address peer pressure and social dynamics
- Include online safety concepts
- Discuss building confidence and self-esteem
- Address bullying and friendship issues
- Include practical decision-making strategies`
      } else {
        return basePrompt + `

AGE-SPECIFIC GUIDELINES (16-19 years):
- Use mature, respectful language
- Include 4-5 scenarios and 5-6 quiz questions
- Address relationship dynamics and consent
- Include digital safety and privacy
- Discuss recognizing manipulation and abuse
- Address supporting friends and reporting
- Include complex emotional and social concepts
- Focus on independence and adult decision-making`
      }
    }

    const prompt = getPrompt(ageGroup, topic, category, difficulty, duration)

    console.log(`🤖 Generating lesson for topic: ${topic}, age: ${ageGroup}`)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    let lessonData
    try {
      // Extract JSON from the response (remove any markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        lessonData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      throw new Error('Failed to parse lesson data from AI response')
    }

    // Validate the response structure
    if (!lessonData.title || !lessonData.keyPoints || !lessonData.scenarios || !lessonData.quiz) {
      throw new Error('Invalid lesson structure received from AI')
    }

    console.log(`✅ Generated lesson: ${lessonData.title}`)

    return new Response(
      JSON.stringify(lessonData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in gemini-lesson-generator function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate lesson',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})