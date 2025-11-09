import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sparkles, RefreshCw, Save, Leaf, Zap, Heart, Apple } from "lucide-react";
import { MacroPieChart } from "./MacroPieChart";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { toast } from "sonner";
import { useState } from "react";

const insightIcons = {
  protein: Zap,
  energy: Sparkles,
  health: Heart,
  natural: Leaf,
  default: Apple,
};

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  foodType: string;
  tips: string[];
}

interface ResultsSectionProps {
  data: NutritionData;
  imageUrl: string;
  onAnalyzeAnother: () => void;
}

export function ResultsSection({ data, imageUrl, onAnalyzeAnother }: ResultsSectionProps) {
  const { saveAnalysis } = useAnalysisHistory();
  const [isSaved, setIsSaved] = useState(false);

  const macroData = [
    { name: "Protein", value: data.protein, max: 100 },
    { name: "Carbs", value: data.carbs, max: 150 },
    { name: "Fat", value: data.fat, max: 70 },
  ];

  const handleSave = () => {
    saveAnalysis({
      ...data,
      imageUrl,
    });
    setIsSaved(true);
    toast.success("Analysis saved to history!");
  };

  const getInsightIcon = (tip: string) => {
    const tipLower = tip.toLowerCase();
    if (tipLower.includes("protein")) return insightIcons.protein;
    if (tipLower.includes("energy")) return insightIcons.energy;
    if (tipLower.includes("vitamin") || tipLower.includes("health")) return insightIcons.health;
    if (tipLower.includes("natural") || tipLower.includes("fresh")) return insightIcons.natural;
    return insightIcons.default;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Image Preview */}
      <Card className="overflow-hidden glass border-primary/20 animate-scale-in hover-lift">
        <img
          src={imageUrl}
          alt="Analyzed meal"
          className="w-full h-64 md:h-80 object-cover"
        />
      </Card>

      {/* Calories Card */}
      <Card className="glass border-primary/20 p-8 text-center animate-scale-in hover-lift" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-7 w-7 text-primary animate-pulse" />
          <h3 className="text-2xl font-semibold text-foreground">Total Calories</h3>
        </div>
        <div className="text-7xl font-bold gradient-nature bg-clip-text text-transparent mb-3 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          {data.calories}
        </div>
        <p className="text-muted-foreground text-lg">kcal</p>
        <div className="mt-6 space-y-2">
          <p className="text-base text-muted-foreground">Serving Size: {data.servingSize}</p>
          <p className="text-base text-primary font-semibold">{data.foodType}</p>
        </div>
      </Card>

      {/* Pie Chart */}
      <Card className="glass border-primary/20 p-8 animate-scale-in hover-lift" style={{ animationDelay: "0.2s" }}>
        <h4 className="font-bold text-foreground mb-6 text-center text-2xl flex items-center justify-center gap-2">
          <Apple className="h-6 w-6 text-accent" />
          Macronutrient Distribution
        </h4>
        <MacroPieChart protein={data.protein} carbs={data.carbs} fat={data.fat} />
      </Card>

      {/* Macros Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {macroData.map((macro, index) => (
          <Card 
            key={macro.name} 
            className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover-lift"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-foreground text-lg">{macro.name}</h4>
              <span className="text-3xl font-bold text-foreground">{macro.value}g</span>
            </div>
            <Progress 
              value={(macro.value / macro.max) * 100} 
              className="h-3 transition-all duration-1000 ease-out"
            />
            <p className="text-xs text-muted-foreground">
              {((macro.value / macro.max) * 100).toFixed(0)}% of daily value
            </p>
          </Card>
        ))}
      </div>

      {/* Tips */}
      {data.tips.length > 0 && (
        <Card className="glass border-primary/20 p-8 animate-scale-in hover-lift" style={{ animationDelay: "0.6s" }}>
          <h4 className="font-bold text-foreground mb-6 flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Nutrition Insights
          </h4>
          <ul className="space-y-4">
            {data.tips.map((tip, index) => {
              const Icon = getInsightIcon(tip);
              return (
                <li 
                  key={index} 
                  className="text-base text-foreground flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-smooth"
                >
                  <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {!isSaved && (
          <Button
            onClick={handleSave}
            size="lg"
            className="gradient-nature hover:opacity-90 hover:scale-105 transition-smooth text-white font-bold px-10 py-7 text-lg rounded-xl animate-scale-in shadow-lg"
            style={{ animationDelay: "0.7s" }}
          >
            <Save className="mr-2 h-6 w-6" />
            Save to History
          </Button>
        )}
        <Button
          onClick={onAnalyzeAnother}
          size="lg"
          className="gradient-gold hover:opacity-90 hover:scale-105 transition-smooth text-white font-bold px-10 py-7 text-lg rounded-xl animate-scale-in shadow-lg pulse-glow"
          style={{ animationDelay: "0.8s" }}
        >
          <RefreshCw className="mr-2 h-6 w-6" />
          Analyze Another Meal
        </Button>
      </div>
    </div>
  );
}
