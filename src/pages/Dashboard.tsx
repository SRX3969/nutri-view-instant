import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Apple, Activity, Droplets, Target, TrendingUp, Plus, LogOut, User, BarChart3 } from 'lucide-react';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';

interface Profile {
  full_name: string;
  is_first_login: boolean;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carbs_goal: number;
  daily_fat_goal: number;
}

interface TodaySummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: number;
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todaySummary, setTodaySummary] = useState<TodaySummary>({ calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 });
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTodaySummary();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      if (data.is_first_login) {
        setShowTutorial(true);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodaySummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`);

      if (error) throw error;

      const summary = data.reduce(
        (acc, log) => ({
          calories: acc.calories + log.calories,
          protein: acc.protein + (log.protein || 0),
          carbs: acc.carbs + (log.carbs || 0),
          fat: acc.fat + (log.fat || 0),
          meals: acc.meals + 1,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 }
      );

      setTodaySummary(summary);
    } catch (error: any) {
      console.error('Error loading today summary:', error);
    }
  };

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    if (user) {
      await supabase
        .from('profiles')
        .update({ is_first_login: false })
        .eq('id', user.id);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-primary/5">
        {showTutorial && <OnboardingTutorial onComplete={handleTutorialComplete} />}

        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getGreeting()}, {profile?.full_name || 'there'} 👋
              </h1>
              <p className="text-muted-foreground mt-1">Here's your nutrition summary for today</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/reports')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaySummary.calories}</div>
                <p className="text-xs text-muted-foreground">of {profile?.daily_calorie_goal || 2000} goal</p>
                <Progress 
                  value={(todaySummary.calories / (profile?.daily_calorie_goal || 2000)) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Protein</CardTitle>
                <Apple className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaySummary.protein.toFixed(1)}g</div>
                <p className="text-xs text-muted-foreground">of {profile?.daily_protein_goal || 50}g goal</p>
                <Progress 
                  value={(todaySummary.protein / (profile?.daily_protein_goal || 50)) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbs</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaySummary.carbs.toFixed(1)}g</div>
                <p className="text-xs text-muted-foreground">of {profile?.daily_carbs_goal || 250}g goal</p>
                <Progress 
                  value={(todaySummary.carbs / (profile?.daily_carbs_goal || 250)) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fat</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaySummary.fat.toFixed(1)}g</div>
                <p className="text-xs text-muted-foreground">of {profile?.daily_fat_goal || 70}g goal</p>
                <Progress 
                  value={(todaySummary.fat / (profile?.daily_fat_goal || 70)) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Food Log */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>Track what you eat throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food
                </Button>
                <div className="mt-4 text-center text-muted-foreground">
                  {todaySummary.meals === 0 ? (
                    <p>No meals logged today. Start by adding your first meal!</p>
                  ) : (
                    <p>You've logged {todaySummary.meals} meal{todaySummary.meals !== 1 ? 's' : ''} today</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaySummary.calories === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Start logging your meals to receive personalized AI-powered nutrition insights!
                  </p>
                ) : (
                  <>
                    {todaySummary.protein < (profile?.daily_protein_goal || 50) * 0.5 && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-900 dark:text-amber-100">
                          You're below your protein goal. Consider adding lean meats, eggs, or legumes.
                        </p>
                      </div>
                    )}
                    {todaySummary.calories > (profile?.daily_calorie_goal || 2000) && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          You've exceeded your calorie goal. Great job staying active!
                        </p>
                      </div>
                    )}
                    {todaySummary.meals < 3 && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-900 dark:text-green-100">
                          Don't forget to log all your meals for accurate tracking!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
