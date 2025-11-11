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
      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const imageBase64 = await base64Promise;
      console.log("Sending image to AI for analysis...");

      // Call the edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-nutrition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageBase64
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }
      const nutritionData: NutritionData = await response.json();
      console.log("Analysis complete:", nutritionData);
      setResults(nutritionData);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze image. Please try again.");
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
    uploadSection?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {!results ? <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
              {/* Animated gradient background */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
              </div>
              
              <div className="space-y-6 animate-fade-in relative">
                {/* Background card for better contrast */}
                <div className="absolute inset-0 -z-10 bg-card/60 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-2xl" />
                
                <div className="px-8 md:px-16 py-12">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-foreground">
                    Track your nutrition instantly.
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                    AI-powered food insights and personalized recommendations — anytime, anywhere.
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={scrollToUpload} size="lg" className="text-lg">
                      Get Started
                    </Button>
                    <Button onClick={scrollToUpload} size="lg" variant="outline" className="text-lg">
                      Try Demo
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={scrollToUpload} size="lg" className="gradient-gold hover:opacity-90 transition-smooth text-white font-bold px-10 py-7 text-xl rounded-2xl shadow-2xl mt-6 pulse-glow animate-scale-in hover:scale-105" style={{
            animationDelay: "0.3s"
          }}>
                Analyze My Meal
                <ArrowDown className="ml-3 h-6 w-6 animate-bounce" />
              </Button>
            </div>

            {/* Upload Zone */}
            <div id="upload-section" className="scroll-mt-32">
              {isAnalyzing ? <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
                  <div className="relative">
                    <Loader2 className="h-20 w-20 animate-spin text-primary" />
                    <div className="absolute inset-0 h-20 w-20 animate-ping text-primary/20">
                      <Loader2 className="h-full w-full" />
                    </div>
                  </div>
                  <p className="text-xl text-muted-foreground animate-pulse font-medium">
                    Analyzing your meal...
                  </p>
                </div> : <UploadZone onImageSelect={analyzeImage} isAnalyzing={isAnalyzing} />}
            </div>
          </div> : <ResultsSection data={results} imageUrl={imageUrl} onAnalyzeAnother={handleAnalyzeAnother} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 mt-16 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NutriLens AI – Powered by Vision & Science
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;