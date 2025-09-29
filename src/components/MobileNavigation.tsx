import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Zap, FolderOpen, Crown } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "research", label: "Research", icon: Zap },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "pricing", label: "Pricing", icon: Crown },
  ];

  const handleNavigation = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col space-y-4 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-stage-3 bg-clip-text text-transparent">
                Universal Researcher AI
              </h2>
            </div>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="justify-start gap-3"
                  onClick={() => handleNavigation(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            
            <Button 
              onClick={() => handleNavigation("pricing")}
              className="bg-gradient-premium text-white border-0 hover:shadow-glow mt-6"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}