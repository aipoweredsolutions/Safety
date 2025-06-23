import { DailyStory } from '../types';

export const dailyStories: DailyStory[] = [
  // Stories for ages 5-8 (Little Learners)
  // Topics: Stranger danger, good/bad touch, saying no, safe adults
  {
    id: 'story-5-8-1',
    title: 'Maya and the Playground Helper',
    description: 'Maya learns about stranger safety when someone offers to help her at the playground',
    ageGroups: ['5-8'],
    category: 'physical',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Maya is playing alone at the playground when a person she doesn\'t know comes over and says, "Hi! I\'m here to help kids. Want me to push you on the swing?" What should Maya do?',
        options: [
          'Say yes because they seem nice',
          'Say "No thank you" and go find her mom',
          'Ask them to play a different game'
        ],
        correctAnswer: 1,
        explanation: 'Maya did the right thing! Even when strangers seem nice, it\'s always best to say no and find a trusted adult like mom or dad.',
        encouragement: 'Great choice! You know how to stay safe with strangers.'
      },
      {
        id: 'scenario-2',
        situation: 'The person says, "But I have candy in my car if you come with me." What should Maya do now?',
        options: [
          'Go get the candy',
          'Run to find her mom right away',
          'Ask for the candy to be brought to her'
        ],
        correctAnswer: 1,
        explanation: 'Maya should run to her mom immediately! Strangers should never ask children to come to their car, even for treats.',
        encouragement: 'Perfect! You know that safe adults don\'t ask kids to come to their cars.'
      }
    ],
    moralLesson: 'Always stay close to your trusted adults and never go anywhere with strangers, even if they offer treats or seem friendly.'
  },
  {
    id: 'story-5-8-2',
    title: 'Sam\'s Uncomfortable Hug',
    description: 'Sam learns about body boundaries when someone wants a hug but Sam doesn\'t feel comfortable',
    ageGroups: ['5-8'],
    category: 'physical',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'At a family gathering, Uncle Bob (who Sam doesn\'t know very well) says, "Come give me a big hug!" But Sam feels uncomfortable and doesn\'t want to hug. What should Sam do?',
        options: [
          'Give the hug anyway to be polite',
          'Say "I don\'t want to hug right now" and offer a wave instead',
          'Hide behind mom or dad'
        ],
        correctAnswer: 1,
        explanation: 'Sam has the right to say no to hugs! It\'s okay to offer a wave, high-five, or just say hello instead.',
        encouragement: 'Excellent! Your body belongs to you, and you can choose who touches you.'
      },
      {
        id: 'scenario-2',
        situation: 'Uncle Bob says, "But family always hugs!" What should Sam do?',
        options: [
          'Give the hug because he said family always hugs',
          'Tell mom or dad how they feel',
          'Run away and hide'
        ],
        correctAnswer: 1,
        explanation: 'Sam should tell mom or dad! Good families respect when someone doesn\'t want to hug. Trusted adults will help.',
        encouragement: 'Smart thinking! Telling a trusted adult when you feel uncomfortable is always the right choice.'
      }
    ],
    moralLesson: 'You have the right to say no to touches that make you uncomfortable, even from family. Your trusted adults will always support you.'
  },
  {
    id: 'story-5-8-3',
    title: 'Lily\'s Safe Word',
    description: 'Lily learns about having a safe word with her family and when to use it',
    ageGroups: ['5-8'],
    category: 'physical',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Lily\'s mom taught her a special safe word "butterfly" to use if she ever feels scared or needs help. At school, a older kid keeps following Lily around and won\'t leave her alone even when she says stop. What should Lily do?',
        options: [
          'Keep trying to get away by herself',
          'Tell the teacher and use her safe word',
          'Just ignore the older kid'
        ],
        correctAnswer: 1,
        explanation: 'Lily should tell her teacher right away! Teachers are safe adults at school, and using her safe word helps them know it\'s really important.',
        encouragement: 'Perfect! You know when to ask for help from safe adults.'
      },
      {
        id: 'scenario-2',
        situation: 'When Lily gets home, should she tell her mom about what happened at school?',
        options: [
          'No, because the teacher already helped',
          'Yes, because mom is her most trusted adult',
          'Only if it happens again'
        ],
        correctAnswer: 1,
        explanation: 'Yes! Lily should always tell her mom about things that made her feel scared or uncomfortable. Mom wants to know so she can help keep Lily safe.',
        encouragement: 'Great job! Telling your trusted adults helps them protect you better.'
      }
    ],
    moralLesson: 'Safe words help trusted adults know when you really need help. Always tell your most trusted adults about things that make you feel scared.'
  },

  // Stories for ages 9-12 (Safety Explorers)
  // Topics: Bullying, online safety, body boundaries, emergencies
  {
    id: 'story-9-12-1',
    title: 'Alex and the Group Chat',
    description: 'Alex faces a difficult situation when classmates start being mean in a group chat',
    ageGroups: ['9-12'],
    category: 'social',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Alex is in a class group chat where some kids start making fun of another student, posting embarrassing photos and mean comments. What should Alex do?',
        options: [
          'Join in so they don\'t target Alex next',
          'Leave the group chat and tell a trusted adult',
          'Just ignore it and hope it stops'
        ],
        correctAnswer: 1,
        explanation: 'Alex should leave the group chat and tell a trusted adult. This is cyberbullying, and it\'s important to get help rather than participate or just watch.',
        encouragement: 'Excellent choice! Standing up against bullying by getting help shows real courage.'
      },
      {
        id: 'scenario-2',
        situation: 'The next day, some classmates ask Alex why they left the group chat and say "it was just a joke." How should Alex respond?',
        options: [
          'Agree that it was just a joke',
          'Explain that making fun of someone isn\'t a joke and can really hurt',
          'Rejoin the group chat to fit in'
        ],
        correctAnswer: 1,
        explanation: 'Alex is right to explain that hurting someone\'s feelings isn\'t a joke. Real jokes don\'t make people feel bad about themselves.',
        encouragement: 'Great thinking! You understand the difference between harmless fun and hurtful behavior.'
      }
    ],
    moralLesson: 'Cyberbullying is never "just a joke." Standing up for others and getting help from trusted adults is always the right thing to do.'
  },
  {
    id: 'story-9-12-2',
    title: 'Jordan\'s Online Friend',
    description: 'Jordan learns about online safety when an internet friend asks to meet in person',
    ageGroups: ['9-12'],
    category: 'online',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Jordan has been chatting with someone online who claims to be 13 years old. This person asks Jordan to meet at the local mall and says "don\'t tell your parents, they won\'t understand our friendship." What should Jordan do?',
        options: [
          'Meet them at the mall as planned',
          'Tell parents immediately about the request',
          'Suggest meeting somewhere else instead'
        ],
        correctAnswer: 1,
        explanation: 'Jordan should tell their parents right away! When someone asks you to keep secrets from your parents, that\'s a big warning sign.',
        encouragement: 'Smart choice! You recognized a dangerous situation and knew to get help.'
      },
      {
        id: 'scenario-2',
        situation: 'Jordan\'s parents explain this could be an adult pretending to be a kid. What should Jordan do about the online friendship?',
        options: [
          'Block the person and stop all contact',
          'Keep chatting but refuse to meet',
          'Ask the person to prove their age'
        ],
        correctAnswer: 0,
        explanation: 'Jordan should block the person completely. People who ask kids to keep secrets from parents and meet in person are dangerous.',
        encouragement: 'Perfect! You know how to protect yourself online by cutting off dangerous contact.'
      }
    ],
    moralLesson: 'Never meet online friends in person without your parents knowing. If someone asks you to keep secrets from your parents, that\'s a warning sign.'
  },
  {
    id: 'story-9-12-3',
    title: 'Casey\'s Emergency',
    description: 'Casey learns what to do when there\'s a real emergency at home',
    ageGroups: ['9-12'],
    category: 'emergency',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Casey comes home to find their grandmother on the floor, conscious but saying she can\'t get up and her chest hurts. Grandma says she\'s probably fine. What should Casey do first?',
        options: [
          'Help grandma try to stand up',
          'Call 911 immediately',
          'Call a parent first'
        ],
        correctAnswer: 1,
        explanation: 'Casey should call 911 right away! Chest pain and being unable to get up could be serious. Emergency services need to check on grandma immediately.',
        encouragement: 'Excellent! You know that chest pain is a serious emergency that needs immediate medical help.'
      },
      {
        id: 'scenario-2',
        situation: 'While waiting for the ambulance, what should Casey do?',
        options: [
          'Try to give grandma medicine',
          'Stay with grandma, keep her calm, and call a parent',
          'Go outside to watch for the ambulance'
        ],
        correctAnswer: 1,
        explanation: 'Casey should stay with grandma to keep her calm and call a parent to let them know what\'s happening. The paramedics will find the house.',
        encouragement: 'Great thinking! You know how to help during an emergency by staying calm and keeping others informed.'
      }
    ],
    moralLesson: 'In medical emergencies, call 911 first, then call your parents. Stay calm and don\'t try to move someone who might be injured.'
  },

  // Stories for ages 13-16 (Teen Guardians)
  // Topics: Peer pressure, toxic friendships, confidence, self-worth
  {
    id: 'story-13-16-1',
    title: 'Riley\'s Party Dilemma',
    description: 'Riley faces peer pressure at a party where friends are making risky choices',
    ageGroups: ['13-16'],
    category: 'social',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'At a party, Riley\'s friends start drinking alcohol they found and pressure Riley to join them, saying "everyone\'s doing it" and "don\'t be such a baby." What should Riley do?',
        options: [
          'Drink a little to fit in with friends',
          'Firmly say no and suggest doing something else',
          'Leave the party if the pressure continues'
        ],
        correctAnswer: 1,
        explanation: 'Riley should firmly say no and suggest an alternative activity. Standing up to peer pressure shows real strength and leadership.',
        encouragement: 'Excellent! You have the confidence to stick to your values even when others pressure you.'
      },
      {
        id: 'scenario-2',
        situation: 'Riley\'s friends get angry and say "fine, but you\'re not really our friend if you won\'t do this with us." How should Riley respond?',
        options: [
          'Give in to keep the friendship',
          'Realize these aren\'t true friends and consider leaving',
          'Try to convince them to stop drinking'
        ],
        correctAnswer: 1,
        explanation: 'Real friends don\'t threaten to end friendships over refusing to do risky things. Riley should recognize this manipulation and consider if these are healthy friendships.',
        encouragement: 'Smart insight! You can recognize when people are trying to manipulate you instead of respecting your choices.'
      }
    ],
    moralLesson: 'True friends respect your boundaries and decisions. Anyone who threatens your friendship over refusing risky behavior isn\'t a real friend.'
  },
  {
    id: 'story-13-16-2',
    title: 'Morgan\'s Toxic Friend',
    description: 'Morgan realizes their close friend has become controlling and manipulative',
    ageGroups: ['13-16'],
    category: 'social',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Morgan\'s best friend Taylor has started telling Morgan what to wear, who to talk to, and gets angry when Morgan spends time with other people. Taylor says "I\'m just looking out for you because I care." What should Morgan do?',
        options: [
          'Accept that Taylor cares and follow their advice',
          'Recognize this as controlling behavior and set boundaries',
          'Gradually distance themselves from Taylor'
        ],
        correctAnswer: 1,
        explanation: 'Morgan should recognize this as controlling behavior. Caring friends give advice when asked, but don\'t try to control your choices or isolate you from others.',
        encouragement: 'Great awareness! You can identify controlling behavior even when it\'s disguised as "caring."'
      },
      {
        id: 'scenario-2',
        situation: 'When Morgan tries to set boundaries, Taylor gets very upset and says "I guess you don\'t value our friendship anymore." What should Morgan do?',
        options: [
          'Apologize and go back to letting Taylor control things',
          'Stay firm with boundaries and explain what healthy friendship looks like',
          'End the friendship immediately'
        ],
        correctAnswer: 1,
        explanation: 'Morgan should stay firm with their boundaries and explain that healthy friendships involve mutual respect, not control. This gives Taylor a chance to change.',
        encouragement: 'Perfect! You know how to maintain healthy boundaries while still giving people a chance to improve.'
      }
    ],
    moralLesson: 'Healthy friendships are based on mutual respect and support, not control. It\'s important to set boundaries even with close friends.'
  },
  {
    id: 'story-13-16-3',
    title: 'Avery\'s Confidence Challenge',
    description: 'Avery learns to build self-confidence when facing criticism and self-doubt',
    ageGroups: ['13-16'],
    category: 'emotional',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Avery wants to try out for the school play but keeps hearing a voice in their head saying "you\'re not good enough" and "everyone will laugh at you." What should Avery do?',
        options: [
          'Skip the audition to avoid potential embarrassment',
          'Challenge those negative thoughts and try out anyway',
          'Only audition if friends encourage them'
        ],
        correctAnswer: 1,
        explanation: 'Avery should challenge those negative thoughts! Often our inner critic is much harsher than reality. Taking positive risks helps build confidence.',
        encouragement: 'Brave choice! You understand that growth comes from challenging your fears and negative self-talk.'
      },
      {
        id: 'scenario-2',
        situation: 'At the audition, Avery makes a small mistake and feels embarrassed. What\'s the best way to handle this?',
        options: [
          'Focus on the mistake and feel like a failure',
          'Acknowledge the mistake but focus on what went well',
          'Make excuses for why the mistake happened'
        ],
        correctAnswer: 1,
        explanation: 'Avery should acknowledge the mistake but focus on their strengths and what went well. Everyone makes mistakes - it\'s how we respond that matters.',
        encouragement: 'Excellent mindset! You know how to learn from mistakes without letting them define your worth.'
      }
    ],
    moralLesson: 'Building confidence means challenging negative self-talk and focusing on growth rather than perfection. Everyone makes mistakes while learning.'
  },

  // Stories for ages 17-19 (Young Adults)
  // Topics: Consent, digital abuse, reporting abuse, emotional boundaries
  {
    id: 'story-17-19-1',
    title: 'Sam\'s Dating Boundary',
    description: 'Sam learns about consent and setting clear boundaries in a dating relationship',
    ageGroups: ['17-19'],
    category: 'social',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Sam is dating someone who keeps pushing for physical intimacy even after Sam says they\'re not ready. Their partner says "if you really cared about me, you would" and "everyone our age is doing this." How should Sam respond?',
        options: [
          'Give in to prove they care about the relationship',
          'Firmly restate their boundaries and explain what consent means',
          'Avoid the topic and hope it goes away'
        ],
        correctAnswer: 1,
        explanation: 'Sam should firmly restate their boundaries. Real love respects boundaries, and consent should never be pressured or manipulated.',
        encouragement: 'Excellent! You understand that true caring means respecting boundaries, not pressuring someone to cross them.'
      },
      {
        id: 'scenario-2',
        situation: 'Sam\'s partner gets angry and says "fine, maybe I should find someone who actually wants to be with me." What should Sam do?',
        options: [
          'Apologize and reconsider their boundaries',
          'Recognize this as manipulation and consider if this is a healthy relationship',
          'Try to compromise to save the relationship'
        ],
        correctAnswer: 1,
        explanation: 'This is emotional manipulation. A caring partner would never threaten to leave because someone isn\'t ready for physical intimacy. Sam should seriously reconsider this relationship.',
        encouragement: 'Smart recognition! You can identify manipulation tactics and know that healthy relationships don\'t involve threats or ultimatums.'
      }
    ],
    moralLesson: 'Consent cannot be pressured, manipulated, or coerced. A partner who truly cares about you will respect your boundaries without making threats.'
  },
  {
    id: 'story-17-19-2',
    title: 'Jordan\'s Digital Stalker',
    description: 'Jordan experiences digital harassment and learns how to respond and get help',
    ageGroups: ['17-19'],
    category: 'online',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'After Jordan ends a relationship, their ex starts constantly texting, calling, and commenting on all their social media posts. The ex also creates fake accounts to follow Jordan when blocked. What should Jordan do?',
        options: [
          'Respond to tell them to stop',
          'Document everything and report to authorities',
          'Just ignore it and hope it stops'
        ],
        correctAnswer: 1,
        explanation: 'Jordan should document all contact and report it. This is digital stalking and harassment, which can escalate. Don\'t engage - just collect evidence.',
        encouragement: 'Perfect response! You know how to protect yourself by documenting abuse and seeking proper help.'
      },
      {
        id: 'scenario-2',
        situation: 'The ex starts showing up at Jordan\'s work and school. Friends say "they\'re just heartbroken, give them time." What should Jordan do?',
        options: [
          'Give the ex another chance to explain',
          'Take the stalking seriously regardless of the ex\'s emotions',
          'Ask friends to talk to the ex'
        ],
        correctAnswer: 1,
        explanation: 'Jordan should take this seriously. Being heartbroken doesn\'t excuse stalking behavior. This is escalating and Jordan needs to prioritize their safety.',
        encouragement: 'Excellent judgment! You understand that someone\'s emotions don\'t excuse abusive or stalking behavior.'
      }
    ],
    moralLesson: 'Digital harassment and stalking are serious crimes, regardless of the perpetrator\'s claimed emotions. Document everything and seek help from authorities.'
  },
  {
    id: 'story-17-19-3',
    title: 'Alex\'s Emotional Boundaries',
    description: 'Alex learns to set healthy emotional boundaries with a friend who constantly needs support',
    ageGroups: ['17-19'],
    category: 'emotional',
    scenarios: [
      {
        id: 'scenario-1',
        situation: 'Alex\'s friend constantly calls in crisis, expecting Alex to drop everything and provide emotional support. Alex is feeling drained and their own mental health is suffering. What should Alex do?',
        options: [
          'Continue helping because that\'s what friends do',
          'Set boundaries about when and how much support they can provide',
          'End the friendship to protect themselves'
        ],
        correctAnswer: 1,
        explanation: 'Alex should set healthy boundaries. Good friends support each other, but not at the expense of their own mental health. Boundaries help both people.',
        encouragement: 'Wise choice! You understand that healthy relationships require boundaries to protect everyone\'s wellbeing.'
      },
      {
        id: 'scenario-2',
        situation: 'When Alex explains they need boundaries, their friend says "I thought you cared about me" and "I have no one else." How should Alex respond?',
        options: [
          'Feel guilty and remove the boundaries',
          'Maintain boundaries while suggesting professional help resources',
          'Apologize for being selfish'
        ],
        correctAnswer: 1,
        explanation: 'Alex should maintain their boundaries while suggesting professional resources. Friends can\'t be someone\'s only support system - that\'s too much pressure and isn\'t healthy.',
        encouragement: 'Perfect balance! You know how to care for someone while still protecting your own mental health and encouraging them to get proper help.'
      }
    ],
    moralLesson: 'Healthy relationships require emotional boundaries. You can care about someone while still protecting your own mental health and encouraging them to seek appropriate help.'
  }
];