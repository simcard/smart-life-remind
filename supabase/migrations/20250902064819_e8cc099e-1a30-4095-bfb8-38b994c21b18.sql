-- Update handle_new_user function to include plan type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, plan_type)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'plan_type')::plan_type, 'family')
  );
  RETURN NEW;
END;
$$;