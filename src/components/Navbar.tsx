import logo from "@/assets/nutrilens-logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { History } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
        <div className="flex items-center gap-4">
          {location.pathname !== "/history" && (
            <Button
              onClick={() => navigate("/history")}
              variant="ghost"
              className="gap-2"
            >
              <History className="h-5 w-5" />
              History
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
