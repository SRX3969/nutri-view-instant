import { Navbar } from "@/components/Navbar";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowLeft, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

const DetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysis, deleteAnalysis } = useAnalysisHistory();
  const navigate = useNavigate();
  const analysis = id ? getAnalysis(id) : null;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Analysis not found
          </h1>
          <Button onClick={() => navigate("/history")}>Back to History</Button>
        </main>
      </div>
    );
  }

  const macroData = [
    { name: "Protein", value: analysis.protein, color: "hsl(var(--primary))" },
    { name: "Carbs", value: analysis.carbs, color: "hsl(var(--accent))" },
    { name: "Fat", value: analysis.fat, color: "hsl(var(--gold))" },
  ];

  const handleDelete = () => {
    deleteAnalysis(analysis.id);
    toast.success("Analysis deleted");
    navigate("/history");
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <Button
            onClick={() => navigate("/history")}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Image */}
          <Card className="overflow-hidden glass border-primary/20 animate-scale-in">
            <img
              src={analysis.imageUrl}
              alt={analysis.foodType}
              className="w-full h-80 object-cover"
            />
          </Card>

          {/* Date */}
          <div className="text-center text-sm text-muted-foreground">
            Analyzed on {formatDate(analysis.timestamp)}
          </div>

          {/* Calories Card */}
          <Card className="glass border-primary/20 p-8 text-center animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Total Calories</h3>
            </div>
            <div className="text-6xl font-bold gradient-nature bg-clip-text text-transparent mb-2">
              {analysis.calories}
            </div>
            <p className="text-muted-foreground">kcal</p>
            <div className="mt-4 space-y-1">
              <p className="text-sm text-muted-foreground">Serving Size: {analysis.servingSize}</p>
              <p className="text-sm text-primary font-medium">{analysis.foodType}</p>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card className="glass border-primary/20 p-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-semibold text-foreground mb-6 text-center text-xl">
              Macronutrient Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
                  value={(macro.value / (macro.name === "Protein" ? 100 : macro.name === "Carbs" ? 150 : 70)) * 100} 
                  className="h-3"
                />
              </Card>
            ))}
          </div>

          {/* Tips */}
          {analysis.tips.length > 0 && (
            <Card className="glass border-primary/20 p-6 animate-scale-in" style={{ animationDelay: "0.6s" }}>
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Nutrition Insights
              </h4>
              <ul className="space-y-2">
                {analysis.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DetailView;
