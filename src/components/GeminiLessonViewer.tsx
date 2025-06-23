import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Loader2, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { AuthUser } from '../services/authService';
import { Lesson } from '../types';

interface GeminiLessonViewerProps {
  lesson: Lesson;
  audio: Map<string, Blob>;
  user: AuthUser;
  onBack: () => void;
  onComplete: () => void;
}

const GeminiLessonViewer: React.FC<GeminiLessonViewerProps> = ({
  lesson,
  audio,
  user,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [scenarioAnswers, setScenarioAnswers] = useState<{ [key: string]: number }>({});

  const steps = ['introduction', 'keyPoints', 'scenarios', 'quiz', 'completion'];

  // Initialize audio elements
  useEffect(() => {
    const newAudioElements = new Map<string, HTMLAudioElement>();
    
    audio.forEach((audioBlob, key) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      audioElement.onended = () => {
        setPlayingAudio(null);
      };
      
      audioElement.onerror = () => {
        console.error(`Audio error for ${key}`);
        setPlayingAudio(null);
      };
      
      newAudioElements.set(key, audioElement);
    });
    
    setAudioElements(newAudioElements);

    // Cleanup function
    return () => {
      newAudioElements.forEach((audio, key) => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      });
    };
  }, [audio]);

  // Auto-play audio when step changes (if enabled)
  useEffect(() => {
    if (audioEnabled && audioElements.size > 0) {
      const stepAudioKey = getStepAudioKey(currentStep);
      if (stepAudioKey && audioElements.has(stepAudioKey)) {
        setTimeout(() => {
          playAudio(stepAudioKey);
        }, 500);
      }
    }
  }, [currentStep, audioEnabled, audioElements]);

  const getStepAudioKey = (step: number): string | null => {
    switch (steps[step]) {
      case 'introduction':
        return 'introduction';
      case 'keyPoints':
        return 'keyPoints';
      case 'scenarios':
        return 'tips'; // Play tips audio during scenarios
      case 'quiz':
        return null; // Quiz questions have individual audio
      default:
        return null;
    }
  };

  const playAudio = (audioKey: string) => {
    const audioElement = audioElements.get(audioKey);
    if (!audioElement) return;

    // Stop any currently playing audio
    if (playingAudio) {
      const currentAudio = audioElements.get(playingAudio);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    audioElement.play();
    setPlayingAudio(audioKey);
  };

  const toggleAudio = (audioKey: string) => {
    const audioElement = audioElements.get(audioKey);
    if (!audioElement) return;

    if (playingAudio === audioKey) {
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      playAudio(audioKey);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
  };

  const handleScenarioAnswer = (scenarioIndex: number, answerIndex: number) => {
    setScenarioAnswers(prev => ({
      ...prev,
      [scenarioIndex]: answerIndex
    }));
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateQuizScore = () => {
    let correct = 0;
    lesson.quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{lesson.description}</p>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-1" />
                AI-Generated Lesson
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Introduction</h3>
                {audioEnabled && (
                  <button
                    onClick={() => toggleAudio('introduction')}
                    className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                    title={playingAudio === 'introduction' ? 'Pause' : 'Play introduction'}
                  >
                    {playingAudio === 'introduction' ? (
                      <Pause className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Play className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-blue-700 leading-relaxed">{lesson.content.introduction}</p>
            </div>
          </div>
        );

      case 'keyPoints':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Learning Points</h2>
              {audioEnabled && (
                <button
                  onClick={() => toggleAudio('keyPoints')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {playingAudio === 'keyPoints' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span>{playingAudio === 'keyPoints' ? 'Pause Audio' : 'Play Audio'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.content.keyPoints.map((point, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'scenarios':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Practice Scenarios</h2>
              <p className="text-gray-600">Test your understanding with these real-world situations</p>
            </div>

            <div className="space-y-6">
              {lesson.content.scenarios.map((scenario, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Scenario {index + 1}
                    </h3>
                    {audioEnabled && (
                      <button
                        onClick={() => toggleAudio(`scenario-${index}`)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Play scenario audio"
                      >
                        {playingAudio === `scenario-${index}` ? (
                          <Pause className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Play className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{scenario.situation}</p>
                  
                  <div className="space-y-3">
                    {scenario.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleScenarioAnswer(index, optionIndex)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          scenarioAnswers[index] === optionIndex
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 border-2 rounded-full mr-3 ${
                            scenarioAnswers[index] === optionIndex
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {scenarioAnswers[index] === optionIndex && (
                              <div className="w-3 h-3 bg-white rounded-full m-0.5" />
                            )}
                          </div>
                          {option}
                        </div>
                      </button>
                    ))}
                  </div>

                  {scenarioAnswers[index] !== undefined && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      scenarioAnswers[index] === scenario.correctAnswer
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-orange-50 border border-orange-200'
                    }`}>
                      <div className="flex items-start">
                        {scenarioAnswers[index] === scenario.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            scenarioAnswers[index] === scenario.correctAnswer
                              ? 'text-green-800'
                              : 'text-orange-800'
                          }`}>
                            {scenarioAnswers[index] === scenario.correctAnswer ? 'Correct!' : 'Not quite right'}
                          </p>
                          <p className={`text-sm mt-1 ${
                            scenarioAnswers[index] === scenario.correctAnswer
                              ? 'text-green-700'
                              : 'text-orange-700'
                          }`}>
                            {scenario.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-yellow-800">Safety Tips</h3>
                {audioEnabled && (
                  <button
                    onClick={() => toggleAudio('tips')}
                    className="p-2 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    {playingAudio === 'tips' ? (
                      <Pause className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <Play className="w-5 h-5 text-yellow-600" />
                    )}
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {lesson.content.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-yellow-700">
                    <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-white text-xs">💡</span>
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Check</h2>
              <p className="text-gray-600">Test what you've learned with this quiz</p>
            </div>

            <div className="space-y-6">
              {lesson.quiz.questions.map((question, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Question {index + 1}
                    </h3>
                    {audioEnabled && (
                      <button
                        onClick={() => toggleAudio(`question-${index}`)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {playingAudio === `question-${index}` ? (
                          <Pause className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Play className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{question.question}</p>
                  
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleQuizAnswer(index, optionIndex)}
                        disabled={showQuizResults}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          showQuizResults
                            ? optionIndex === question.correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : quizAnswers[index] === optionIndex && optionIndex !== question.correctAnswer
                              ? 'border-red-500 bg-red-50 text-red-800'
                              : 'border-gray-200 bg-gray-50 text-gray-600'
                            : quizAnswers[index] === optionIndex
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 border-2 rounded-full mr-3 ${
                            showQuizResults
                              ? optionIndex === question.correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : quizAnswers[index] === optionIndex && optionIndex !== question.correctAnswer
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300'
                              : quizAnswers[index] === optionIndex
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {((showQuizResults && optionIndex === question.correctAnswer) ||
                              (!showQuizResults && quizAnswers[index] === optionIndex)) && (
                              <div className="w-3 h-3 bg-white rounded-full m-0.5" />
                            )}
                          </div>
                          {option}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showQuizResults && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showQuizResults && Object.keys(quizAnswers).length === lesson.quiz.questions.length && (
              <div className="text-center">
                <button
                  onClick={handleQuizSubmit}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Submit Quiz
                </button>
              </div>
            )}

            {showQuizResults && (
              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Results</h3>
                <p className="text-lg text-gray-600 mb-4">
                  You scored {calculateQuizScore()} out of {lesson.quiz.questions.length}
                </p>
                <div className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${
                  calculateQuizScore() === lesson.quiz.questions.length
                    ? 'bg-green-100 text-green-800'
                    : calculateQuizScore() >= lesson.quiz.questions.length * 0.7
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {calculateQuizScore() === lesson.quiz.questions.length
                    ? '🎉 Perfect Score!'
                    : calculateQuizScore() >= lesson.quiz.questions.length * 0.7
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
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Lesson Complete! 🎉</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                You've successfully completed "{lesson.title}". This AI-generated lesson was created specifically for your learning needs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">What you accomplished:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">AI-Generated Content</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Voice Narration</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Interactive Learning</p>
                </div>
              </div>
            </div>

            <button
              onClick={onComplete}
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
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to AI Lessons</span>
            </button>
            
            <div className="flex items-center space-x-4">
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
              
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>
          
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
                (steps[currentStep] === 'quiz' && !showQuizResults)
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

export default GeminiLessonViewer;