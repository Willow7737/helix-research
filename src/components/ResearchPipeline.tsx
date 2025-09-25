import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Brain, 
  Lightbulb, 
  Activity, 
  CheckCircle, 
  RefreshCw,
  Shield,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp
} from "lucide-react";

interface ResearchStage {
  id: number;
  name: string;
  description: string;
  icon: typeof Database;
  status: 'pending' | 'running' | 'completed' | 'error';
  ethicsStatus: 'pending' | 'approved' | 'warning' | 'denied';
  progress: number;
  results?: any;
}

interface ResearchPipelineProps {
  topic: string;
  isRunning: boolean;
  results?: any[];
  onStageClick: (stage: ResearchStage) => void;
}

export function ResearchPipeline({ topic, isRunning, results = [], onStageClick }: ResearchPipelineProps) {
  // Update stages based on results
  const getStageStatus = (stageId: number): { status: 'pending' | 'running' | 'completed' | 'error'; ethicsStatus: 'pending' | 'approved' | 'warning' | 'denied'; progress: number } => {
    const result = results.find(r => r.stage === stageId);
    if (result) {
      return {
        status: result.status as 'pending' | 'running' | 'completed' | 'error',
        ethicsStatus: result.ethicsStatus as 'pending' | 'approved' | 'warning' | 'denied',
        progress: result.status === 'completed' ? 100 : isRunning ? 50 : 0
      };
    }
    return {
      status: (isRunning && stageId <= (results.length + 1) ? 'running' : 'pending') as 'pending' | 'running' | 'completed' | 'error',
      ethicsStatus: 'pending' as 'pending' | 'approved' | 'warning' | 'denied',
      progress: 0
    };
  };

  const stages: ResearchStage[] = [
    {
      id: 1,
      name: "Ingestion & Curation",
      description: "Collecting and curating research data from multiple sources",
      icon: Database,
      ...getStageStatus(1),
    },
    {
      id: 2,
      name: "Knowledge Modeling",
      description: "Extracting entities and relationships from curated data",
      icon: Brain,
      ...getStageStatus(2),
    },
    {
      id: 3,
      name: "Hypothesis Generation",
      description: "Creating testable hypotheses with experimental designs",
      icon: Lightbulb,
      ...getStageStatus(3),
    },
    {
      id: 4,
      name: "Simulation & Prioritization",
      description: "Running computational experiments and risk assessment",
      icon: Activity,
      ...getStageStatus(4),
    },
    {
      id: 5,
      name: "Real-World Validation",
      description: "Statistical analysis and publication criteria checking",
      icon: CheckCircle,
      ...getStageStatus(5),
    },
    {
      id: 6,
      name: "Learning Loop & Dissemination",
      description: "Knowledge base updates and research artifact generation",
      icon: RefreshCw,
      ...getStageStatus(6),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-accent';
      case 'running': return 'bg-primary';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getEthicsColor = (ethicsStatus: string) => {
    switch (ethicsStatus) {
      case 'approved': return 'bg-ethics-approved';
      case 'warning': return 'bg-ethics-warning';
      case 'denied': return 'bg-ethics-denied';
      default: return 'bg-muted';
    }
  };

  const getEthicsIcon = (ethicsStatus: string) => {
    switch (ethicsStatus) {
      case 'approved': return <Shield className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'denied': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="text-center space-y-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary rounded-full text-primary-foreground shadow-glow animate-float">
          <Brain className="h-5 w-5 animate-research-pulse" />
          <span className="font-medium">Research Topic: {topic}</span>
        </div>
        
        {/* Overall Progress */}
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {Math.round(stages.reduce((acc, stage) => acc + stage.progress, 0) / 6)}%
            </span>
          </div>
          <Progress 
            value={stages.reduce((acc, stage) => acc + stage.progress, 0) / 6} 
            className="h-3 bg-gradient-stage shadow-sm"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stages.filter(s => s.status === 'completed').length} completed</span>
            <span>{stages.filter(s => s.status === 'running').length} running</span>
            <span>{stages.filter(s => s.status === 'pending').length} pending</span>
          </div>
        </div>
        
        {/* Real-time status */}
        {isRunning && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span>Pipeline actively processing...</span>
          </div>
        )}
      </div>

      {/* Pipeline Stages */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = isRunning && stage.status === 'running';
          const isCompleted = stage.status === 'completed';
          
          return (
            <Card
              key={stage.id}
              className={`cursor-pointer transition-all duration-500 hover:shadow-stage hover:-translate-y-2 ${
                isActive ? 'shadow-glow border-primary animate-research-pulse' : 
                isCompleted ? 'shadow-card border-ethics-approved/30' : ''
              }`}
              onClick={() => onStageClick(stage)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isActive ? 'animate-research-pulse shadow-lg' : 
                        isCompleted ? 'shadow-md' : ''
                      }`}
                      style={{ backgroundColor: `hsl(var(--stage-${stage.id}))` }}
                    >
                      <Icon className={`h-5 w-5 text-white ${isActive ? 'animate-spin' : ''}`} />
                    </div>
                    <Badge 
                      variant={isCompleted ? "default" : "outline"} 
                      className="text-xs"
                    >
                      Stage {stage.id}
                    </Badge>
                  </div>
                  
                  {/* Ethics Status */}
                  <div 
                    className={`p-1.5 rounded-full transition-all duration-300 ${getEthicsColor(stage.ethicsStatus)} ${
                      stage.ethicsStatus === 'approved' ? 'shadow-sm' : ''
                    }`}
                    title={`Ethics Status: ${stage.ethicsStatus}`}
                  >
                    {getEthicsIcon(stage.ethicsStatus)}
                  </div>
                </div>

                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {stage.name}
                    {isCompleted && <CheckCircle className="h-4 w-4 text-ethics-approved" />}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {stage.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium flex items-center gap-1">
                      {isActive && <Zap className="h-3 w-3 text-primary" />}
                      {stage.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={stage.progress} 
                    className={`h-2 transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
                    style={{
                      backgroundColor: `hsl(var(--stage-${stage.id}) / 0.2)`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant={
                      stage.status === 'completed' ? 'default' : 
                      stage.status === 'running' ? 'outline' : 'secondary'
                    }
                    className={`capitalize ${isActive ? 'animate-pulse' : ''}`}
                  >
                    {stage.status}
                  </Badge>
                  
                  {stage.status === 'completed' && (
                    <Button variant="outline" size="sm" className="hover:shadow-sm transition-all duration-300">
                      View Results
                    </Button>
                  )}
                  
                  {isActive && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Processing...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stage Flow Visualization */}
      <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="relative">
          {/* Flow Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-stage transform -translate-y-1/2 rounded-full shadow-sm" />
          
          {/* Stage Dots */}
          <div className="relative flex justify-between items-center">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`w-5 h-5 rounded-full border-2 border-background transition-all duration-300 ${
                  stage.status === 'completed' ? 'bg-accent' :
                  stage.status === 'running' ? 'bg-primary animate-research-pulse shadow-lg' :
                  'bg-muted'
                } hover:scale-110 cursor-pointer`}
                style={{
                  backgroundColor: stage.status !== 'pending' ? `hsl(var(--stage-${stage.id}))` : undefined
                }}
                title={`Stage ${stage.id}: ${stage.name}`}
              />
            ))}
          </div>
          
          {/* Stage labels */}
          <div className="relative flex justify-between items-center mt-4">
            {stages.map((stage) => (
              <div key={stage.id} className="text-xs text-center text-muted-foreground max-w-16">
                <div className="truncate">{stage.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}