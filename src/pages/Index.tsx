import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadZone } from "@/components/UploadZone";
import { ResultsSection } from "@/components/ResultsSection";
import { FloatingElements } from "@/components/FloatingElements";
import { Loader2, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  foodType: string;
  tips: string[];
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<NutritionData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    setShowHero(true);
  }, []);

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      // Simulate API call - in production, this would call /api/analyze
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response data
      const mockData: NutritionData = {
        calories: 450,
        protein: 32,
        carbs: 45,
        fat: 18,
        servingSize: "1 plate (250g)",
        foodType: "Grilled Chicken with Vegetables",
        tips: [
          "High in Protein - Great for muscle recovery",
          "Balanced macronutrients for sustained energy",
          "Rich in vitamins from fresh vegetables",
          "Low in processed ingredients",
        ],
      };

      setResults(mockData);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setResults(null);
    setImageUrl("");
  };

  const scrollToUpload = () => {
    const uploadSection = document.getElementById("upload-section");
    uploadSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {!results ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
              {/* Animated gradient background */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/10 to-background" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 animate-pulse" style={{ animationDuration: "4s" }} />
              </div>
              
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-shadow-strong">
                  <span className="gradient-nature bg-clip-text text-transparent">
                    See what you eat — naturally
                  </span>
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-foreground max-w-3xl mx-auto text-shadow-soft font-medium opacity-90">
                  Upload your meal photo. Let AI break down your nutrition in seconds.
                </p>
              </div>

              <Button
                onClick={scrollToUpload}
                size="lg"
                className="gradient-gold hover:opacity-90 transition-smooth text-white font-bold px-10 py-7 text-xl rounded-2xl shadow-2xl mt-6 pulse-glow animate-scale-in hover:scale-105"
                style={{ animationDelay: "0.3s" }}
              >
                Analyze My Meal
                <ArrowDown className="ml-3 h-6 w-6 animate-bounce" />
              </Button>
            </div>

            {/* Upload Zone */}
            <div id="upload-section" className="scroll-mt-32">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
                  <div className="relative">
                    <Loader2 className="h-20 w-20 animate-spin text-primary" />
                    <div className="absolute inset-0 h-20 w-20 animate-ping text-primary/20">
                      <Loader2 className="h-full w-full" />
                    </div>
                  </div>
                  <p className="text-xl text-muted-foreground animate-pulse font-medium">
                    Analyzing your meal...
                  </p>
                </div>
              ) : (
                <UploadZone onImageSelect={analyzeImage} isAnalyzing={isAnalyzing} />
              )}
            </div>
          </div>
        ) : (
          <ResultsSection
            data={results}
            imageUrl={imageUrl}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 mt-16 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NutriLens AI – Powered by Vision & Science
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
