import logo from "@/assets/nutrilens-logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { History, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 animate-fade-in cursor-pointer"
        >
          <img 
            src={logo} 
            alt="NutriLens Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            NutriLens
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {location.pathname !== "/history" && (
            <Button
              onClick={() => navigate("/history")}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <History className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline">History</span>
            </Button>
          )}
          
          {user ? (
            <>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              size="sm"
              className="gap-2 gradient-nature text-white"
            >
              <LogIn className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline">Login</span>
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
