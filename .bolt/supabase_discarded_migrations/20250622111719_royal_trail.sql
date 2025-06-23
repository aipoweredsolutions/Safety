/*
  # Update SafetyLearn Content with New Learning Framework

  1. New Content Structure
    - Clear existing content to avoid conflicts
    - Insert lessons aligned with the new age-based learning framework
    - Add comprehensive key points, scenarios, and quiz questions
    - Insert daily stories with interactive scenarios

  2. Age Groups (Updated to match current enum)
    - Group 1: Ages 5-9 (foundational safety awareness)
    - Group 2: Ages 10-14 (boundary setting and digital safety)
    - Group 3: Ages 15-19 (relationships and advanced safety)

  3. Content Organization
    - Age-appropriate lessons for each group
    - Progressive difficulty and complexity
    - Real-world scenarios and practical applications
*/

-- Clear existing content to avoid conflicts
DELETE FROM lesson_quiz_questions;
DELETE FROM lesson_scenarios;
DELETE FROM lesson_key_points;
DELETE FROM lesson_age_groups;
DELETE FROM lessons;

DELETE FROM daily_story_scenarios;
DELETE FROM daily_story_age_groups;
DELETE FROM daily_stories;

-- Insert lessons aligned with the new learning framework

-- Group 1 (Ages 5-9) Lessons - Foundational Safety Awareness
INSERT INTO lessons (id, title, description, duration_minutes, difficulty, category, introduction_text, tips) VALUES
('safe-vs-unsafe-behavior', 'Safe vs Unsafe Behavior', 'Learn to recognize the difference between safe and unsafe situations', 10, 'easy', 'physical',
 'Learning to tell the difference between safe and unsafe helps you make good choices and stay protected.',
 ARRAY['Trust your feelings - if something feels wrong, tell a trusted adult', 'Safe behaviors make you feel good and protected', 'Unsafe behaviors might make you feel scared or uncomfortable']),

('stranger-danger-basics', 'Stranger Danger Basics', 'Understanding who strangers are and how to stay safe around them', 12, 'easy', 'physical',
 'Not all strangers are dangerous, but it''s important to know the safety rules when meeting new people.',
 ARRAY['Stay close to trusted adults in public places', 'Never go anywhere with someone you don''t know', 'If a stranger approaches you, find a trusted adult right away']),

('good-touch-bad-touch', 'Good Touch vs Bad Touch', 'Learning about appropriate and inappropriate touch', 15, 'easy', 'physical',
 'Understanding the difference between good touch and bad touch helps keep your body safe.',
 ARRAY['Good touches make you feel safe and happy', 'Bad touches make you feel uncomfortable or scared', 'You can always say no to touches that don''t feel right']),

('secrets-vs-surprises', 'Secrets vs Surprises', 'Understanding the difference between safe surprises and unsafe secrets', 10, 'easy', 'emotional',
 'Learning about good surprises and bad secrets helps you know when to tell a trusted adult.',
 ARRAY['Good surprises are fun and make people happy', 'Bad secrets make you feel worried or scared', 'You should never keep secrets that make you uncomfortable']),

('trusted-adults-help', 'Trusted Adults and How to Ask for Help', 'Identifying safe adults and learning how to ask for help when needed', 12, 'easy', 'emotional',
 'Knowing who your trusted adults are and how to ask for help keeps you safe and supported.',
 ARRAY['Trusted adults are people your parents say are safe', 'It''s always okay to ask for help', 'Tell a trusted adult if something makes you feel unsafe']),

('emergency-basics', 'Emergency Basics', 'Learning what to do in emergency situations and how to call for help', 15, 'easy', 'emergency',
 'Knowing what to do in an emergency can help keep you and others safe.',
 ARRAY['Know your full name, address, and phone number', 'Call 999 or 112 in a real emergency', 'Stay calm and speak clearly when asking for help']);

-- Group 2 (Ages 10-14) Lessons - Boundary Setting and Digital Safety
INSERT INTO lessons (id, title, description, duration_minutes, difficulty, category, introduction_text, tips) VALUES
('types-of-bullying', 'Understanding Different Types of Bullying', 'Learn to recognize verbal, physical, and cyberbullying', 18, 'medium', 'social',
 'Bullying can happen in many different ways. Knowing how to recognize and respond to bullying helps keep you and others safe.',
 ARRAY['Bullying is never okay, no matter what form it takes', 'Tell a trusted adult if you or someone else is being bullied', 'Standing up for others shows courage and kindness']),

('online-safety-basics', 'Online Safety Fundamentals', 'Essential skills for staying safe while gaming, chatting, and browsing online', 20, 'medium', 'online',
 'The internet can be fun and educational, but it''s important to know how to protect yourself online.',
 ARRAY['Never share personal information like your address or phone number', 'Use strong passwords and keep them private', 'Tell a trusted adult if someone online makes you uncomfortable']),

('setting-personal-boundaries', 'Setting and Respecting Personal Boundaries', 'Learning how to set your own boundaries and respect others'' boundaries', 16, 'medium', 'emotional',
 'Personal boundaries help you feel safe and respected. Learning to set and respect boundaries is important for healthy relationships.',
 ARRAY['It''s okay to say no when something doesn''t feel right', 'Respect when others say no to you', 'Boundaries help keep relationships healthy and safe']),

('peer-pressure-decisions', 'Handling Peer Pressure and Making Good Decisions', 'Strategies for resisting negative peer pressure and making independent choices', 18, 'medium', 'social',
 'Learning to make your own decisions helps you stay true to your values and stay safe.',
 ARRAY['True friends respect your decisions and don''t pressure you', 'It''s okay to be different from your friends', 'Trust your instincts about what feels right']),

('recognizing-manipulation', 'Recognizing Manipulation and Unfair Treatment', 'Learning to identify when someone is trying to manipulate or take advantage of you', 20, 'medium', 'emotional',
 'Understanding manipulation helps you protect yourself and build healthier relationships.',
 ARRAY['Trust your feelings if something doesn''t seem fair', 'Manipulation often involves making you feel guilty or scared', 'You deserve to be treated with respect']),

('healthy-friendships', 'What Makes a Healthy Friendship', 'Understanding the qualities of good friendships and how to be a good friend', 16, 'medium', 'social',
 'Healthy friendships are built on trust, respect, and kindness. Learning about good friendships helps you choose better friends.',
 ARRAY['Good friends support and encourage each other', 'Healthy friendships involve give and take', 'Friends should make you feel good about yourself']);

-- Group 3 (Ages 15-19) Lessons - Relationships and Advanced Safety
INSERT INTO lessons (id, title, description, duration_minutes, difficulty, category, introduction_text, tips) VALUES
('healthy-vs-unhealthy-relationships', 'Recognizing Healthy vs Unhealthy Relationships', 'Understanding the signs of healthy and unhealthy relationships in friendships and romantic partnerships', 25, 'hard', 'social',
 'Healthy relationships are built on respect, trust, and communication. Learning to recognize unhealthy patterns helps you build better relationships.',
 ARRAY['Healthy relationships involve mutual respect and support', 'Unhealthy relationships may involve control, manipulation, or abuse', 'You deserve to be treated with kindness and respect']),

('understanding-consent', 'Understanding Consent and Personal Autonomy', 'Learning about consent in all aspects of life and relationships', 22, 'hard', 'social',
 'Consent is about respecting yourself and others. Understanding consent helps you build healthy, respectful relationships.',
 ARRAY['Consent must be freely given without pressure or manipulation', 'You can change your mind at any time', 'Respecting consent shows maturity and care for others']),

('online-privacy-exploitation', 'Online Privacy and Digital Exploitation Prevention', 'Advanced online safety including privacy settings, sexting risks, and digital exploitation', 25, 'hard', 'online',
 'As you become more independent online, it''s important to understand advanced privacy and safety concepts.',
 ARRAY['Think carefully before sharing any personal content online', 'Understand that digital content can be permanent', 'Know your rights and how to report exploitation']),

('emotional-abuse-control', 'Recognizing Emotional Abuse and Control', 'Identifying controlling behaviors, gaslighting, and other forms of emotional abuse', 28, 'hard', 'emotional',
 'Emotional abuse can be harder to recognize than physical abuse, but it''s just as serious and harmful.',
 ARRAY['Trust your feelings if something doesn''t feel right in a relationship', 'Manipulation often starts small and gradually increases', 'You deserve relationships built on respect, not control']),

('power-dynamics-relationships', 'Understanding Power Dynamics in Relationships', 'Learning about healthy and unhealthy power balances in various relationships', 24, 'hard', 'social',
 'Understanding power dynamics helps you recognize when relationships are unbalanced and potentially harmful.',
 ARRAY['Healthy relationships have balanced power between people', 'Be aware of age, authority, or other power differences', 'Speak up if you feel powerless in a relationship']),

('ending-relationships-safely', 'How to End a Relationship Safely', 'Learning strategies for ending unhealthy relationships while staying safe', 26, 'hard', 'emotional',
 'Sometimes relationships need to end for your safety and wellbeing. Knowing how to do this safely is important.',
 ARRAY['Plan ahead if you need to end an unhealthy relationship', 'Tell trusted adults about your situation', 'Your safety is more important than someone else''s feelings']),

('supporting-friends-crisis', 'Supporting Friends in Unsafe Situations', 'Learning how to help friends who may be in dangerous or unhealthy situations', 22, 'hard', 'social',
 'Being a good friend sometimes means helping someone get to safety. Learning how to do this effectively can save lives.',
 ARRAY['Listen without judgment when friends share problems', 'Encourage friends to seek help from trusted adults', 'Know when a situation is too serious for you to handle alone']),

('reporting-abuse-rights', 'Reporting Abuse and Knowing Your Rights', 'Understanding how and when to report abuse, and knowing your legal rights', 30, 'hard', 'emergency',
 'Knowing how to report abuse and understanding your rights empowers you to protect yourself and others.',
 ARRAY['You have the right to be safe and protected', 'Reporting abuse can prevent it from happening to others', 'There are many resources available to help you']);

-- Insert lesson age groups using current enum values
INSERT INTO lesson_age_groups (lesson_id, age_group) VALUES
-- Ages 5-9 lessons (Group 1)
('safe-vs-unsafe-behavior', '5-8'),
('stranger-danger-basics', '5-8'),
('good-touch-bad-touch', '5-8'),
('secrets-vs-surprises', '5-8'),
('trusted-adults-help', '5-8'),
('emergency-basics', '5-8'),

-- Ages 10-14 lessons (Group 2)
('types-of-bullying', '9-12'),
('online-safety-basics', '9-12'),
('setting-personal-boundaries', '9-12'),
('peer-pressure-decisions', '9-12'),
('recognizing-manipulation', '9-12'),
('healthy-friendships', '9-12'),

-- Some lessons span multiple groups
('types-of-bullying', '13-16'),
('online-safety-basics', '13-16'),
('setting-personal-boundaries', '13-16'),
('peer-pressure-decisions', '13-16'),

-- Ages 15-19 lessons (Group 3)
('healthy-vs-unhealthy-relationships', '13-16'),
('understanding-consent', '13-16'),
('online-privacy-exploitation', '13-16'),
('emotional-abuse-control', '13-16'),
('power-dynamics-relationships', '13-16'),
('ending-relationships-safely', '13-16'),
('supporting-friends-crisis', '13-16'),
('reporting-abuse-rights', '13-16'),

-- Advanced lessons for older teens
('healthy-vs-unhealthy-relationships', '17-19'),
('understanding-consent', '17-19'),
('online-privacy-exploitation', '17-19'),
('emotional-abuse-control', '17-19'),
('power-dynamics-relationships', '17-19'),
('ending-relationships-safely', '17-19'),
('supporting-friends-crisis', '17-19'),
('reporting-abuse-rights', '17-19');

-- Insert lesson key points based on the framework
INSERT INTO lesson_key_points (lesson_id, point_text, order_index) VALUES
-- Safe vs Unsafe Behavior (Ages 5-9)
('safe-vs-unsafe-behavior', 'Safe behaviors make you feel good and protected', 0),
('safe-vs-unsafe-behavior', 'Unsafe behaviors might make you feel scared or uncomfortable', 1),
('safe-vs-unsafe-behavior', 'Always tell a trusted adult if something feels unsafe', 2),
('safe-vs-unsafe-behavior', 'Trust your feelings about what feels right', 3),

-- Stranger Danger Basics (Ages 5-9)
('stranger-danger-basics', 'A stranger is someone you don''t know well', 0),
('stranger-danger-basics', 'Never accept gifts or rides from strangers', 1),
('stranger-danger-basics', 'Stay close to trusted adults in public', 2),
('stranger-danger-basics', 'Know your full name, address, and phone number', 3),

-- Good Touch vs Bad Touch (Ages 5-9)
('good-touch-bad-touch', 'Good touches are safe, wanted, and make you feel comfortable', 0),
('good-touch-bad-touch', 'Bad touches make you feel uncomfortable, scared, or confused', 1),
('good-touch-bad-touch', 'You have the right to say no to any touch', 2),
('good-touch-bad-touch', 'Tell a trusted adult about any touch that doesn''t feel right', 3),

-- Secrets vs Surprises (Ages 5-9)
('secrets-vs-surprises', 'Good surprises are fun and make people happy when revealed', 0),
('secrets-vs-surprises', 'Bad secrets make you feel worried, scared, or uncomfortable', 1),
('secrets-vs-surprises', 'You should never keep secrets that make you feel bad', 2),
('secrets-vs-surprises', 'Always tell a trusted adult about uncomfortable secrets', 3),

-- Types of Bullying (Ages 10-14)
('types-of-bullying', 'Physical bullying involves hitting, pushing, or damaging property', 0),
('types-of-bullying', 'Verbal bullying includes name-calling, threats, and mean comments', 1),
('types-of-bullying', 'Cyberbullying happens online through messages, posts, or images', 2),
('types-of-bullying', 'All forms of bullying are serious and should be reported', 3),

-- Online Safety Basics (Ages 10-14)
('online-safety-basics', 'Never share personal information like your address or phone number', 0),
('online-safety-basics', 'Use strong, unique passwords for all your accounts', 1),
('online-safety-basics', 'Be careful about what you post - it can be permanent', 2),
('online-safety-basics', 'Tell a trusted adult if someone online makes you uncomfortable', 3),

-- Understanding Consent (Ages 15-19)
('understanding-consent', 'Consent means saying yes freely without pressure', 0),
('understanding-consent', 'You can change your mind at any time', 1),
('understanding-consent', 'Consent cannot be given if someone is impaired or pressured', 2),
('understanding-consent', 'Respecting consent builds trust and healthy relationships', 3),

-- Emotional Abuse and Control (Ages 15-19)
('emotional-abuse-control', 'Emotional abuse can be harder to see than physical abuse', 0),
('emotional-abuse-control', 'Control often starts small and gradually increases', 1),
('emotional-abuse-control', 'Gaslighting makes you question your own reality', 2),
('emotional-abuse-control', 'You deserve relationships built on respect, not control', 3);

-- Insert sample scenarios for practice
INSERT INTO lesson_scenarios (lesson_id, situation, options, correct_answer_index, explanation, order_index) VALUES
-- Stranger Danger Basics
('stranger-danger-basics', 'A person you don''t know offers you candy and asks you to come to their car. What should you do?',
 ARRAY['Go with them to get the candy', 'Say no and find a trusted adult immediately', 'Ask them to bring the candy to you'], 1,
 'Never go anywhere with a stranger, even if they offer treats. Always say no and find a trusted adult right away.', 0),

('stranger-danger-basics', 'At the store, someone says they know your mom and offers to take you to her. What should you do?',
 ARRAY['Go with them since they know your mom', 'Stay where you are and ask a store employee for help', 'Ask them to prove they know your mom'], 1,
 'Never go anywhere with someone you don''t know, even if they claim to know your family. Find a trusted adult like a store employee.', 1),

-- Types of Bullying
('types-of-bullying', 'Someone at school keeps sending you mean messages online and sharing embarrassing photos of you. What should you do?',
 ARRAY['Send mean messages back', 'Block them and tell a trusted adult', 'Delete your social media accounts'], 1,
 'This is cyberbullying. Block the person and tell a trusted adult who can help you report it and stop it from continuing.', 0),

('types-of-bullying', 'You see someone being bullied at school. What''s the best way to help?',
 ARRAY['Join in with the bullying', 'Tell a trusted adult and offer support to the person being bullied', 'Just ignore it'], 1,
 'The best way to help is to tell a trusted adult and show support for the person being bullied. Bystanders can make a big difference.', 1),

-- Understanding Consent
('understanding-consent', 'Your partner wants to do something physical that you''re not comfortable with. They say "if you really loved me, you would do this." What should you do?',
 ARRAY['Give in because they said they love you', 'Firmly say no and explain that love means respecting boundaries', 'Avoid talking about it'], 1,
 'This is manipulation. True love means respecting boundaries. You have the right to say no to anything that makes you uncomfortable.', 0),

('understanding-consent', 'A friend asks you to do something you''re not sure about. What''s the best approach?',
 ARRAY['Do it anyway to avoid conflict', 'Ask for time to think about it and trust your feelings', 'Do it but complain about it later'], 1,
 'It''s always okay to ask for time to think. Trust your feelings and don''t let anyone pressure you into decisions.', 1);

-- Insert quiz questions for assessment
INSERT INTO lesson_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, order_index) VALUES
-- Stranger Danger Basics
('stranger-danger-basics', 'What should you do if a stranger asks you to help find their lost pet?',
 ARRAY['Help them look for the pet', 'Say no and walk away', 'Ask your friends to help too'], 1,
 'Adults should ask other adults for help, not children. Always say no to strangers asking for help and walk away.', 0),

('stranger-danger-basics', 'If you get separated from your family at a crowded place, what should you do first?',
 ARRAY['Look for them by walking around', 'Stay where you are and look for a police officer or security guard', 'Ask any adult for help'], 1,
 'Stay in one place so your family can find you, and look for uniformed officials like police or security guards for help.', 1),

-- Good Touch vs Bad Touch
('good-touch-bad-touch', 'What should you do if someone touches you in a way that makes you feel uncomfortable?',
 ARRAY['Keep it a secret', 'Say no and tell a trusted adult', 'Just ignore it'], 1,
 'You should always say no to uncomfortable touch and tell a trusted adult. Your body belongs to you.', 0),

('good-touch-bad-touch', 'Which of these is a good touch?',
 ARRAY['A hug from someone you love when you want it', 'Someone touching you when you said no', 'A touch that makes you feel scared'], 0,
 'Good touches are wanted, safe, and make you feel comfortable. You should always want and agree to good touches.', 1),

-- Types of Bullying
('types-of-bullying', 'What is the best way to help someone who is being bullied?',
 ARRAY['Join in with the bullying', 'Tell a trusted adult and offer support to the person being bullied', 'Ignore it'], 1,
 'The best way to help is to tell a trusted adult and show support for the person being bullied. Bystanders can make a big difference.', 0),

('types-of-bullying', 'Which of these is considered cyberbullying?',
 ARRAY['Sending threatening messages online', 'Sharing embarrassing photos without permission', 'Both of the above'], 2,
 'Cyberbullying includes threatening messages, sharing private content, spreading rumors, and other harmful online behaviors.', 1),

-- Online Safety Basics
('online-safety-basics', 'What makes a strong password?',
 ARRAY['Your birthday', 'A mix of letters, numbers, and symbols', 'Your pet''s name'], 1,
 'Strong passwords use a combination of uppercase, lowercase, numbers, and symbols, and are unique for each account.', 0),

('online-safety-basics', 'What should you do if someone online asks to meet you in person?',
 ARRAY['Meet them in a public place', 'Tell a trusted adult and never meet alone', 'Ignore the request'], 1,
 'Always tell a trusted adult about meeting requests. If you do meet, it should be in a public place with adult supervision.', 1),

-- Understanding Consent
('understanding-consent', 'Which of these is true about consent?',
 ARRAY['Once you say yes, you can''t change your mind', 'Consent can be withdrawn at any time', 'Consent isn''t needed in relationships'], 1,
 'Consent can always be withdrawn at any time. You have the right to change your mind about anything.', 0),

('understanding-consent', 'What should you do if someone pressures you after you''ve said no?',
 ARRAY['Give in to avoid conflict', 'Firmly repeat your no and remove yourself from the situation', 'Feel guilty for saying no'], 1,
 'Your no should be respected. If someone continues to pressure you, firmly repeat your boundary and remove yourself from the situation.', 1);

-- Insert daily stories aligned with the framework
INSERT INTO daily_stories (id, title, description, moral_lesson, category) VALUES
-- Ages 5-9 Stories
('maya-playground-stranger', 'Maya and the Playground Stranger', 'Maya learns about stranger safety when someone she doesn''t know approaches her at the playground',
 'Always stay close to trusted adults and never go anywhere with strangers, even if they seem nice or offer treats.', 'physical'),

('sam-uncomfortable-touch', 'Sam''s Uncomfortable Moment', 'Sam learns about body boundaries when someone wants to touch them in a way that doesn''t feel right',
 'You have the right to say no to any touch that makes you uncomfortable. Your body belongs to you.', 'physical'),

('lily-bad-secret', 'Lily''s Confusing Secret', 'Lily learns the difference between good surprises and bad secrets when someone asks her to keep something that makes her feel worried',
 'Good surprises make people happy, but bad secrets make you feel worried or scared. Always tell a trusted adult about uncomfortable secrets.', 'emotional'),

-- Ages 10-14 Stories
('alex-cyberbullying-chat', 'Alex and the Mean Messages', 'Alex learns how to handle cyberbullying when classmates start sending mean messages online',
 'Cyberbullying is never okay. Block bullies, save evidence, and tell trusted adults who can help stop it.', 'social'),

('jordan-online-stranger', 'Jordan''s Online "Friend"', 'Jordan learns about online safety when someone they met online wants to meet in person',
 'Never meet online friends in person without telling your parents. If someone asks you to keep secrets from your parents, that''s a warning sign.', 'online'),

('casey-peer-pressure', 'Casey''s Difficult Choice', 'Casey faces peer pressure from friends and learns to stick to their values',
 'True friends respect your decisions and boundaries. You don''t have to do something that makes you uncomfortable to fit in.', 'social'),

-- Ages 15-19 Stories
('riley-party-pressure', 'Riley''s Party Dilemma', 'Riley faces pressure at a party and learns about making safe choices in challenging situations',
 'You have the right to make your own choices about your body and activities. Real friends will respect your boundaries.', 'social'),

('sam-relationship-boundaries', 'Sam''s Relationship Lesson', 'Sam learns about setting boundaries and recognizing manipulation in a dating relationship',
 'Healthy relationships are built on respect and consent. Anyone who pressures you or threatens to leave doesn''t truly care about you.', 'social'),

('taylor-digital-harassment', 'Taylor''s Digital Nightmare', 'Taylor learns how to handle digital harassment and stalking from an ex-partner',
 'Digital harassment and stalking are serious crimes. Document everything, don''t engage, and seek help from authorities and trusted adults.', 'online'),

('morgan-toxic-friend', 'Morgan''s Controlling Friend', 'Morgan learns to recognize when a friendship becomes controlling and unhealthy',
 'Healthy friendships are based on mutual respect and support, not control. It''s important to set boundaries even with close friends.', 'social');

-- Insert daily story age groups using current enum values
INSERT INTO daily_story_age_groups (daily_story_id, age_group) VALUES
-- Ages 5-9 stories
('maya-playground-stranger', '5-8'),
('sam-uncomfortable-touch', '5-8'),
('lily-bad-secret', '5-8'),

-- Ages 10-14 stories
('alex-cyberbullying-chat', '9-12'),
('jordan-online-stranger', '9-12'),
('casey-peer-pressure', '9-12'),

-- Some stories span multiple groups
('alex-cyberbullying-chat', '13-16'),
('jordan-online-stranger', '13-16'),
('casey-peer-pressure', '13-16'),

-- Ages 15-19 stories
('riley-party-pressure', '13-16'),
('sam-relationship-boundaries', '13-16'),
('taylor-digital-harassment', '13-16'),
('morgan-toxic-friend', '13-16'),

('riley-party-pressure', '17-19'),
('sam-relationship-boundaries', '17-19'),
('taylor-digital-harassment', '17-19'),
('morgan-toxic-friend', '17-19');

-- Insert daily story scenarios
INSERT INTO daily_story_scenarios (daily_story_id, situation, options, correct_answer_index, explanation, encouragement, order_index) VALUES
-- Maya's Playground Stranger (Ages 5-9)
('maya-playground-stranger', 'Maya is playing at the playground when a person she doesn''t know says, "Hi! I''m here to help kids. Want me to push you on the swing?" What should Maya do?',
 ARRAY['Say yes because they seem nice', 'Say "No thank you" and go find her mom', 'Ask them to play a different game'], 1,
 'Maya did the right thing! Even when strangers seem nice, it''s always best to say no and find a trusted adult.',
 'Great choice! You know how to stay safe with strangers.', 0),

('maya-playground-stranger', 'The person says, "But I have candy in my car if you come with me." What should Maya do now?',
 ARRAY['Go get the candy', 'Run to find her mom right away', 'Ask for the candy to be brought to her'], 1,
 'Maya should run to her mom immediately! Strangers should never ask children to come to their car, even for treats.',
 'Perfect! You know that safe adults don''t ask kids to come to their cars.', 1),

-- Sam's Uncomfortable Touch (Ages 5-9)
('sam-uncomfortable-touch', 'At a family gathering, someone Sam doesn''t know very well says, "Come give me a big hug!" But Sam feels uncomfortable and doesn''t want to hug. What should Sam do?',
 ARRAY['Give the hug anyway to be polite', 'Say "I don''t want to hug right now" and offer a wave instead', 'Hide behind mom or dad'], 1,
 'Sam has the right to say no to hugs! It''s okay to offer a wave, high-five, or just say hello instead.',
 'Excellent! Your body belongs to you, and you can choose who touches you.', 0),

-- Alex's Cyberbullying Chat (Ages 10-14)
('alex-cyberbullying-chat', 'Alex receives mean messages from classmates in a group chat. They''re sharing embarrassing photos and making fun of another student. What should Alex do?',
 ARRAY['Join in so they don''t target Alex next', 'Leave the group chat and tell a trusted adult', 'Just ignore the messages'], 1,
 'Alex should leave the group chat and tell a trusted adult. This is cyberbullying, and it''s important to get help rather than participate.',
 'Excellent choice! Standing up against bullying shows real courage.', 0),

('alex-cyberbullying-chat', 'The next day, some classmates ask Alex why they left the group chat and say "it was just a joke." How should Alex respond?',
 ARRAY['Agree that it was just a joke', 'Explain that making fun of someone isn''t a joke and can really hurt', 'Rejoin the group chat to fit in'], 1,
 'Alex is right to explain that hurting someone''s feelings isn''t a joke. Real jokes don''t make people feel bad about themselves.',
 'Great thinking! You understand the difference between harmless fun and hurtful behavior.', 1),

-- Jordan's Online Stranger (Ages 10-14)
('jordan-online-stranger', 'Jordan has been chatting with someone online who claims to be 13 years old. This person asks Jordan to meet at the local mall and says "don''t tell your parents, they won''t understand our friendship." What should Jordan do?',
 ARRAY['Meet them at the mall as planned', 'Tell parents immediately about the request', 'Suggest meeting somewhere else instead'], 1,
 'Jordan should tell their parents right away! When someone asks you to keep secrets from your parents, that''s a big warning sign.',
 'Smart choice! You recognized a dangerous situation and knew to get help.', 0),

-- Sam's Relationship Boundaries (Ages 15-19)
('sam-relationship-boundaries', 'Sam''s partner keeps pressuring them to do things they''re not comfortable with, saying "if you really cared about me, you would do this." How should Sam respond?',
 ARRAY['Give in to prove they care', 'Firmly restate their boundaries and explain that love means respect', 'Avoid the topic'], 1,
 'Sam should firmly restate their boundaries. Real love and care means respecting someone''s limits, not pressuring them.',
 'Excellent! You understand that healthy relationships are built on respect and consent.', 0),

('sam-relationship-boundaries', 'Sam''s partner gets angry and says "fine, maybe I should find someone who actually wants to be with me." What should Sam do?',
 ARRAY['Apologize and reconsider their boundaries', 'Recognize this as manipulation and consider if this is a healthy relationship', 'Try to compromise to save the relationship'], 1,
 'This is emotional manipulation. A caring partner would never threaten to leave because someone isn''t ready for something. Sam should seriously reconsider this relationship.',
 'Smart recognition! You can identify manipulation tactics and know that healthy relationships don''t involve threats or ultimatums.', 1),

-- Taylor's Digital Harassment (Ages 15-19)
('taylor-digital-harassment', 'After Taylor ends a relationship, their ex starts constantly texting, calling, and commenting on all their social media posts. The ex also creates fake accounts to follow Taylor when blocked. What should Taylor do?',
 ARRAY['Respond to tell them to stop', 'Document everything and report to authorities', 'Just ignore it and hope it stops'], 1,
 'Taylor should document all contact and report it. This is digital stalking and harassment, which can escalate. Don''t engage - just collect evidence.',
 'Perfect response! You know how to protect yourself by documenting abuse and seeking proper help.', 0);