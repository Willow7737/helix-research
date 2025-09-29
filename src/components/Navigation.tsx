import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Settings, User, Home, FolderOpen, Brain, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileNavigation } from "./MobileNavigation";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-responsive">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-stage-3 bg-clip-text text-transparent hidden sm:block">
                Universal Researcher AI
              </h1>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-stage-3 bg-clip-text text-transparent sm:hidden">
                URA
              </h1>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("dashboard")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "research" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("research")}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Research
              </Button>
              <Button
                variant={activeTab === "projects" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("projects")}
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Projects
              </Button>
              <Button
                variant={activeTab === "pricing" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("pricing")}
                className="flex items-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Pricing
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <MobileNavigation activeTab={activeTab} onTabChange={onTabChange} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTabChange("pricing")}
              className="bg-gradient-premium text-white border-0 hover:shadow-glow hover:bg-gradient-premium/90 hidden sm:flex"
            >
              <Crown className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Upgrade</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="Avatar" />
                    <AvatarFallback className="bg-gradient-primary text-white font-medium">
                      {user?.email ? getInitials(user.email) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onTabChange("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;