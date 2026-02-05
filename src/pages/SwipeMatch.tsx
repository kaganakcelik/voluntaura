import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOpportunities, Opportunity } from '@/lib/mockData';
import { useVolunteerStore } from '@/lib/store';
import { QuestionnaireWizard } from '@/components/QuestionnaireWizard';
import { SwipeCard } from '@/components/SwipeCard';
import { MatchCelebration } from '@/components/MatchCelebration';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, RefreshCw, Heart, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SwipeMatchPage() {
  const navigate = useNavigate();
  const {
    questionnaireCompleted,
    questionnaireAnswers,
    matchedOpportunities,
    savedOpportunities,
    matchOpportunity,
    saveOpportunity,
    setQuestionnaireCompleted,
  } = useVolunteerStore();

  const [showWizard, setShowWizard] = useState(!questionnaireCompleted);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedOpp, setMatchedOpp] = useState<Opportunity | null>(null);
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());
  const [showMatches, setShowMatches] = useState(false);

  const handleWizardClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Filter opportunities based on questionnaire answers
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter((opp) => {
      // Don't show already swiped
      if (swipedIds.has(opp.id)) return false;

      // Filter by preferred causes if any selected
      if (questionnaireAnswers.preferredCauses.length > 0) {
        if (!opp.causes.some((c) => questionnaireAnswers.preferredCauses.includes(c))) {
          return false;
        }
      }

      // Filter by location preference
      if (questionnaireAnswers.locationPreference === 'Remote' && opp.locationType !== 'Remote') {
        return false;
      }
      if (questionnaireAnswers.locationPreference === 'In-person' && opp.locationType !== 'In-person') {
        return false;
      }

      // Filter by distance
      if (opp.distance > questionnaireAnswers.maxDistance && opp.locationType !== 'Remote') {
        return false;
      }

      return true;
    });
  }, [questionnaireAnswers, swipedIds]);

  const currentOpportunities = filteredOpportunities.slice(currentIndex, currentIndex + 3);

  const matchedOpps = useMemo(() => {
    return mockOpportunities.filter((o) => matchedOpportunities.includes(o.id));
  }, [matchedOpportunities]);

  const handleSwipeLeft = useCallback(() => {
    const opp = currentOpportunities[0];
    if (opp) {
      setSwipedIds((prev) => new Set(prev).add(opp.id));
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentOpportunities]);

  const handleSwipeRight = useCallback(() => {
    const opp = currentOpportunities[0];
    if (opp) {
      matchOpportunity(opp.id);
      setMatchedOpp(opp);
      setShowMatch(true);
      setSwipedIds((prev) => new Set(prev).add(opp.id));
    }
  }, [currentOpportunities, matchOpportunity]);

  const handleSave = useCallback(() => {
    const opp = currentOpportunities[0];
    if (opp) {
      saveOpportunity(opp.id);
      toast({
        title: 'Saved for later! ⭐',
        description: `${opp.title} has been saved to your list.`,
      });
    }
  }, [currentOpportunities, saveOpportunity]);

  const handleMatchClose = () => {
    setShowMatch(false);
    setCurrentIndex((prev) => prev + 1);
    setMatchedOpp(null);
  };

  const resetSwipes = () => {
    setSwipedIds(new Set());
    setCurrentIndex(0);
  };

  const retakeQuiz = () => {
    setShowWizard(true);
  };

  if (showWizard) {
    return <QuestionnaireWizard onComplete={() => setShowWizard(false)} onClose={handleWizardClose} />;
  }

  const noMoreCards = currentOpportunities.length === 0;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      {/* Main swipe area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 pb-24 md:pb-4 relative overflow-hidden">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Find Your Match
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredOpportunities.length - currentIndex} opportunities left
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={retakeQuiz}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>

        {/* Card stack */}
        <div className="relative w-full max-w-sm h-[500px] mt-16">
          {noMoreCards ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No more opportunities</h3>
              <p className="text-muted-foreground mb-6">
                You've seen all matching opportunities. Try adjusting your preferences or check back later!
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={resetSwipes}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button onClick={retakeQuiz}>
                  Adjust Preferences
                </Button>
              </div>
            </div>
          ) : (
            currentOpportunities.map((opp, index) => (
              <SwipeCard
                key={opp.id}
                opportunity={opp}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSave={handleSave}
                isTop={index === 0}
                style={{
                  zIndex: currentOpportunities.length - index,
                  transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                }}
              />
            ))
          )}
        </div>

        {/* Mobile matches toggle */}
        <Button
          variant="outline"
          className="lg:hidden absolute bottom-28 right-4"
          onClick={() => setShowMatches(!showMatches)}
        >
          <Heart className="w-4 h-4 mr-2 text-primary fill-primary" />
          Matches ({matchedOpps.length})
          <ChevronRight className={cn('w-4 h-4 ml-2 transition-transform', showMatches && 'rotate-90')} />
        </Button>
      </main>

      {/* Matches panel - Desktop */}
      <aside className="hidden lg:block w-80 border-l bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            Your Matches
          </h2>
          <p className="text-sm text-muted-foreground">
            {matchedOpps.length} opportunities matched
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-73px)]">
          <div className="p-4 space-y-3">
            {matchedOpps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No matches yet</p>
                <p className="text-sm">Swipe right on opportunities you like!</p>
              </div>
            ) : (
              matchedOpps.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} compact />
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Matches panel - Mobile */}
      {showMatches && (
        <div className="lg:hidden fixed inset-x-0 bottom-20 max-h-[60vh] bg-card border-t rounded-t-2xl z-40 animate-slide-up">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                Your Matches
              </h2>
              <p className="text-sm text-muted-foreground">
                {matchedOpps.length} opportunities matched
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowMatches(false)}>
              Close
            </Button>
          </div>
          <ScrollArea className="h-[40vh]">
            <div className="p-4 space-y-3">
              {matchedOpps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No matches yet</p>
                </div>
              ) : (
                matchedOpps.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} compact />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Match celebration */}
      <MatchCelebration
        show={showMatch}
        opportunityTitle={matchedOpp?.title || ''}
        onClose={handleMatchClose}
      />
    </div>
  );
}
