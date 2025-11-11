import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft, Download, TrendingUp, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { MacroPieChart } from '@/components/MacroPieChart';

interface WeeklySummary {
  totalCalories: number;
  avgCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealsLogged: number;
}

export default function Reports() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadWeeklySummary();
    }
  }, [user]);

  const loadWeeklySummary = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('logged_at', sevenDaysAgo.toISOString());

      if (error) throw error;

      const summary = data.reduce(
        (acc, log) => ({
          totalCalories: acc.totalCalories + log.calories,
          totalProtein: acc.totalProtein + (log.protein || 0),
          totalCarbs: acc.totalCarbs + (log.carbs || 0),
          totalFat: acc.totalFat + (log.fat || 0),
          mealsLogged: acc.mealsLogged + 1,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, mealsLogged: 0 }
      );

      setWeeklySummary({
        ...summary,
        avgCalories: summary.mealsLogged > 0 ? Math.round(summary.totalCalories / 7) : 0,
      });
    } catch (error: any) {
      toast({
        title: 'Error loading reports',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: 'Export feature coming soon!',
      description: 'You\'ll be able to export your data as CSV/PDF soon.',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const macroData = weeklySummary
    ? [
        { name: 'Protein', value: weeklySummary.totalProtein, color: '#7BC47F' },
        { name: 'Carbs', value: weeklySummary.totalCarbs, color: '#60A5FA' },
        { name: 'Fat', value: weeklySummary.totalFat, color: '#FBBF24' },
      ]
    : [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-primary/5">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Insights</h1>
            <p className="text-muted-foreground">Track your progress and nutrition trends</p>
          </div>

          {weeklySummary && weeklySummary.mealsLogged > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Last 7 Days Summary
                  </CardTitle>
                  <CardDescription>Your nutrition overview for the past week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Calories</p>
                      <p className="text-2xl font-bold">{weeklySummary.totalCalories.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Daily Average</p>
                      <p className="text-2xl font-bold">{weeklySummary.avgCalories.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Protein</p>
                      <p className="text-2xl font-bold">{weeklySummary.totalProtein.toFixed(0)}g</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Meals Logged</p>
                      <p className="text-2xl font-bold">{weeklySummary.mealsLogged}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Macro Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Macro Distribution
                  </CardTitle>
                  <CardDescription>Your macronutrient breakdown for the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <MacroPieChart data={macroData} />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="font-semibold">{weeklySummary.totalProtein.toFixed(0)}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{weeklySummary.totalCarbs.toFixed(0)}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="font-semibold">{weeklySummary.totalFat.toFixed(0)}g</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No nutrition data to display yet. Start logging your meals to see reports and insights!
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Start Tracking
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Privacy Notice */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                🔒 <strong>Your data is private and secure.</strong> We never share your nutrition information without your consent.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
