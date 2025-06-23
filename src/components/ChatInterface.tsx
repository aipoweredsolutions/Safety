import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Shield, Lightbulb, Loader2, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { ChatMessage, SafetyCategory } from '../types';
import { geminiService } from '../services/geminiService';
import { elevenLabsService } from '../services/elevenLabsService';

interface ChatInterfaceProps {
  userAge: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userAge }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: getWelcomeMessage(userAge),
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get age-appropriate welcome message
  function getWelcomeMessage(age: number): string {
    if (age >= 5 && age <= 8) {
      return "Hi there! I'm your safety helper! 🛡️ I can help you learn about staying safe with strangers, good and bad touches, saying no when you feel uncomfortable, and finding safe adults to talk to. What would you like to know about?";
    } else if (age >= 9 && age <= 12) {
      return "Hello! I'm your safety assistant! 🌟 I'm here to help you learn about bullying, staying safe online, body boundaries, and what to do in emergencies. What safety topic would you like to explore today?";
    } else if (age >= 13 && age <= 15) {
      return "Hey! I'm your safety guide! 💪 I can help you navigate peer pressure, recognize toxic friendships, build confidence, and develop your self-worth. What's on your mind today?";
    } else if (age >= 16 && age <= 19) {
      return "Hi! I'm your safety advisor! 🎯 I'm here to discuss consent, digital abuse, reporting abuse, and setting emotional boundaries. What would you like to talk about?";
    } else {
      return "Hi! I'm your AI safety assistant. I'm here to help you learn about staying safe. What would you like to know about today?";
    }
  }

  // Get age-appropriate header info
  function getHeaderInfo(age: number) {
    if (age >= 5 && age <= 8) {
      return {
        title: "Safety Helper",
        subtitle: "Ask me about staying safe!"
      };
    } else if (age >= 9 && age <= 12) {
      return {
        title: "Safety Assistant",
        subtitle: "Learn about bullying, online safety & more"
      };
    } else if (age >= 13 && age <= 15) {
      return {
        title: "Safety Guide",
        subtitle: "Navigate friendships, confidence & self-worth"
      };
    } else if (age >= 16 && age <= 19) {
      return {
        title: "Safety Advisor",
        subtitle: "Discuss consent, boundaries & reporting"
      };
    } else {
      return {
        title: "Safety Assistant",
        subtitle: "Ask me anything about staying safe"
      };
    }
  }

  // Get age-appropriate quick questions
  function getQuickQuestions(age: number): string[] {
    if (age >= 5 && age <= 8) {
      return [
        "What should I do if a stranger talks to me?",
        "What are good touches and bad touches?",
        "When is it okay to say no?",
        "Who are my safe adults?"
      ];
    } else if (age >= 9 && age <= 12) {
      return [
        "How do I deal with bullying?",
        "How do I stay safe online?",
        "What are body boundaries?",
        "What should I do in an emergency?"
      ];
    } else if (age >= 13 && age <= 15) {
      return [
        "How do I handle peer pressure?",
        "What makes a friendship toxic?",
        "How can I build more confidence?",
        "How do I improve my self-worth?"
      ];
    } else if (age >= 16 && age <= 19) {
      return [
        "What does consent really mean?",
        "How do I recognize digital abuse?",
        "How do I report abuse safely?",
        "How do I set emotional boundaries?"
      ];
    } else {
      return [
        "How do I stay safe online?",
        "What should I do if someone is bullying me?",
        "How do I create a strong password?",
        "What if a stranger approaches me?"
      ];
    }
  }

  // Get age-appropriate placeholder text
  function getPlaceholderText(age: number): string {
    if (age >= 5 && age <= 8) {
      return "Ask me about staying safe...";
    } else if (age >= 9 && age <= 12) {
      return "Ask about bullying, online safety, or emergencies...";
    } else if (age >= 13 && age <= 15) {
      return "Ask about friendships, confidence, or peer pressure...";
    } else if (age >= 16 && age <= 19) {
      return "Ask about consent, boundaries, or reporting...";
    } else {
      return "Ask me about staying safe...";
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate audio for AI messages
  const generateAudio = async (messageId: string, text: string) => {
    if (!audioEnabled || isGeneratingAudio === messageId) return;

    setIsGeneratingAudio(messageId);
    try {
      const audioBlob = await elevenLabsService.generateSpeech(text, userAge);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setAudioElements(prev => new Map(prev.set(messageId, audio)));
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGeneratingAudio(null);
    }
  };

  // Play/pause audio
  const toggleAudio = (messageId: string) => {
    const audio = audioElements.get(messageId);
    if (!audio) return;

    if (playingAudio === messageId) {
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
      setPlayingAudio(messageId);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await geminiService.sendChatMessage(
        currentInput,
        userAge,
        conversationHistory
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(response.conversationHistory);

      // Generate audio for AI response if enabled
      if (audioEnabled) {
        setTimeout(() => {
          generateAudio(aiMessage.id, response.response);
        }, 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or if you have an emergency, contact a trusted adult immediately.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const headerInfo = getHeaderInfo(userAge);
  const quickQuestions = getQuickQuestions(userAge);
  const placeholderText = getPlaceholderText(userAge);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{headerInfo.title}</h3>
              <p className="text-sm text-gray-600">{headerInfo.subtitle}</p>
            </div>
          </div>
          
          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              audioEnabled 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={audioEnabled ? 'Disable voice responses' : 'Enable voice responses'}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {/* Audio controls for AI messages */}
                  {message.sender === 'ai' && audioEnabled && (
                    <div className="flex items-center space-x-1 ml-2">
                      {isGeneratingAudio === message.id ? (
                        <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                      ) : audioElements.has(message.id) ? (
                        <button
                          onClick={() => toggleAudio(message.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title={playingAudio === message.id ? 'Pause' : 'Play'}
                        >
                          {playingAudio === message.id ? (
                            <Pause className="w-3 h-3 text-gray-600" />
                          ) : (
                            <Play className="w-3 h-3 text-gray-600" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => generateAudio(message.id, message.content)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Generate audio"
                        >
                          <Volume2 className="w-3 h-3 text-gray-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-1" />
            {userAge >= 5 && userAge <= 8 ? "Try asking about:" :
             userAge >= 9 && userAge <= 12 ? "Quick questions to get started:" :
             userAge >= 13 && userAge <= 15 ? "Popular topics to explore:" :
             "Common questions:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholderText}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Audio status indicator */}
        {audioEnabled && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              <Volume2 className="w-3 h-3" />
              <span>Voice responses enabled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;