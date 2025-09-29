import { useState } from "react";
import { PricingTier } from "./PricingTier";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Building, Zap, Check, Star, Users, Rocket } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PricingPageProps {
  onPlanSelect: (plan: string) => void;
}

export function PricingPage({ onPlanSelect }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const pricingPlans = {
    monthly: [
      {
        name: "Starter",
        price: "$0",
        description: "Perfect for individuals and small research projects",
        tier: 'free' as const,
        features: [
          { name: "5 research projects per month", included: true },
          { name: "Basic web scraping", included: true },
          { name: "Standard AI models", included: true },
          { name: "PDF export", included: true },
          { name: "Community support", included: true },
          { name: "Advanced AI models", included: false },
          { name: "Priority processing", included: false },
          { name: "API access", included: false },
          { name: "Custom integrations", included: false }
        ]
      },
      {
        name: "Professional",
        price: "$29",
        description: "For professionals and growing research teams",
        tier: 'pro' as const,
        popular: true,
        features: [
          { name: "Unlimited research projects", included: true },
          { name: "Advanced web scraping", included: true },
          { name: "Premium AI models (GPT-5, Gemini Pro)", included: true },
          { name: "Priority processing", included: true },
          { name: "Advanced analytics", included: true },
          { name: "API access", included: true, limit: "10,000 requests/month" },
          { name: "Email support", included: true },
          { name: "Collaboration tools", included: true },
          { name: "Custom branding", included: false }
        ]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with advanced needs",
        tier: 'enterprise' as const,
        features: [
          { name: "Everything in Professional", included: true },
          { name: "Unlimited API access", included: true },
          { name: "Custom AI model training", included: true },
          { name: "White-label solution", included: true },
          { name: "Dedicated account manager", included: true },
          { name: "Custom integrations", included: true },
          { name: "SLA guarantee", included: true },
          { name: "On-premise deployment", included: true },
          { name: "24/7 phone support", included: true }
        ]
      }
    ],
    annual: [
      {
        name: "Starter",
        price: "$0",
        description: "Perfect for individuals and small research projects",
        tier: 'free' as const,
        features: [
          { name: "5 research projects per month", included: true },
          { name: "Basic web scraping", included: true },
          { name: "Standard AI models", included: true },
          { name: "PDF export", included: true },
          { name: "Community support", included: true },
          { name: "Advanced AI models", included: false },
          { name: "Priority processing", included: false },
          { name: "API access", included: false },
          { name: "Custom integrations", included: false }
        ]
      },
      {
        name: "Professional",
        price: "$290",
        description: "For professionals and growing research teams (2 months free!)",
        tier: 'pro' as const,
        popular: true,
        features: [
          { name: "Unlimited research projects", included: true },
          { name: "Advanced web scraping", included: true },
          { name: "Premium AI models (GPT-5, Gemini Pro)", included: true },
          { name: "Priority processing", included: true },
          { name: "Advanced analytics", included: true },
          { name: "API access", included: true, limit: "10,000 requests/month" },
          { name: "Email support", included: true },
          { name: "Collaboration tools", included: true },
          { name: "Custom branding", included: false }
        ]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with advanced needs",
        tier: 'enterprise' as const,
        features: [
          { name: "Everything in Professional", included: true },
          { name: "Unlimited API access", included: true },
          { name: "Custom AI model training", included: true },
          { name: "White-label solution", included: true },
          { name: "Dedicated account manager", included: true },
          { name: "Custom integrations", included: true },
          { name: "SLA guarantee", included: true },
          { name: "On-premise deployment", included: true },
          { name: "24/7 phone support", included: true }
        ]
      }
    ]
  };

  const handlePlanSelect = (plan: string) => {
    toast({
      title: "Plan Selection",
      description: `You selected the ${plan} plan. Contact our sales team to proceed.`,
    });
    onPlanSelect(plan);
  };

  const addOns = [
    {
      name: "Additional API Calls",
      description: "Extra API requests beyond your plan limit",
      price: "$0.001 per request"
    },
    {
      name: "Premium Data Sources",
      description: "Access to exclusive academic and industry databases",
      price: "$99/month"
    },
    {
      name: "Custom AI Training",
      description: "Train AI models on your specific domain data",
      price: "$499/month"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-premium/10 rounded-full text-sm">
          <Star className="h-4 w-4 text-premium" />
          <span>Transparent, flexible pricing</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold">
          Choose Your Research
          <span className="bg-gradient-premium bg-clip-text text-transparent"> Superpower</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free, scale as you grow. No hidden fees, no surprises. 
          Cancel anytime with full data export.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative"
          >
            <div className={`w-12 h-6 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-premium' : 'bg-muted'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${billingCycle === 'annual' ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
          </Button>
          <span className={`text-sm ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
          </span>
          {billingCycle === 'annual' && (
            <Badge className="bg-gradient-premium text-white border-0 ml-2">
              Save 17%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingPlans[billingCycle].map((plan, index) => (
          <PricingTier
            key={index}
            name={plan.name}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            popular={plan.popular}
            tier={plan.tier}
            onSelect={() => handlePlanSelect(plan.name)}
          />
        ))}
      </div>

      {/* Add-ons */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Powerful Add-ons</h2>
          <p className="text-muted-foreground">Enhance your research capabilities with optional add-ons</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addOns.map((addon, index) => (
            <Card key={index} className="hover:shadow-card transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{addon.name}</CardTitle>
                <CardDescription>{addon.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold text-primary">{addon.price}</div>
                <Button variant="outline" className="w-full">
                  Add to Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <Card className="bg-gradient-enterprise text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-enterprise/90 to-premium/90" />
        <CardHeader className="relative z-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mx-auto">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl">Ready for Enterprise?</CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Get a custom solution tailored to your organization's needs
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              <span>Custom pricing</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              <span>Dedicated support</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              <span>White-label options</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg">
              <Users className="h-5 w-5 mr-2" />
              Contact Sales
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              <Rocket className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}