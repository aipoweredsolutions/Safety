import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Stranger Safety Basics',
    description: 'Learn how to identify and handle interactions with strangers safely',
    ageGroups: ['5-8', '9-12'],
    duration: 15,
    difficulty: 'easy',
    category: 'physical',
    content: {
      introduction: 'Not all strangers are dangerous, but it\'s important to know how to stay safe when meeting new people.',
      keyPoints: [
        'Always stay close to trusted adults in public',
        'Never accept gifts or rides from strangers',
        'Know your full name, address, and phone number',
        'Find a trusted adult if you feel unsafe'
      ],
      scenarios: [
        {
          id: 's1',
          situation: 'A stranger offers you candy at the park. What should you do?',
          options: ['Take the candy', 'Say no and find a trusted adult', 'Ask for more candy'],
          correctAnswer: 1,
          explanation: 'Always say no to strangers offering gifts and find a trusted adult immediately.'
        }
      ],
      tips: [
        'Trust your instincts - if something feels wrong, it probably is',
        'Practice the "buddy system" when going places',
        'Know safe places to go if you need help'
      ]
    },
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What should you do if a stranger asks you to help find their lost pet?',
          options: ['Help them look', 'Say no and walk away', 'Ask your friends to help too'],
          correctAnswer: 1,
          explanation: 'Adults should ask other adults for help, not children. Always say no and walk away.'
        },
        {
          id: 'q2',
          question: 'A stranger at the store says they know your mom and offers to take you to her. What do you do?',
          options: ['Go with them since they know mom', 'Ask them to prove they know your mom', 'Stay where you are and find a store employee'],
          correctAnswer: 2,
          explanation: 'Never go anywhere with someone you don\'t know, even if they claim to know your family. Find a trusted adult like a store employee.'
        },
        {
          id: 'q3',
          question: 'What information is safe to tell a stranger?',
          options: ['Your full name and address', 'Your school name and teacher', 'Nothing personal - just be polite'],
          correctAnswer: 2,
          explanation: 'You should never share personal information with strangers. It\'s okay to be polite, but keep your personal details private.'
        },
        {
          id: 'q4',
          question: 'If you get separated from your family at a crowded place, what should you do first?',
          options: ['Look for them by walking around', 'Ask any adult for help', 'Stay where you are and look for a police officer or security guard'],
          correctAnswer: 2,
          explanation: 'Stay in one place so your family can find you, and look for uniformed officials like police or security guards for help.'
        },
        {
          id: 'q5',
          question: 'What makes someone a "trusted adult"?',
          options: ['Any adult who is nice to you', 'Adults your parents have told you are safe', 'Adults who give you gifts'],
          correctAnswer: 1,
          explanation: 'Trusted adults are people your parents or guardians have specifically told you are safe to talk to and ask for help.'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Online Privacy & Digital Footprints',
    description: 'Understanding how to protect your personal information online',
    ageGroups: ['13-16', '17-19'],
    duration: 20,
    difficulty: 'medium',
    category: 'online',
    content: {
      introduction: 'Everything you do online leaves a digital footprint. Learning to manage your online presence is crucial for your safety and future.',
      keyPoints: [
        'Never share personal information like address or phone number',
        'Think before you post - content can be permanent',
        'Use strong, unique passwords for all accounts',
        'Be careful about location sharing on social media'
      ],
      scenarios: [
        {
          id: 's2',
          situation: 'Someone you don\'t know well asks for your home address on social media. What do you do?',
          options: ['Give them your address', 'Ignore or block them', 'Give them a fake address'],
          correctAnswer: 1,
          explanation: 'Never share personal information with people you don\'t know well. Block or report suspicious behavior.'
        }
      ],
      tips: [
        'Check your privacy settings regularly',
        'Be skeptical of friend requests from strangers',
        'Report cyberbullying or inappropriate behavior'
      ]
    },
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What makes a strong password?',
          options: ['Your birthday', 'A mix of letters, numbers, and symbols', 'Your pet\'s name'],
          correctAnswer: 1,
          explanation: 'Strong passwords use a combination of uppercase, lowercase, numbers, and symbols, and are unique for each account.'
        },
        {
          id: 'q2',
          question: 'What should you do before posting a photo on social media?',
          options: ['Post it immediately', 'Check if it reveals personal information or location', 'Ask all your friends first'],
          correctAnswer: 1,
          explanation: 'Always check if photos reveal personal information, your location, or anything that could be used to identify or find you.'
        },
        {
          id: 'q3',
          question: 'How often should you review your privacy settings on social media?',
          options: ['Never - they\'re set once', 'Every few months', 'Only when you remember'],
          correctAnswer: 1,
          explanation: 'Privacy settings can change with app updates, so it\'s important to review them regularly to ensure your information stays protected.'
        },
        {
          id: 'q4',
          question: 'What information should you never share online with people you don\'t know in person?',
          options: ['Your favorite color', 'Your home address and phone number', 'Your favorite movie'],
          correctAnswer: 1,
          explanation: 'Personal identifying information like your address, phone number, school, or schedule should never be shared with online strangers.'
        },
        {
          id: 'q5',
          question: 'If someone online asks to meet you in person, what should you do?',
          options: ['Meet them in a public place', 'Tell a trusted adult and never meet alone', 'Ignore the request'],
          correctAnswer: 1,
          explanation: 'Always tell a trusted adult about meeting requests. If you do meet, it should be in a public place with adult supervision.'
        },
        {
          id: 'q6',
          question: 'What is a digital footprint?',
          options: ['Your shoe size online', 'The permanent record of your online activities', 'Your computer\'s memory'],
          correctAnswer: 1,
          explanation: 'A digital footprint is the trail of data you leave behind when using the internet, including posts, searches, and interactions.'
        },
        {
          id: 'q7',
          question: 'Why should you be careful about location sharing on social media?',
          options: ['It uses too much data', 'It can reveal where you are and your daily patterns', 'It\'s not important'],
          correctAnswer: 1,
          explanation: 'Location sharing can reveal your whereabouts, daily routines, and places you frequent, which could be used by people with bad intentions.'
        }
      ]
    }
  },
  {
    id: '3',
    title: 'Cyberbullying Prevention',
    description: 'Recognizing and responding to cyberbullying situations',
    ageGroups: ['9-12', '13-16'],
    duration: 18,
    difficulty: 'medium',
    category: 'social',
    content: {
      introduction: 'Cyberbullying can happen anywhere online. Knowing how to recognize and respond to it protects you and others.',
      keyPoints: [
        'Recognize different forms of cyberbullying',
        'Don\'t respond to bullies - block and report',
        'Save evidence of cyberbullying',
        'Tell a trusted adult immediately'
      ],
      scenarios: [
        {
          id: 's3',
          situation: 'Someone is posting mean comments about you on social media. What\'s your best response?',
          options: ['Post mean comments back', 'Block them and tell an adult', 'Delete your account'],
          correctAnswer: 1,
          explanation: 'Blocking the bully and telling a trusted adult is the safest approach. Don\'t engage with bullies.'
        }
      ],
      tips: [
        'Document everything - take screenshots',
        'Don\'t suffer in silence - reach out for help',
        'Support others who are being bullied'
      ]
    },
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What should you do if you witness cyberbullying?',
          options: ['Ignore it', 'Join in', 'Report it to a trusted adult or platform'],
          correctAnswer: 2,
          explanation: 'Bystanders can help stop cyberbullying by reporting it and supporting the victim.'
        },
        {
          id: 'q2',
          question: 'What is the best way to respond to a cyberbully?',
          options: ['Fight back with mean messages', 'Block them and don\'t respond', 'Try to reason with them'],
          correctAnswer: 1,
          explanation: 'Don\'t engage with bullies. Block them immediately and report the behavior to prevent escalation.'
        },
        {
          id: 'q3',
          question: 'Why is it important to save evidence of cyberbullying?',
          options: ['To show your friends', 'To report it to authorities or platforms', 'To remember what happened'],
          correctAnswer: 1,
          explanation: 'Screenshots and saved messages provide evidence that can be used to report the bullying and take action.'
        },
        {
          id: 'q4',
          question: 'Which of these is considered cyberbullying?',
          options: ['Sending threatening messages', 'Sharing embarrassing photos without permission', 'Both of the above'],
          correctAnswer: 2,
          explanation: 'Cyberbullying includes threatening messages, sharing private content, spreading rumors, and other harmful online behaviors.'
        },
        {
          id: 'q5',
          question: 'What should you do if cyberbullying is affecting your mental health?',
          options: ['Keep it to yourself', 'Talk to a trusted adult or counselor', 'Just ignore it'],
          correctAnswer: 1,
          explanation: 'Cyberbullying can seriously impact mental health. It\'s important to seek support from trusted adults, counselors, or mental health professionals.'
        },
        {
          id: 'q6',
          question: 'How can you help prevent cyberbullying?',
          options: ['Mind your own business', 'Be kind online and stand up for others', 'Only worry about yourself'],
          correctAnswer: 1,
          explanation: 'Creating a positive online environment by being kind and supporting others helps prevent cyberbullying.'
        },
        {
          id: 'q7',
          question: 'If someone shares your private messages to embarrass you, what should you do?',
          options: ['Share their private messages too', 'Report it and tell a trusted adult', 'Do nothing'],
          correctAnswer: 1,
          explanation: 'Sharing private messages without permission is a form of cyberbullying and should be reported immediately.'
        },
        {
          id: 'q8',
          question: 'What platforms should you report cyberbullying to?',
          options: ['Only the police', 'The social media platform and trusted adults', 'No one'],
          correctAnswer: 1,
          explanation: 'Report cyberbullying to both the platform where it occurred and to trusted adults who can provide support and guidance.'
        }
      ]
    }
  }
];