import { useState } from "react";
import { Search, Loader2, AlertTriangle, Star, ArrowRight, Scale } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface SearchResult {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  defaultPortion: string;
  portionOptions?: { label: string; multiplier: number }[];
  ingredients?: string;
  cookingMethod?: string;
  region?: string;
  category?: string;
  nutritionScore: string;
  warnings?: string[];
  recommendations?: string[];
  vitamins?: {
    vitaminA?: number;
    vitaminC?: number;
    iron?: number;
    calcium?: number;
  };
  relatedFoods?: string[];
}

interface SearchFoodProps {
  onCompare?: (food: string) => void;
}

const popularSearches = [
  "Idli", "Dosa", "Biryani", "Roti", "Dal", "Paneer Butter Masala",
  "Samosa", "Pav Bhaji", "Chole Bhature", "Poha", "Upma", "Vada Pav"
];

export function SearchFood({ onCompare }: SearchFoodProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [selectedPortion, setSelectedPortion] = useState(1);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) {
      toast.error("Please enter a food to search");
      return;
    }

    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-nutrition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "search", query: q })
      });

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      setResult(data);
      setSelectedPortion(1);
    } catch (error) {
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getScoreColor = (score: string) => {
    if (score.startsWith("A")) return "bg-green-500";
    if (score.startsWith("B")) return "bg-yellow-500";
    if (score.startsWith("C")) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search Indian foods... (e.g., Biryani, Idli, Dal)"
            className="pl-12 h-14 text-lg rounded-xl border-2 border-primary/20 focus:border-primary"
          />
        </div>
        <Button
          onClick={() => handleSearch()}
          disabled={isSearching}
          className="h-14 px-8 rounded-xl gradient-nature text-white font-bold"
        >
          {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
        </Button>
      </div>

      {/* Popular Searches */}
      {!result && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((food) => (
              <Badge
                key={food}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors py-2 px-4"
                onClick={() => {
                  setQuery(food);
                  handleSearch(food);
                }}
              >
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isSearching && (
        <div className="flex flex-col items-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Searching Indian food database...</p>
        </div>
      )}

      {/* Results */}
      {result && !isSearching && (
        <Card className="glass border-primary/20 p-6 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{result.name}</h3>
              <p className="text-muted-foreground">{result.description}</p>
              {result.region && (
                <Badge variant="secondary" className="mt-2">{result.region}</Badge>
              )}
            </div>
            <div className={`${getScoreColor(result.nutritionScore)} text-white font-bold px-4 py-2 rounded-lg text-xl`}>
              {result.nutritionScore}
            </div>
          </div>

          {/* Portion Selector */}
          {result.portionOptions && result.portionOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Select Portion:</p>
              <div className="flex flex-wrap gap-2">
                {result.portionOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedPortion === option.multiplier ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPortion(option.multiplier)}
                    className="rounded-lg"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{Math.round(result.calories * selectedPortion)}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{Math.round(result.protein * selectedPortion)}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{Math.round(result.carbs * selectedPortion)}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{Math.round(result.fat * selectedPortion)}g</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
          </div>

          {/* Ingredients */}
          {result.ingredients && (
            <div className="space-y-2">
              <p className="font-medium text-foreground">Ingredients Breakdown:</p>
              <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">{result.ingredients}</p>
            </div>
          )}

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
                Healthier Alternatives
              </p>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compare Button */}
          {onCompare && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onCompare(result.name)}
            >
              <Scale className="mr-2 h-4 w-4" />
              Compare with another food
            </Button>
          )}

          {/* Related Foods */}
          {result.relatedFoods && result.relatedFoods.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Related foods:</p>
              <div className="flex flex-wrap gap-2">
                {result.relatedFoods.map((food) => (
                  <Badge
                    key={food}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => {
                      setQuery(food);
                      handleSearch(food);
                    }}
                  >
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
