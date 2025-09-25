-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create research projects table
CREATE TABLE public.research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  sources TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create research stages table
CREATE TABLE public.research_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  ethics_status TEXT NOT NULL DEFAULT 'pending' CHECK (ethics_status IN ('pending', 'approved', 'rejected')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  quality_score DECIMAL(3,2),
  confidence_score DECIMAL(3,2),
  ethics_score DECIMAL(3,2),
  novelty_score DECIMAL(3,2),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, stage_number)
);

-- Create research artifacts table
CREATE TABLE public.research_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID NOT NULL REFERENCES public.research_stages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('csv', 'json', 'pdf', 'image', 'document')),
  file_path TEXT,
  file_size INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaborators table
CREATE TABLE public.project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for research projects
CREATE POLICY "Users can view own projects" ON public.research_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view collaborated projects" ON public.research_projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.project_collaborators 
    WHERE project_id = research_projects.id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can create own projects" ON public.research_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.research_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Editors can update collaborated projects" ON public.research_projects FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.project_collaborators 
    WHERE project_id = research_projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- RLS Policies for research stages
CREATE POLICY "Users can view stages of accessible projects" ON public.research_stages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.research_projects rp
    LEFT JOIN public.project_collaborators pc ON rp.id = pc.project_id
    WHERE rp.id = research_stages.project_id 
    AND (rp.user_id = auth.uid() OR pc.user_id = auth.uid())
  )
);
CREATE POLICY "Users can modify stages of editable projects" ON public.research_stages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.research_projects rp
    LEFT JOIN public.project_collaborators pc ON rp.id = pc.project_id
    WHERE rp.id = research_stages.project_id 
    AND (rp.user_id = auth.uid() OR (pc.user_id = auth.uid() AND pc.role IN ('owner', 'editor')))
  )
);

-- RLS Policies for research artifacts
CREATE POLICY "Users can view artifacts of accessible projects" ON public.research_artifacts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.research_stages rs
    JOIN public.research_projects rp ON rs.project_id = rp.id
    LEFT JOIN public.project_collaborators pc ON rp.id = pc.project_id
    WHERE rs.id = research_artifacts.stage_id 
    AND (rp.user_id = auth.uid() OR pc.user_id = auth.uid())
  )
);
CREATE POLICY "Users can modify artifacts of editable projects" ON public.research_artifacts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.research_stages rs
    JOIN public.research_projects rp ON rs.project_id = rp.id
    LEFT JOIN public.project_collaborators pc ON rp.id = pc.project_id
    WHERE rs.id = research_artifacts.stage_id 
    AND (rp.user_id = auth.uid() OR (pc.user_id = auth.uid() AND pc.role IN ('owner', 'editor')))
  )
);

-- RLS Policies for project collaborators
CREATE POLICY "Users can view collaborators of accessible projects" ON public.project_collaborators FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.research_projects rp
    WHERE rp.id = project_collaborators.project_id 
    AND rp.user_id = auth.uid()
  ) OR user_id = auth.uid()
);
CREATE POLICY "Project owners can manage collaborators" ON public.project_collaborators FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.research_projects rp
    WHERE rp.id = project_collaborators.project_id 
    AND rp.user_id = auth.uid()
  )
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('research-artifacts', 'research-artifacts', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);

-- Storage policies for research artifacts
CREATE POLICY "Users can view artifacts of accessible projects" ON storage.objects FOR SELECT USING (
  bucket_id = 'research-artifacts' AND 
  EXISTS (
    SELECT 1 FROM public.research_artifacts ra
    JOIN public.research_stages rs ON ra.stage_id = rs.id
    JOIN public.research_projects rp ON rs.project_id = rp.id
    LEFT JOIN public.project_collaborators pc ON rp.id = pc.project_id
    WHERE ra.file_path = storage.objects.name
    AND (rp.user_id = auth.uid() OR pc.user_id = auth.uid())
  )
);

CREATE POLICY "Users can upload artifacts for editable projects" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'research-artifacts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for user avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON public.research_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_research_stages_updated_at BEFORE UPDATE ON public.research_stages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();