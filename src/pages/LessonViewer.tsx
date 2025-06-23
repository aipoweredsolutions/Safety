import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, BookOpen, Clock, Users, Loader2, Volume2, VolumeX, Play, Pause, AlertTriangle, SkipForward } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthUser } from '../services/authService';
import { Lesson } from '../types';
import { lessonService } from '../services/lessonService';
import { geminiService } from '../services/geminiService';
import { elevenLabsService } from '../services/elevenLabsService';

interface LessonViewerProps {
  user: AuthUser;
  onCompleteLesson: (lessonId: string) => void;
}

interface QuizResult {
  questionId: string;
  explanation: string;
  isCorrect: boolean;
  encouragement: string;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ user, onCompleteLesson }) => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{ [key: string]: QuizResult }>({});
  const [loadingExplanations, setLoadingExplanations] = useState(false);
  const [contentValidation, setContentValidation] = useState<{
    hasKeyPoints: boolean;
    hasScenarios: boolean;
    hasQuiz: boolean;
    keyPointsCount: number;
    scenariosCount: number;
    quizCount: number;
  } | null>(null);
  
  // Enhanced voice functionality states
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  // Load lesson data
  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) {
        navigate('/app/lessons');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`📖 Loading lesson: ${lessonId}`);
        
        // Validate lesson content first
        const validation = await lessonService.validateLessonContent(lessonId);
        setContentValidation(validation);
        
        const lessonData = await lessonService.getLessonById(lessonId);
        
        if (!lessonData) {
          setError('Lesson not found');
          return;
        }
        
        setLesson(lessonData);
        console.log(`✅ Lesson loaded: ${lessonData.title}`);
        
        // Log content validation
        if (!validation.hasKeyPoints) {
          console.warn(`⚠️ Lesson ${lessonId} has no key points (${validation.keyPointsCount})`);
        }
        if (!validation.hasScenarios) {
          console.warn(`⚠️ Lesson ${lessonId} has no practice scenarios (${validation.scenariosCount})`);
        }
        if (!validation.hasQuiz) {
          console.warn(`⚠️ Lesson ${lessonId} has no quiz questions (${validation.quizCount})`);
        }
        
      } catch (err) {
        console.error('❌ Error loading lesson:', err);
        setError('Failed to load lesson. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate]);

  // Auto-play audio when step changes
  useEffect(() => {
    if (audioEnabled && autoPlay && lesson) {
      const stepAudioKeys = getStepAudioKeys(currentStep);
      if (stepAudioKeys.length > 0) {
        setAudioQueue(stepAudioKeys);
        setCurrentAudioIndex(0);
        setTimeout(() => {
          playAudioSequence(stepAudioKeys);
        }, 1000);
      }
    }
  }, [currentStep, audioEnabled, autoPlay, lesson]);

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      audioElements.forEach(audio => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      });
    };
  }, [audioElements]);

  // Get audio keys for current step
  const getStepAudioKeys = (step: number): string[] => {
    if (!lesson) return [];
    
    switch (steps[step]) {
      case 'introduction':
        return ['lesson-intro'];
      case 'content':
        return ['content-intro', 'key-points', 'tips'];
      case 'scenarios':
        const scenarioKeys = lesson.content.scenarios.map((_, index) => `scenario-${index}`);
        return ['scenarios-intro', ...scenarioKeys];
      case 'quiz':
        return ['quiz-intro'];
      case 'completion':
        return ['completion'];
      default:
        return [];
    }
  };

  // Play audio sequence
  const playAudioSequence = async (audioKeys: string[]) => {
    for (let i = 0; i < audioKeys.length; i++) {
      const audioKey = audioKeys[i];
      const text = getTextForAudioKey(audioKey);
      
      if (text) {
        try {
          await generateAndPlayAudio(audioKey, text);
          // Wait for audio to finish before playing next
          await waitForAudioToFinish(audioKey);
        } catch (error) {
          console.error(`Error playing audio for ${audioKey}:`, error);
        }
      }
    }
  };

  // Wait for audio to finish playing
  const waitForAudioToFinish = (audioKey: string): Promise<void> => {
    return new Promise((resolve) => {
      const audio = audioElements.get(audioKey);
      if (!audio) {
        resolve();
        return;
      }

      const handleEnded = () => {
        audio.removeEventListener('ended', handleEnded);
        resolve();
      };

      if (audio.ended || audio.paused) {
        resolve();
      } else {
        audio.addEventListener('ended', handleEnded);
      }
    });
  };

  // Get text content for audio key
  const getTextForAudioKey = (audioKey: string): string => {
    if (!lesson) return '';

    switch (audioKey) {
      case 'lesson-intro':
        return `Welcome to ${lesson.title}. ${lesson.description}. ${lesson.content.introduction}`;
      case 'content-intro':
        return 'Now let\'s explore the key concepts you\'ll learn in this lesson.';
      case 'key-points':
        return `Here are the key points to remember: ${lesson.content.keyPoints.join('. ')}.`;
      case 'tips':
        return `Important safety tips: ${lesson.content.tips.join('. ')}.`;
      case 'scenarios-intro':
        return 'Let\'s practice what you\'ve learned with some real-world scenarios.';
      case 'quiz-intro':
        return 'Now it\'s time to test your knowledge with a quiz.';
      case 'completion':
        return `Congratulations! You\'ve successfully completed ${lesson.title}. You\'re now better equipped to stay safe in this area.`;
      default:
        if (audioKey.startsWith('scenario-')) {
          const index = parseInt(audioKey.split('-')[1]);
          const scenario = lesson.content.scenarios[index];
          if (scenario) {
            return `Scenario ${index + 1}: ${scenario.situation}. The options are: ${scenario.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ')}.`;
          }
        } else if (audioKey.startsWith('question-')) {
          const index = parseInt(audioKey.split('-')[1]);
          const question = lesson.quiz.questions[index];
          if (question) {
            return `Question ${index + 1}: ${question.question}. The options are: ${question.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ')}.`;
          }
        }
        return '';
    }
  };

  // Generate and play audio
  const generateAndPlayAudio = async (audioId: string, text: string) => {
    if (!audioEnabled || isGeneratingAudio === audioId) return;

    setIsGeneratingAudio(audioId);
    try {
      const audioBlob = await elevenLabsService.generateSpeech(text, user.age);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingAudio(null);
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        setPlayingAudio(null);
        URL.revokeObjectURL(audioUrl);
        setAudioElements(prev => {
          const newMap = new Map(prev);
          newMap.delete(audioId);
          return newMap;
        });
      };

      setAudioElements(prev => new Map(prev.set(audioId, audio)));
      
      // Auto-play if in sequence
      if (autoPlay) {
        audio.play();
        setPlayingAudio(audioId);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGeneratingAudio(null);
    }
  };

  // Toggle audio playback
  const toggleAudio = async (audioId: string, text?: string) => {
    const audio = audioElements.get(audioId);
    
    if (!audio && text && audioEnabled) {
      await generateAndPlayAudio(audioId, text);
      return;
    }
    
    if (!audio) return;

    if (playingAudio === audioId) {
      audio.pause();
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (playingAudio) {
        const currentAudio = audioElements.get(playingAudio);
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }
      
      audio.play();
      setPlayingAudio(audioId);
    }
  };

  // Stop all audio
  const stopAllAudio = () => {
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingAudio(null);
    setAudioQueue([]);
    setCurrentAudioIndex(0);
  };

  // Skip to next audio in sequence
  const skipToNextAudio = () => {
    if (currentAudioIndex < audioQueue.length - 1) {
      stopAllAudio();
      const nextIndex = currentAudioIndex + 1;
      setCurrentAudioIndex(nextIndex);
      const nextAudioKey = audioQueue[nextIndex];
      const text = getTextForAudioKey(nextAudioKey);
      if (text) {
        generateAndPlayAudio(nextAudioKey, text);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Lesson...</h2>
          <p className="text-gray-600">Preparing your safety lesson</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Lesson</h3>
          <p className="text-red-500 max-w-md mx-auto mb-4">{error || 'Lesson not found'}</p>
          <button
            onClick={() => navigate('/app/lessons')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    'introduction',
    'content',
    'scenarios',
    'quiz',
    'completion'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      stopAllAudio();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      stopAllAudio();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    // Generate audio feedback for the selected answer if audio is enabled
    if (audioEnabled) {
      const question = lesson.quiz.questions.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options[answerIndex];
        const feedbackText = `You selected: ${selectedOption}`;
        generateAndPlayAudio(`answer-${questionId}-${answerIndex}`, feedbackText);
      }
    }
  };

  const handleQuizSubmit = async () => {
    setLoadingExplanations(true);
    setShowResults(true);

    try {
      const results: { [key: string]: QuizResult } = {};

      // Get AI explanations for each question
      for (const question of lesson.quiz.questions) {
        if (quizAnswers[question.id] !== undefined) {
          try {
            const result = await geminiService.getQuizExplanation(
              question.question,
              quizAnswers[question.id],
              question.correctAnswer,
              question.options,
              user.age,
              lesson.title
            );

            results[question.id] = {
              questionId: question.id,
              ...result
            };
          } catch (error) {
            console.error(`Error getting explanation for question ${question.id}:`, error);
            // Fallback to original explanation
            const fallbackResult = {
              questionId: question.id,
              explanation: question.explanation,
              isCorrect: quizAnswers[question.id] === question.correctAnswer,
              encouragement: quizAnswers[question.id] === question.correctAnswer ? 
                "Great job!" : "Keep learning!"
            };
            results[question.id] = fallbackResult;
          }
        }
      }

      setQuizResults(results);

      // Generate overall quiz completion audio
      if (audioEnabled) {
        const quizScore = lesson.quiz.questions.reduce((score, question) => {
          return score + (quizAnswers[question.id] === question.correctAnswer ? 1 : 0);
        }, 0);
        
        const completionText = `Quiz completed! You scored ${quizScore} out of ${lesson.quiz.questions.length} questions correct.`;
        setTimeout(() => {
          generateAndPlayAudio('quiz-completion', completionText);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing quiz results:', error);
    } finally {
      setLoadingExplanations(false);
    }
  };

  const handleCompleteLesson = () => {
    stopAllAudio();
    onCompleteLesson(lesson.id);
    navigate('/app/lessons');
  };

  const quizScore = lesson.quiz.questions.reduce((score, question) => {
    return score + (quizAnswers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'introduction':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{lesson.description}</p>
            
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Ages {lesson.ageGroups.join(', ')}</span>
              </div>
            </div>

            {/* Audio Controls */}
            {audioEnabled && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    const text = getTextForAudioKey('lesson-intro');
                    toggleAudio('lesson-intro', text);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {isGeneratingAudio === 'lesson-intro' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : playingAudio === 'lesson-intro' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span>Play Introduction</span>
                </button>
              </div>
            )}

            {/* Content Validation Status */}
            {contentValidation && (
              <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold text-blue-800 mb-4">Lesson Content Overview:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className={`flex items-center space-x-2 ${contentValidation.hasKeyPoints ? 'text-green-700' : 'text-orange-700'}`}>
                    {contentValidation.hasKeyPoints ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{contentValidation.keyPointsCount} Key Points</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${contentValidation.hasScenarios ? 'text-green-700' : 'text-orange-700'}`}>
                    {contentValidation.hasScenarios ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{contentValidation.scenariosCount} Practice Scenarios</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${contentValidation.hasQuiz ? 'text-green-700' : 'text-orange-700'}`}>
                    {contentValidation.hasQuiz ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{contentValidation.quizCount} Quiz Questions</span>
                  </div>
                </div>
                
                {(!contentValidation.hasKeyPoints || !contentValidation.hasScenarios || !contentValidation.hasQuiz) && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> Some content may be missing from the database. 
                      The lesson will still provide valuable safety education.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Safety Concepts</h2>
              {audioEnabled && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      const text = getTextForAudioKey('content-intro');
                      toggleAudio('content-intro', text);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    {playingAudio === 'content-intro' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Play Intro</span>
                  </button>
                  <button
                    onClick={() => {
                      const text = getTextForAudioKey('key-points');
                      toggleAudio('key-points', text);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    {playingAudio === 'key-points' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Play Key Points</span>
                  </button>
                  <button
                    onClick={() => {
                      const text = getTextForAudioKey('tips');
                      toggleAudio('tips', text);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    {playingAudio === 'tips' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Play Tips</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Introduction</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{lesson.content.introduction}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Points to Remember</h3>
                
                {lesson.content.keyPoints.length > 0 ? (
                  <ul className="space-y-3">
                    {lesson.content.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-600">No key points available in the database.</p>
                    <p className="text-gray-500 text-sm mt-2">Key points would typically be loaded here.</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Safety Tips</h3>
                
                {lesson.content.tips.length > 0 ? (
                  <ul className="space-y-3">
                    {lesson.content.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                          💡
                        </span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-600">No safety tips available in the database.</p>
                    <p className="text-gray-500 text-sm mt-2">Safety tips would typically be loaded here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'scenarios':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Practice Scenarios</h2>
              <p className="text-gray-600">Let's practice what you've learned with some real-world situations</p>
              
              {audioEnabled && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      const text = getTextForAudioKey('scenarios-intro');
                      toggleAudio('scenarios-intro', text);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    {playingAudio === 'scenarios-intro' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>Play Scenarios Introduction</span>
                  </button>
                </div>
              )}
            </div>

            {lesson.content.scenarios.length > 0 ? (
              <div className="space-y-6">
                {lesson.content.scenarios.map((scenario, index) => (
                  <div key={scenario.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Scenario {index + 1}
                      </h3>
                      {audioEnabled && (
                        <button
                          onClick={() => {
                            const text = getTextForAudioKey(`scenario-${index}`);
                            toggleAudio(`scenario-${index}`, text);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Play scenario"
                        >
                          {isGeneratingAudio === `scenario-${index}` ? (
                            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                          ) : playingAudio === `scenario-${index}` ? (
                            <Pause className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Play className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{scenario.situation}</p>
                    
                    <div className="space-y-3">
                      {scenario.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          className={`w-full text-left p-4 rounded-lg border transition-colors ${
                            optionIndex === scenario.correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                          disabled
                        >
                          <div className="flex items-center">
                            {optionIndex === scenario.correctAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3" />
                            )}
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {scenario.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Practice Scenarios Available</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This lesson doesn't have practice scenarios in the database yet. 
                  Scenarios help you apply what you've learned in real-world situations.
                </p>
              </div>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Check</h2>
              <p className="text-gray-600">Test your understanding with this quiz</p>
              
              {audioEnabled && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      const text = getTextForAudioKey('quiz-intro');
                      toggleAudio('quiz-intro', text);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    {playingAudio === 'quiz-intro' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>Play Quiz Introduction</span>
                  </button>
                </div>
              )}
            </div>

            {lesson.quiz.questions.length > 0 ? (
              <div className="space-y-6">
                {lesson.quiz.questions.map((question, index) => {
                  const questionText = `Question ${index + 1}: ${question.question}. The options are: ${question.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ')}.`;
                  
                  return (
                    <div key={question.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Question {index + 1}
                        </h3>
                        
                        {/* Audio controls for question */}
                        {audioEnabled && (
                          <div className="flex items-center space-x-2">
                            {isGeneratingAudio === `question-${question.id}` ? (
                              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                            ) : audioElements.has(`question-${question.id}`) ? (
                              <button
                                onClick={() => toggleAudio(`question-${question.id}`)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title={playingAudio === `question-${question.id}` ? 'Pause question' : 'Play question'}
                              >
                                {playingAudio === `question-${question.id}` ? (
                                  <Pause className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <Play className="w-5 h-5 text-blue-600" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleAudio(`question-${question.id}`, questionText)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Play question"
                              >
                                <Volume2 className="w-5 h-5 text-gray-600" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4">{question.question}</p>
                      
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleQuizAnswer(question.id, optionIndex)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors ${
                              quizAnswers[question.id] === optionIndex
                                ? 'border-blue-500 bg-blue-50 text-blue-800'
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                            }`}
                            disabled={showResults}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 border-2 rounded-full mr-3 ${
                                quizAnswers[question.id] === optionIndex
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {quizAnswers[question.id] === optionIndex && (
                                  <div className="w-3 h-3 bg-white rounded-full m-0.5" />
                                )}
                              </div>
                              {option}
                            </div>
                          </button>
                        ))}
                      </div>

                      {showResults && quizResults[question.id] && (
                        <div className={`mt-4 p-4 rounded-lg ${
                          quizResults[question.id].isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              {quizResults[question.id].isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                              )}
                              <div>
                                <p className={`font-medium ${
                                  quizResults[question.id].isCorrect
                                    ? 'text-green-800'
                                    : 'text-red-800'
                                }`}>
                                  {quizResults[question.id].encouragement}
                                </p>
                                <p className={`text-sm mt-1 ${
                                  quizResults[question.id].isCorrect
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                }`}>
                                  {quizResults[question.id].explanation}
                                </p>
                              </div>
                            </div>
                            
                            {/* Audio controls for result */}
                            {audioEnabled && (
                              <div className="flex items-center space-x-1 ml-2">
                                {isGeneratingAudio === `result-${question.id}` ? (
                                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                                ) : audioElements.has(`result-${question.id}`) ? (
                                  <button
                                    onClick={() => toggleAudio(`result-${question.id}`)}
                                    className="p-1 rounded hover:bg-white/50 transition-colors"
                                    title={playingAudio === `result-${question.id}` ? 'Pause explanation' : 'Play explanation'}
                                  >
                                    {playingAudio === `result-${question.id}` ? (
                                      <Pause className="w-4 h-4 text-gray-600" />
                                    ) : (
                                      <Play className="w-4 h-4 text-gray-600" />
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const explanationText = `${quizResults[question.id].encouragement} ${quizResults[question.id].explanation}`;
                                      toggleAudio(`result-${question.id}`, explanationText);
                                    }}
                                    className="p-1 rounded hover:bg-white/50 transition-colors"
                                    title="Play explanation"
                                  >
                                    <Volume2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Quiz Questions Available</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This lesson doesn't have quiz questions in the database yet. 
                  Quizzes help test your understanding of the safety concepts.
                </p>
              </div>
            )}

            {lesson.quiz.questions.length > 0 && !showResults && Object.keys(quizAnswers).length === lesson.quiz.questions.length && (
              <div className="text-center">
                <button
                  onClick={handleQuizSubmit}
                  disabled={loadingExplanations}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                >
                  {loadingExplanations ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Getting AI Feedback...</span>
                    </>
                  ) : (
                    <span>Submit Quiz</span>
                  )}
                </button>
              </div>
            )}

            {showResults && !loadingExplanations && lesson.quiz.questions.length > 0 && (
              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Results</h3>
                    <p className="text-lg text-gray-600 mb-4">
                      You scored {quizScore} out of {lesson.quiz.questions.length}
                    </p>
                  </div>
                  
                  {/* Audio controls for quiz completion */}
                  {audioEnabled && (
                    <div className="flex items-center space-x-2">
                      {isGeneratingAudio === 'quiz-completion' ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : audioElements.has('quiz-completion') ? (
                        <button
                          onClick={() => toggleAudio('quiz-completion')}
                          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                          title={playingAudio === 'quiz-completion' ? 'Pause results' : 'Play results'}
                        >
                          {playingAudio === 'quiz-completion' ? (
                            <Pause className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Play className="w-5 h-5 text-blue-600" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const completionText = `Quiz completed! You scored ${quizScore} out of ${lesson.quiz.questions.length} questions correct.`;
                            toggleAudio('quiz-completion', completionText);
                          }}
                          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                          title="Play quiz results"
                        >
                          <Volume2 className="w-5 h-5 text-blue-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${
                  quizScore === lesson.quiz.questions.length
                    ? 'bg-green-100 text-green-800'
                    : quizScore >= lesson.quiz.questions.length * 0.7
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {quizScore === lesson.quiz.questions.length
                    ? '🎉 Perfect Score!'
                    : quizScore >= lesson.quiz.questions.length * 0.7
                    ? '👍 Good Job!'
                    : '💪 Keep Learning!'
                  }
                </div>
              </div>
            )}
          </div>
        );

      case 'completion':
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Congratulations! 🎉</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                You've successfully completed "{lesson.title}". You're now better equipped to stay safe in this area.
              </p>
            </div>

            {audioEnabled && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const text = getTextForAudioKey('completion');
                    toggleAudio('completion', text);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  {playingAudio === 'completion' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>Play Completion Message</span>
                </button>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">What you've accomplished:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Learned Key Concepts</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Practiced Scenarios</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">🏆</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">Earned Points</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCompleteLesson}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Continue Learning
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Progress Bar with Audio Controls */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-800">{lesson.title}</h2>
            <div className="flex items-center space-x-4">
              {/* Audio Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    audioEnabled 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={audioEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="text-sm">Voice</span>
                </button>

                {audioEnabled && (
                  <>
                    <button
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        autoPlay 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={autoPlay ? 'Disable auto-play' : 'Enable auto-play'}
                    >
                      Auto-play
                    </button>

                    {playingAudio && (
                      <>
                        <button
                          onClick={stopAllAudio}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Stop all audio"
                        >
                          <Pause className="w-4 h-4" />
                        </button>

                        {audioQueue.length > 1 && currentAudioIndex < audioQueue.length - 1 && (
                          <button
                            onClick={skipToNextAudio}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            title="Skip to next"
                          >
                            <SkipForward className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Audio Status Indicator */}
          {audioEnabled && (
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <Volume2 className="w-3 h-3" />
                <span>
                  {playingAudio ? `Playing: ${playingAudio}` : 
                   autoPlay ? 'Auto-play enabled' : 'Voice enabled'}
                </span>
                {isGeneratingAudio && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Generating...</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={
                (steps[currentStep] === 'quiz' && lesson.quiz.questions.length > 0 && !showResults)
              }
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;