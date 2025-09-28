import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResearchForm } from "@/components/ResearchForm";
import { ResearchPipeline } from "@/components/ResearchPipeline";
import { StageResults } from "@/components/StageResults";
import ProjectsManager from "@/components/ProjectsManager";
import Navigation from "@/components/Navigation";
import { ResearchExport } from "@/components/ResearchExport";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Users, 
  Sparkles,
  Github,
  Twitter,
  Mail,
  Shield,
  Zap,
  Target,
  LogIn
} from "lucide-react";
import jsPDF from "jspdf";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "researcher" | "user";
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

interface Metric {
  name: string;
  value: number;
  description?: string;
}

interface Artifact {
  name: string;
  url: string;
  type: "report" | "data" | "model";
  description?: string;
}

interface Stage {
  id: number;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  metrics: Metric[];
  artifacts: Artifact[];
}

interface ResearchProject {
  id: string;
  title: string;
  description?: string;
  topic: string;
  sources: string[];
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  status: "open" | "in progress" | "completed" | "blocked";
  priority: "high" | "medium" | "low";
  due_date?: string;
  created_at: string;
  updated_at: string;
  project_id: string;
}

interface Source {
  id: string;
  url: string;
  title: string;
  type: "article" | "report" | "dataset" | "other";
  access_date: string;
  project_id: string;
}

interface StageResult {
  stage: number;
  name: string;
  status: "completed" | "error" | "running";
  ethicsStatus: "approved" | "warning" | "denied";
  data: any[];
  metrics: Record<string, number>;
  artifacts: string[];
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTopic, setCurrentTopic] = useState("");
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [results, setResults] = useState<StageResult[]>([]);
  const [activeTab, setActiveTab] = useState("research");
  const [researchTab, setResearchTab] = useState<"form" | "pipeline" | "results" | "export">("form");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Auto-switch research sub-tabs based on pipeline state
  useEffect(() => {
    if (isPipelineRunning) {
      setResearchTab("pipeline");
    } else if (results.length >= 6) {
      setResearchTab("export");
    } else if (results.length > 0) {
      setResearchTab("results");
    } else {
      setResearchTab("form");
    }
  }, [isPipelineRunning, results.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Generate dynamic research results based on topic
  const generateMockResults = (topic: string, sources: string[]) => {
    const topicKeywords = topic.toLowerCase().split(' ');
    const mainKeyword = topicKeywords[0] || 'research';
    
    return [
      {
        stage: 1,
        name: "Ingestion & Curation",
        status: "completed" as const,
        ethicsStatus: "approved" as const,
        data: [
          {
            title: `Advances in ${topic}: A Comprehensive Review`,
            quality_score: 0.91 + Math.random() * 0.08,
            metadata: { provenance: "arXiv", type: "paper" }
          },
          {
            title: `Novel ${mainKeyword} implementations and methodologies`,
            quality_score: 0.85 + Math.random() * 0.10,
            metadata: { provenance: "Nature", type: "paper" }
          },
          {
            title: `${topic} benchmark dataset v2.0`,
            quality_score: 0.92 + Math.random() * 0.06,
            metadata: { provenance: "Kaggle", type: "dataset" }
          }
        ],
        metrics: {
          qualityScore: 0.89 + Math.random() * 0.10,
          ethicsScore: 0.96 + Math.random() * 0.04
        },
        artifacts: ["curated_data.json", "quality_report.pdf"]
      },
      {
        stage: 2,
        name: "Knowledge Modeling",
        status: "completed" as const,
        ethicsStatus: "approved" as const,
        data: [
          { entity: mainKeyword, relation: "ENABLES", evidence_score: 0.92 + Math.random() * 0.06 },
          { entity: `${mainKeyword} optimization`, relation: "IMPROVES", evidence_score: 0.87 + Math.random() * 0.08 },
          { entity: `${mainKeyword} frameworks`, relation: "REQUIRES", evidence_score: 0.85 + Math.random() * 0.10 },
          { entity: `${mainKeyword} validation`, relation: "BASED_ON", evidence_score: 0.90 + Math.random() * 0.08 },
          { entity: `${mainKeyword} limitations`, relation: "REDUCES", evidence_score: 0.76 + Math.random() * 0.10 }
        ],
        metrics: {
          confidenceScore: 0.86 + Math.random() * 0.10,
          noveltyScore: 0.71 + Math.random() * 0.15
        },
        artifacts: ["knowledge_graph.json", "entity_relationships.csv"]
      },
      {
        stage: 3,
        name: "Hypothesis Generation",
        status: "completed" as const,
        ethicsStatus: "approved" as const,
        data: [
          {
            statement: `${topic} optimization improves performance by ${Math.round(30 + Math.random() * 40)}%`,
            plausibility: 0.78 + Math.random() * 0.15,
            design: { duration: `${Math.round(3 + Math.random() * 6)} months`, materials: `${mainKeyword} framework` }
          },
          {
            statement: `Advanced ${mainKeyword} techniques reduce computation time by ${Math.round(40 + Math.random() * 30)}%`,
            plausibility: 0.72 + Math.random() * 0.18,
            design: { duration: `${Math.round(2 + Math.random() * 4)} months`, materials: `${mainKeyword} simulator` }
          }
        ],
        metrics: {
          noveltyScore: 0.75 + Math.random() * 0.15,
          ethicsScore: 0.98 + Math.random() * 0.02
        },
        artifacts: ["hypotheses.json", "experimental_designs.pdf"]
      },
      {
        stage: 4,
        name: "Simulation & Prioritization",
        status: "completed" as const,
        ethicsStatus: "approved" as const,
        data: [
          {
            hypothesis_id: 1,
            simulation_results: {
              performance_gain: Math.round(25 + Math.random() * 50),
              confidence_interval: "95%",
              risk_assessment: "Low"
            },
            priority_score: 0.82 + Math.random() * 0.15
          },
          {
            hypothesis_id: 2,
            simulation_results: {
              performance_gain: Math.round(30 + Math.random() * 40),
              confidence_interval: "90%",
              risk_assessment: "Medium"
            },
            priority_score: 0.75 + Math.random() * 0.20
          }
        ],
        metrics: {
          simulationAccuracy: 0.88 + Math.random() * 0.10,
          riskScore: 0.15 + Math.random() * 0.20
        },
        artifacts: ["simulation_results.json", "risk_assessment.pdf"]
      },
      {
        stage: 5,
        name: "Real-World Validation",
        status: "completed" as const,
        ethicsStatus: "approved" as const,
        data: [
          {
            experiment_id: 1,
            statistical_analysis: {
              p_value: Math.random() * 0.05,
              effect_size: 0.65 + Math.random() * 0.30,
              sample_size: Math.round(100 + Math.random() * 400)
            },
            publication_criteria: {
              statistical_significance: true,
              effect_size_adequate: true,
              reproducibility_score: 0.85 + Math.random() * 0.12
            }
          }
        ],
        metrics: {
          validationScore: 0.83 + Math.random() * 0.15,
          reproducibilityScore: 0.87 + Math.random() * 0.10
        },
        artifacts: ["validation_results.json", "statistical_report.pdf"]
      },
      {
        stage: 6,
        name: "Learning Loop & Dissemination",
        status: "completed" as const,
        ethicsStatus: "approved" as const,
        data: [
          {
            knowledge_updates: [
              `Updated ${mainKeyword} knowledge base with new findings`,
              `Refined ${mainKeyword} prediction models`,
              `Enhanced ${mainKeyword} recommendation algorithms`
            ],
            dissemination_plan: {
              target_journals: [`Journal of ${topic}`, `${mainKeyword} Research Quarterly`],
              conference_submissions: 2,
              open_access_repository: "arXiv"
            }
          }
        ],
        metrics: {
          knowledgeIntegration: 0.91 + Math.random() * 0.08,
          disseminationReach: 0.76 + Math.random() * 0.20
        },
        artifacts: ["knowledge_updates.json", "dissemination_report.pdf"]
      }
    ];
  };

  const handleResearchStart = async (topic: string, sources: string[], description?: string) => {
    setCurrentTopic(topic);
    setActiveTab("research");
    setResearchTab("pipeline");
    setIsPipelineRunning(true);
    setResults([]); // Clear previous results
    
    toast({
      title: "Research Started",
      description: `Initiating automated research on: ${topic}`,
    });

    // Simulate progressive research pipeline execution
    const stageTimings = [2000, 4000, 6000, 8000, 10000, 12000]; // Each stage completion time
    const dynamicResults = generateMockResults(topic, sources);
    
    stageTimings.forEach((timing, index) => {
      setTimeout(() => {
        const completedStages = dynamicResults.slice(0, index + 1);
        setResults(completedStages);
        
        if (index === stageTimings.length - 1) {
          setIsPipelineRunning(false);
          setResearchTab("export");
          toast({
            title: "Research Completed",
            description: "Professional research report ready for export and review",
          });
        } else {
          toast({
            title: `Stage ${index + 1} Complete`,
            description: `${dynamicResults[index].name} finished successfully`,
          });
        }
      }, timing);
    });
  };

  const handleDownload = (stage: number, artifact: string) => {
    const stageResult = results.find(r => r.stage === stage);
    
    if (artifact.endsWith('.json')) {
      const content = JSON.stringify(stageResult?.data || {}, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      downloadFile(blob, artifact);
    } else if (artifact.endsWith('.csv')) {
      let content = '';
      if (stage === 2) {
        content = "entity,relation,evidence_score\n";
        stageResult?.data.forEach((item: any) => {
          content += `"${item.entity}","${item.relation}",${item.evidence_score}\n`;
        });
      } else {
        content = "data,value\nsample_data,1.0\n";
      }
      const blob = new Blob([content], { type: 'text/csv' });
      downloadFile(blob, artifact);
    } else if (artifact.endsWith('.pdf')) {
      // Generate real PDF using jsPDF
      const pdf = new jsPDF();
      
      // Header
      pdf.setFontSize(20);
      pdf.text('Universal Researcher AI', 20, 30);
      pdf.setFontSize(16);
      pdf.text(`Stage ${stage}: ${stageResult?.name || 'Research Report'}`, 20, 45);
      
      // Date and metadata
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 55);
      pdf.text(`Research Topic: ${currentTopic}`, 20, 62);
      
      // Download the PDF
      pdf.save(artifact);
    }

    toast({
      title: "Download Complete",
      description: `${artifact} from Stage ${stage} has been downloaded`,
    });
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "research" && (
          <Tabs value={researchTab} onValueChange={(val) => setResearchTab(val as "form" | "pipeline" | "results" | "export")} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="form">Research Form</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <ResearchForm
                onResearchStart={handleResearchStart}
                isLoading={isPipelineRunning}
              />
            </TabsContent>

            <TabsContent value="pipeline">
              <ResearchPipeline
                topic={currentTopic}
                isRunning={isPipelineRunning}
                results={results}
                onStageClick={(stageId) => {
                  console.log("Clicked stage:", stageId);
                }}
              />
            </TabsContent>

            <TabsContent value="results">
              <StageResults
                results={results}
                onDownload={handleDownload}
                onViewDetails={(stageId) => {
                  console.log("View details for stage:", stageId);
                }}
              />
            </TabsContent>

            <TabsContent value="export">
              <ResearchExport 
                topic={currentTopic}
                description={`Professional research conducted using advanced 6-stage pipeline`}
                results={results}
                projectId={user?.id}
              />
            </TabsContent>
          </Tabs>
        )}

        {activeTab === "projects" && <ProjectsManager />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-semibold">Universal Researcher AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Automated research pipeline with ethics integration and knowledge loop.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>6-Stage Pipeline</li>
                <li>Ethics Integration</li>
                <li>Real-time Validation</li>
                <li>Knowledge Loop</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Research Papers</li>
                <li>Community</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Universal Researcher AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
