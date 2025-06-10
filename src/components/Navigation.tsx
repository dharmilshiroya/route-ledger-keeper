
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Truck, 
  Users, 
  Car, 
  CreditCard, 
  BarChart3, 
  Menu,
  X,
  LogOut,
  Home
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Vehicles", href: "/vehicles", icon: Truck },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Trips", href: "/trips", icon: Car },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-card/95 backdrop-blur-sm shadow-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-modern p-3 rounded-xl shadow-lg hover-glow">
                <Truck className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  TransportPro
                </span>
                <div className="text-xs text-muted-foreground font-medium tracking-wide">
                  Transport Management System
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-all duration-200 group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="tracking-wide">{item.name}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Link>
              );
            })}
            
            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-border/50">
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground tracking-wide">
                  {user?.email?.split('@')[0]}
                </div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border/50 bg-card/95 backdrop-blur-sm animate-fade-in">
            <div className="space-y-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="pt-6 mt-6 border-t border-border/50">
                <div className="px-4 py-3 text-sm">
                  <div className="font-semibold text-foreground tracking-wide">
                    {user?.email}
                  </div>
                  <div className="text-xs text-muted-foreground">Administrator</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-3 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
