-- Clean up ALL existing policies on research_projects to eliminate conflicts
DROP POLICY IF EXISTS "Users can view collaborated projects" ON research_projects;
DROP POLICY IF EXISTS "Editors can update collaborated projects" ON research_projects;
DROP POLICY IF EXISTS "Users can view own projects" ON research_projects;
DROP POLICY IF EXISTS "Users can create own projects" ON research_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON research_projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON research_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON research_projects;

-- Create simple, non-recursive policies for research_projects
CREATE POLICY "Users can view own projects" 
  ON research_projects 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" 
  ON research_projects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
  ON research_projects 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Clean up project_collaborators policies to avoid recursion
DROP POLICY IF EXISTS "Users can view collaborators of accessible projects" ON project_collaborators;
DROP POLICY IF EXISTS "Project owners can manage collaborators" ON project_collaborators;
DROP POLICY IF EXISTS "Users can view own collaborations" ON project_collaborators;

-- Create simple policies for project_collaborators
CREATE POLICY "Users can view own collaborations" 
  ON project_collaborators 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

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