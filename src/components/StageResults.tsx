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
  RefreshCw
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
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Research Results</h2>
        <p className="text-muted-foreground">
          Comprehensive results from the 6-stage research pipeline
        </p>
      </div>

      <div className="grid gap-6">
        {results.map((result) => {
          const StageIcon = getStageIcon(result.stage);
          
          return (
            <Card key={result.stage} className="shadow-stage">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `hsl(var(--stage-${result.stage}))` }}
                    >
                      <StageIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Stage {result.stage}: {result.name}
                        {getStatusIcon(result.status)}
                      </CardTitle>
                      <CardDescription>
                        Ethics Status: {getEthicsIcon(result.ethicsStatus)} {result.ethicsStatus}
                      </CardDescription>
                    </div>
                  </div>

                  {result.status === 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm"
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.metrics.qualityScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-medium">{Math.round(result.metrics.qualityScore * 100)}%</span>
                        </div>
                        <Progress value={result.metrics.qualityScore * 100} className="h-2" />
                      </div>
                    )}
                    
                    {result.metrics.confidenceScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium">{Math.round(result.metrics.confidenceScore * 100)}%</span>
                        </div>
                        <Progress value={result.metrics.confidenceScore * 100} className="h-2" />
                      </div>
                    )}
                    
                    {result.metrics.ethicsScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ethics</span>
                          <span className="font-medium">{Math.round(result.metrics.ethicsScore * 100)}%</span>
                        </div>
                        <Progress value={result.metrics.ethicsScore * 100} className="h-2" />
                      </div>
                    )}
                    
                    {result.metrics.noveltyScore !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Novelty</span>
                          <span className="font-medium">{Math.round(result.metrics.noveltyScore * 100)}%</span>
                        </div>
                        <Progress value={result.metrics.noveltyScore * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Stage-specific Results */}
                <div className="space-y-3">
                  {result.stage === 1 && result.data && (
                    <div>
                      <h4 className="font-medium mb-2">Curated Data Sources</h4>
                      <div className="grid gap-2">
                        {result.data.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{item.title || `Source ${index + 1}`}</p>
                              <p className="text-xs text-muted-foreground">
                                Quality: {Math.round((item.quality_score || 0) * 100)}% | 
                                Source: {item.metadata?.provenance || 'Unknown'}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {item.metadata?.type || 'Data'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.stage === 2 && result.data && (
                    <div>
                      <h4 className="font-medium mb-2">Knowledge Entities</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.data.slice(0, 10).map((entity: any, index: number) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className="text-xs"
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
                      <h4 className="font-medium mb-2">Generated Hypotheses</h4>
                      <div className="space-y-2">
                        {result.data.slice(0, 3).map((hypothesis: any, index: number) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg">
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
                      <h4 className="font-medium mb-2">Simulation Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(result.data.output || {}).map(([key, value]) => (
                          <div key={key} className="p-3 bg-muted/30 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-medium">
                              {typeof value === 'number' ? value.toFixed(3) : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.stage === 5 && result.data && (
                    <div>
                      <h4 className="font-medium mb-2">Statistical Validation</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(result.data.data || {}).map(([key, value]) => (
                          <div key={key} className="p-3 bg-muted/30 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-medium">
                              {typeof value === 'number' ? value.toFixed(4) : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <Badge 
                          variant={result.data.meets_criteria ? "default" : "destructive"}
                          className="w-full justify-center"
                        >
                          {result.data.meets_criteria ? "Meets Publication Criteria" : "Does Not Meet Criteria"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {result.stage === 6 && result.data && (
                    <div>
                      <h4 className="font-medium mb-2">Learning Updates</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">Knowledge Base Updates</span>
                          <Badge variant="outline">{result.data.updates || 0} entries</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">Model Retraining</span>
                          <Badge variant={result.data.retrained ? "default" : "secondary"}>
                            {result.data.retrained ? "Completed" : "Pending"}
                          </Badge>
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
                        Generated Artifacts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.artifacts.map((artifact, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => onDownload?.(result.stage, artifact)}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            {artifact}
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