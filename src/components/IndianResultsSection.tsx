import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Sparkles, RefreshCw, Save, AlertTriangle, Star, Apple, 
  Flame, Droplets, Wheat, Cookie, Zap, Heart, Leaf, Scale
} from "lucide-react";
import { MacroPieChart } from "./MacroPieChart";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { toast } from "sonner";
import { useState } from "react";

interface DetectedItem {
  name: string;
  portion: string;
  calories: number;
  ingredients?: string;
}

interface Warning {
  type: string;
  message: string;
}

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
  detectedItems?: DetectedItem[];
  nutritionScore?: string;
  warnings?: Warning[];
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

interface ResultsSectionProps {
  data: NutritionData;
  imageUrl: string;
  onAnalyzeAnother: () => void;
}

const warningIcons: Record<string, typeof AlertTriangle> = {
  "high-oil": Droplets,
  "high-sugar": Cookie,
  "deep-fried": Flame,
  "high-sodium": Scale,
  "high-ghee": Droplets,
  "processed": AlertTriangle
};

export function IndianResultsSection({
  data,
  imageUrl,
  onAnalyzeAnother
}: ResultsSectionProps) {
  const { saveAnalysis } = useAnalysisHistory();
  const [isSaved, setIsSaved] = useState(false);

  const macroData = [
    { name: "Protein", value: data.protein, color: "#22C55E" },
    { name: "Carbs", value: data.carbs, color: "#3B82F6" },
    { name: "Fat", value: data.fat, color: "#EAB308" }
  ];

  const handleSave = () => {
    saveAnalysis({ ...data, imageUrl });
    setIsSaved(true);
    toast.success("Analysis saved to history!");
  };

  const getScoreColor = (score?: string) => {
    if (!score) return "bg-gray-500";
    if (score.startsWith("A")) return "bg-green-500";
    if (score.startsWith("B")) return "bg-yellow-500";
    if (score.startsWith("C")) return "bg-orange-500";
    return "bg-red-500";
  };

  const getWarningColor = (type: string) => {
    switch (type) {
      case "high-oil":
      case "high-ghee":
        return "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300";
      case "high-sugar":
        return "bg-pink-500/10 border-pink-500/30 text-pink-700 dark:text-pink-300";
      case "deep-fried":
        return "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300";
      case "high-sodium":
        return "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Image Preview with Score */}
      <Card className="overflow-hidden glass border-primary/20 animate-scale-in hover-lift relative">
        <img src={imageUrl} alt="Analyzed meal" className="w-full h-64 md:h-80 object-cover" />
        {data.nutritionScore && (
          <div className={`absolute top-4 right-4 ${getScoreColor(data.nutritionScore)} text-white font-bold px-4 py-2 rounded-xl text-2xl shadow-lg`}>
            {data.nutritionScore}
          </div>
        )}
      </Card>

      {/* Food Type & Serving */}
      <Card className="glass border-primary/20 p-6 text-center animate-scale-in hover-lift">
        <h3 className="text-2xl font-bold text-foreground mb-2">{data.foodType}</h3>
        <p className="text-muted-foreground">Serving Size: {data.servingSize}</p>
      </Card>

      {/* Detected Items */}
      {data.detectedItems && data.detectedItems.length > 0 && (
        <Card className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover-lift">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            Detected Items
          </h4>
          <div className="space-y-3">
            {data.detectedItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.portion}</p>
                  {item.ingredients && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Ingredients: {item.ingredients}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{item.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Calories Card */}
      <Card className="glass border-primary/20 p-8 text-center animate-scale-in hover-lift">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="h-7 w-7 text-primary animate-pulse" />
          <h3 className="text-2xl font-semibold text-foreground">Total Calories</h3>
        </div>
        <div className="text-7xl font-bold gradient-nature bg-clip-text text-transparent mb-3">
          {data.calories}
        </div>
        <p className="text-muted-foreground text-lg">kcal</p>
      </Card>

      {/* Pie Chart */}
      <Card className="glass border-primary/20 p-8 animate-scale-in hover-lift">
        <h4 className="font-bold text-foreground mb-6 text-center text-2xl flex items-center justify-center gap-2">
          <Apple className="h-6 w-6 text-accent" />
          Macronutrient Distribution
        </h4>
        <MacroPieChart data={macroData} />
      </Card>

      {/* Macros Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-primary/20 p-4 text-center animate-scale-in hover-lift">
          <div className="bg-green-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <Zap className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.protein}g</p>
          <p className="text-sm text-muted-foreground">Protein</p>
        </Card>
        <Card className="glass border-primary/20 p-4 text-center animate-scale-in hover-lift">
          <div className="bg-blue-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <Wheat className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.carbs}g</p>
          <p className="text-sm text-muted-foreground">Carbs</p>
        </Card>
        <Card className="glass border-primary/20 p-4 text-center animate-scale-in hover-lift">
          <div className="bg-yellow-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <Droplets className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.fat}g</p>
          <p className="text-sm text-muted-foreground">Fat</p>
        </Card>
        {data.fiber !== undefined && (
          <Card className="glass border-primary/20 p-4 text-center animate-scale-in hover-lift">
            <div className="bg-emerald-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Leaf className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{data.fiber}g</p>
            <p className="text-sm text-muted-foreground">Fiber</p>
          </Card>
        )}
      </div>

      {/* Vitamins & Minerals */}
      {data.vitamins && Object.keys(data.vitamins).length > 0 && (
        <Card className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover-lift">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Vitamins & Minerals (% Daily Value)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.vitamins.vitaminA !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vitamin A</span>
                  <span className="font-medium text-foreground">{data.vitamins.vitaminA}%</span>
                </div>
                <Progress value={Math.min(data.vitamins.vitaminA, 100)} className="h-2" />
              </div>
            )}
            {data.vitamins.vitaminC !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vitamin C</span>
                  <span className="font-medium text-foreground">{data.vitamins.vitaminC}%</span>
                </div>
                <Progress value={Math.min(data.vitamins.vitaminC, 100)} className="h-2" />
              </div>
            )}
            {data.vitamins.iron !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Iron</span>
                  <span className="font-medium text-foreground">{data.vitamins.iron}%</span>
                </div>
                <Progress value={Math.min(data.vitamins.iron, 100)} className="h-2" />
              </div>
            )}
            {data.vitamins.calcium !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Calcium</span>
                  <span className="font-medium text-foreground">{data.vitamins.calcium}%</span>
                </div>
                <Progress value={Math.min(data.vitamins.calcium, 100)} className="h-2" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <Card className="glass border-red-500/20 p-6 space-y-4 animate-scale-in">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Health Alerts
          </h4>
          <div className="space-y-3">
            {data.warnings.map((warning, index) => {
              const Icon = warningIcons[warning.type] || AlertTriangle;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${getWarningColor(warning.type)}`}
                >
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{warning.message}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover-lift">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Healthier Indian Alternatives
          </h4>
          <ul className="space-y-3">
            {data.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <span className="text-primary font-bold">→</span>
                <span className="text-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Tips */}
      {data.tips && data.tips.length > 0 && (
        <Card className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover-lift">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Nutrition Insights
          </h4>
          <ul className="space-y-3">
            {data.tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {!isSaved && (
          <Button
            onClick={handleSave}
            size="lg"
            className="gradient-nature hover:opacity-90 hover:scale-105 transition-smooth text-white font-bold px-10 py-7 text-lg rounded-xl shadow-lg"
          >
            <Save className="mr-2 h-6 w-6" />
            Save to History
          </Button>
        )}
        <Button
          onClick={onAnalyzeAnother}
          size="lg"
          className="gradient-gold hover:opacity-90 hover:scale-105 transition-smooth text-white font-bold px-10 py-7 text-lg rounded-xl shadow-lg pulse-glow"
        >
          <RefreshCw className="mr-2 h-6 w-6" />
          Analyze Another Meal
        </Button>
      </div>
    </div>
  );
}
