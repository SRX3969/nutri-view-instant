import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sparkles, RefreshCw, Save } from "lucide-react";
import { MacroPieChart } from "./MacroPieChart";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { toast } from "sonner";
import { useState } from "react";

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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Image Preview */}
      <Card className="overflow-hidden glass border-primary/20 animate-scale-in">
        <img
          src={imageUrl}
          alt="Analyzed meal"
          className="w-full h-64 object-cover"
        />
      </Card>

      {/* Calories Card */}
      <Card className="glass border-primary/20 p-8 text-center animate-scale-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Total Calories</h3>
        </div>
        <div className="text-6xl font-bold gradient-nature bg-clip-text text-transparent mb-2">
          {data.calories}
        </div>
        <p className="text-muted-foreground">kcal</p>
        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">Serving Size: {data.servingSize}</p>
          <p className="text-sm text-primary font-medium">{data.foodType}</p>
        </div>
      </Card>

      {/* Pie Chart */}
      <Card className="glass border-primary/20 p-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
        <h4 className="font-semibold text-foreground mb-6 text-center text-xl">
          Macronutrient Distribution
        </h4>
        <MacroPieChart protein={data.protein} carbs={data.carbs} fat={data.fat} />
      </Card>

      {/* Macros Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {macroData.map((macro, index) => (
            <Card 
              key={macro.name} 
              className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover:scale-105 transition-smooth"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-foreground">{macro.name}</h4>
              <span className="text-2xl font-bold text-foreground">{macro.value}g</span>
            </div>
            <Progress 
              value={(macro.value / macro.max) * 100} 
              className="h-3"
            />
          </Card>
        ))}
      </div>

      {/* Tips */}
      {data.tips.length > 0 && (
        <Card className="glass border-primary/20 p-6 animate-scale-in" style={{ animationDelay: "0.6s" }}>
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Nutrition Insights
          </h4>
          <ul className="space-y-2">
            {data.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{tip}</span>
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
            className="gradient-nature hover:opacity-90 transition-smooth text-white font-medium px-8 py-6 text-lg rounded-xl animate-scale-in"
            style={{ animationDelay: "0.7s" }}
          >
            <Save className="mr-2 h-5 w-5" />
            Save to History
          </Button>
        )}
        <Button
          onClick={onAnalyzeAnother}
          size="lg"
          className="gradient-gold hover:opacity-90 transition-smooth text-white font-medium px-8 py-6 text-lg rounded-xl animate-scale-in"
          style={{ animationDelay: "0.8s" }}
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Analyze Another Meal
        </Button>
      </div>
    </div>
  );
}
