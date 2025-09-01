-- Create plan types enum
CREATE TYPE public.plan_type AS ENUM ('family', 'business');

-- Add plan type to profiles table
ALTER TABLE public.profiles ADD COLUMN plan_type plan_type DEFAULT 'family';

-- Update family member validation function to check plan limits
CREATE OR REPLACE FUNCTION public.validate_family_member_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  user_plan plan_type;
  max_members integer;
BEGIN
  -- Get the account owner's plan type
  SELECT p.plan_type INTO user_plan
  FROM public.profiles p
  WHERE p.user_id = NEW.account_owner_id;
  
  -- Set member limits based on plan
  IF user_plan = 'business' THEN
    max_members := 15;
  ELSE
    max_members := 5;
  END IF;
  
  -- Check if adding this member would exceed the limit
  IF (SELECT COUNT(*) FROM public.family_members 
      WHERE account_owner_id = NEW.account_owner_id 
      AND is_active = true) >= max_members THEN
    RAISE EXCEPTION 'Maximum of % active members allowed for % plan', max_members, user_plan;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add location fields to reminders table
ALTER TABLE public.reminders 
ADD COLUMN reminder_location TEXT,
ADD COLUMN location_lat DECIMAL(10, 8),
ADD COLUMN location_lng DECIMAL(11, 8),
ADD COLUMN location_radius INTEGER DEFAULT 500;

-- Create user locations table for tracking
CREATE TABLE public.user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for user_locations
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_locations
CREATE POLICY "Users can view their own locations" 
ON public.user_locations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own locations" 
ON public.user_locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations" 
ON public.user_locations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for location queries
CREATE INDEX idx_user_locations_user_timestamp ON public.user_locations(user_id, timestamp DESC);
CREATE INDEX idx_reminders_location ON public.reminders(user_id, location_lat, location_lng) WHERE location_lat IS NOT NULL;