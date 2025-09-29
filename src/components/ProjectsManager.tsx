import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useResearchProjects } from "@/hooks/useResearchProjects";
import { Plus, Play, Trash2, Clock, CheckCircle, XCircle, FileSearch } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProjectsManager = () => {
  const { projects, loading, createProject, deleteProject } = useResearchProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    topic: "",
    sources: "",
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sourcesArray = newProject.sources
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const project = await createProject({
      title: newProject.title,
      description: newProject.description,
      topic: newProject.topic,
      sources: sourcesArray,
    });

    if (project) {
      setNewProject({ title: "", description: "", topic: "", sources: "" });
      setIsDialogOpen(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileSearch className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Research Projects</h2>
          <p className="text-muted-foreground">Manage your research projects and pipelines</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Research Project</DialogTitle>
              <DialogDescription>
                Set up a new research project with your topic and sources.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your research project"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Research Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Climate change impacts on agriculture"
                  value={newProject.topic}
                  onChange={(e) => setNewProject(prev => ({ ...prev, topic: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sources">Research Sources (one per line)</Label>
                <Textarea
                  id="sources"
                  placeholder="https://example.com/research
Academic journals
Government reports"
                  value={newProject.sources}
                  onChange={(e) => setNewProject(prev => ({ ...prev, sources: e.target.value }))}
                  rows={5}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center p-8">
          <CardHeader>
            <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first research project to get started with AI-powered research.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.topic}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getStatusIcon(project.status)}
                    {project.status}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getStatusColor(project.status)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {project.sources.slice(0, 3).map((source, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {source.length > 20 ? `${source.substring(0, 20)}...` : source}
                    </Badge>
                  ))}
                  {project.sources.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.sources.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => {
                        // TODO: Implement run project functionality
                        console.log("Running project:", project.id);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;