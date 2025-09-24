import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Database, 
  MessageSquare, 
  Shield,
  Sparkles,
  Play
} from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  enabled: boolean;
}

interface ResearchFormProps {
  onSubmit: (topic: string, sources: string[], description?: string) => void;
  isRunning: boolean;
}

export function ResearchForm({ onSubmit, isRunning }: ResearchFormProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "paper",
      name: "Academic Papers",
      description: "Research papers from arXiv, PubMed, Google Scholar",
      icon: FileText,
      enabled: true,
    },
    {
      id: "patent",
      name: "Patent Databases",
      description: "USPTO, EPO, and other patent repositories",
      icon: Shield,
      enabled: false,
    },
    {
      id: "dataset",
      name: "Research Datasets",
      description: "Kaggle, UCI ML Repository, government data",
      icon: Database,
      enabled: false,
    },
    {
      id: "forum",
      name: "Scientific Forums",
      description: "ResearchGate, Stack Overflow, Reddit Science",
      icon: MessageSquare,
      enabled: false,
    },
  ]);

  const toggleDataSource = (id: string) => {
    setDataSources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enabledSources = dataSources.filter(source => source.enabled).map(source => source.id);
    onSubmit(topic, enabledSources, description);
  };

  const selectedCount = dataSources.filter(source => source.enabled).length;

  return (
    <Card className="shadow-research border-primary/20">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Search className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Start New Research</CardTitle>
            <CardDescription>
              Define your research topic and select data sources for automated analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Research Topic */}
          <div className="space-y-3">
            <Label htmlFor="topic" className="text-base font-medium">
              Research Topic
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., quantum computing algorithms, machine learning in healthcare"
              className="text-lg h-12"
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter a specific research topic or area of interest
            </p>
          </div>

          {/* Optional Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium">
              Research Context <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context about your research objectives, specific questions, or focus areas..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Data Sources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Data Sources</Label>
              <Badge variant="outline" className="ml-2">
                {selectedCount} selected
              </Badge>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {dataSources.map((source) => {
                const Icon = source.icon;
                return (
                  <div
                    key={source.id}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-stage ${
                      source.enabled 
                        ? 'border-primary bg-primary/5 shadow-stage' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleDataSource(source.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={source.enabled}
                        onCheckedChange={() => toggleDataSource(source.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{source.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {source.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Select data sources for research ingestion. At least one source is required.
            </p>
          </div>

          {/* Ethics Notice */}
          <div className="p-4 bg-muted/50 rounded-lg border border-muted space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-ethics-approved" />
              <span className="font-medium text-sm">Ethics & Safety Review</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All research will be automatically reviewed for ethical compliance, bias detection, 
              and safety concerns at multiple stages of the pipeline.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg bg-gradient-primary hover:shadow-glow transition-all duration-300"
            disabled={!topic.trim() || selectedCount === 0 || isRunning}
          >
            {isRunning ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                Research in Progress...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Research Pipeline
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}