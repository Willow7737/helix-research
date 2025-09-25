import { useState } from "react";
import { ResearchForm } from "@/components/ResearchForm";
import { ResearchPipeline } from "@/components/ResearchPipeline";
import { StageResults } from "@/components/StageResults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Award,
  Github,
  ExternalLink,
  Sparkles,
  Target,
  Rocket,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

const Index = () => {
  const [currentTopic, setCurrentTopic] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("form");
  const { toast } = useToast();

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
    setIsRunning(true);
    setActiveTab("pipeline");
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
          setIsRunning(false);
          setActiveTab("results");
          toast({
            title: "Research Completed",
            description: "All 6 stages completed successfully with ethics approval",
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

  const handleStageClick = (stage: any) => {
    console.log("Stage clicked:", stage);
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
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Universal Researcher AI', 20, 30);
      pdf.setFontSize(16);
      pdf.text(`Stage ${stage}: ${stageResult?.name || 'Research Report'}`, 20, 45);
      
      // Date and metadata
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 55);
      pdf.text(`Research Topic: ${currentTopic}`, 20, 62);
      
      // Stage details
      let yPos = 80;
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Stage Overview', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      const stageDescriptions = {
        1: 'Data ingestion and curation from multiple research sources',
        2: 'Knowledge modeling and entity relationship extraction',
        3: 'Hypothesis generation with experimental design',
        4: 'Computational simulation and risk assessment',
        5: 'Real-world validation and statistical analysis',
        6: 'Learning loop updates and research dissemination'
      };
      
      pdf.text(stageDescriptions[stage as keyof typeof stageDescriptions] || '', 20, yPos);
      yPos += 20;
      
      // Metrics
      if (stageResult?.metrics) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Performance Metrics', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        Object.entries(stageResult.metrics).forEach(([key, value]) => {
          if (typeof value === 'number') {
            pdf.text(`${key}: ${Math.round(value * 100)}%`, 20, yPos);
            yPos += 7;
          }
        });
        yPos += 10;
      }
      
      // Data summary
      if (stageResult?.data) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Results Summary', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        
        if (Array.isArray(stageResult.data)) {
          pdf.text(`Total items processed: ${stageResult.data.length}`, 20, yPos);
          yPos += 7;
          
          stageResult.data.slice(0, 5).forEach((item: any, index: number) => {
            if (yPos > pageHeight - 30) {
              pdf.addPage();
              yPos = 30;
            }
            
            const text = item.title || item.statement || item.entity || `Item ${index + 1}`;
            const lines = pdf.splitTextToSize(text, pageWidth - 40);
            pdf.text(lines, 20, yPos);
            yPos += lines.length * 5 + 3;
          });
        }
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Generated by Universal Researcher AI - Automated Research Pipeline', 20, pageHeight - 10);
      
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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg animate-float">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Universal Researcher AI</h1>
                <p className="text-sm text-muted-foreground">Automated 6-Stage Research Pipeline</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex animate-shimmer">
                v1.0.0
              </Badge>
              <Button variant="outline" size="sm" className="hover:shadow-sm transition-all duration-300">
                <Github className="h-4 w-4 mr-2" />
                Docs
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto shadow-sm">
            <TabsTrigger value="form">Research Form</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12 animate-fade-in-up">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-30 animate-pulse" />
                  <h2 className="relative text-4xl lg:text-6xl font-bold bg-gradient-research bg-clip-text text-transparent">
                  Automate Your Research
                  </h2>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Advanced AI-driven research pipeline that ingests data, models knowledge, 
                  generates hypotheses, runs simulations, validates results, and updates learning systems.
                </p>
                
                {/* Key stats */}
                <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span>6-Stage Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-ethics-approved" />
                    <span>Ethics Integrated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-stage-4" />
                    <span>Fully Automated</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Card className="shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group">
                  <CardHeader className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-stage-1 group-hover:animate-pulse" />
                    <CardTitle>6-Stage Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Complete research automation from data ingestion to knowledge dissemination
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group" style={{ animationDelay: '0.1s' }}>
                  <CardHeader className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-ethics-approved group-hover:animate-pulse" />
                    <CardTitle>Ethics Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Built-in ethics review, bias detection, and safety validation at every stage
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group" style={{ animationDelay: '0.2s' }}>
                  <CardHeader className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-stage-4 group-hover:animate-pulse" />
                    <CardTitle>Statistical Rigor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Comprehensive validation with publication-ready statistical analysis
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              
              {/* Additional features showcase */}
              <div className="max-w-4xl mx-auto pt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-left space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Advanced AI Capabilities
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        Automated hypothesis generation with experimental design
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-stage-2 rounded-full" />
                        Knowledge graph construction and entity extraction
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-stage-4 rounded-full" />
                        Computational simulation and risk assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-stage-6 rounded-full" />
                        Continuous learning and model improvement
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-left space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Globe className="h-6 w-6 text-stage-6" />
                      Research Impact
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-ethics-approved rounded-full" />
                        Publication-ready statistical validation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-stage-3 rounded-full" />
                        Reproducible research methodologies
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-stage-5 rounded-full" />
                        Open science and knowledge sharing
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        Accelerated scientific discovery
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Form */}
            <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <ResearchForm onSubmit={handleResearchStart} isRunning={isRunning} />
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-8">
            {currentTopic && (
              <ResearchPipeline
                topic={currentTopic}
                isRunning={isRunning}
                results={results}
                onStageClick={handleStageClick}
              />
            )}
            {!currentTopic && (
              <div className="text-center py-12 animate-fade-in-up">
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-float" />
                <h3 className="text-xl font-medium mb-2">No Active Research</h3>
                <p className="text-muted-foreground mb-4">Start a new research project to see the pipeline in action</p>
                <Button onClick={() => setActiveTab("form")} className="bg-gradient-primary hover:shadow-glow">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Research
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-8">
            {results.length > 0 && (
              <StageResults
                results={results}
                onDownload={handleDownload}
                onViewDetails={(stage) => console.log("View details for stage", stage)}
              />
            )}
            {results.length === 0 && (
              <div className="text-center py-12 animate-fade-in-up">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-float" />
                <h3 className="text-xl font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground mb-4">Complete a research pipeline to view comprehensive results</p>
                <Button onClick={() => setActiveTab("form")} className="bg-gradient-primary hover:shadow-glow">
                  <Rocket className="h-4 w-4 mr-2" />
                  Start Research
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t glass mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-medium">Universal Researcher AI</span>
              <Badge variant="outline" className="animate-shimmer">Research Automation</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Powered by FastAPI & Next.js</span>
              <Button variant="ghost" size="sm" className="hover:shadow-sm transition-all duration-300">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
