import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface ProfileData {
  full_name: string;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  dietary_preference: string | null;
  health_goal: string | null;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carbs_goal: number;
  daily_fat_goal: number;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    age: null,
    gender: null,
    height: null,
    weight: null,
    dietary_preference: null,
    health_goal: null,
    daily_calorie_goal: 2000,
    daily_protein_goal: 50,
    daily_carbs_goal: 250,
    daily_fat_goal: 70,
  });
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
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          dietary_preference: data.dietary_preference,
          health_goal: data.health_goal,
          daily_calorie_goal: data.daily_calorie_goal,
          daily_protein_goal: data.daily_protein_goal,
          daily_carbs_goal: data.daily_carbs_goal,
          daily_fat_goal: data.daily_fat_goal,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error loading profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Profile updated successfully!',
        description: 'Your changes have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
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
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Update your personal information and health goals
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profile.age || ''}
                        onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || null })}
                        placeholder="25"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={profile.gender || ''}
                        onValueChange={(value) => setProfile({ ...profile, gender: value })}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={profile.height || ''}
                        onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || null })}
                        placeholder="170"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={profile.weight || ''}
                        onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || null })}
                        placeholder="70"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietary_preference">Dietary Preference</Label>
                      <Select
                        value={profile.dietary_preference || ''}
                        onValueChange={(value) => setProfile({ ...profile, dietary_preference: value })}
                      >
                        <SelectTrigger id="dietary_preference">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Health Goals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Health Goals</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="health_goal">Primary Goal</Label>
                    <Select
                      value={profile.health_goal || ''}
                      onValueChange={(value) => setProfile({ ...profile, health_goal: value })}
                    >
                      <SelectTrigger id="health_goal">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                        <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                        <SelectItem value="maintain_health">Maintain Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Daily Targets */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Daily Nutrition Targets</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="daily_calorie_goal">Calories (kcal)</Label>
                      <Input
                        id="daily_calorie_goal"
                        type="number"
                        value={profile.daily_calorie_goal}
                        onChange={(e) => setProfile({ ...profile, daily_calorie_goal: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="daily_protein_goal">Protein (g)</Label>
                      <Input
                        id="daily_protein_goal"
                        type="number"
                        value={profile.daily_protein_goal}
                        onChange={(e) => setProfile({ ...profile, daily_protein_goal: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="daily_carbs_goal">Carbs (g)</Label>
                      <Input
                        id="daily_carbs_goal"
                        type="number"
                        value={profile.daily_carbs_goal}
                        onChange={(e) => setProfile({ ...profile, daily_carbs_goal: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="daily_fat_goal">Fat (g)</Label>
                      <Input
                        id="daily_fat_goal"
                        type="number"
                        value={profile.daily_fat_goal}
                        onChange={(e) => setProfile({ ...profile, daily_fat_goal: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
