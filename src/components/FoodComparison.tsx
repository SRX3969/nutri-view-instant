import { useState } from "react";
import { Scale, Loader2, Trophy, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface FoodData {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  nutritionScore: string;
  pros?: string[];
  cons?: string[];
}

interface ComparisonResult {
  food1: FoodData;
  food2: FoodData;
  winner: string;
  verdict: string;
  recommendations?: string[];
}

const popularComparisons = [
  "Roti vs Rice",
  "Idli vs Dosa",
  "Chole vs Rajma",
  "Chicken Curry vs Paneer Curry",
  "Paratha vs Chapati",
  "Samosa vs Pakoda"
];

export function FoodComparison() {
  const [food1, setFood1] = useState("");
  const [food2, setFood2] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleCompare = async (comparison?: string) => {
    let query = "";
    if (comparison) {
      query = comparison;
      const [f1, f2] = comparison.split(" vs ");
      setFood1(f1);
      setFood2(f2);
    } else {
      if (!food1.trim() || !food2.trim()) {
        toast.error("Please enter both foods to compare");
        return;
      }
      query = `${food1} vs ${food2}`;
    }

    setIsComparing(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-nutrition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "compare", query })
      });

      if (!response.ok) {
        throw new Error("Failed to compare");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast.error("Failed to compare foods. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

  const getScoreColor = (score: string) => {
    if (score.startsWith("A")) return "text-green-500";
    if (score.startsWith("B")) return "text-yellow-500";
    if (score.startsWith("C")) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score: string) => {
    if (score.startsWith("A")) return "bg-green-500";
    if (score.startsWith("B")) return "bg-yellow-500";
    if (score.startsWith("C")) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <Input
          value={food1}
          onChange={(e) => setFood1(e.target.value)}
          placeholder="First food (e.g., Roti)"
          className="h-14 text-lg rounded-xl border-2 border-primary/20 focus:border-primary"
        />
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
          <Scale className="h-5 w-5 text-primary" />
        </div>
        <Input
          value={food2}
          onChange={(e) => setFood2(e.target.value)}
          placeholder="Second food (e.g., Rice)"
          className="h-14 text-lg rounded-xl border-2 border-primary/20 focus:border-primary"
        />
        <Button
          onClick={() => handleCompare()}
          disabled={isComparing}
          className="h-14 px-8 rounded-xl gradient-nature text-white font-bold whitespace-nowrap"
        >
          {isComparing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Compare"}
        </Button>
      </div>

      {/* Popular Comparisons */}
      {!result && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Popular comparisons:</p>
          <div className="flex flex-wrap gap-2">
            {popularComparisons.map((comp) => (
              <Button
                key={comp}
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => handleCompare(comp)}
              >
                {comp}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isComparing && (
        <div className="flex flex-col items-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Comparing nutritional values...</p>
        </div>
      )}

      {/* Results */}
      {result && !isComparing && (
        <div className="space-y-6 animate-fade-in">
          {/* Winner Banner */}
          <Card className="glass border-primary/20 p-6 text-center bg-gradient-to-r from-primary/10 to-accent/10">
            <Trophy className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Winner: {result.winner}
            </h3>
            <p className="text-muted-foreground">{result.verdict}</p>
          </Card>

          {/* Side by Side Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Food 1 */}
            <Card className={`glass p-6 space-y-4 ${result.winner === result.food1.name ? "border-2 border-primary" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-foreground">{result.food1.name}</h4>
                  <p className="text-sm text-muted-foreground">{result.food1.portion}</p>
                </div>
                <div className={`${getScoreBg(result.food1.nutritionScore)} text-white font-bold px-3 py-1 rounded-lg`}>
                  {result.food1.nutritionScore}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{result.food1.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{result.food1.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{result.food1.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{result.food1.fat}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>

              {result.food1.pros && result.food1.pros.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" /> Pros
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.food1.pros.map((pro, i) => (
                      <li key={i}>• {pro}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.food1.cons && result.food1.cons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4" /> Cons
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.food1.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Food 2 */}
            <Card className={`glass p-6 space-y-4 ${result.winner === result.food2.name ? "border-2 border-primary" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-foreground">{result.food2.name}</h4>
                  <p className="text-sm text-muted-foreground">{result.food2.portion}</p>
                </div>
                <div className={`${getScoreBg(result.food2.nutritionScore)} text-white font-bold px-3 py-1 rounded-lg`}>
                  {result.food2.nutritionScore}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{result.food2.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{result.food2.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{result.food2.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{result.food2.fat}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>

              {result.food2.pros && result.food2.pros.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" /> Pros
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.food2.pros.map((pro, i) => (
                      <li key={i}>• {pro}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.food2.cons && result.food2.cons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4" /> Cons
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.food2.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="glass border-primary/20 p-6 space-y-3">
              <p className="font-medium text-foreground">Recommendations:</p>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Compare Another */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setResult(null);
              setFood1("");
              setFood2("");
            }}
          >
            Compare Different Foods
          </Button>
        </div>
      )}
    </div>
  );
}
