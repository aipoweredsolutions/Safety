/*
  # Update Safety Tips to be Topic-Specific

  1. Updates
    - Replace generic safety tips with topic-specific, actionable advice
    - Ensure tips are relevant to each lesson's learning objectives
    - Maintain age-appropriate language and concepts
    - Provide practical, memorable guidance for each safety topic

  2. Coverage
    - All age groups (5-10, 11-15, 16-19)
    - All safety categories (physical, online, social, emotional, emergency)
    - Topic-specific actionable advice
*/

-- Update safety tips to be topic-specific for each lesson

-- Ages 5-10 Lessons - Topic-Specific Tips
UPDATE lessons SET tips = ARRAY[
  'If someone you don''t know talks to you, stay where you are and look for a trusted adult',
  'Safe places have trusted adults like parents, teachers, or police officers',
  'If you feel scared, it''s okay to run away and find help',
  'Practice saying "I need to find my mom/dad" if a stranger approaches you'
] WHERE id = 'safe-vs-unsafe-behavior';

UPDATE lessons SET tips = ARRAY[
  'Never go anywhere with someone you don''t know, even if they seem nice',
  'If a stranger asks for help, tell them to ask another grown-up instead',
  'Know your full name, your parents'' names, and your phone number',
  'If you get lost, stay where you are and look for a police officer or store worker'
] WHERE id = 'stranger-danger-basics';

UPDATE lessons SET tips = ARRAY[
  'Your private parts are the areas covered by a bathing suit',
  'No one should touch your private parts except to keep you clean or healthy',
  'If someone touches you in a way that feels wrong, tell them "NO" loudly',
  'Always tell a trusted adult if someone touches you inappropriately'
] WHERE id = 'good-touch-bad-touch';

UPDATE lessons SET tips = ARRAY[
  'Good surprises are things like birthday parties that make people happy',
  'Bad secrets make you feel worried, scared, or like you might get in trouble',
  'Adults should never ask you to keep secrets from your parents',
  'If someone says "don''t tell anyone," that''s when you should definitely tell'
] WHERE id = 'secrets-vs-surprises';

UPDATE lessons SET tips = ARRAY[
  'Trusted adults are people your parents have told you are safe',
  'You can always ask for help - you won''t get in trouble for asking',
  'If one trusted adult can''t help, try another one',
  'Practice telling trusted adults about both good and bad things that happen'
] WHERE id = 'trusted-adults-help';

UPDATE lessons SET tips = ARRAY[
  'In an emergency, call 999 or 112 and speak slowly and clearly',
  'Know your address or at least your street name and town',
  'If there''s a fire, get out fast and meet at your family''s meeting place',
  'If you''re hurt or scared, find the nearest adult and ask for help'
] WHERE id = 'emergency-basics';

UPDATE lessons SET tips = ARRAY[
  'Practice saying "NO" in a loud, strong voice when you feel uncomfortable',
  'Your feelings matter - if something doesn''t feel right, speak up',
  'You can say no to hugs, kisses, or any touch you don''t want',
  'Telling a trusted adult about problems helps keep you and others safe'
] WHERE id = 'saying-no-telling';

UPDATE lessons SET tips = ARRAY[
  'Pay attention to butterflies in your stomach - they might mean something''s wrong',
  'If your body feels tense or scared, trust that feeling',
  'When something feels "yucky" or wrong, tell a trusted adult right away',
  'Your body is smart and tries to protect you by giving you warning feelings'
] WHERE id = 'body-cues-feelings';

-- Ages 11-15 Lessons - Topic-Specific Tips
UPDATE lessons SET tips = ARRAY[
  'Document bullying by taking screenshots or writing down what happened',
  'Don''t fight back physically - it can make the situation worse',
  'Tell multiple trusted adults until someone takes action to help',
  'Support friends who are being bullied by including them and speaking up'
] WHERE id = 'types-of-bullying';

UPDATE lessons SET tips = ARRAY[
  'Use privacy settings on all social media accounts and review them regularly',
  'Never share passwords, even with close friends',
  'Think before you post - would you be comfortable if your parents or teachers saw it?',
  'Block and report anyone who makes you uncomfortable online'
] WHERE id = 'online-safety-basics';

UPDATE lessons SET tips = ARRAY[
  'It''s okay to say "I need time to think about it" when pressured to decide quickly',
  'Practice saying "That doesn''t work for me" when setting boundaries',
  'Your boundaries can be different with different people - that''s normal',
  'If someone gets angry when you set boundaries, that''s a red flag about them'
] WHERE id = 'setting-personal-boundaries';

UPDATE lessons SET tips = ARRAY[
  'Real friends will respect your decisions even if they''re different from theirs',
  'Have a code word with parents to text if you need to leave a situation',
  'Practice responses like "I''m not comfortable with that" before you need them',
  'Remember that popular doesn''t always mean right or safe'
] WHERE id = 'peer-pressure-decisions';

UPDATE lessons SET tips = ARRAY[
  'Secrets about illegal activities, abuse, or danger should always be reported',
  'If keeping a secret makes you feel sick or worried, it''s probably harmful',
  'You''re not responsible for protecting adults by keeping their secrets',
  'Talk to a counselor or trusted adult if you''re unsure about a secret'
] WHERE id = 'uncomfortable-secrets';

UPDATE lessons SET tips = ARRAY[
  'Trust your gut if someone makes you feel confused about what really happened',
  'Manipulation often starts small and gradually gets worse over time',
  'Keep a journal of interactions if someone makes you question your memory',
  'Healthy relationships don''t involve guilt trips or emotional blackmail'
] WHERE id = 'recognizing-manipulation';

UPDATE lessons SET tips = ARRAY[
  'Make a list of your positive qualities and read it when you''re feeling down',
  'Surround yourself with people who celebrate your successes',
  'Practice self-compassion - talk to yourself like you would a good friend',
  'Remember that everyone makes mistakes - they don''t define your worth'
] WHERE id = 'building-self-esteem';

UPDATE lessons SET tips = ARRAY[
  'Healthy friends support your other friendships and don''t try to isolate you',
  'Good friends respect your family time and other commitments',
  'In healthy friendships, you can disagree without fear of losing the friendship',
  'Pay attention to how you feel after spending time with different friends'
] WHERE id = 'healthy-friendships';

-- Ages 16-19 Lessons - Topic-Specific Tips
UPDATE lessons SET tips = ARRAY[
  'Healthy partners encourage your goals and dreams, not discourage them',
  'Love bombing (excessive early attention) followed by criticism is a warning sign',
  'Your partner should enhance your life, not be your entire life',
  'If you''re walking on eggshells around someone, the relationship isn''t healthy'
] WHERE id = 'healthy-vs-unhealthy-relationships';

UPDATE lessons SET tips = ARRAY[
  'Consent is ongoing - it can be withdrawn at any point during any activity',
  'Being in a relationship doesn''t mean automatic consent to everything',
  'Consent given under pressure, manipulation, or while impaired isn''t valid consent',
  'Enthusiastic consent means both people are excited and willing participants'
] WHERE id = 'understanding-consent';

UPDATE lessons SET tips = ARRAY[
  'Regularly audit your social media privacy settings and friend lists',
  'Be cautious about sharing location data, even with people you trust',
  'Remember that anything digital can potentially be screenshot or saved',
  'Use different passwords for different accounts and enable two-factor authentication'
] WHERE id = 'online-privacy-exploitation';

UPDATE lessons SET tips = ARRAY[
  'Gaslighting makes you question your own memory and perception of reality',
  'Emotional abusers often isolate you from friends and family gradually',
  'Keep a private journal to track patterns of behavior that concern you',
  'Trust friends and family if they express concerns about your relationship'
] WHERE id = 'emotional-abuse-control';

UPDATE lessons SET tips = ARRAY[
  'Be aware of age gaps and how they might create unequal power dynamics',
  'Financial dependence can create unhealthy power imbalances in relationships',
  'Authority figures (teachers, bosses, coaches) have power that affects consent',
  'Healthy relationships involve shared decision-making and mutual respect'
] WHERE id = 'power-dynamics';

UPDATE lessons SET tips = ARRAY[
  'Plan your exit strategy when you''re thinking clearly, not during a crisis',
  'Save important documents and have a safe place to stay lined up',
  'Tell trusted friends about your plans so someone knows your situation',
  'Consider involving professionals like counselors or domestic violence advocates'
] WHERE id = 'ending-relationships-safely';

UPDATE lessons SET tips = ARRAY[
  'Listen without trying to fix everything - sometimes people just need support',
  'Don''t promise to keep secrets about abuse or dangerous situations',
  'Help them connect with professional resources rather than trying to rescue them yourself',
  'Take care of your own mental health while supporting others'
] WHERE id = 'supporting-friends';

UPDATE lessons SET tips = ARRAY[
  'Document abuse with photos, screenshots, and written records when safe to do so',
  'Know that reporting doesn''t always mean immediate legal action - you have options',
  'Contact local domestic violence hotlines for guidance specific to your situation',
  'Remember that abuse is never your fault, regardless of the circumstances'
] WHERE id = 'reporting-abuse-rights';

UPDATE lessons SET tips = ARRAY[
  'Excessive jealousy and possessiveness are not signs of love - they''re control tactics',
  'Partners who check your phone, emails, or social media without permission are being controlling',
  'Isolation from friends and family often happens gradually and may seem caring at first',
  'Pay attention if you find yourself changing your behavior to avoid your partner''s anger'
] WHERE id = 'unhealthy-partner-behaviors';