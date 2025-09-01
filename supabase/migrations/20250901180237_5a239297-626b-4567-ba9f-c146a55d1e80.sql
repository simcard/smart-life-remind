-- Fix function search path issues by setting search_path to public
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_family_member_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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