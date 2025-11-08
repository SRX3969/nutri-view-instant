import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadZone } from "@/components/UploadZone";
import { ResultsSection } from "@/components/ResultsSection";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        {!results ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="gradient-teal bg-clip-text text-transparent">
                  See what you eat
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Instantly analyze your meals with AI-powered nutrition insights
              </p>
            </div>

            {/* Upload Zone */}
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
