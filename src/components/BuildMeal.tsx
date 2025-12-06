import { useState } from "react";
import { Plus, Trash2, Loader2, Utensils, AlertTriangle, Star, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface MealItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealResult {
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  nutritionScore: string;
  warnings?: string[];
  recommendations?: string[];
  mealReview: string;
  vitamins?: {
    vitaminA?: number;
    vitaminC?: number;
    iron?: number;
    calcium?: number;
  };
}

const quickAddItems = [
  "1 Roti", "1 Katori Dal", "1 Katori Rice", "1 Katori Sabji",
  "1 Paratha", "2 Idli", "1 Dosa", "1 Bowl Curd", "1 Katori Salad",
  "1 Samosa", "1 Ladoo", "1 Cup Chai", "1 Chapati", "1 Katori Rajma"
];

export function BuildMeal() {
  const [items, setItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<MealResult | null>(null);

  const addItem = (item?: string) => {
    const itemToAdd = item || currentItem.trim();
    if (!itemToAdd) return;
    setItems([...items, itemToAdd]);
    setCurrentItem("");
    setResult(null);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setResult(null);
  };

  const calculateMeal = async () => {
    if (items.length === 0) {
      toast.error("Please add at least one item to your meal");
      return;
    }

    setIsCalculating(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-nutrition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "build", mealItems: items })
      });

      if (!response.ok) {
        throw new Error("Failed to calculate");
      }

      const data = await response.json();
      setResult(data);
      toast.success("Meal calculated successfully!");
    } catch (error) {
      toast.error("Failed to calculate meal. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreColor = (score: string) => {
    if (score.startsWith("A")) return "bg-green-500";
    if (score.startsWith("B")) return "bg-yellow-500";
    if (score.startsWith("C")) return "bg-orange-500";
    return "bg-red-500";
  };

  const clearAll = () => {
    setItems([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Add Item Input */}
      <div className="flex gap-3">
        <Input
          value={currentItem}
          onChange={(e) => setCurrentItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add item... (e.g., 2 Rotis, 1 Katori Dal)"
          className="h-14 text-lg rounded-xl border-2 border-primary/20 focus:border-primary"
        />
        <Button
          onClick={() => addItem()}
          className="h-14 px-6 rounded-xl gradient-nature text-white font-bold"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Add */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {quickAddItems.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 transition-colors py-2 px-3"
              onClick={() => addItem(item)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {/* Added Items */}
      {items.length > 0 && (
        <Card className="glass border-primary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              Your Meal ({items.length} items)
            </h4>
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3"
              >
                <span className="text-foreground">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={calculateMeal}
            disabled={isCalculating}
            className="w-full h-12 rounded-xl gradient-gold text-white font-bold"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate Total Nutrition"
            )}
          </Button>
        </Card>
      )}

      {/* Results */}
      {result && !isCalculating && (
        <Card className="glass border-primary/20 p-6 space-y-6 animate-fade-in">
          {/* Header with Score */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">Meal Analysis</h3>
            <div className={`${getScoreColor(result.nutritionScore)} text-white font-bold px-4 py-2 rounded-lg text-xl`}>
              {result.nutritionScore}
            </div>
          </div>

          {/* Total Nutrition */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{result.totalCalories}</p>
              <p className="text-sm text-muted-foreground">Total Calories</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{result.totalProtein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{result.totalCarbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{result.totalFat}g</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
          </div>

          {/* Individual Items */}
          <div className="space-y-2">
            <p className="font-medium text-foreground">Item Breakdown:</p>
            <div className="space-y-2">
              {result.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.portion}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{item.calories} kcal</p>
                    <p className="text-xs text-muted-foreground">
                      P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Review */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
            <p className="font-medium text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Meal Review
            </p>
            <p className="text-muted-foreground">{result.mealReview}</p>
          </div>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Health Alerts
              </p>
              <div className="space-y-2">
                {result.warnings.map((warning, i) => (
                  <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-700 dark:text-amber-300">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Recommendations
              </p>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <span className="text-primary font-bold">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
