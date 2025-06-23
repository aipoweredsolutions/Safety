import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface QuizRequest {
  question: string
  userAnswer: number
  correctAnswer: number
  options: string[]
  userAge: number
  lessonTitle: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      question, 
      userAnswer, 
      correctAnswer, 
      options, 
      userAge, 
      lessonTitle 
    }: QuizRequest = await req.json()

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const isCorrect = userAnswer === correctAnswer
    const userAnswerText = options[userAnswer]
    const correctAnswerText = options[correctAnswer]

    // Create age-appropriate prompt for quiz explanation
    const prompt = `
    You are providing feedback for a safety quiz question to a ${userAge}-year-old learner in the lesson "${lessonTitle}".

    Question: ${question}
    Options: ${options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}
    
    User selected: ${userAnswerText}
    Correct answer: ${correctAnswerText}
    Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}

    Please provide ${isCorrect ? 'positive reinforcement and additional context' : 'gentle correction and explanation'} that is:
    - Age-appropriate for a ${userAge}-year-old
    - Encouraging and supportive
    - Educational and helpful
    - 2-3 sentences maximum
    - Focused on the safety concept being taught

    ${isCorrect ? 
      'Since they got it right, reinforce why their answer was good and maybe add a helpful tip.' : 
      'Since they got it wrong, gently explain why the correct answer is better and help them understand the safety concept.'
    }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const explanation = response.text()

    return new Response(
      JSON.stringify({ 
        explanation,
        isCorrect,
        encouragement: isCorrect ? 
          "Great job! You're learning important safety skills." : 
          "That's okay! Learning from mistakes helps us stay safer."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in gemini-quiz function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate quiz explanation',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})