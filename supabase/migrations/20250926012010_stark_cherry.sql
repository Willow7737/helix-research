/*
  # Fix Authentication Signup Issues

  This migration addresses potential issues with user signup and profile creation:
  
  1. Database Setup
     - Ensures proper user table references
     - Fixes profile creation trigger
     - Adds proper RLS policies
  
  2. Security
     - Updates RLS policies for profiles table
     - Ensures proper user access controls
  
  3. Trigger Functions
     - Creates/updates the handle_new_user function
     - Ensures profile is created automatically on signup
*/

-- First, let's ensure we have the auth.users reference properly set up
-- Update the profiles table foreign key to reference auth.users properly
DO $$
BEGIN
  -- Drop existing foreign key if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_user_id_fkey;
  END IF;
  
  -- Add the correct foreign key reference to auth.users
  ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Create or replace the trigger function for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies for profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a function to get or create user profile (useful for the frontend)
CREATE OR REPLACE FUNCTION get_or_create_profile(user_uuid UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Try to get existing profile
  RETURN QUERY
  SELECT p.id, p.user_id, p.display_name, p.avatar_url, p.organization, p.created_at, p.updated_at
  FROM profiles p
  WHERE p.user_id = user_uuid;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO profiles (user_id, display_name, created_at, updated_at)
    VALUES (user_uuid, (SELECT email FROM auth.users WHERE id = user_uuid), NOW(), NOW())
    RETURNING profiles.id, profiles.user_id, profiles.display_name, profiles.avatar_url, profiles.organization, profiles.created_at, profiles.updated_at;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;