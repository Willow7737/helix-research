import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  ExternalLink,
  Shield,
  BarChart3,
  FileText,
  Brain,
  Lightbulb,
  Activity,
  RefreshCw,
  TrendingUp,
  Award,
  Clock,
  Users,
  Database
} from "lucide-react";

interface StageResult {
  stage: number;
  name: string;
  status: 'completed' | 'error' | 'running';
  ethicsStatus: 'approved' | 'warning' | 'denied';
  data: any;
  metrics?: {
    qualityScore?: number;
    confidenceScore?: number;
    ethicsScore?: number;
    noveltyScore?: number;
  };
  artifacts?: string[];
}

interface StageResultsProps {
  results: StageResult[];
  onDownload?: (stage: number, artifact: string) => void;
  onViewDetails?: (stage: number) => void;
}

export function StageResults({ results, onDownload, onViewDetails }: StageResultsProps) {
  const getStageIcon = (stage: number) => {
    const icons = [FileText, Brain, Lightbulb, Activity, CheckCircle, RefreshCw];
    const Icon = icons[stage - 1] || FileText;
    return Icon;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-ethics-approved" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-ethics-warning" />;
    }
  };

  const getEthicsIcon = (ethicsStatus: string) => {
    switch (ethicsStatus) {
      case 'approved': return <Shield className="h-4 w-4 text-ethics-approved" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-ethics-warning" />;
      case 'denied': return <XCircle className="h-4 w-4 text-ethics-denied" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-2">Research Results</h2>
        <p className="text-muted-foreground">
          Comprehensive results from the 6-stage research pipeline
        </p>
        
        {/* Results summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-6">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{results.length}</div>
            <div className="text-xs text-muted-foreground">Stages Completed</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-ethics-approved">
              {results.filter(r => r.ethicsStatus === 'approved').length}
            </div>
            <div className="text-xs text-muted-foreground">Ethics Approved</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-stage-4">
              {results.reduce((acc, r) => acc + (r.artifacts?.length || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">Artifacts Generated</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-stage-6">
              {Math.round(results.reduce((acc, r) => acc + (r.metrics?.qualityScore || 0), 0) / results.length * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Quality</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {results.map((result) => {
          const StageIcon = getStageIcon(result.stage);
          
          return (
            <Card key={result.stage} className="shadow-stage hover:shadow-research transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-full shadow-md"
                      style={{ backgroundColor: `hsl(var(--stage-${result.stage}))` }}
                    >
                      <StageIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Stage {result.stage}: {result.name}
                        {getStatusIcon(result.status)}
                        {result.status === 'completed' && (
                          <Award className="h-4 w-4 text-ethics-approved" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          {getEthicsIcon(result.ethicsStatus)} 
                          <span className="capitalize">Ethics: {result.ethicsStatus}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>Completed</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>

                  {result.status === 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:shadow-sm transition-all duration-300"
                      onClick={() => onViewDetails?.(result.stage)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Metrics */}
                {result.metrics && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.metrics.qualityScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-medium text-primary">{Math.round(result.metrics.qualityScore * 100)}%</span>
                        </div>
                        <Progress 
                          value={result.metrics.qualityScore * 100} 
                          className="h-2 bg-primary/10" 
                        />
                      </div>
                    )}
                    
                    {result.metrics.confidenceScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium text-stage-2">{Math.round(result.metrics.confidenceScore * 100)}%</span>
                        </div>
                        <Progress 
                          value={result.metrics.confidenceScore * 100} 
                          className="h-2"
                          style={{ backgroundColor: `hsl(var(--stage-2) / 0.1)` }}
                        />
                      </div>
                    )}
                    
                    {result.metrics.ethicsScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ethics</span>
                          <span className="font-medium text-ethics-approved">{Math.round(result.metrics.ethicsScore * 100)}%</span>
                        </div>
                        <Progress 
                          value={result.metrics.ethicsScore * 100} 
                          className="h-2 bg-ethics-approved/10" 
                        />
                      </div>
                    )}
                    
                    {result.metrics.noveltyScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Novelty</span>
                          <span className="font-medium text-stage-6">{Math.round(result.metrics.noveltyScore * 100)}%</span>
                        </div>
                        <Progress 
                          value={result.metrics.noveltyScore * 100} 
                          className="h-2"
                          style={{ backgroundColor: `hsl(var(--stage-6) / 0.1)` }}
                        />
                      </div>
                    )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Stage-specific Results */}
                <div className="space-y-3">
                  {result.stage === 1 && result.data && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Curated Data Sources ({result.data.length})
                      </h4>
                      <div className="grid gap-2">
                        {result.data.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                            <div>
                              <p className="font-medium text-sm">{item.title || `Source ${index + 1}`}</p>
                              <p className="text-xs text-muted-foreground">
                                Quality: {Math.round((item.quality_score || 0) * 100)}% | 
                                Source: {item.metadata?.provenance || 'Unknown'}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {item.metadata?.type || 'Data'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.stage === 2 && result.data && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Knowledge Entities ({result.data.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.data.slice(0, 10).map((entity: any, index: number) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="text-xs hover:bg-secondary/80 transition-colors duration-200 cursor-help"
                            title={`Relation: ${entity.relation} | Score: ${Math.round((entity.evidence_score || 0) * 100)}%`}
                          >
                            {entity.entity}
                          </Badge>
                        ))}
                        {result.data.length > 10 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.data.length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {result.stage === 3 && result.data && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Generated Hypotheses ({result.data.length})
                      </h4>
                      <div className="space-y-2">
                        {result.data.slice(0, 3).map((hypothesis: any, index: number) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                            <p className="font-medium text-sm mb-1">{hypothesis.statement}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Plausibility: {Math.round((hypothesis.plausibility || 0) * 100)}%</span>
                              <span>Duration: {hypothesis.design?.duration || 'N/A'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.stage === 4 && result.data && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Simulation Results
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(result.data.output || {}).map(([key, value]) => (
                          <div key={key} className="p-3 bg-muted/30 rounded-lg text-center hover:bg-muted/50 transition-colors duration-200">
                            <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-medium text-primary">
                              {typeof value === 'number' ? value.toFixed(3) : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.stage === 5 && result.data && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Statistical Validation
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(result.data.data || {}).map(([key, value]) => (
                          <div key={key} className="p-3 bg-muted/30 rounded-lg text-center hover:bg-muted/50 transition-colors duration-200">
                            <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-medium text-stage-5">
                              {typeof value === 'number' ? value.toFixed(4) : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <Badge 
                          variant={result.data.meets_criteria ? "default" : "destructive"}
                          className="w-full justify-center py-2"
                        >
                          {result.data.meets_criteria && <Award className="h-3 w-3 mr-1" />}
                          {result.data.meets_criteria ? "Meets Publication Criteria" : "Does Not Meet Criteria"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {result.stage === 6 && result.data && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Learning Updates & Dissemination
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                          <span className="text-sm">Knowledge Base Updates</span>
                          <Badge variant="outline">{result.data.updates || 0} entries</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                          <span className="text-sm">Model Retraining</span>
                          <Badge variant={result.data.retrained ? "default" : "secondary"}>
                            {result.data.retrained ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                          <span className="text-sm flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            Research Impact
                          </span>
                          <Badge variant="outline">High Potential</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Artifacts */}
                {result.artifacts && result.artifacts.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Generated Artifacts ({result.artifacts.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.artifacts.map((artifact, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                            onClick={() => onDownload?.(result.stage, artifact)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            <span className="text-xs">{artifact}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}