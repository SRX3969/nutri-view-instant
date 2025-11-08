import { Navbar } from "@/components/Navbar";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";

const History = () => {
  const { history } = useAnalysisHistory();
  const navigate = useNavigate();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8 flex items-center gap-4">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-nature bg-clip-text text-transparent">
              Analysis History
            </h1>
            <p className="text-muted-foreground">
              View your past meal analyses
            </p>
          </div>

          {history.length === 0 ? (
            <Card className="glass border-primary/20 p-12 text-center animate-fade-in">
              <p className="text-muted-foreground text-lg">
                No analyses yet. Start by uploading your first meal!
              </p>
              <Button
                onClick={() => navigate("/")}
                className="gradient-gold hover:opacity-90 transition-smooth text-white mt-6"
              >
                Analyze Your First Meal
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item, index) => (
                <Card
                  key={item.id}
                  onClick={() => navigate(`/detail/${item.id}`)}
                  className="glass border-primary/20 overflow-hidden cursor-pointer hover:scale-105 transition-smooth animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.foodType}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground text-lg">
                      {item.foodType}
                    </h3>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Calories:</span>
                        <span className="ml-1 font-medium text-foreground">
                          {item.calories}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Protein:</span>
                        <span className="ml-1 font-medium text-foreground">
                          {item.protein}g
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
