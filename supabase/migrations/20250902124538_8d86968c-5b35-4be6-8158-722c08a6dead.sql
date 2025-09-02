-- Add a test reminder for Cape Town Table Mountain sunset tomorrow
INSERT INTO public.reminders (
  user_id,
  title,
  category,
  description,
  due_date,
  due_time,
  priority,
  location,
  location_lat,
  location_lng,
  location_radius,
  notification_preferences,
  completed
)
SELECT 
  auth.uid(),
  'Watch sunset at Table Mountain',
  'personal',
  'Enjoy the beautiful sunset views from Cape Town''s iconic Table Mountain. Don''t forget your camera!',
  CURRENT_DATE + INTERVAL '1 day',
  '18:30:00'::time,
  'high',
  'Table Mountain, Cape Town, South Africa',
  -33.9628,
  18.4098,
  1000,
  ARRAY['app', 'email'],
  false
WHERE auth.uid() IS NOT NULL;