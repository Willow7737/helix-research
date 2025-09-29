import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building } from "lucide-react";

interface PricingFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  tier: 'free' | 'pro' | 'enterprise';
  onSelect: () => void;
}

export function PricingTier({ name, price, description, features, popular, tier, onSelect }: PricingTierProps) {
  const getTierIcon = () => {
    switch (tier) {
      case 'free':
        return <Zap className="h-5 w-5" />;
      case 'pro':
        return <Crown className="h-5 w-5" />;
      case 'enterprise':
        return <Building className="h-5 w-5" />;
    }
  };

  const getTierGradient = () => {
    switch (tier) {
      case 'free':
        return 'bg-gradient-subtle';
      case 'pro':
        return 'bg-gradient-premium';
      case 'enterprise':
        return 'bg-gradient-enterprise';
    }
  };

  const getTierBorder = () => {
    switch (tier) {
      case 'free':
        return 'border-border';
      case 'pro':
        return 'border-premium/30';
      case 'enterprise':
        return 'border-enterprise/30';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-research hover:-translate-y-2 ${getTierBorder()} ${popular ? 'scale-105 shadow-glow' : ''}`}>
      {popular && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-premium" />
      )}
      
      <CardHeader className="text-center space-y-4">
        {popular && (
          <Badge className="absolute top-4 right-4 bg-gradient-premium text-white border-0">
            Most Popular
          </Badge>
        )}
        
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getTierGradient()} text-white mx-auto shadow-stage`}>
          {getTierIcon()}
        </div>
        
        <div>
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <CardDescription className="text-base mt-2">{description}</CardDescription>
        </div>
        
        <div className="space-y-1">
          <div className="text-4xl font-bold">
            {price}
            {price !== 'Custom' && <span className="text-lg font-normal text-muted-foreground">/month</span>}
          </div>
          {tier === 'free' && <p className="text-sm text-muted-foreground">Forever free</p>}
          {tier === 'pro' && <p className="text-sm text-muted-foreground">Billed monthly</p>}
          {tier === 'enterprise' && <p className="text-sm text-muted-foreground">Contact us for pricing</p>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Button 
          className={`w-full font-semibold ${
            tier === 'pro' ? 'bg-gradient-premium hover:shadow-glow' :
            tier === 'enterprise' ? 'bg-gradient-enterprise hover:shadow-glow' :
            'bg-primary hover:bg-primary/90'
          }`}
          onClick={onSelect}
        >
          {tier === 'free' ? 'Get Started Free' :
           tier === 'pro' ? 'Upgrade to Pro' :
           'Contact Sales'}
        </Button>
        
        <div className="space-y-3">
          <h4 className="font-semibold">Features included:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className={`h-4 w-4 mt-0.5 ${feature.included ? 'text-accent' : 'text-muted-foreground/30'}`} />
                <div className="flex-1">
                  <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                    {feature.name}
                  </span>
                  {feature.limit && (
                    <span className="text-sm text-muted-foreground ml-1">({feature.limit})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}