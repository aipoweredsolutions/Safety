import React from 'react';
import { User, School, Briefcase } from 'lucide-react';
import { AgeGroup } from '../types';

interface AgeSelectorProps {
  onSelectAge: (ageGroup: AgeGroup) => void;
}

const AgeSelector: React.FC<AgeSelectorProps> = ({ onSelectAge }) => {
  const ageGroups = [
    {
      group: '5-9' as AgeGroup,
      title: 'Young Learners',
      description: 'Build foundational safety awareness and recognize danger',
      icon: User,
      color: 'from-pink-400 to-purple-400',
      keyTopics: [
        'Safe vs unsafe behavior',
        'Stranger danger',
        'Good touch vs bad touch',
        'Trusted adults and help'
      ]
    },
    {
      group: '10-14' as AgeGroup,
      title: 'Teen Guardians', 
      description: 'Strengthen boundaries and understand peer influence',
      icon: School,
      color: 'from-blue-400 to-cyan-400',
      keyTopics: [
        'Types of bullying',
        'Online safety basics',
        'Personal boundaries',
        'Peer pressure decisions'
      ]
    },
    {
      group: '15-19' as AgeGroup,
      title: 'Young Adults',
      description: 'Navigate relationships with maturity and independence',
      icon: Briefcase,
      color: 'from-green-400 to-teal-400',
      keyTopics: [
        'Healthy relationships',
        'Understanding consent',
        'Digital exploitation',
        'Recognizing manipulation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to SafetyLearn
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your age group to start your personalized safety learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ageGroups.map(({ group, title, description, icon: Icon, color, keyTopics }) => (
            <button
              key={group}
              onClick={() => onSelectAge(group)}
              className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-lg text-gray-600 mb-4">{description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Learning Topics:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {keyTopics.map((topic, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  Ages {group}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Your safety and privacy are our top priorities. All learning is personalized and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeSelector;