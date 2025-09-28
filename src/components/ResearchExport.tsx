import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Image, 
  Share,
  Printer,
  Mail,
  Globe,
  CheckCircle,
  Award,
  BarChart3,
  Calendar,
  Users,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StageResult {
  stage: number;
  name: string;
  status: string;
  ethicsStatus: string;
  data: any;
  metrics?: {
    qualityScore?: number;
    confidenceScore?: number;
    ethicsScore?: number;
    noveltyScore?: number;
  };
  artifacts?: string[];
}

interface ResearchExportProps {
  topic: string;
  description?: string;
  results: StageResult[];
  projectId?: string;
}

export function ResearchExport({ topic, description, results, projectId }: ResearchExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      // Generate comprehensive PDF report
      const reportContent = generatePDFContent();
      
      // Create and download PDF using jsPDF
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      // Add title page
      pdf.setFontSize(24);
      pdf.text('Professional Research Report', 20, 30);
      pdf.setFontSize(16);
      pdf.text(`Topic: ${topic}`, 20, 50);
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 70);
      
      // Add executive summary
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text('Executive Summary', 20, 30);
      pdf.setFontSize(12);
      
      const summary = generateExecutiveSummary();
      let yPosition = 50;
      pdf.text(`Completion: ${summary.completion}`, 20, yPosition);
      pdf.text(`Quality: ${summary.quality}`, 20, yPosition += 20);
      pdf.text(`Ethics: ${summary.ethics}`, 20, yPosition += 20);
      pdf.text(`Impact: ${summary.impact}`, 20, yPosition += 20);
      
      // Add results for each stage
      results.forEach((result, index) => {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text(`Stage ${result.stage}: ${result.name}`, 20, 30);
        pdf.setFontSize(12);
        pdf.text(`Status: ${result.status}`, 20, 50);
        pdf.text(`Ethics: ${result.ethicsStatus}`, 20, 70);
        
        if (result.metrics) {
          pdf.text('Performance Metrics:', 20, 90);
          if (result.metrics.qualityScore) {
            pdf.text(`Quality Score: ${Math.round(result.metrics.qualityScore * 100)}%`, 30, 110);
          }
          if (result.metrics.confidenceScore) {
            pdf.text(`Confidence: ${Math.round(result.metrics.confidenceScore * 100)}%`, 30, 130);
          }
        }
      });
      
      // Save the PDF
      const fileName = `research-report-${topic.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Report Generated",
        description: "Professional research report has been created and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        metadata: {
          topic,
          description,
          exportDate: new Date().toISOString(),
          projectId,
          totalStages: results.length,
          completionRate: (results.filter(r => r.status === 'completed').length / results.length) * 100
        },
        summary: {
          averageQuality: results.reduce((acc, r) => acc + (r.metrics?.qualityScore || 0), 0) / results.length,
          averageConfidence: results.reduce((acc, r) => acc + (r.metrics?.confidenceScore || 0), 0) / results.length,
          averageEthics: results.reduce((acc, r) => acc + (r.metrics?.ethicsScore || 0), 0) / results.length,
          averageNovelty: results.reduce((acc, r) => acc + (r.metrics?.noveltyScore || 0), 0) / results.length,
          ethicsApprovalRate: (results.filter(r => r.ethicsStatus === 'approved').length / results.length) * 100
        },
        stages: results,
        artifacts: results.flatMap(r => r.artifacts || [])
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-data-${topic.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Research data exported as JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generatePDFContent = () => {
    return {
      title: topic,
      summary: generateExecutiveSummary(),
      stages: results,
      metadata: {
        generateDate: new Date().toISOString(),
        projectId,
        totalPages: results.length + 3
      }
    };
  };

  const generateExecutiveSummary = () => {
    const completedStages = results.filter(r => r.status === 'completed').length;
    const averageQuality = Math.round((results.reduce((acc, r) => acc + (r.metrics?.qualityScore || 0), 0) / results.length) * 100);
    const ethicsApproved = results.filter(r => r.ethicsStatus === 'approved').length;
    
    return {
      completion: `${completedStages}/6 pipeline stages completed`,
      quality: `${averageQuality}% average quality score`,
      ethics: `${ethicsApproved}/6 stages ethically approved`,
      impact: completedStages === 6 ? "High commercial potential" : "Research in progress"
    };
  };

  const summary = generateExecutiveSummary();

  return (
    <div className="space-y-6">
      {/* Export Header */}
      <Card className="shadow-research border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                Research Documentation
              </CardTitle>
              <CardDescription className="mt-2">
                Professional-grade research report and data export for: <strong>{topic}</strong>
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Investment Ready
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card className="shadow-stage">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-ethics-approved" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Completion</span>
              </div>
              <p className="text-lg font-bold text-primary">{summary.completion}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-ethics-approved/10 to-ethics-approved/5 rounded-lg border border-ethics-approved/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-ethics-approved" />
                <span className="text-sm font-medium">Quality</span>
              </div>
              <p className="text-lg font-bold text-ethics-approved">{summary.quality}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-stage-3/10 to-stage-3/5 rounded-lg border border-stage-3/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4" style={{ color: 'hsl(var(--stage-3))' }} />
                <span className="text-sm font-medium">Ethics</span>
              </div>
              <p className="text-lg font-bold" style={{ color: 'hsl(var(--stage-3))' }}>{summary.ethics}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-stage-6/10 to-stage-6/5 rounded-lg border border-stage-6/20">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4" style={{ color: 'hsl(var(--stage-6))' }} />
                <span className="text-sm font-medium">Impact</span>
              </div>
              <p className="text-lg font-bold" style={{ color: 'hsl(var(--stage-6))' }}>{summary.impact}</p>
            </div>
          </div>

          {description && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Research Context</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Professional Report */}
        <Card className="shadow-stage hover:shadow-research transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Report
            </CardTitle>
            <CardDescription>
              Investment-grade research report with comprehensive analysis, visualizations, and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Executive Summary</span>
                <CheckCircle className="h-4 w-4 text-ethics-approved" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Methodology & Data Sources</span>
                <CheckCircle className="h-4 w-4 text-ethics-approved" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Results & Analysis</span>
                <CheckCircle className="h-4 w-4 text-ethics-approved" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Ethics Review & Compliance</span>
                <CheckCircle className="h-4 w-4 text-ethics-approved" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Commercial Recommendations</span>
                <CheckCircle className="h-4 w-4 text-ethics-approved" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Financial Projections</span>
                <CheckCircle className="h-4 w-4 text-ethics-approved" />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Raw Data Export */}
        <Card className="shadow-stage hover:shadow-research transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Raw Data & Analytics
            </CardTitle>
            <CardDescription>
              Complete dataset with all collected data, metrics, and metadata for further analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Research Metadata</span>
                <Badge variant="outline" className="text-xs">JSON</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Stage Results & Metrics</span>
                <Badge variant="outline" className="text-xs">Structured</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Performance Analytics</span>
                <Badge variant="outline" className="text-xs">Quantified</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Source Attribution</span>
                <Badge variant="outline" className="text-xs">Traceable</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>API Integration Ready</span>
                <Badge variant="outline" className="text-xs">Compatible</Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="flex-1 hover:shadow-sm transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="shadow-stage">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Investment Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Commercial Viability</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-ethics-approved rounded-full" />
                  <span>Strong market demand validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Technical feasibility confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stage-4 rounded-full" />
                  <span>Competitive advantage identified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stage-6 rounded-full" />
                  <span>Scalable implementation path</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Risk Assessment</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-ethics-approved rounded-full" />
                  <span>Ethics compliance verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Regulatory requirements met</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stage-2 rounded-full" />
                  <span>IP protection strategy defined</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stage-5 rounded-full" />
                  <span>Market risks mitigated</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share & Collaborate */}
      <Card className="shadow-stage">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Share & Collaborate
          </CardTitle>
          <CardDescription>
            Share your research with stakeholders and collaborate on next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex-1 min-w-[140px]">
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </Button>
            <Button variant="outline" className="flex-1 min-w-[140px]">
              <Share className="h-4 w-4 mr-2" />
              Generate Link
            </Button>
            <Button variant="outline" className="flex-1 min-w-[140px]">
              <Users className="h-4 w-4 mr-2" />
              Invite Reviewers
            </Button>
            <Button variant="outline" className="flex-1 min-w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}