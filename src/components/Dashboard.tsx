import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useResearchProjects } from "@/hooks/useResearchProjects";
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Users, 
  BarChart3, 
  Rocket,
  Crown,
  Globe,
  Database,
  Bot,
  Shield,
  Clock
} from "lucide-react";

interface DashboardProps {
  onStartResearch: () => void;
  onViewProjects: () => void;
  onUpgrade: () => void;
}

export function Dashboard({ onStartResearch, onViewProjects, onUpgrade }: DashboardProps) {
  const { projects } = useResearchProjects();
  
  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    runningProjects: projects.filter(p => p.status === 'running').length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) : 0
  };

  const features = [
    {
      title: "AI-Powered Research",
      description: "Leverage advanced AI models for comprehensive research analysis",
      icon: Brain,
      gradient: "bg-gradient-primary"
    },
    {
      title: "Real-time Web Scraping",
      description: "Access live data from millions of sources across the internet",
      icon: Globe,
      gradient: "bg-gradient-research"
    },
    {
      title: "Advanced Analytics",
      description: "Get deep insights with sophisticated statistical analysis",
      icon: BarChart3,
      gradient: "bg-gradient-stage"
    },
    {
      title: "Automated Documentation",
      description: "Generate publication-ready reports and documentation",
      icon: Bot,
      gradient: "bg-gradient-premium"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-stage-3/10 to-stage-6/10" />
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full text-sm">
            <Rocket className="h-4 w-4 text-primary" />
            <span>Universal Researcher AI Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-stage-3 to-stage-6 bg-clip-text text-transparent">
            Research at the Speed of AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your research workflow with AI-powered data collection, analysis, and documentation. 
            From hypothesis to publication in minutes, not months.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={onStartResearch} className="bg-gradient-primary hover:shadow-glow">
              <Zap className="h-5 w-5 mr-2" />
              Start New Research
            </Button>
            <Button size="lg" variant="outline" onClick={onViewProjects}>
              <Database className="h-5 w-5 mr-2" />
              View Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Research initiatives
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              Successful completions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Research</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.runningProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <Progress value={stats.avgProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Platform Features */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Powerful Research Capabilities</h2>
          <p className="text-muted-foreground">Everything you need for comprehensive research</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-stage hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.gradient} text-white mx-auto shadow-stage`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-pricing border-premium/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-premium" />
                Unlock Advanced Features
              </CardTitle>
              <CardDescription>
                Get access to premium data sources, unlimited research, and priority processing
              </CardDescription>
            </div>
            <Badge className="bg-gradient-premium text-white border-0">
              Limited Time
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={onUpgrade} className="bg-gradient-premium hover:shadow-glow">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Enterprise Solution
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}