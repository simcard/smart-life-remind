-- Add notification preferences column to reminders table
ALTER TABLE public.reminders 
ADD COLUMN notification_preferences text[] DEFAULT ARRAY['app'];

-- Add comment for clarity
COMMENT ON COLUMN public.reminders.notification_preferences IS 'Array of notification preferences: app, whatsapp, email';