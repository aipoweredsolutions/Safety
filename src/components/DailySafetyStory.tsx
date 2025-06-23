import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, Lightbulb, Calendar, RefreshCw, Loader2 } from 'lucide-react';
import { DailyStory, StoryScenario, AgeGroup } from '../types';
import { lessonService } from '../services/lessonService';

interface DailySafetyStoryProps {
  userAge: number;
  ageGroup: AgeGroup;
}

interface ScenarioResult {
  scenarioId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  showResult: boolean;
}

const DailySafetyStory: React.FC<DailySafetyStoryProps> = ({ userAge, ageGroup }) => {
  const [todaysStory, setTodaysStory] = useState<DailyStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scenarioResults, setScenarioResults] = useState<{ [key: string]: ScenarioResult }>({});
  const [storyCompleted, setStoryCompleted] = useState(false);

  // Get today's date as a string for consistent daily story selection
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  };

  // Load daily stories and select today's story
  useEffect(() => {
    const loadTodaysStory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📖 Loading daily stories for age group:', ageGroup);
        
        const todayString = getTodayString();
        const storageKey = `daily-story-${todayString}`;
        const storedStoryId = localStorage.getItem(storageKey);

        // Fetch stories for user's age group
        const ageAppropriateStories = await lessonService.getDailyStoriesByAgeGroup(ageGroup);

        if (ageAppropriateStories.length === 0) {
          console.warn(`No stories found for age group: ${ageGroup}`);
          setError('No stories available for your age group');
          return;
        }

        let selectedStory: DailyStory;

        if (storedStoryId) {
          // Use stored story if it exists and is valid
          const stored = ageAppropriateStories.find(story => story.id === storedStoryId);
          if (stored) {
            selectedStory = stored;
          } else {
            // Fallback if stored story is no longer valid
            selectedStory = selectDailyStory(ageAppropriateStories, todayString);
          }
        } else {
          // Select new story for today
          selectedStory = selectDailyStory(ageAppropriateStories, todayString);
        }

        // Load the complete story with scenarios
        const completeStory = await lessonService.getDailyStoryById(selectedStory.id);
        if (!completeStory) {
          setError('Failed to load story details');
          return;
        }

        setTodaysStory(completeStory);
        localStorage.setItem(storageKey, completeStory.id);

        // Check if story was already completed today
        const completionKey = `daily-story-completed-${todayString}`;
        const wasCompleted = localStorage.getItem(completionKey) === 'true';
        setStoryCompleted(wasCompleted);

        // Load saved progress for today's story
        const progressKey = `daily-story-progress-${todayString}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            setScenarioResults(progress.scenarioResults || {});
            setCurrentScenario(progress.currentScenario || 0);
          } catch (error) {
            console.error('Error loading story progress:', error);
          }
        }

        console.log(`✅ Loaded daily story: ${completeStory.title}`);
      } catch (err) {
        console.error('❌ Error loading daily story:', err);
        setError('Failed to load daily story. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTodaysStory();
  }, [ageGroup]);

  // Deterministic story selection based on date
  const selectDailyStory = (stories: DailyStory[], dateString: string): DailyStory => {
    // Create a simple hash from the date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get a valid index
    const index = Math.abs(hash) % stories.length;
    return stories[index];
  };

  // Save progress to localStorage
  const saveProgress = (results: { [key: string]: ScenarioResult }, scenario: number) => {
    const todayString = getTodayString();
    const progressKey = `daily-story-progress-${todayString}`;
    const progress = {
      scenarioResults: results,
      currentScenario: scenario
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  };

  // Handle scenario answer selection
  const handleAnswerSelect = (scenarioId: string, answerIndex: number, scenario: StoryScenario) => {
    const isCorrect = answerIndex === scenario.correctAnswer;
    const newResult: ScenarioResult = {
      scenarioId,
      selectedAnswer: answerIndex,
      isCorrect,
      showResult: true
    };

    const newResults = {
      ...scenarioResults,
      [scenarioId]: newResult
    };

    setScenarioResults(newResults);
    saveProgress(newResults, currentScenario);
  };

  // Move to next scenario
  const handleNextScenario = () => {
    if (todaysStory && currentScenario < todaysStory.scenarios.length - 1) {
      const nextScenario = currentScenario + 1;
      setCurrentScenario(nextScenario);
      saveProgress(scenarioResults, nextScenario);
    } else {
      // Story completed
      setStoryCompleted(true);
      const todayString = getTodayString();
      const completionKey = `daily-story-completed-${todayString}`;
      localStorage.setItem(completionKey, 'true');
    }
  };

  // Reset story for new attempt (for testing purposes)
  const resetStory = () => {
    setCurrentScenario(0);
    setScenarioResults({});
    setStoryCompleted(false);
    const todayString = getTodayString();
    localStorage.removeItem(`daily-story-progress-${todayString}`);
    localStorage.removeItem(`daily-story-completed-${todayString}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading today's safety story...</p>
        </div>
      </div>
    );
  }

  if (error || !todaysStory) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Story</h3>
          <p className="text-red-500 mb-4">{error || 'Story not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentScenarioData = todaysStory.scenarios[currentScenario];
  const scenarioResult = scenarioResults[currentScenarioData?.id];

  // Get age-appropriate styling and messaging
  const getAgeAppropriateStyle = () => {
    if (userAge >= 5 && userAge <= 10) {
      return {
        gradient: 'from-pink-400 to-purple-400',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-800',
        borderColor: 'border-pink-200'
      };
    } else if (userAge >= 11 && userAge <= 15) {
      return {
        gradient: 'from-blue-400 to-cyan-400',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200'
      };
    } else {
      return {
        gradient: 'from-green-400 to-teal-400',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    }
  };

  const style = getAgeAppropriateStyle();

  if (storyCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${style.gradient} rounded-full flex items-center justify-center mx-auto`}>
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Story Complete! 🎉</h3>
            <p className="text-gray-600 mb-4">
              You've finished today's safety story: "{todaysStory.title}"
            </p>
          </div>

          <div className={`${style.bgColor} ${style.borderColor} border rounded-xl p-4`}>
            <div className="flex items-start space-x-3">
              <Lightbulb className={`w-5 h-5 ${style.textColor} mt-0.5 flex-shrink-0`} />
              <div>
                <h4 className={`font-semibold ${style.textColor} mb-1`}>Today's Safety Lesson:</h4>
                <p className={`text-sm ${style.textColor}`}>{todaysStory.moralLesson}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Come back tomorrow for a new story!</span>
            </div>
            <button
              onClick={resetStory}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
              title="Reset story (for testing)"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${style.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Today's Safety Story</h3>
            <p className="text-white/90 text-sm">{todaysStory.title}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Scenario</div>
            <div className="text-lg font-bold">
              {currentScenario + 1} of {todaysStory.scenarios.length}
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="p-6">
        {/* Story Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{todaysStory.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentScenario + (scenarioResult?.showResult ? 1 : 0)) / todaysStory.scenarios.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${style.gradient} h-2 rounded-full transition-all duration-500`}
              style={{ 
                width: `${((currentScenario + (scenarioResult?.showResult ? 1 : 0)) / todaysStory.scenarios.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Current Scenario */}
        {currentScenarioData && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Scenario {currentScenario + 1}:</h4>
              <p className="text-gray-700 leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">What should they do?</h5>
              {currentScenarioData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentScenarioData.id, index, currentScenarioData)}
                  disabled={scenarioResult?.showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    scenarioResult?.showResult
                      ? index === currentScenarioData.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : index === scenarioResult.selectedAnswer && !scenarioResult.isCorrect
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                      : scenarioResult?.selectedAnswer === index
                      ? `border-blue-500 ${style.bgColor} ${style.textColor}`
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  } ${scenarioResult?.showResult ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0 ${
                      scenarioResult?.showResult
                        ? index === currentScenarioData.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : index === scenarioResult.selectedAnswer && !scenarioResult.isCorrect
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        : scenarioResult?.selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {((scenarioResult?.showResult && index === currentScenarioData.correctAnswer) ||
                        (!scenarioResult?.showResult && scenarioResult?.selectedAnswer === index)) && (
                        <div className="w-3 h-3 bg-white rounded-full m-0.5" />
                      )}
                      {scenarioResult?.showResult && index === scenarioResult.selectedAnswer && !scenarioResult.isCorrect && (
                        <XCircle className="w-3 h-3 text-white m-0.5" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Result Explanation */}
            {scenarioResult?.showResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                scenarioResult.isCorrect
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {scenarioResult.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium mb-1 ${
                      scenarioResult.isCorrect ? 'text-green-800' : 'text-orange-800'
                    }`}>
                      {currentScenarioData.encouragement}
                    </p>
                    <p className={`text-sm ${
                      scenarioResult.isCorrect ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {currentScenarioData.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {scenarioResult?.showResult && (
              <div className="text-center pt-4">
                <button
                  onClick={handleNextScenario}
                  className={`px-6 py-3 bg-gradient-to-r ${style.gradient} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  {currentScenario < todaysStory.scenarios.length - 1 ? 'Next Scenario' : 'Complete Story'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySafetyStory;