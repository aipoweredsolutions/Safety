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

-- Insert ALL lesson key points for EVERY lesson
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

-- Trusted Adults and Help (Ages 5-10)
('trusted-adults-help', 'Trusted adults are people your parents say are safe to talk to', 0),
('trusted-adults-help', 'You can talk to trusted adults about anything that worries you', 1),
('trusted-adults-help', 'It''s always okay to ask for help when you need it', 2),
('trusted-adults-help', 'Trusted adults will listen and help keep you safe', 3),

-- Emergency Basics (Ages 5-10)
('emergency-basics', 'An emergency is when someone needs help right away', 0),
('emergency-basics', 'Know your full name, address, and phone number', 1),
('emergency-basics', 'Call 999 or 112 for police, fire, or medical emergencies', 2),
('emergency-basics', 'Stay calm and speak clearly when asking for help', 3),

-- Saying No and Telling (Ages 5-10)
('saying-no-telling', 'It''s okay to say no when something doesn''t feel right', 0),
('saying-no-telling', 'You won''t get in trouble for telling the truth', 1),
('saying-no-telling', 'Always tell a trusted adult if someone makes you uncomfortable', 2),
('saying-no-telling', 'Your voice matters and you deserve to be heard', 3),

-- Body Cues and Feelings (Ages 5-10)
('body-cues-feelings', 'Your body gives you signals when something doesn''t feel safe', 0),
('body-cues-feelings', 'Trust feelings like butterflies in your tummy or feeling scared', 1),
('body-cues-feelings', 'These feelings are your body''s way of protecting you', 2),
('body-cues-feelings', 'Tell a trusted adult when your body gives you warning signals', 3),

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

-- Setting Personal Boundaries (Ages 11-15)
('setting-personal-boundaries', 'Boundaries are limits that help you feel safe and respected', 0),
('setting-personal-boundaries', 'You have the right to set boundaries with anyone', 1),
('setting-personal-boundaries', 'It''s important to respect other people''s boundaries too', 2),
('setting-personal-boundaries', 'Healthy relationships respect boundaries', 3),

-- Peer Pressure Decisions (Ages 11-15)
('peer-pressure-decisions', 'Peer pressure is when others try to influence your choices', 0),
('peer-pressure-decisions', 'True friends respect your decisions and don''t pressure you', 1),
('peer-pressure-decisions', 'It''s okay to be different from your friends', 2),
('peer-pressure-decisions', 'Trust your instincts about what feels right for you', 3),

-- Uncomfortable Secrets (Ages 11-15)
('uncomfortable-secrets', 'Some secrets can be harmful and shouldn''t be kept', 0),
('uncomfortable-secrets', 'Secrets that make you feel bad should be shared with trusted adults', 1),
('uncomfortable-secrets', 'You''re not responsible for keeping harmful secrets', 2),
('uncomfortable-secrets', 'Speaking up about uncomfortable secrets helps keep everyone safe', 3),

-- Recognizing Manipulation (Ages 11-15)
('recognizing-manipulation', 'Manipulation is when someone tries to control you unfairly', 0),
('recognizing-manipulation', 'Trust your feelings if something doesn''t seem fair', 1),
('recognizing-manipulation', 'Manipulation often involves making you feel guilty or scared', 2),
('recognizing-manipulation', 'You deserve to be treated with respect and honesty', 3),

-- Building Self-Esteem (Ages 11-15)
('building-self-esteem', 'You are valuable and deserve respect', 0),
('building-self-esteem', 'Believe in yourself and your abilities', 1),
('building-self-esteem', 'Standing up for others shows strength and kindness', 2),
('building-self-esteem', 'Confidence comes from knowing your worth', 3),

-- Healthy Friendships (Ages 11-15)
('healthy-friendships', 'Good friends respect your boundaries and decisions', 0),
('healthy-friendships', 'Healthy friendships involve give and take', 1),
('healthy-friendships', 'You should feel good about yourself in a healthy friendship', 2),
('healthy-friendships', 'Friends support each other through good times and bad', 3),

-- Healthy vs Unhealthy Relationships (Ages 16-19)
('healthy-vs-unhealthy-relationships', 'Healthy relationships involve mutual respect and support', 0),
('healthy-vs-unhealthy-relationships', 'Unhealthy relationships may involve control, manipulation, or abuse', 1),
('healthy-vs-unhealthy-relationships', 'You deserve to be treated with kindness and respect', 2),
('healthy-vs-unhealthy-relationships', 'Trust your instincts if something feels wrong in a relationship', 3),

-- Understanding Consent (Ages 16-19)
('understanding-consent', 'Consent means saying yes freely without pressure', 0),
('understanding-consent', 'You can change your mind at any time', 1),
('understanding-consent', 'Consent cannot be given if someone is impaired or pressured', 2),
('understanding-consent', 'Respecting consent builds trust and healthy relationships', 3),

-- Online Privacy Exploitation (Ages 16-19)
('online-privacy-exploitation', 'Think carefully before sharing any personal content online', 0),
('online-privacy-exploitation', 'Understand that digital content can be permanent', 1),
('online-privacy-exploitation', 'Know your rights and how to report exploitation', 2),
('online-privacy-exploitation', 'Use strong privacy settings on all social media accounts', 3),

-- Emotional Abuse Control (Ages 16-19)
('emotional-abuse-control', 'Trust your feelings if something doesn''t feel right in a relationship', 0),
('emotional-abuse-control', 'Manipulation often starts small and gradually increases', 1),
('emotional-abuse-control', 'You deserve relationships built on respect, not control', 2),
('emotional-abuse-control', 'Gaslighting makes you question your own reality and feelings', 3),

-- Power Dynamics (Ages 16-19)
('power-dynamics', 'Healthy relationships have balanced power', 0),
('power-dynamics', 'Age, authority, or dependency can create power imbalances', 1),
('power-dynamics', 'Be aware of how power affects your relationships', 2),
('power-dynamics', 'Power imbalances can make consent more complicated', 3),

-- Ending Relationships Safely (Ages 16-19)
('ending-relationships-safely', 'Plan ahead when ending a potentially dangerous relationship', 0),
('ending-relationships-safely', 'Seek support from trusted adults and friends', 1),
('ending-relationships-safely', 'Your safety is more important than someone else''s feelings', 2),
('ending-relationships-safely', 'Consider involving authorities if you feel threatened', 3),

-- Supporting Friends (Ages 16-19)
('supporting-friends', 'Listen without judgment when friends share problems', 0),
('supporting-friends', 'Encourage them to seek help from trusted adults', 1),
('supporting-friends', 'Don''t try to rescue them yourself - get professional help', 2),
('supporting-friends', 'Take care of your own mental health while helping others', 3),

-- Reporting Abuse Rights (Ages 16-19)
('reporting-abuse-rights', 'You have the right to be safe and respected', 0),
('reporting-abuse-rights', 'There are many resources available to help you', 1),
('reporting-abuse-rights', 'Reporting abuse can help protect you and others', 2),
('reporting-abuse-rights', 'You are not responsible for someone else''s abusive behavior', 3),

-- Unhealthy Partner Behaviors (Ages 16-19)
('unhealthy-partner-behaviors', 'Control disguised as care is still controlling behavior', 0),
('unhealthy-partner-behaviors', 'Isolation from friends and family is a warning sign', 1),
('unhealthy-partner-behaviors', 'Love-bombing followed by criticism is a manipulation tactic', 2),
('unhealthy-partner-behaviors', 'Jealousy and possessiveness are not signs of love', 3);

-- Insert ALL lesson scenarios for EVERY lesson
INSERT INTO lesson_scenarios (lesson_id, situation, options, correct_answer_index, explanation, order_index) VALUES
-- Safe vs Unsafe Behavior (Ages 5-10)
('safe-vs-unsafe-behavior', 'You''re walking to school and see a big dog without a leash running toward you. What should you do?',
 ARRAY['Run toward the dog to pet it', 'Stand still and call for help from a trusted adult', 'Throw something at the dog'], 1,
 'When you see an unleashed dog, it''s safest to stand still and call for help. Running might make the dog chase you.', 0),

('safe-vs-unsafe-behavior', 'Your friend wants to climb on the roof of the playground equipment. What should you do?',
 ARRAY['Climb up with them because it looks fun', 'Tell them it''s not safe and suggest playing something else', 'Watch them climb but don''t join'], 1,
 'Climbing on roofs is unsafe and could cause serious injury. A good friend helps keep others safe by suggesting safer activities.', 1),

-- Stranger Danger Basics (Ages 5-10)
('stranger-danger-basics', 'A person you don''t know offers you candy and asks you to come to their car. What should you do?',
 ARRAY['Go with them to get the candy', 'Say no and find a trusted adult immediately', 'Ask them to bring the candy to you'], 1,
 'Never go anywhere with a stranger, even if they offer treats. Always say no and find a trusted adult right away.', 0),

('stranger-danger-basics', 'You''re lost in a store and can''t find your parents. What should you do?',
 ARRAY['Leave the store to look for them outside', 'Stay where you are and ask a store employee for help', 'Follow other families hoping to find yours'], 1,
 'If you''re lost, stay in the store and find a store employee wearing a name tag. They are safe adults who can help you find your parents.', 1),

-- Good Touch vs Bad Touch (Ages 5-10)
('good-touch-bad-touch', 'Someone touches you in a way that makes you feel uncomfortable. What should you do?',
 ARRAY['Keep it a secret', 'Say no and tell a trusted adult', 'Just ignore it'], 1,
 'You should always say no to uncomfortable touch and tell a trusted adult. Your body belongs to you.', 0),

('good-touch-bad-touch', 'A family member wants to hug you but you don''t want to be hugged right now. What should you do?',
 ARRAY['Give the hug anyway to be polite', 'Say "I don''t want to hug right now" and offer a wave instead', 'Run away and hide'], 1,
 'You have the right to say no to hugs even from family. You can offer a wave, high-five, or just say hello instead.', 1),

-- Secrets vs Surprises (Ages 5-10)
('secrets-vs-surprises', 'Someone tells you a secret that makes you feel scared and worried. What should you do?',
 ARRAY['Keep the secret because they asked you to', 'Tell a trusted adult about the secret', 'Tell all your friends about it'], 1,
 'Secrets that make you feel scared or worried should always be shared with a trusted adult who can help.', 0),

('secrets-vs-surprises', 'Your friend is planning a surprise birthday party for another friend. Should you tell?',
 ARRAY['Yes, tell the birthday person right away', 'No, keep this happy surprise secret', 'Tell everyone except the birthday person'], 1,
 'Happy surprises that make people smile are okay to keep secret. This is different from secrets that make you feel bad.', 1),

-- Trusted Adults and Help (Ages 5-10)
('trusted-adults-help', 'You''re at the park and get separated from your parents. What should you do?',
 ARRAY['Ask any adult to help you find your parents', 'Stay where you are and look for a police officer or park ranger', 'Leave the park to look for them'], 1,
 'If you get lost, stay where you are and look for a uniformed official like a police officer or park ranger. They are trusted helpers.', 0),

('trusted-adults-help', 'Your friend tells you something that makes you worried about their safety. What should you do?',
 ARRAY['Promise to keep it secret', 'Tell a trusted adult even if your friend gets upset', 'Just forget about it'], 1,
 'When you''re worried about someone''s safety, it''s important to tell a trusted adult who can help, even if it''s hard.', 1),

-- Emergency Basics (Ages 5-10)
('emergency-basics', 'You see someone fall down and they''re not moving. What should you do first?',
 ARRAY['Try to move them to a more comfortable position', 'Call 999 or 112 for help immediately', 'Give them water to drink'], 1,
 'In a medical emergency, call for help first. Don''t try to move someone who might be injured.', 0),

('emergency-basics', 'There''s a fire in your house. What should you do?',
 ARRAY['Hide under your bed until it''s over', 'Get out of the house immediately and call for help', 'Try to put out the fire yourself'], 1,
 'In a fire, get out immediately and call for help. Never try to fight a fire yourself or hide inside.', 1),

-- Saying No and Telling (Ages 5-10)
('saying-no-telling', 'An older kid tells you to do something that makes you uncomfortable and says not to tell anyone. What should you do?',
 ARRAY['Do what they say to avoid trouble', 'Say no and tell a trusted adult', 'Only tell your best friend'], 1,
 'When someone tells you not to tell anyone, that''s often a sign that what they''re asking is wrong. Always tell a trusted adult.', 0),

('saying-no-telling', 'You don''t want to play a game that your friends are playing because it seems dangerous. What should you do?',
 ARRAY['Play anyway so your friends don''t get mad', 'Say no and suggest a different game', 'Just watch but don''t participate'], 1,
 'It''s always okay to say no to things that seem dangerous. Good friends will understand and play something else.', 1),

-- Body Cues and Feelings (Ages 5-10)
('body-cues-feelings', 'You''re with someone and your tummy starts feeling funny and you feel scared. What should you do?',
 ARRAY['Ignore the feeling and stay', 'Trust your feeling and find a trusted adult', 'Ask the person why you feel scared'], 1,
 'When your body gives you warning signals like a funny tummy or scared feelings, trust those feelings and get help.', 0),

('body-cues-feelings', 'Someone is being very nice to you but something feels "off" or wrong. What should you do?',
 ARRAY['Ignore the feeling because they''re being nice', 'Trust your instincts and tell a trusted adult', 'Try to figure out why you feel that way'], 1,
 'Sometimes people can seem nice but still not be safe. Always trust your instincts and tell a trusted adult about these feelings.', 1),

-- Types of Bullying (Ages 11-15)
('types-of-bullying', 'Someone at school keeps sending you mean messages online and sharing embarrassing photos of you. What should you do?',
 ARRAY['Send mean messages back', 'Block them and tell a trusted adult', 'Delete your social media accounts'], 1,
 'This is cyberbullying. Block the person and tell a trusted adult who can help you report it and stop it from continuing.', 0),

('types-of-bullying', 'You see someone being bullied at school. What''s the best way to help?',
 ARRAY['Join in with the bullying', 'Tell a trusted adult and offer support to the person being bullied', 'Ignore it because it''s not your business'], 1,
 'The best way to help is to tell a trusted adult and show support for the person being bullied. Bystanders can make a big difference.', 1),

-- Online Safety Basics (Ages 11-15)
('online-safety-basics', 'Someone you met online wants to meet you in person and asks you not to tell your parents. What should you do?',
 ARRAY['Meet them in a public place', 'Tell your parents immediately', 'Ask them to video chat first'], 1,
 'Never meet online friends without telling your parents. When someone asks you to keep secrets from your parents, that''s a warning sign.', 0),

('online-safety-basics', 'You receive a friend request from someone you don''t know who has very few friends and no profile picture. What should you do?',
 ARRAY['Accept the request to be friendly', 'Ignore or decline the request', 'Accept but don''t talk to them'], 1,
 'Don''t accept friend requests from people you don''t know. Fake profiles often have few friends and no real photos.', 1),

-- Setting Personal Boundaries (Ages 11-15)
('setting-personal-boundaries', 'Your friend keeps borrowing your things without asking and not returning them. What should you do?',
 ARRAY['Let them keep doing it to avoid conflict', 'Talk to them about respecting your belongings', 'Stop being friends with them'], 1,
 'It''s important to communicate your boundaries clearly. A good friend will respect your belongings when you explain how you feel.', 0),

('setting-personal-boundaries', 'Someone keeps texting you late at night even though you''ve asked them to stop. What should you do?',
 ARRAY['Answer the texts so they don''t get upset', 'Block their number and tell a trusted adult if needed', 'Turn off your phone completely'], 1,
 'When someone doesn''t respect your boundaries after you''ve clearly stated them, it''s okay to block them and seek support.', 1),

-- Peer Pressure Decisions (Ages 11-15)
('peer-pressure-decisions', 'Your friends want you to skip class with them and say you''re "not cool" if you don''t. What should you do?',
 ARRAY['Skip class to prove you''re cool', 'Stick to your values and go to class', 'Skip just this once'], 1,
 'True friends don''t threaten your friendship over doing the right thing. Stick to your values even when it''s hard.', 0),

('peer-pressure-decisions', 'Everyone at a party is doing something you''re not comfortable with. What should you do?',
 ARRAY['Join in so you fit in', 'Leave the party or call someone to pick you up', 'Hide in the bathroom until it''s over'], 1,
 'If you''re uncomfortable with what''s happening, it''s always okay to leave. Your safety and comfort are more important than fitting in.', 1),

-- Uncomfortable Secrets (Ages 11-15)
('uncomfortable-secrets', 'A friend tells you they''re being hurt at home but begs you not to tell anyone. What should you do?',
 ARRAY['Keep the secret because they asked you to', 'Tell a trusted adult who can help them', 'Try to help them yourself'], 1,
 'When someone is being hurt, they need help from adults who can protect them. Keeping this secret could put them in more danger.', 0),

('uncomfortable-secrets', 'Someone shows you inappropriate pictures and tells you to keep it secret. What should you do?',
 ARRAY['Keep the secret to avoid getting in trouble', 'Tell a trusted adult immediately', 'Delete the pictures and forget about it'], 1,
 'This is never okay and should always be reported to a trusted adult. You won''t get in trouble for reporting something inappropriate.', 1),

-- Recognizing Manipulation (Ages 11-15)
('recognizing-manipulation', 'Someone says "If you were really my friend, you would do this for me" when asking you to do something wrong. What is this?',
 ARRAY['A sign of true friendship', 'Manipulation using guilt', 'A reasonable request'], 1,
 'This is manipulation. True friends don''t use guilt or threaten the friendship to make you do things you''re uncomfortable with.', 0),

('recognizing-manipulation', 'An adult tells you that what they''re doing is "normal" but it makes you uncomfortable and they say not to tell your parents. What should you do?',
 ARRAY['Believe them that it''s normal', 'Trust your uncomfortable feelings and tell your parents', 'Ask other adults if it''s normal'], 1,
 'Trust your feelings. When adults ask you to keep secrets from your parents, especially about things that make you uncomfortable, that''s a warning sign.', 1),

-- Building Self-Esteem (Ages 11-15)
('building-self-esteem', 'Someone makes fun of the way you look. How should you respond?',
 ARRAY['Change how you look to fit in', 'Remember that your worth isn''t based on others'' opinions', 'Make fun of them back'], 1,
 'Your worth comes from who you are as a person, not what others think about your appearance. Don''t let others define your value.', 0),

('building-self-esteem', 'You see someone being picked on for being different. What should you do?',
 ARRAY['Join in so you don''t become a target', 'Stand up for them or get help from an adult', 'Ignore it and walk away'], 1,
 'Standing up for others shows courage and kindness. You can help by supporting them directly or getting help from an adult.', 1),

-- Healthy Friendships (Ages 11-15)
('healthy-friendships', 'Your friend gets angry every time you spend time with other people. What does this suggest?',
 ARRAY['They really care about your friendship', 'This might be an unhealthy, controlling behavior', 'You should only hang out with them'], 1,
 'Healthy friends want you to have other relationships too. Trying to control who you spend time with is a sign of an unhealthy friendship.', 0),

('healthy-friendships', 'A good friend asks you to do something that goes against your values. What should you do?',
 ARRAY['Do it because they''re your friend', 'Explain your values and suggest something else', 'End the friendship'], 1,
 'Good friends respect your values and boundaries. You can explain why you''re not comfortable and suggest an alternative.', 1),

-- Healthy vs Unhealthy Relationships (Ages 16-19)
('healthy-vs-unhealthy-relationships', 'Your partner gets extremely jealous when you talk to other people and accuses you of cheating. What does this indicate?',
 ARRAY['They love you very much', 'This is a sign of an unhealthy, controlling relationship', 'This is normal in relationships'], 1,
 'Extreme jealousy and accusations are signs of controlling behavior, not love. Healthy relationships are built on trust.', 0),

('healthy-vs-unhealthy-relationships', 'Your partner says they''ll hurt themselves if you break up with them. What should you do?',
 ARRAY['Stay in the relationship to keep them safe', 'End the relationship and tell a trusted adult about the threat', 'Try to help them yourself'], 1,
 'This is emotional manipulation. You''re not responsible for someone else''s threats. Tell a trusted adult who can get them proper help.', 1),

-- Understanding Consent (Ages 16-19)
('understanding-consent', 'Your partner wants to do something physical that you''re not comfortable with. They say "if you really loved me, you would do this." What should you do?',
 ARRAY['Give in because they said they love you', 'Firmly say no and explain that love means respecting boundaries', 'Avoid talking about it'], 1,
 'This is manipulation. True love means respecting boundaries. You have the right to say no to anything that makes you uncomfortable.', 0),

('understanding-consent', 'You''re at a party and someone who has been drinking wants to be intimate with you. What should you do?',
 ARRAY['It''s okay because they''re making the choice', 'Don''t engage because they cannot give proper consent while impaired', 'Ask them again when they''re sober'], 1,
 'Someone who is impaired by alcohol or drugs cannot give proper consent. Wait until they are completely sober and can make a clear decision.', 1),

-- Online Privacy Exploitation (Ages 16-19)
('online-privacy-exploitation', 'Someone you''re dating asks you to send intimate photos and promises they''ll keep them private. What should you do?',
 ARRAY['Send them because you trust them', 'Refuse because digital content can be shared or used against you', 'Only send them if they send some first'], 1,
 'Never send intimate photos. Even if you trust someone now, relationships can end and images can be shared or used for revenge.', 0),

('online-privacy-exploitation', 'You discover that someone has been sharing your private photos without permission. What should you do?',
 ARRAY['Confront them directly', 'Document the evidence and report it to authorities and platforms', 'Try to get the photos back yourself'], 1,
 'This is a serious crime. Document everything, report it to the police and the platforms, and seek support from trusted adults.', 1),

-- Emotional Abuse Control (Ages 16-19)
('emotional-abuse-control', 'Your partner constantly criticizes you and then says "I''m just trying to help you be better." What is this?',
 ARRAY['Helpful feedback from someone who cares', 'Emotional abuse disguised as help', 'Normal relationship communication'], 1,
 'Constant criticism that makes you feel bad about yourself is emotional abuse, even when disguised as "help." Healthy partners build you up.', 0),

('emotional-abuse-control', 'Your partner makes you question your own memory of events and tells you you''re "too sensitive." What is this called?',
 ARRAY['Honest feedback', 'Gaslighting - a form of emotional abuse', 'Normal disagreement'], 1,
 'This is called gaslighting - making you question your own reality and feelings. It''s a serious form of emotional abuse.', 1),

-- Power Dynamics (Ages 16-19)
('power-dynamics', 'You''re 17 and a 25-year-old coworker asks you on a date. What should you consider?',
 ARRAY['Age is just a number', 'The age and experience gap creates a power imbalance', 'It''s flattering that an older person likes you'], 1,
 'Significant age gaps, especially when you''re a teenager, create power imbalances that can make relationships unhealthy or exploitative.', 0),

('power-dynamics', 'Your boss at work makes comments about your appearance and asks you to spend time alone with them. What should you do?',
 ARRAY['Feel flattered by the attention', 'Recognize this as inappropriate use of power and report it', 'Try to handle it yourself'], 1,
 'This is sexual harassment and an abuse of power. Report it to HR, a trusted adult, or appropriate authorities.', 1),

-- Ending Relationships Safely (Ages 16-19)
('ending-relationships-safely', 'You want to end a relationship but your partner has threatened violence before. What should you do?',
 ARRAY['End it in person to be respectful', 'Make a safety plan and involve trusted adults or authorities', 'Stay in the relationship to avoid conflict'], 1,
 'Your safety comes first. Make a plan with trusted adults, consider involving authorities, and don''t meet them alone.', 0),

('ending-relationships-safely', 'After you break up, your ex keeps showing up at your work and school. What should you do?',
 ARRAY['Talk to them to work things out', 'Document everything and report the stalking behavior', 'Change your schedule to avoid them'], 1,
 'This is stalking behavior. Document everything, report it to authorities, and seek support from trusted adults.', 1),

-- Supporting Friends (Ages 16-19)
('supporting-friends', 'Your friend is in an abusive relationship but gets angry when you suggest they leave. What should you do?',
 ARRAY['Stop bringing it up since they don''t want help', 'Continue to support them while encouraging professional help', 'Give them an ultimatum'], 1,
 'Continue to be supportive without judgment. Encourage them to seek professional help and let them know you''re there when they''re ready.', 0),

('supporting-friends', 'Your friend tells you they''re thinking about hurting themselves. What should you do?',
 ARRAY['Promise to keep it secret', 'Take it seriously and get help from a trusted adult immediately', 'Try to talk them out of it yourself'], 1,
 'Threats of self-harm should always be taken seriously. Get help from a trusted adult, counselor, or call a crisis hotline immediately.', 1),

-- Reporting Abuse Rights (Ages 16-19)
('reporting-abuse-rights', 'You want to report abuse but you''re worried about what might happen to the abuser. What should you remember?',
 ARRAY['Don''t report it to protect them', 'Your safety is more important than protecting an abuser', 'Only report it if the abuse gets worse'], 1,
 'You are not responsible for protecting someone who is hurting you. Your safety and the safety of others is the priority.', 0),

('reporting-abuse-rights', 'You''re afraid to report abuse because you think no one will believe you. What should you do?',
 ARRAY['Don''t report it since no one will believe you', 'Report it anyway - you deserve to be heard and helped', 'Wait until you have more proof'], 1,
 'You deserve to be believed and helped. There are people trained to help abuse victims, and your report is important.', 1),

-- Unhealthy Partner Behaviors (Ages 16-19)
('unhealthy-partner-behaviors', 'Your partner says they''re "protecting" you by not letting you see certain friends. What is this really?',
 ARRAY['Caring protection', 'Controlling and isolating behavior', 'Reasonable concern'], 1,
 'Isolation disguised as protection is a form of control. Healthy partners trust you to make your own decisions about friendships.', 0),

('unhealthy-partner-behaviors', 'Your partner showers you with gifts and attention, then gets angry and critical. What is this pattern called?',
 ARRAY['Normal relationship ups and downs', 'Love-bombing followed by devaluation', 'Passionate love'], 1,
 'This is called love-bombing followed by devaluation. It''s a manipulation tactic designed to keep you confused and dependent.', 1);

-- Insert ALL quiz questions for EVERY lesson
INSERT INTO lesson_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, order_index) VALUES
-- Safe vs Unsafe Behavior (Ages 5-10)
('safe-vs-unsafe-behavior', 'Which of these is a safe behavior?',
 ARRAY['Playing with matches', 'Looking both ways before crossing the street', 'Talking to strangers'], 1,
 'Looking both ways before crossing the street is a safe behavior that helps protect you from cars.', 0),

('safe-vs-unsafe-behavior', 'What should you do if something feels unsafe?',
 ARRAY['Ignore the feeling', 'Tell a trusted adult right away', 'Try to handle it yourself'], 1,
 'Always tell a trusted adult when something feels unsafe. They can help keep you protected.', 1),

('safe-vs-unsafe-behavior', 'Which feeling might warn you that something is unsafe?',
 ARRAY['Feeling happy and excited', 'Feeling scared or worried', 'Feeling hungry'], 1,
 'Feeling scared or worried can be your body''s way of warning you that something might not be safe.', 2),

-- Stranger Danger Basics (Ages 5-10)
('stranger-danger-basics', 'What should you do if a stranger asks you to help find their lost pet?',
 ARRAY['Help them look', 'Say no and walk away', 'Ask your friends to help too'], 1,
 'Adults should ask other adults for help, not children. Always say no and walk away.', 0),

('stranger-danger-basics', 'What information is safe to tell a stranger?',
 ARRAY['Your full name and address', 'Your school name and teacher', 'Nothing personal - just be polite'], 2,
 'You should never share personal information with strangers. It''s okay to be polite, but keep your personal details private.', 1),

('stranger-danger-basics', 'If you get lost, who should you look for?',
 ARRAY['Any adult who looks nice', 'A police officer or store employee with a name tag', 'Other children'], 1,
 'Look for uniformed officials like police officers or store employees with name tags. They are trained to help children safely.', 2),

-- Good Touch vs Bad Touch (Ages 5-10)
('good-touch-bad-touch', 'What should you do if someone touches you in a way that makes you feel uncomfortable?',
 ARRAY['Keep it a secret', 'Say no and tell a trusted adult', 'Just ignore it'], 1,
 'You should always say no to uncomfortable touch and tell a trusted adult. Your body belongs to you.', 0),

('good-touch-bad-touch', 'What makes someone a "trusted adult"?',
 ARRAY['Any adult who is nice to you', 'Adults your parents have told you are safe', 'Adults who give you gifts'], 1,
 'Trusted adults are people your parents or guardians have specifically told you are safe to talk to and ask for help.', 1),

('good-touch-bad-touch', 'Is it okay to say no to hugs from family members?',
 ARRAY['No, you must always hug family', 'Yes, you can choose when you want to be touched', 'Only if they''re strangers'], 1,
 'You have the right to say no to any touch, even from family members. You can offer a wave or high-five instead.', 2),

-- Secrets vs Surprises (Ages 5-10)
('secrets-vs-surprises', 'What''s the difference between a good surprise and a bad secret?',
 ARRAY['There is no difference', 'Good surprises make people happy, bad secrets make you feel worried', 'Secrets are always bad'], 1,
 'Good surprises are meant to make people happy, while bad secrets make you feel worried, scared, or uncomfortable.', 0),

('secrets-vs-surprises', 'Should you keep a secret that makes you feel scared?',
 ARRAY['Yes, because you promised', 'No, tell a trusted adult', 'Only tell your best friend'], 1,
 'Secrets that make you feel scared or worried should always be shared with a trusted adult who can help.', 1),

('secrets-vs-surprises', 'What should you do if someone tells you to keep a "special secret" just between you two?',
 ARRAY['Always keep it secret', 'Tell a trusted adult, especially if it makes you uncomfortable', 'Tell everyone you know'], 1,
 'If someone asks you to keep a "special secret" and it makes you uncomfortable, always tell a trusted adult.', 2),

-- Trusted Adults and Help (Ages 5-10)
('trusted-adults-help', 'Who is a trusted adult?',
 ARRAY['Anyone who offers you candy', 'Someone your parents say you can go to for help', 'A stranger who seems nice'], 1,
 'A trusted adult is someone your parents or guardians have told you is safe to talk to and ask for help.', 0),

('trusted-adults-help', 'When should you talk to a trusted adult?',
 ARRAY['Only when you are in big trouble', 'When something makes you feel worried, scared, or uncomfortable', 'Never, you should handle things yourself'], 1,
 'You should always talk to a trusted adult when something makes you feel worried, scared, or uncomfortable. They are there to help you.', 1),

('trusted-adults-help', 'What should you do if a trusted adult is not nearby when you need help?',
 ARRAY['Find any adult and ask for help', 'Look for a police officer, firefighter, or store employee', 'Wait until your parents arrive'], 1,
 'If your trusted adult is not nearby, look for other uniformed officials like police officers, firefighters, or store employees. They are also trusted helpers.', 2),

-- Emergency Basics (Ages 5-10)
('emergency-basics', 'What number should you call for emergencies?',
 ARRAY['999 or 112', '123', '456'], 0,
 '999 and 112 are the emergency numbers that connect you to police, fire, and medical help.', 0),

('emergency-basics', 'What information should you know in case of emergency?',
 ARRAY['Your favorite color', 'Your full name, address, and phone number', 'Your friend''s birthday'], 1,
 'Knowing your full name, address, and phone number helps emergency workers find you and contact your family.', 1),

('emergency-basics', 'What should you do if you see someone who is hurt?',
 ARRAY['Try to move them', 'Call for help immediately', 'Give them food'], 1,
 'If someone is hurt, call for help immediately. Don''t try to move them as this could make their injuries worse.', 2),

-- Saying No and Telling (Ages 5-10)
('saying-no-telling', 'Is it okay to say no to an adult?',
 ARRAY['Never, adults are always right', 'Yes, if they ask you to do something that makes you uncomfortable', 'Only if they''re strangers'], 1,
 'It''s okay to say no to any adult if they ask you to do something that makes you feel uncomfortable or unsafe.', 0),

('saying-no-telling', 'What should you do if someone tells you not to tell your parents about something?',
 ARRAY['Keep it secret like they asked', 'Tell your parents anyway', 'Only tell if they ask'], 1,
 'When someone tells you not to tell your parents, that''s often a warning sign. Always tell your parents about these situations.', 1),

('saying-no-telling', 'Will you get in trouble for telling the truth about something that made you uncomfortable?',
 ARRAY['Yes, you''ll always get in trouble', 'No, trusted adults want to help keep you safe', 'Only if you did something wrong'], 1,
 'You won''t get in trouble for telling the truth about things that make you uncomfortable. Trusted adults want to help keep you safe.', 2),

-- Body Cues and Feelings (Ages 5-10)
('body-cues-feelings', 'What does it mean when you get "butterflies" in your stomach around someone?',
 ARRAY['You''re hungry', 'Your body might be warning you something doesn''t feel right', 'You''re excited'], 1,
 'Sometimes butterflies or funny feelings in your stomach can be your body''s way of warning you that something doesn''t feel safe.', 0),

('body-cues-feelings', 'Should you trust your feelings about people and situations?',
 ARRAY['No, feelings don''t matter', 'Yes, your feelings are important warning signals', 'Only if other people agree'], 1,
 'Your feelings are important warning signals. If something doesn''t feel right, trust that feeling and get help.', 1),

('body-cues-feelings', 'What should you do if your body gives you warning signals?',
 ARRAY['Ignore them and stay', 'Tell a trusted adult about how you''re feeling', 'Try to figure it out yourself'], 1,
 'When your body gives you warning signals, tell a trusted adult about how you''re feeling. They can help keep you safe.', 2),

-- Types of Bullying (Ages 11-15)
('types-of-bullying', 'What should you do if you witness cyberbullying?',
 ARRAY['Ignore it', 'Join in', 'Report it to a trusted adult or platform'], 2,
 'Bystanders can help stop cyberbullying by reporting it and supporting the victim.', 0),

('types-of-bullying', 'What is the best way to respond to a cyberbully?',
 ARRAY['Fight back with mean messages', 'Block them and don''t respond', 'Try to reason with them'], 1,
 'Don''t engage with bullies. Block them immediately and report the behavior to prevent escalation.', 1),

('types-of-bullying', 'Why is it important to save evidence of cyberbullying?',
 ARRAY['To show your friends', 'To report it to authorities or platforms', 'To remember what happened'], 1,
 'Screenshots and saved messages provide evidence that can be used to report the bullying and take action.', 2),

('types-of-bullying', 'Which of these is considered cyberbullying?',
 ARRAY['Sending threatening messages', 'Sharing embarrassing photos without permission', 'Both of the above'], 2,
 'Cyberbullying includes threatening messages, sharing private content, spreading rumors, and other harmful online behaviors.', 3),

-- Online Safety Basics (Ages 11-15)
('online-safety-basics', 'What makes a strong password?',
 ARRAY['Your birthday', 'A mix of letters, numbers, and symbols', 'Your pet''s name'], 1,
 'Strong passwords use a combination of uppercase, lowercase, numbers, and symbols, and are unique for each account.', 0),

('online-safety-basics', 'What should you do before posting a photo on social media?',
 ARRAY['Post it immediately', 'Check if it reveals personal information or location', 'Ask all your friends first'], 1,
 'Always check if photos reveal personal information, your location, or anything that could be used to identify or find you.', 1),

('online-safety-basics', 'What information should you never share online with people you don''t know in person?',
 ARRAY['Your favorite color', 'Your home address and phone number', 'Your favorite movie'], 1,
 'Personal identifying information like your address, phone number, school, or schedule should never be shared with online strangers.', 2),

('online-safety-basics', 'If someone online asks to meet you in person, what should you do?',
 ARRAY['Meet them in a public place', 'Tell a trusted adult and never meet alone', 'Ignore the request'], 1,
 'Always tell a trusted adult about meeting requests. If you do meet, it should be in a public place with adult supervision.', 3),

-- Setting Personal Boundaries (Ages 11-15)
('setting-personal-boundaries', 'What are personal boundaries?',
 ARRAY['Rules that limit your fun', 'Limits that help you feel safe and respected', 'Things that keep you away from friends'], 1,
 'Personal boundaries are limits that help you feel safe, respected, and comfortable in relationships.', 0),

('setting-personal-boundaries', 'What should you do if someone doesn''t respect your boundaries?',
 ARRAY['Give up and let them do what they want', 'Clearly restate your boundaries and get support if needed', 'Never talk to them again'], 1,
 'If someone doesn''t respect your boundaries, clearly restate them and seek support from trusted adults if the behavior continues.', 1),

('setting-personal-boundaries', 'Is it okay to have different boundaries with different people?',
 ARRAY['No, boundaries should be the same for everyone', 'Yes, you can have different comfort levels with different people', 'Only if they''re family'], 1,
 'It''s normal and healthy to have different boundaries with different people based on your relationship and comfort level.', 2),

-- Peer Pressure Decisions (Ages 11-15)
('peer-pressure-decisions', 'What is peer pressure?',
 ARRAY['When friends support your decisions', 'When others try to influence you to do something', 'When you help friends make good choices'], 1,
 'Peer pressure is when others try to influence you to do something, which can be positive or negative.', 0),

('peer-pressure-decisions', 'How can you resist negative peer pressure?',
 ARRAY['Always do what your friends want', 'Stay true to your values and suggest alternatives', 'Avoid having any friends'], 1,
 'You can resist negative peer pressure by staying true to your values, suggesting alternatives, and surrounding yourself with supportive friends.', 1),

('peer-pressure-decisions', 'What does it mean if friends threaten to end your friendship over your decisions?',
 ARRAY['They really care about you', 'They might not be true friends', 'You should always give in'], 1,
 'True friends respect your decisions and don''t threaten to end the friendship when you make choices they disagree with.', 2),

-- Uncomfortable Secrets (Ages 11-15)
('uncomfortable-secrets', 'When should you break a promise to keep a secret?',
 ARRAY['Never, promises should always be kept', 'When the secret involves someone being hurt or in danger', 'Only if you get permission'], 1,
 'You should break a promise to keep a secret when it involves someone being hurt or in danger. Safety is more important than promises.', 0),

('uncomfortable-secrets', 'What should you do if someone tells you a secret that makes you worried?',
 ARRAY['Keep it to yourself', 'Tell a trusted adult who can help', 'Tell all your friends'], 1,
 'If a secret makes you worried about someone''s safety, tell a trusted adult who can provide proper help and support.', 1),

('uncomfortable-secrets', 'Are you responsible for keeping secrets that involve illegal or harmful activities?',
 ARRAY['Yes, you promised to keep it secret', 'No, you should report harmful or illegal activities', 'Only if you''re not involved'], 1,
 'You are not responsible for keeping secrets about illegal or harmful activities. These should be reported to trusted adults.', 2),

-- Recognizing Manipulation (Ages 11-15)
('recognizing-manipulation', 'What is manipulation?',
 ARRAY['Helping someone make good decisions', 'Trying to control someone through unfair tactics', 'Giving honest advice'], 1,
 'Manipulation is trying to control someone through unfair tactics like guilt, fear, or deception.', 0),

('recognizing-manipulation', 'Which phrase is often used in manipulation?',
 ARRAY['"I respect your decision"', '"If you really cared about me, you would..."', '"Take your time to think about it"'], 1,
 'Phrases like "if you really cared about me" are guilt tactics used to manipulate people into doing things they don''t want to do.', 1),

('recognizing-manipulation', 'How should you respond to manipulation?',
 ARRAY['Give in to avoid conflict', 'Trust your feelings and set clear boundaries', 'Try to manipulate them back'], 1,
 'Trust your feelings when something seems unfair and set clear boundaries. Don''t give in to manipulation tactics.', 2),

-- Building Self-Esteem (Ages 11-15)
('building-self-esteem', 'What is self-esteem?',
 ARRAY['How much money you have', 'How you feel about yourself and your worth', 'How popular you are'], 1,
 'Self-esteem is how you feel about yourself and your sense of personal worth and value.', 0),

('building-self-esteem', 'How can you build healthy self-esteem?',
 ARRAY['Only by getting approval from others', 'By recognizing your strengths and treating yourself with kindness', 'By comparing yourself to others'], 1,
 'Healthy self-esteem comes from recognizing your own strengths, accomplishments, and treating yourself with kindness and respect.', 1),

('building-self-esteem', 'What should you do if someone puts you down?',
 ARRAY['Believe what they say about you', 'Remember that their words don''t define your worth', 'Put them down in return'], 1,
 'Other people''s negative words don''t define your worth. Remember your own value and seek support from people who treat you well.', 2),

-- Healthy Friendships (Ages 11-15)
('healthy-friendships', 'What is a sign of a healthy friendship?',
 ARRAY['Your friend controls who else you can be friends with', 'You feel good about yourself when you''re with them', 'They get jealous when you spend time with others'], 1,
 'In healthy friendships, you feel good about yourself and are supported in having other relationships too.', 0),

('healthy-friendships', 'What should you do if a friend consistently makes you feel bad about yourself?',
 ARRAY['Try harder to please them', 'Consider whether this is a healthy friendship', 'Change yourself to make them happy'], 1,
 'If a friend consistently makes you feel bad about yourself, it may be time to reconsider whether this is a healthy friendship.', 1),

('healthy-friendships', 'How do healthy friends handle disagreements?',
 ARRAY['They never disagree', 'They talk through problems with respect', 'One person always gives in'], 1,
 'Healthy friends can disagree but work through problems by talking respectfully and finding solutions together.', 2),

-- Healthy vs Unhealthy Relationships (Ages 16-19)
('healthy-vs-unhealthy-relationships', 'What characterizes a healthy relationship?',
 ARRAY['One person makes all the decisions', 'Mutual respect, trust, and communication', 'Constant jealousy and checking up on each other'], 1,
 'Healthy relationships are built on mutual respect, trust, open communication, and support for each other''s independence.', 0),

('healthy-vs-unhealthy-relationships', 'Which is a warning sign of an unhealthy relationship?',
 ARRAY['Supporting each other''s goals', 'Trying to control what the other person wears or who they see', 'Having different interests'], 1,
 'Trying to control what someone wears, who they see, or how they spend their time is a major warning sign of an unhealthy relationship.', 1),

('healthy-vs-unhealthy-relationships', 'What should you do if you recognize signs of an unhealthy relationship?',
 ARRAY['Ignore the signs and hope things improve', 'Seek support from trusted friends, family, or professionals', 'Try to change the other person'], 1,
 'If you recognize signs of an unhealthy relationship, seek support from trusted people and consider professional help.', 2),

-- Understanding Consent (Ages 16-19)
('understanding-consent', 'Which of these is true about consent?',
 ARRAY['Once you say yes, you can''t change your mind', 'Consent can be withdrawn at any time', 'Consent isn''t needed in relationships'], 1,
 'Consent can always be withdrawn at any time. You have the right to change your mind about anything.', 0),

('understanding-consent', 'What should you do if someone pressures you after you''ve said no?',
 ARRAY['Give in to avoid conflict', 'Firmly repeat your no and remove yourself from the situation', 'Try to compromise'], 1,
 'When someone doesn''t respect your no, it''s important to be firm and remove yourself from the situation if possible.', 1),

('understanding-consent', 'Can someone give consent if they are heavily intoxicated?',
 ARRAY['Yes, if they say yes', 'No, intoxication impairs the ability to give proper consent', 'Only if they initiated it'], 1,
 'Someone who is heavily intoxicated cannot give proper consent because their judgment and decision-making ability are impaired.', 2),

-- Online Privacy Exploitation (Ages 16-19)
('online-privacy-exploitation', 'What should you consider before sharing intimate content online?',
 ARRAY['Whether the person promises to keep it private', 'That digital content can be permanent and shared without permission', 'Whether you trust the person right now'], 1,
 'Digital content can be permanent, copied, and shared without your permission, even by people you trust now.', 0),

('online-privacy-exploitation', 'What should you do if someone threatens to share your private images?',
 ARRAY['Give in to their demands', 'Document the threats and report to authorities', 'Try to negotiate with them'], 1,
 'This is a serious crime called revenge porn or image-based abuse. Document everything and report it to authorities immediately.', 1),

('online-privacy-exploitation', 'How can you protect your privacy on social media?',
 ARRAY['Accept all friend requests to be social', 'Use strong privacy settings and be selective about what you share', 'Share everything to build trust'], 1,
 'Use strong privacy settings, be selective about friend requests, and think carefully about what you share online.', 2),

-- Emotional Abuse Control (Ages 16-19)
('emotional-abuse-control', 'What is gaslighting?',
 ARRAY['A type of lighting', 'Making someone question their own reality and feelings', 'A form of meditation'], 1,
 'Gaslighting is a form of emotional abuse where someone makes you question your own memory, perception, and sanity.', 0),

('emotional-abuse-control', 'Which is an example of emotional abuse?',
 ARRAY['Respectful disagreement', 'Constant criticism that makes you feel worthless', 'Asking for space when upset'], 1,
 'Constant criticism designed to make you feel worthless is a form of emotional abuse that can be very damaging.', 1),

('emotional-abuse-control', 'What should you do if you think you''re experiencing emotional abuse?',
 ARRAY['Try to fix the relationship yourself', 'Seek support from trusted friends, family, or professionals', 'Ignore it and hope it stops'], 1,
 'Emotional abuse is serious and often escalates. Seek support from trusted people and consider professional help.', 2),

-- Power Dynamics (Ages 16-19)
('power-dynamics', 'What creates power imbalances in relationships?',
 ARRAY['Having different interests', 'Differences in age, authority, or financial dependence', 'Living in different places'], 1,
 'Power imbalances can be created by differences in age, authority positions, financial dependence, or experience.', 0),

('power-dynamics', 'Why are power imbalances concerning in relationships?',
 ARRAY['They make relationships more interesting', 'They can make it harder to give free consent and maintain equality', 'They don''t matter in relationships'], 1,
 'Power imbalances can make it difficult to give free consent and can lead to exploitation or abuse of the person with less power.', 1),

('power-dynamics', 'How should you handle a relationship with a power imbalance?',
 ARRAY['Ignore the imbalance', 'Be extra aware of consent and seek outside perspective', 'Let the person with more power make all decisions'], 1,
 'Be extra aware of consent issues and seek perspective from trusted friends or counselors about whether the relationship is healthy.', 2),

-- Ending Relationships Safely (Ages 16-19)
('ending-relationships-safely', 'What should you do if you''re afraid to end a relationship because of threats?',
 ARRAY['Stay in the relationship to avoid the threats', 'Make a safety plan and involve trusted adults or authorities', 'Try to reason with the person making threats'], 1,
 'If you''re afraid to end a relationship due to threats, make a safety plan with trusted adults and consider involving authorities.', 0),

('ending-relationships-safely', 'What is stalking?',
 ARRAY['Showing romantic interest', 'Repeatedly following, contacting, or harassing someone against their will', 'Trying to win someone back'], 1,
 'Stalking is repeatedly following, contacting, or harassing someone against their will, and it''s a serious crime.', 1),

('ending-relationships-safely', 'What should you do if an ex-partner won''t accept the breakup?',
 ARRAY['Keep explaining until they understand', 'Document their behavior and seek support from authorities if needed', 'Give them another chance'], 1,
 'Document all unwanted contact and seek support from authorities if the behavior continues. You don''t owe anyone a relationship.', 2),

-- Supporting Friends (Ages 16-19)
('supporting-friends', 'What''s the best way to help a friend in an abusive relationship?',
 ARRAY['Tell them what to do', 'Listen without judgment and encourage professional help', 'Confront the abuser yourself'], 1,
 'Listen without judgment, provide emotional support, and encourage them to seek help from professionals trained in abuse situations.', 0),

('supporting-friends', 'What should you do if a friend tells you they''re thinking of hurting themselves?',
 ARRAY['Promise to keep it secret', 'Take it seriously and get help from a trusted adult immediately', 'Try to talk them out of it yourself'], 1,
 'Threats of self-harm should always be taken seriously. Get help from a trusted adult, counselor, or crisis hotline immediately.', 1),

('supporting-friends', 'How can you take care of yourself while helping a friend in crisis?',
 ARRAY['Put all your energy into helping them', 'Set boundaries and seek support for yourself too', 'Stop helping them completely'], 1,
 'It''s important to set boundaries and seek support for yourself too. You can''t help others effectively if you''re not taking care of your own mental health.', 2),

-- Reporting Abuse Rights (Ages 16-19)
('reporting-abuse-rights', 'What should you remember about reporting abuse?',
 ARRAY['You''re responsible for protecting the abuser', 'You have the right to be safe and your report is important', 'Only report if you have video evidence'], 1,
 'You have the right to be safe, and your report is important. You''re not responsible for protecting someone who is hurting you.', 0),

('reporting-abuse-rights', 'What if you''re worried no one will believe your report of abuse?',
 ARRAY['Don''t report it', 'Report it anyway - you deserve to be heard and helped', 'Wait until you have more proof'], 1,
 'You deserve to be believed and helped. There are people trained to help abuse victims, and your report matters.', 1),

('reporting-abuse-rights', 'Who can you report abuse to?',
 ARRAY['Only the police', 'Police, school counselors, trusted adults, or abuse hotlines', 'Only your family'], 1,
 'You can report abuse to police, school counselors, trusted adults, abuse hotlines, or other support services.', 2),

-- Unhealthy Partner Behaviors (Ages 16-19)
('unhealthy-partner-behaviors', 'What is "love-bombing"?',
 ARRAY['Expressing love through gifts', 'Overwhelming someone with excessive attention and affection to manipulate them', 'Celebrating anniversaries'], 1,
 'Love-bombing is overwhelming someone with excessive attention and affection early in a relationship to manipulate and control them.', 0),

('unhealthy-partner-behaviors', 'What should you do if a partner tries to isolate you from friends and family?',
 ARRAY['Accept it because they want to spend time with you', 'Recognize this as a warning sign and maintain your relationships', 'Only see friends when your partner approves'], 1,
 'Isolation is a major warning sign of abuse. Healthy partners encourage your other relationships and don''t try to control who you see.', 1),

('unhealthy-partner-behaviors', 'What is a sign that someone''s jealousy has become unhealthy?',
 ARRAY['They ask who you''re texting', 'They accuse you of cheating without evidence and try to control your interactions', 'They feel a little jealous sometimes'], 1,
 'Unhealthy jealousy involves accusations without evidence, trying to control your interactions, and not trusting you despite your faithfulness.', 2);

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