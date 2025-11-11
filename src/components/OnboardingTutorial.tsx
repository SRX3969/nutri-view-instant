import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to Nutri-View Instant 🎉',
    description: "Let's take a quick tour to show you how it works. This will only take a minute!",
    highlight: null,
  },
  {
    title: 'Add or Scan Your Food 📸',
    description: 'Click "Add Food" to log your meals manually or upload a photo for instant AI analysis.',
    highlight: 'food-log',
  },
  {
    title: 'See Instant Nutrition Insights 📊',
    description: 'Your dashboard shows real-time calories, macros, and progress towards your daily goals.',
    highlight: 'dashboard',
  },
  {
    title: 'Track Your Progress & Goals 📈',
    description: 'Visit the Reports page to see weekly trends, charts, and export your nutrition data.',
    highlight: 'reports',
  },
  {
    title: 'Update Your Profile & Preferences ⚙️',
    description: 'Customize your health goals, dietary preferences, and daily targets in your Profile.',
    highlight: 'profile',
  },
];

export default function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center gap-2 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {currentStep === 0 && '👋'}
              {currentStep === 1 && '📸'}
              {currentStep === 2 && '📊'}
              {currentStep === 3 && '📈'}
              {currentStep === 4 && '⚙️'}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>

          <Button onClick={handleNext}>
            {isLastStep ? "Let's Begin!" : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
