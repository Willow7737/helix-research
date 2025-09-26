/*
  # Fix RLS Infinite Recursion

  This migration fixes the infinite recursion issue in RLS policies by:
  1. Dropping existing problematic policies
  2. Creating simpler, non-recursive policies
  3. Ensuring policies don't create circular references

  ## Changes Made
  - Simplified research_projects policies to avoid recursion
  - Fixed project_collaborators policies
  - Ensured all policies use direct user authentication checks
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view collaborated projects" ON research_projects;
DROP POLICY IF EXISTS "Editors can update collaborated projects" ON research_projects;
DROP POLICY IF EXISTS "Users can view collaborators of accessible projects" ON project_collaborators;

-- Create simple, non-recursive policies for research_projects
CREATE POLICY "Users can view own projects" 
  ON research_projects 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" 
  ON research_projects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
  ON research_projects 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" 
  ON research_projects 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create simple policies for project_collaborators
CREATE POLICY "Users can view own collaborations" 
  ON project_collaborators 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Project owners can manage collaborators" 
  ON project_collaborators 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM research_projects 
      WHERE research_projects.id = project_collaborators.project_id 
      AND research_projects.user_id = auth.uid()
    )
  );

-- Fix research_stages policies to be simpler
DROP POLICY IF EXISTS "Users can view stages of accessible projects" ON research_stages;
DROP POLICY IF EXISTS "Users can modify stages of editable projects" ON research_stages;

CREATE POLICY "Users can view stages of own projects" 
  ON research_stages 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM research_projects 
      WHERE research_projects.id = research_stages.project_id 
      AND research_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can modify stages of own projects" 
  ON research_stages 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM research_projects 
      WHERE research_projects.id = research_stages.project_id 
      AND research_projects.user_id = auth.uid()
    )
  );

-- Fix research_artifacts policies
DROP POLICY IF EXISTS "Users can view artifacts of accessible projects" ON research_artifacts;
DROP POLICY IF EXISTS "Users can modify artifacts of editable projects" ON research_artifacts;

CREATE POLICY "Users can view artifacts of own projects" 
  ON research_artifacts 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM research_stages rs
      JOIN research_projects rp ON rs.project_id = rp.id
      WHERE rs.id = research_artifacts.stage_id 
      AND rp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can modify artifacts of own projects" 
  ON research_artifacts 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM research_stages rs
      JOIN research_projects rp ON rs.project_id = rp.id
      WHERE rs.id = research_artifacts.stage_id 
      AND rp.user_id = auth.uid()
    )
  );