import { useState } from 'react';
import { useVolunteerStore } from '@/lib/store';
import { Cause, LocationType } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const causes: Cause[] = ['Environment', 'Education', 'Animals', 'Health', 'Food', 'Community'];

const causeEmojis: Record<Cause, string> = {
  Environment: '🌿',
  Education: '📚',
  Animals: '🐾',
  Health: '❤️',
  Food: '🍎',
  Community: '🏘️',
};

interface QuestionnaireWizardProps {
  onComplete: () => void;
  onClose?: () => void;
}

export function QuestionnaireWizard({ onComplete, onClose }: QuestionnaireWizardProps) {
  const { questionnaireAnswers, setQuestionnaireAnswers, setQuestionnaireCompleted } = useVolunteerStore();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setQuestionnaireCompleted(true);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return questionnaireAnswers.experienceLevel !== null;
      case 2:
        return questionnaireAnswers.preferredCauses.length > 0;
      case 3:
        return questionnaireAnswers.availabilityDays.length > 0;
      case 4:
        return questionnaireAnswers.locationPreference !== null;
      case 5:
        return true; // Comfort preferences are optional
      default:
        return false;
    }
  };

  const toggleCause = (cause: Cause) => {
    const current = questionnaireAnswers.preferredCauses;
    const newCauses = current.includes(cause)
      ? current.filter((c) => c !== cause)
      : [...current, cause];
    setQuestionnaireAnswers({ preferredCauses: newCauses });
  };

  const toggleDay = (day: string) => {
    const current = questionnaireAnswers.availabilityDays;
    const newDays = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setQuestionnaireAnswers({ availabilityDays: newDays });
  };

  const toggleComfort = (comfort: string) => {
    const current = questionnaireAnswers.comfortPreferences;
    const newComforts = current.includes(comfort)
      ? current.filter((c) => c !== comfort)
      : [...current, comfort];
    setQuestionnaireAnswers({ comfortPreferences: newComforts });
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Let's find your perfect match</h2>
              <p className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </p>
            </div>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-1.5" />
        </div>

        {/* Content */}
        <div className="p-6 min-h-[280px]">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium">What's your volunteer experience level?</h3>
              <div className="grid gap-3">
                {[
                  { value: 'none', label: 'New to volunteering', desc: "I'm just getting started" },
                  { value: 'some', label: 'Some experience', desc: "I've volunteered a few times" },
                  { value: 'lots', label: 'Experienced volunteer', desc: 'I volunteer regularly' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setQuestionnaireAnswers({
                        experienceLevel: option.value as 'none' | 'some' | 'lots',
                      })
                    }
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      questionnaireAnswers.experienceLevel === option.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium">What causes are you passionate about?</h3>
              <p className="text-sm text-muted-foreground">Select all that interest you</p>
              <div className="flex flex-wrap gap-2">
                {causes.map((cause) => (
                  <button
                    key={cause}
                    onClick={() => toggleCause(cause)}
                    className={cn(
                      'filter-chip text-base py-2 px-4',
                      questionnaireAnswers.preferredCauses.includes(cause)
                        ? 'filter-chip-active'
                        : 'filter-chip-inactive'
                    )}
                  >
                    <span>{causeEmojis[cause]}</span>
                    {cause}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium mb-3">When are you available?</h3>
                <div className="flex flex-wrap gap-2">
                  {['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekends'].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        'filter-chip',
                        questionnaireAnswers.availabilityDays.includes(day)
                          ? 'filter-chip-active'
                          : 'filter-chip-inactive'
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Hours per week</Label>
                  <span className="text-sm font-semibold text-primary">
                    {questionnaireAnswers.hoursPerWeek} hours
                  </span>
                </div>
                <Slider
                  value={[questionnaireAnswers.hoursPerWeek]}
                  onValueChange={([value]) => setQuestionnaireAnswers({ hoursPerWeek: value })}
                  max={20}
                  min={1}
                  step={1}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium mb-3">Where would you like to volunteer?</h3>
                <div className="grid gap-3">
                  {[
                    { value: 'In-person', label: 'In-person', desc: 'At physical locations' },
                    { value: 'Remote', label: 'Remote', desc: 'From home, online' },
                    { value: 'either', label: 'Either works', desc: "I'm flexible" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setQuestionnaireAnswers({
                          locationPreference: option.value as LocationType | 'either',
                        })
                      }
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        questionnaireAnswers.locationPreference === option.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      )}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {questionnaireAnswers.locationPreference !== 'Remote' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Maximum distance</Label>
                    <span className="text-sm font-semibold text-primary">
                      {questionnaireAnswers.maxDistance} miles
                    </span>
                  </div>
                  <Slider
                    value={[questionnaireAnswers.maxDistance]}
                    onValueChange={([value]) => setQuestionnaireAnswers({ maxDistance: value })}
                    max={25}
                    min={1}
                    step={1}
                  />
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium">Any comfort preferences?</h3>
              <p className="text-sm text-muted-foreground">Optional - helps us find better matches</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Outdoors activities',
                  'Working with kids',
                  'Physical activity',
                  'Team projects',
                  'Solo work',
                  'Office/admin tasks',
                  'Creative work',
                  'Teaching/mentoring',
                ].map((comfort) => (
                  <button
                    key={comfort}
                    onClick={() => toggleComfort(comfort)}
                    className={cn(
                      'filter-chip',
                      questionnaireAnswers.comfortPreferences.includes(comfort)
                        ? 'filter-chip-active'
                        : 'filter-chip-inactive'
                    )}
                  >
                    {comfort}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-between">
          <Button
            variant="ghost"
            onClick={step === 1 && onClose ? onClose : handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary-glow"
          >
            {step === totalSteps ? (
              <>
                Start Matching
                <Sparkles className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
