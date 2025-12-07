import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadZone } from "@/components/UploadZone";
import { IndianResultsSection } from "@/components/IndianResultsSection";
import { SearchFood } from "@/components/SearchFood";
import { BuildMeal } from "@/components/BuildMeal";
import { FoodComparison } from "@/components/FoodComparison";
import { FloatingElements } from "@/components/FloatingElements";
import { Loader2, ArrowDown, Camera, Search, Utensils, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  foodType: string;
  detectedItems?: {
    name: string;
    portion: string;
    calories: number;
    ingredients?: string;
  }[];
  nutritionScore?: string;
  warnings?: {
    type: string;
    message: string;
  }[];
  recommendations?: string[];
  tips: string[];
  vitamins?: {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminB12?: number;
    iron?: number;
    calcium?: number;
  };
}
const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<NutritionData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("upload");
  const [showComparison, setShowComparison] = useState(false);
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const imageBase64 = await base64Promise;
      console.log("Sending image to AI for Indian food analysis...");
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
  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section");
    contentSection?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {!results ? <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
              </div>
              
              <div className="space-y-6 animate-fade-in relative">
                <div className="absolute inset-0 -z-10 bg-card/60 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-2xl" />
                
                <div className="px-8 md:px-16 py-12">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground">
                    Indian Food <span className="gradient-nature bg-clip-text text-transparent bg-primary-foreground">Nutrition AI</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                    AI-powered analysis for Indian foods — Thalis, Biryanis, Dosas, Street Foods & more
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={scrollToContent} size="lg" className="text-lg gradient-nature text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={scrollToContent} size="lg" className="gradient-gold hover:opacity-90 transition-smooth text-white font-bold px-10 py-7 text-xl rounded-2xl shadow-2xl mt-6 pulse-glow animate-scale-in hover:scale-105">
                Analyze Indian Food
                <ArrowDown className="ml-3 h-6 w-6 animate-bounce" />
              </Button>
            </div>

            {/* Main Content Section */}
            <div id="content-section" className="scroll-mt-32">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-muted/50 rounded-2xl mb-8">
                  <TabsTrigger value="upload" className="flex flex-col md:flex-row items-center gap-2 py-4 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm md:text-base">Upload/Click</span>
                  </TabsTrigger>
                  <TabsTrigger value="search" className="flex flex-col md:flex-row items-center gap-2 py-4 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg">
                    <Search className="h-5 w-5" />
                    <span className="text-sm md:text-base">Search Food</span>
                  </TabsTrigger>
                  <TabsTrigger value="build" className="flex flex-col md:flex-row items-center gap-2 py-4 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg">
                    <Utensils className="h-5 w-5" />
                    <span className="text-sm md:text-base">Build Meal</span>
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="flex flex-col md:flex-row items-center gap-2 py-4 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg">
                    <Scale className="h-5 w-5" />
                    <span className="text-sm md:text-base">Compare</span>
                  </TabsTrigger>
                </TabsList>

                {/* Upload Tab */}
                <TabsContent value="upload" className="space-y-6">
                  <Card className="glass border-primary/20 p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                      <Camera className="h-7 w-7 text-primary" />
                      Upload or Click Picture
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Take a photo or upload an image of your Indian meal for instant AI analysis
                    </p>
                    
                    {isAnalyzing ? <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
                        <div className="relative">
                          <Loader2 className="h-20 w-20 animate-spin text-primary" />
                          <div className="absolute inset-0 h-20 w-20 animate-ping text-primary/20">
                            <Loader2 className="h-full w-full" />
                          </div>
                        </div>
                        <p className="text-xl text-muted-foreground animate-pulse font-medium">
                          Analyzing your Indian meal...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Detecting items, portions & calculating nutrition
                        </p>
                      </div> : <UploadZone onImageSelect={analyzeImage} isAnalyzing={isAnalyzing} />}
                  </Card>
                </TabsContent>

                {/* Search Tab */}
                <TabsContent value="search" className="space-y-6">
                  <Card className="glass border-primary/20 p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                      <Search className="h-7 w-7 text-primary" />
                      Search Indian Food
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Search any Indian food — regional dishes, street foods, sweets, homemade meals
                    </p>
                    <SearchFood onCompare={() => setActiveTab("compare")} />
                  </Card>
                </TabsContent>

                {/* Build Meal Tab */}
                <TabsContent value="build" className="space-y-6">
                  <Card className="glass border-primary/20 p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                      <Utensils className="h-7 w-7 text-primary" />
                      Build Your Meal
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Add items like "2 Rotis + 1 Katori Dal + 1 Katori Rice" to calculate total nutrition
                    </p>
                    <BuildMeal />
                  </Card>
                </TabsContent>

                {/* Compare Tab */}
                <TabsContent value="compare" className="space-y-6">
                  <Card className="glass border-primary/20 p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                      <Scale className="h-7 w-7 text-primary" />
                      Compare Foods
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Compare two Indian foods side-by-side — Roti vs Rice, Idli vs Dosa, and more
                    </p>
                    <FoodComparison />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6 py-12">
              <Card className="glass border-primary/20 p-6 text-center hover-lift">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Indian Food Detection</h3>
                <p className="text-muted-foreground">
                  Detects Thalis, Biryanis, Dosas, Rotis, Dals, Street Foods, Sweets & more
                </p>
              </Card>
              <Card className="glass border-primary/20 p-6 text-center hover-lift">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Indian Portions</h3>
                <p className="text-muted-foreground">
                  Measures in Katori, Roti, Ladle, Plate — authentic Indian portion sizes
                </p>
              </Card>
              <Card className="glass border-primary/20 p-6 text-center hover-lift">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Health Alerts</h3>
                <p className="text-muted-foreground">
                  Warnings for high oil, ghee, sugar, fried foods with healthier alternatives
                </p>
              </Card>
            </div>
          </div> : <IndianResultsSection data={results} imageUrl={imageUrl} onAnalyzeAnother={handleAnalyzeAnother} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 mt-16 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NutriLens AI – Specialized for Indian Foods
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;