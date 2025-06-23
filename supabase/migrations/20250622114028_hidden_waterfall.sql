-- First, completely clear existing content to avoid conflicts
DELETE FROM lesson_quiz_questions;
DELETE FROM lesson_scenarios;
DELETE FROM lesson_key_points;
DELETE FROM lesson_age_groups;
DELETE FROM lessons;

DELETE FROM daily_story_scenarios;
DELETE FROM daily_story_age_groups;
DELETE FROM daily_stories;

-- Update the enum type by creating a new one and migrating data
ALTER TYPE age_group_enum RENAME TO age_group_enum_old;
CREATE TYPE age_group_enum AS ENUM ('5-10', '11-15', '16-19');

-- Update users table with proper mapping
ALTER TABLE users 
  ALTER COLUMN age_group TYPE age_group_enum 
  USING CASE 
    WHEN age_group::text = '5-8' THEN '5-10'::age_group_enum
    WHEN age_group::text = '9-12' THEN '11-15'::age_group_enum
    WHEN age_group::text = '13-16' THEN '16-19'::age_group_enum
    WHEN age_group::text = '17-19' THEN '16-19'::age_group_enum
    ELSE '11-15'::age_group_enum
  END;

-- Update lesson_age_groups table (even though it's empty now)
ALTER TABLE lesson_age_groups 
  ALTER COLUMN age_group TYPE age_group_enum 
  USING CASE 
    WHEN age_group::text = '5-8' THEN '5-10'::age_group_enum
    WHEN age_group::text = '9-12' THEN '11-15'::age_group_enum
    WHEN age_group::text = '13-16' THEN '16-19'::age_group_enum
    WHEN age_group::text = '17-19' THEN '16-19'::age_group_enum
    ELSE '11-15'::age_group_enum
  END;

-- Update daily_story_age_groups table (even though it's empty now)
ALTER TABLE daily_story_age_groups 
  ALTER COLUMN age_group TYPE age_group_enum 
  USING CASE 
    WHEN age_group::text = '5-8' THEN '5-10'::age_group_enum
    WHEN age_group::text = '9-12' THEN '11-15'::age_group_enum
    WHEN age_group::text = '13-16' THEN '16-19'::age_group_enum
    WHEN age_group::text = '17-19' THEN '16-19'::age_group_enum
    ELSE '11-15'::age_group_enum
  END;

-- Now we can safely drop the old enum
DROP TYPE age_group_enum_old;

-- Update user age constraints to match new groups
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_age_check;
ALTER TABLE users ADD CONSTRAINT users_age_check CHECK (age >= 5 AND age <= 19);

-- Update handle_new_user_signup function for new age groups
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (
    id,
    name,
    age,
    age_group,
    avatar,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 12),
    COALESCE(NEW.raw_user_meta_data->>'age_group', '11-15')::age_group_enum,
    COALESCE(NEW.raw_user_meta_data->>'avatar', ''),
    NOW(),
    NOW()
  );

  -- Insert into user_progress table
  INSERT INTO public.user_progress (
    user_id,
    current_level,
    total_lessons_completed,
    streak_days,
    total_points,
    completed_lesson_ids,
    last_activity_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    1,
    0,
    1,
    0,
    '{}',
    CURRENT_DATE,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error in handle_new_user_signup: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert lessons aligned with the new learning framework

-- Group 1 (Ages 5-10) Lessons
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

('trusted-adults-help', 'Trusted Adults and How to Ask for Help', 'Identifying safe adults and learning when and how to ask for help', 12, 'easy', 'social',
 'Knowing who your trusted adults are and how to ask for help keeps you safe and supported.',
 ARRAY['Trusted adults are people your parents say are safe', 'It''s always okay to ask for help when you need it', 'Tell a trusted adult if something makes you feel unsafe']),

('emergency-basics', 'Emergency Basics', 'Learning what to do in emergency situations and how to call for help', 15, 'easy', 'emergency',
 'Knowing what to do in an emergency can help keep you and others safe.',
 ARRAY['Know your full name, address, and phone number', 'Call 999 or 112 for emergencies', 'Stay calm and speak clearly when asking for help']),

('saying-no-telling', 'Saying No and Telling Someone', 'Building confidence to say no and tell trusted adults about problems', 10, 'easy', 'emotional',
 'Learning to say no and tell trusted adults helps you stay safe and feel confident.',
 ARRAY['It''s okay to say no when something doesn''t feel right', 'Always tell a trusted adult if someone makes you uncomfortable', 'You won''t get in trouble for telling the truth']),

('body-cues-feelings', 'Recognizing Body Cues When Something Feels Wrong', 'Understanding how your body tells you when something isn''t right', 12, 'easy', 'emotional',
 'Your body has ways of telling you when something doesn''t feel safe. Learning to listen to these feelings helps keep you protected.',
 ARRAY['Trust your gut feelings', 'If your tummy feels funny or you feel scared, tell someone', 'Your feelings are important and valid']);

-- Group 2 (Ages 11-15) Lessons  
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

('uncomfortable-secrets', 'Secrets That Feel Uncomfortable', 'Understanding when secrets are harmful and what to do about them', 15, 'medium', 'emotional',
 'Some secrets can be harmful. Learning the difference helps you know when to speak up.',
 ARRAY['Secrets that make you feel bad should be shared with trusted adults', 'You''re not responsible for keeping harmful secrets', 'Speaking up about uncomfortable secrets helps keep everyone safe']),

('recognizing-manipulation', 'Recognizing Manipulation and Unfair Treatment', 'Identifying when someone is trying to manipulate or treat you unfairly', 20, 'medium', 'emotional',
 'Learning to recognize manipulation helps you protect yourself and make better decisions about relationships.',
 ARRAY['Trust your feelings if something doesn''t seem fair', 'Manipulation often involves making you feel guilty or scared', 'You deserve to be treated with respect']),

('building-self-esteem', 'Building Self-Esteem and Standing Up for Others', 'Developing confidence in yourself and learning to support others', 16, 'medium', 'emotional',
 'Building self-esteem helps you feel confident and empowers you to help others.',
 ARRAY['You are valuable and deserve respect', 'Standing up for others shows strength and kindness', 'Believe in yourself and your abilities']),

('healthy-friendships', 'What a Healthy Friendship Looks Like', 'Understanding the qualities of good friendships and relationships', 18, 'medium', 'social',
 'Healthy friendships are built on respect, trust, and kindness. Learning what to look for helps you build better relationships.',
 ARRAY['Good friends respect your boundaries and decisions', 'Healthy friendships involve give and take', 'You should feel good about yourself in a healthy friendship']);

-- Group 3 (Ages 16-19) Lessons
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

('emotional-abuse-control', 'Recognizing Emotional Abuse, Manipulation, and Control', 'Identifying controlling behaviors, gaslighting, and other forms of emotional abuse', 28, 'hard', 'emotional',
 'Emotional abuse can be harder to recognize than physical abuse, but it''s just as serious and harmful.',
 ARRAY['Trust your feelings if something doesn''t feel right in a relationship', 'Manipulation often starts small and gradually increases', 'You deserve relationships built on respect, not control']),

('power-dynamics', 'Understanding Power Dynamics in Relationships', 'Learning about how power imbalances can affect relationships and safety', 20, 'hard', 'social',
 'Understanding power dynamics helps you recognize when relationships might not be equal or safe.',
 ARRAY['Healthy relationships have balanced power', 'Age, authority, or dependency can create power imbalances', 'Be aware of how power affects your relationships']),

('ending-relationships-safely', 'How to End a Relationship Safely', 'Learning strategies for ending unhealthy relationships while staying safe', 22, 'hard', 'social',
 'Sometimes relationships need to end. Knowing how to do this safely is important for your wellbeing.',
 ARRAY['Plan ahead when ending a potentially dangerous relationship', 'Seek support from trusted adults and friends', 'Your safety is more important than someone else''s feelings']),

('supporting-friends', 'Supporting Friends in Unsafe Situations', 'Learning how to help friends who may be in dangerous or unhealthy situations', 18, 'hard', 'social',
 'Knowing how to support friends in difficult situations can help keep them safe.',
 ARRAY['Listen without judgment', 'Encourage them to seek help from trusted adults', 'Don''t try to rescue them yourself - get professional help']),

('reporting-abuse-rights', 'Reporting Abuse and Knowing Your Rights', 'Understanding how and where to report abuse and what your rights are', 25, 'hard', 'social',
 'Knowing your rights and how to report abuse empowers you to protect yourself and others.',
 ARRAY['You have the right to be safe and respected', 'There are many resources available to help you', 'Reporting abuse can help protect you and others']),

('unhealthy-partner-behaviors', 'Recognizing Unhealthy Partner Behaviors', 'Identifying warning signs like control disguised as care, isolation, and emotional manipulation', 30, 'hard', 'emotional',
 'Learning to recognize unhealthy behaviors early can help you avoid dangerous relationships.',
 ARRAY['Control disguised as care is still control', 'Isolation from friends and family is a warning sign', 'Love-bombing followed by criticism is a manipulation tactic']);

-- Insert lesson age groups (one record per lesson-age group combination)
INSERT INTO lesson_age_groups (lesson_id, age_group) VALUES
-- Ages 5-10 lessons
('safe-vs-unsafe-behavior', '5-10'),
('stranger-danger-basics', '5-10'),
('good-touch-bad-touch', '5-10'),
('secrets-vs-surprises', '5-10'),
('trusted-adults-help', '5-10'),
('emergency-basics', '5-10'),
('saying-no-telling', '5-10'),
('body-cues-feelings', '5-10'),

-- Ages 11-15 lessons
('types-of-bullying', '11-15'),
('online-safety-basics', '11-15'),
('setting-personal-boundaries', '11-15'),
('peer-pressure-decisions', '11-15'),
('uncomfortable-secrets', '11-15'),
('recognizing-manipulation', '11-15'),
('building-self-esteem', '11-15'),
('healthy-friendships', '11-15'),

-- Ages 16-19 lessons
('healthy-vs-unhealthy-relationships', '16-19'),
('understanding-consent', '16-19'),
('online-privacy-exploitation', '16-19'),
('emotional-abuse-control', '16-19'),
('power-dynamics', '16-19'),
('ending-relationships-safely', '16-19'),
('supporting-friends', '16-19'),
('reporting-abuse-rights', '16-19'),
('unhealthy-partner-behaviors', '16-19');

-- Insert lesson key points based on the framework
INSERT INTO lesson_key_points (lesson_id, point_text, order_index) VALUES
-- Safe vs Unsafe Behavior (Ages 5-10)
('safe-vs-unsafe-behavior', 'Safe behaviors make you feel good and protected', 0),
('safe-vs-unsafe-behavior', 'Unsafe behaviors might make you feel scared or uncomfortable', 1),
('safe-vs-unsafe-behavior', 'Always tell a trusted adult if something feels unsafe', 2),
('safe-vs-unsafe-behavior', 'Trust your feelings about what feels right', 3),

-- Stranger Danger Basics (Ages 5-10)
('stranger-danger-basics', 'A stranger is someone you don''t know well', 0),
('stranger-danger-basics', 'Never accept gifts or rides from strangers', 1),
('stranger-danger-basics', 'Stay close to trusted adults in public', 2),
('stranger-danger-basics', 'Know your full name, address, and phone number', 3),

-- Good Touch vs Bad Touch (Ages 5-10)
('good-touch-bad-touch', 'Good touches are safe, wanted, and make you feel comfortable', 0),
('good-touch-bad-touch', 'Bad touches make you feel uncomfortable, scared, or confused', 1),
('good-touch-bad-touch', 'You have the right to say no to any touch', 2),
('good-touch-bad-touch', 'Tell a trusted adult about any touch that doesn''t feel right', 3),

-- Secrets vs Surprises (Ages 5-10)
('secrets-vs-surprises', 'Good surprises are happy and make people smile', 0),
('secrets-vs-surprises', 'Bad secrets make you feel worried, scared, or confused', 1),
('secrets-vs-surprises', 'You should never keep secrets that make you uncomfortable', 2),
('secrets-vs-surprises', 'Always tell a trusted adult about bad secrets', 3),

-- Types of Bullying (Ages 11-15)
('types-of-bullying', 'Physical bullying involves hitting, pushing, or damaging property', 0),
('types-of-bullying', 'Verbal bullying includes name-calling, threats, and mean comments', 1),
('types-of-bullying', 'Cyberbullying happens online through messages, posts, or images', 2),
('types-of-bullying', 'All forms of bullying are serious and should be reported', 3),

-- Online Safety Basics (Ages 11-15)
('online-safety-basics', 'Never share personal information like your address or phone number', 0),
('online-safety-basics', 'Use strong, unique passwords for all your accounts', 1),
('online-safety-basics', 'Be careful about what you post - it can be permanent', 2),
('online-safety-basics', 'Tell a trusted adult if someone online makes you uncomfortable', 3),

-- Understanding Consent (Ages 16-19)
('understanding-consent', 'Consent means saying yes freely without pressure', 0),
('understanding-consent', 'You can change your mind at any time', 1),
('understanding-consent', 'Consent cannot be given if someone is impaired or pressured', 2),
('understanding-consent', 'Respecting consent builds trust and healthy relationships', 3),

-- Unhealthy Partner Behaviors (Ages 16-19)
('unhealthy-partner-behaviors', 'Control disguised as care is still controlling behavior', 0),
('unhealthy-partner-behaviors', 'Isolation from friends and family is a warning sign', 1),
('unhealthy-partner-behaviors', 'Love-bombing followed by criticism is manipulation', 2),
('unhealthy-partner-behaviors', 'Gaslighting makes you question your own reality', 3);

-- Insert sample scenarios
INSERT INTO lesson_scenarios (lesson_id, situation, options, correct_answer_index, explanation, order_index) VALUES
('stranger-danger-basics', 'A person you don''t know offers you candy and asks you to come to their car. What should you do?',
 ARRAY['Go with them to get the candy', 'Say no and find a trusted adult immediately', 'Ask them to bring the candy to you'], 1,
 'Never go anywhere with a stranger, even if they offer treats. Always say no and find a trusted adult right away.', 0),

('good-touch-bad-touch', 'Someone touches you in a way that makes you feel uncomfortable. What should you do?',
 ARRAY['Keep it a secret', 'Say no and tell a trusted adult', 'Just ignore it'], 1,
 'You should always say no to uncomfortable touch and tell a trusted adult. Your body belongs to you.', 0),

('types-of-bullying', 'Someone at school keeps sending you mean messages online and sharing embarrassing photos of you. What should you do?',
 ARRAY['Send mean messages back', 'Block them and tell a trusted adult', 'Delete your social media accounts'], 1,
 'This is cyberbullying. Block the person and tell a trusted adult who can help you report it and stop it from continuing.', 0),

('understanding-consent', 'Your partner wants to do something physical that you''re not comfortable with. They say "if you really loved me, you would do this." What should you do?',
 ARRAY['Give in because they said they love you', 'Firmly say no and explain that love means respecting boundaries', 'Avoid talking about it'], 1,
 'This is manipulation. True love means respecting boundaries. You have the right to say no to anything that makes you uncomfortable.', 0);

-- Insert quiz questions
INSERT INTO lesson_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, order_index) VALUES
('stranger-danger-basics', 'What should you do if a stranger asks you to help find their lost pet?',
 ARRAY['Help them look for the pet', 'Say no and walk away', 'Ask your friends to help too'], 1,
 'Adults should ask other adults for help, not children. Always say no to strangers asking for help and walk away.', 0),

('stranger-danger-basics', 'What information is safe to tell a stranger?',
 ARRAY['Your full name and address', 'Your school name and teacher', 'Nothing personal - just be polite'], 2,
 'You should never share personal information with strangers. It''s okay to be polite, but keep your personal details private.', 1),

('good-touch-bad-touch', 'What should you do if someone touches you in a way that makes you feel uncomfortable?',
 ARRAY['Keep it a secret', 'Say no and tell a trusted adult', 'Just ignore it'], 1,
 'You should always say no to uncomfortable touch and tell a trusted adult. Your body belongs to you.', 0),

('good-touch-bad-touch', 'What makes someone a "trusted adult"?',
 ARRAY['Any adult who is nice to you', 'Adults your parents have told you are safe', 'Adults who give you gifts'], 1,
 'Trusted adults are people your parents or guardians have specifically told you are safe to talk to and ask for help.', 1),

('types-of-bullying', 'What is the best way to help someone who is being bullied?',
 ARRAY['Join in with the bullying', 'Tell a trusted adult and offer support to the person being bullied', 'Ignore it'], 1,
 'The best way to help is to tell a trusted adult and show support for the person being bullied. Bystanders can make a big difference.', 0),

('types-of-bullying', 'Which of these is considered cyberbullying?',
 ARRAY['Sending threatening messages', 'Sharing embarrassing photos without permission', 'Both of the above'], 2,
 'Cyberbullying includes threatening messages, sharing private content, spreading rumors, and other harmful online behaviors.', 1),

('understanding-consent', 'Which of these is true about consent?',
 ARRAY['Once you say yes, you can''t change your mind', 'Consent can be withdrawn at any time', 'Consent isn''t needed in relationships'], 1,
 'Consent can always be withdrawn at any time. You have the right to change your mind about anything.', 0),

('understanding-consent', 'What should you do if someone pressures you after you''ve said no?',
 ARRAY['Give in to avoid conflict', 'Firmly repeat your no and remove yourself from the situation', 'Try to compromise'], 1,
 'When someone doesn''t respect your no, it''s important to be firm and remove yourself from the situation if possible.', 1);

-- Insert daily stories aligned with the framework
INSERT INTO daily_stories (id, title, description, moral_lesson, category) VALUES
('maya-playground-stranger', 'Maya and the Playground Stranger', 'Maya learns about stranger safety when someone she doesn''t know approaches her at the playground',
 'Always stay close to trusted adults and never go anywhere with strangers, even if they seem nice or offer treats.', 'physical'),

('sam-uncomfortable-secret', 'Sam''s Uncomfortable Secret', 'Sam learns about the difference between good surprises and bad secrets',
 'Secrets that make you feel bad or scared should always be shared with trusted adults. You won''t get in trouble for telling the truth.', 'emotional'),

('lily-body-feelings', 'Lily Listens to Her Body', 'Lily learns to trust her body''s signals when something doesn''t feel right',
 'Your body has ways of telling you when something doesn''t feel safe. Trust your feelings and tell a trusted adult.', 'emotional'),

('alex-cyberbullying-chat', 'Alex and the Mean Messages', 'Alex learns how to handle cyberbullying when classmates start sending mean messages online',
 'Cyberbullying is never okay. Block bullies, save evidence, and tell trusted adults who can help stop it.', 'social'),

('jordan-online-stranger', 'Jordan''s Online "Friend"', 'Jordan learns about online safety when someone they met online wants to meet in person',
 'Never meet online friends in person without telling your parents. If someone asks you to keep secrets from your parents, that''s a warning sign.', 'online'),

('riley-party-pressure', 'Riley''s Difficult Choice', 'Riley faces peer pressure at a party and learns to stick to their values',
 'True friends respect your decisions and boundaries. You don''t have to do something that makes you uncomfortable to fit in.', 'social'),

('morgan-toxic-friend', 'Morgan''s Controlling Friend', 'Morgan learns to recognize when a friendship becomes controlling and unhealthy',
 'Healthy friendships are based on mutual respect and support, not control. It''s important to set boundaries even with close friends.', 'social'),

('sam-relationship-boundaries', 'Sam''s Relationship Lesson', 'Sam learns about setting boundaries and recognizing manipulation in a dating relationship',
 'Healthy relationships are built on respect and consent. Anyone who pressures you or threatens to leave doesn''t truly care about you.', 'social'),

('casey-digital-stalking', 'Casey''s Digital Nightmare', 'Casey learns how to handle digital harassment and stalking from an ex-partner',
 'Digital harassment and stalking are serious crimes. Document everything, don''t engage, and seek help from authorities and trusted adults.', 'online'),

('taylor-controlling-partner', 'Taylor''s Wake-Up Call', 'Taylor learns to recognize controlling behaviors disguised as care in their relationship',
 'Control disguised as care is still control. Healthy partners support your independence and relationships with others.', 'emotional');

-- Insert daily story age groups
INSERT INTO daily_story_age_groups (daily_story_id, age_group) VALUES
('maya-playground-stranger', '5-10'),
('sam-uncomfortable-secret', '5-10'),
('lily-body-feelings', '5-10'),
('alex-cyberbullying-chat', '11-15'),
('jordan-online-stranger', '11-15'),
('riley-party-pressure', '11-15'),
('morgan-toxic-friend', '11-15'),
('sam-relationship-boundaries', '16-19'),
('casey-digital-stalking', '16-19'),
('taylor-controlling-partner', '16-19');

-- Insert daily story scenarios
INSERT INTO daily_story_scenarios (daily_story_id, situation, options, correct_answer_index, explanation, encouragement, order_index) VALUES
('maya-playground-stranger', 'Maya is playing at the playground when a person she doesn''t know says, "Hi! I''m here to help kids. Want me to push you on the swing?" What should Maya do?',
 ARRAY['Say yes because they seem nice', 'Say "No thank you" and go find her mom', 'Ask them to play a different game'], 1,
 'Maya did the right thing! Even when strangers seem nice, it''s always best to say no and find a trusted adult.',
 'Great choice! You know how to stay safe with strangers.', 0),

('maya-playground-stranger', 'The person says, "But I have candy in my car if you come with me." What should Maya do now?',
 ARRAY['Go get the candy', 'Run to find her mom right away', 'Ask for the candy to be brought to her'], 1,
 'Maya should run to her mom immediately! Strangers should never ask children to come to their car, even for treats.',
 'Perfect! You know that safe adults don''t ask kids to come to their cars.', 1),

('sam-uncomfortable-secret', 'Someone tells Sam a secret that makes Sam feel scared and worried. They say "you can''t tell anyone or you''ll get in big trouble." What should Sam do?',
 ARRAY['Keep the secret to avoid trouble', 'Tell a trusted adult about the secret', 'Only tell their best friend'], 1,
 'Sam should tell a trusted adult. Secrets that make you feel scared or worried should always be shared with someone who can help.',
 'Excellent! You know that some secrets need to be shared to keep everyone safe.', 0),

('alex-cyberbullying-chat', 'Alex receives mean messages from classmates in a group chat. They''re sharing embarrassing photos and making fun of another student. What should Alex do?',
 ARRAY['Join in so they don''t target Alex next', 'Leave the group chat and tell a trusted adult', 'Just ignore the messages'], 1,
 'Alex should leave the group chat and tell a trusted adult. This is cyberbullying, and it''s important to get help rather than participate.',
 'Excellent choice! Standing up against bullying shows real courage.', 0),

('alex-cyberbullying-chat', 'The next day, some classmates ask Alex why they left the group chat and say "it was just a joke." How should Alex respond?',
 ARRAY['Agree that it was just a joke', 'Explain that making fun of someone isn''t a joke and can really hurt', 'Rejoin the group chat to fit in'], 1,
 'Alex is right to explain that hurting someone''s feelings isn''t a joke. Real jokes don''t make people feel bad about themselves.',
 'Great thinking! You understand the difference between harmless fun and hurtful behavior.', 1),

('sam-relationship-boundaries', 'Sam''s partner keeps pressuring them to do things they''re not comfortable with, saying "if you really cared about me, you would do this." How should Sam respond?',
 ARRAY['Give in to prove they care', 'Firmly restate their boundaries and explain that love means respect', 'Avoid the topic'], 1,
 'Sam should firmly restate their boundaries. Real love and care means respecting someone''s limits, not pressuring them.',
 'Excellent! You understand that healthy relationships are built on respect and consent.', 0),

('sam-relationship-boundaries', 'When Sam sets boundaries, their partner gets angry and says "fine, maybe I should find someone who actually wants to be with me." What should Sam do?',
 ARRAY['Apologize and reconsider their boundaries', 'Recognize this as manipulation and consider if this is a healthy relationship', 'Try to compromise to save the relationship'], 1,
 'This is emotional manipulation. A caring partner would never threaten to leave because someone isn''t ready for something. Sam should seriously reconsider this relationship.',
 'Smart recognition! You can identify manipulation tactics and know that healthy relationships don''t involve threats or ultimatums.', 1),

('taylor-controlling-partner', 'Taylor''s partner says they''re "just looking out for them" by telling them what to wear and who they can hang out with. What should Taylor recognize?',
 ARRAY['This shows how much their partner cares', 'This is controlling behavior disguised as care', 'This is normal in relationships'], 1,
 'This is controlling behavior. Caring partners support your independence and trust you to make your own decisions.',
 'Great insight! You can recognize when control is disguised as care.', 0),

('taylor-controlling-partner', 'When Taylor tries to set boundaries, their partner says "I guess you don''t value our relationship anymore." What should Taylor do?',
 ARRAY['Apologize and go back to letting their partner control things', 'Stay firm with boundaries and explain what healthy relationships look like', 'End the relationship immediately'], 1,
 'Taylor should stay firm with their boundaries and explain that healthy relationships involve mutual respect, not control. This gives their partner a chance to change.',
 'Perfect! You know how to maintain healthy boundaries while still giving people a chance to improve.', 1);