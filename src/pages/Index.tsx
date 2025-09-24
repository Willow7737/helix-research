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
  ExternalLink 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

const Index = () => {
  const [currentTopic, setCurrentTopic] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("form");
  const { toast } = useToast();

  // Mock data for demonstration
  const mockResults = [
    {
      stage: 1,
      name: "Ingestion & Curation",
      status: "completed" as const,
      ethicsStatus: "approved" as const,
      data: [
        {
          title: "Advances in Quantum Computing: A Comprehensive Review",
          quality_score: 0.92,
          metadata: { provenance: "arXiv", type: "paper" }
        },
        {
          title: "Novel Quantum Algorithm Implementations",
          quality_score: 0.87,
          metadata: { provenance: "Nature", type: "paper" }
        },
        {
          title: "Quantum Computing Benchmark Dataset v2.0",
          quality_score: 0.94,
          metadata: { provenance: "Kaggle", type: "dataset" }
        }
      ],
      metrics: {
        qualityScore: 0.91,
        ethicsScore: 0.98
      },
      artifacts: ["curated_data.json", "quality_report.pdf"]
    },
    {
      stage: 2,
      name: "Knowledge Modeling",
      status: "completed" as const,
      ethicsStatus: "approved" as const,
      data: [
        { entity: "quantum entanglement", relation: "ENABLES", evidence_score: 0.94 },
        { entity: "error correction", relation: "IMPROVES", evidence_score: 0.89 },
        { entity: "quantum gates", relation: "REQUIRES", evidence_score: 0.87 },
        { entity: "superposition", relation: "BASED_ON", evidence_score: 0.92 },
        { entity: "decoherence", relation: "REDUCES", evidence_score: 0.78 }
      ],
      metrics: {
        confidenceScore: 0.88,
        noveltyScore: 0.73
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
          statement: "Quantum error correction improves algorithm reliability by 40%",
          plausibility: 0.82,
          design: { duration: "6 months", materials: "Superconducting qubits" }
        },
        {
          statement: "Hybrid quantum-classical algorithms reduce computation time by 60%",
          plausibility: 0.75,
          design: { duration: "4 months", materials: "Quantum simulator" }
        }
      ],
      metrics: {
        noveltyScore: 0.79,
        ethicsScore: 1.0
      },
      artifacts: ["hypotheses.json", "experimental_designs.pdf"]
    }
  ];

  const handleResearchStart = async (topic: string, sources: string[], description?: string) => {
    setCurrentTopic(topic);
    setIsRunning(true);
    setActiveTab("pipeline");
    setResults([]); // Clear previous results
    
    toast({
      title: "Research Started",
      description: `Initiating automated research on: ${topic}`,
    });

    // Simulate research pipeline execution
    setTimeout(() => {
      setResults(mockResults);
      setIsRunning(false);
      setActiveTab("results");
      toast({
        title: "Research Completed",
        description: "All 6 stages completed successfully with ethics approval",
      });
    }, 8000);
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
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Universal Researcher AI</h1>
                <p className="text-sm text-muted-foreground">Automated 6-Stage Research Pipeline</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex">
                v1.0.0
              </Badge>
              <Button variant="outline" size="sm">
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
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
            <TabsTrigger value="form">Research Form</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-research bg-clip-text text-transparent">
                  Automate Your Research
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Advanced AI-driven research pipeline that ingests data, models knowledge, 
                  generates hypotheses, runs simulations, validates results, and updates learning systems.
                </p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
                <Card className="shadow-stage hover:shadow-glow transition-all duration-300">
                  <CardHeader className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-stage-1" />
                    <CardTitle>6-Stage Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Complete research automation from data ingestion to knowledge dissemination
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="shadow-stage hover:shadow-glow transition-all duration-300">
                  <CardHeader className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-ethics-approved" />
                    <CardTitle>Ethics Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Built-in ethics review, bias detection, and safety validation at every stage
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="shadow-stage hover:shadow-glow transition-all duration-300">
                  <CardHeader className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-stage-4" />
                    <CardTitle>Statistical Rigor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Comprehensive validation with publication-ready statistical analysis
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Research Form */}
            <div className="max-w-2xl mx-auto">
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
          </TabsContent>

          <TabsContent value="results" className="space-y-8">
            {results.length > 0 && (
              <StageResults
                results={results}
                onDownload={handleDownload}
                onViewDetails={(stage) => console.log("View details for stage", stage)}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-medium">Universal Researcher AI</span>
              <Badge variant="outline">Research Automation</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Powered by FastAPI & Next.js</span>
              <Button variant="ghost" size="sm">
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
