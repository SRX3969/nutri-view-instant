import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadZone } from "@/components/UploadZone";
import { ResultsSection } from "@/components/ResultsSection";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        {!results ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              {/* Background overlay for readability */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/80 to-background" />
              
              <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
                <span className="gradient-nature bg-clip-text text-transparent" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                  See what you eat — naturally
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto drop-shadow-md font-medium">
                Upload your meal photo. Let AI break down your nutrition in seconds.
              </p>
              <Button
                onClick={scrollToUpload}
                size="lg"
                className="gradient-gold hover:opacity-90 transition-smooth text-white font-medium px-8 py-6 text-lg rounded-xl shadow-lg mt-4"
              >
                Analyze My Meal
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
              </Button>
            </div>

            {/* Upload Zone */}
            <div id="upload-section" className="scroll-mt-32">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-lg text-muted-foreground animate-pulse">
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
      <footer className="border-t border-border/50 py-8 mt-16">
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
