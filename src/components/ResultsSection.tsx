import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sparkles, RefreshCw } from "lucide-react";

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
  const macroData = [
    { name: "Protein", value: data.protein, color: "from-blue-500 to-blue-600", max: 100 },
    { name: "Carbs", value: data.carbs, color: "from-orange-500 to-orange-600", max: 150 },
    { name: "Fat", value: data.fat, color: "from-pink-500 to-pink-600", max: 70 },
  ];

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
        <div className="text-6xl font-bold gradient-teal bg-clip-text text-transparent mb-2">
          {data.calories}
        </div>
        <p className="text-muted-foreground">kcal</p>
        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">Serving Size: {data.servingSize}</p>
          <p className="text-sm text-primary font-medium">{data.foodType}</p>
        </div>
      </Card>

      {/* Macros Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {macroData.map((macro, index) => (
          <Card 
            key={macro.name} 
            className="glass border-primary/20 p-6 space-y-4 animate-scale-in hover:scale-105 transition-smooth"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
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
        <Card className="glass border-primary/20 p-6 animate-scale-in" style={{ animationDelay: "0.5s" }}>
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

      {/* Analyze Another Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onAnalyzeAnother}
          size="lg"
          className="gradient-gold hover:opacity-90 transition-smooth text-white font-medium px-8 py-6 text-lg rounded-xl animate-scale-in"
          style={{ animationDelay: "0.6s" }}
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Analyze Another Meal
        </Button>
      </div>
    </div>
  );
}
