import { useState, useMemo } from 'react';
import { mockOpportunities, Opportunity, causeColors, causeIcons } from '@/lib/mockData';
import { useVolunteerStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OpportunityDrawer } from '@/components/OpportunityDrawer';
import {
  Bookmark,
  Heart,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  Calendar,
  Eye,
  Trash2,
  Target,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type TabValue = 'saved' | 'matched' | 'applied' | 'completed';

interface ListItemProps {
  opportunity: Opportunity;
  status: TabValue;
  onView: () => void;
  onRemove: () => void;
  onAction?: () => void;
}

function ListItem({ opportunity, status, onView, onRemove, onAction }: ListItemProps) {
  const statusConfig = {
    saved: { label: 'Saved', color: 'bg-warning/10 text-warning', icon: Bookmark },
    matched: { label: 'Matched', color: 'bg-primary/10 text-primary', icon: Heart },
    applied: { label: 'Applied', color: 'bg-success/10 text-success', icon: Send },
    completed: { label: 'Completed', color: 'bg-muted text-muted-foreground', icon: CheckCircle2 },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="card-elevated p-4 group">
      <div className="flex items-start gap-4">
        {/* Image */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={opportunity.imageUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold truncate">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground">{opportunity.organization}</p>
            </div>
            <Badge variant="secondary" className={cn('flex-shrink-0', config.color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {opportunity.causes.slice(0, 2).map((cause) => (
              <span key={cause} className={cn('cause-badge text-xs', causeColors[cause])}>
                <span className="text-xs">{causeIcons[cause]}</span>
                {cause}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {opportunity.distance > 0 ? `${opportunity.distance} mi` : 'Remote'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {opportunity.duration}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {opportunity.timeCommitment}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t">
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        
        {status === 'saved' && (
          <Button variant="outline" size="sm" onClick={onAction}>
            <Send className="w-4 h-4 mr-1" />
            Apply
          </Button>
        )}
        
        {status === 'matched' && (
          <Button variant="outline" size="sm" onClick={onAction}>
            <Send className="w-4 h-4 mr-1" />
            Apply
          </Button>
        )}
        
        {status === 'applied' && (
          <Button variant="outline" size="sm" onClick={onAction}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Mark Complete
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function MyVolunteeringPage() {
  const {
    savedOpportunities,
    matchedOpportunities,
    appliedOpportunities,
    completedOpportunities,
    unsaveOpportunity,
    unmatchOpportunity,
    applyToOpportunity,
    markCompleted,
    scheduledHours,
    goalHours,
    setGoalHours,
  } = useVolunteerStore();

  const [activeTab, setActiveTab] = useState<TabValue>('saved');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState(goalHours);

  const getOpportunities = (ids: string[]) =>
    mockOpportunities.filter((o) => ids.includes(o.id));

  const tabData: Record<TabValue, { opportunities: Opportunity[]; emptyIcon: React.ReactNode; emptyText: string }> = {
    saved: {
      opportunities: getOpportunities(savedOpportunities),
      emptyIcon: <Bookmark className="w-12 h-12 text-muted-foreground/30" />,
      emptyText: 'No saved opportunities yet. Save ones you like to review later!',
    },
    matched: {
      opportunities: getOpportunities(matchedOpportunities),
      emptyIcon: <Heart className="w-12 h-12 text-muted-foreground/30" />,
      emptyText: 'No matches yet. Try the swipe feature to find your perfect volunteer match!',
    },
    applied: {
      opportunities: getOpportunities(appliedOpportunities),
      emptyIcon: <Send className="w-12 h-12 text-muted-foreground/30" />,
      emptyText: "No applications yet. Apply to opportunities you're interested in!",
    },
    completed: {
      opportunities: getOpportunities(completedOpportunities),
      emptyIcon: <CheckCircle2 className="w-12 h-12 text-muted-foreground/30" />,
      emptyText: 'No completed volunteering yet. Your contributions will appear here!',
    },
  };

  const handleView = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDrawerOpen(true);
  };

  const handleRemove = (opportunity: Opportunity, tab: TabValue) => {
    switch (tab) {
      case 'saved':
        unsaveOpportunity(opportunity.id);
        toast({ title: 'Removed from saved' });
        break;
      case 'matched':
        unmatchOpportunity(opportunity.id);
        toast({ title: 'Removed from matches' });
        break;
      default:
        toast({ title: 'Removed' });
    }
  };

  const handleAction = (opportunity: Opportunity, tab: TabValue) => {
    switch (tab) {
      case 'saved':
      case 'matched':
        applyToOpportunity(opportunity.id);
        toast({
          title: 'Application submitted! 🎉',
          description: `Your interest in ${opportunity.title} has been recorded.`,
        });
        break;
      case 'applied':
        markCompleted(opportunity.id);
        toast({
          title: 'Marked as completed! 🌟',
          description: 'Great work making a difference!',
        });
        break;
    }
  };

  const progressPercentage = Math.min((scheduledHours / goalHours) * 100, 100);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">My Volunteering</h1>
        <p className="text-muted-foreground">Track your volunteer journey</p>
      </div>

      {/* Progress Widget */}
      <div className="card-elevated p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">This Month's Progress</h2>
              <p className="text-sm text-muted-foreground">
                {scheduledHours} of {goalHours} hours scheduled
              </p>
            </div>
          </div>
          
          <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-1" />
                Set Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Monthly Goal</DialogTitle>
              </DialogHeader>
              <div className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Hours per month</span>
                  <span className="text-2xl font-bold text-primary">{tempGoal}</span>
                </div>
                <Slider
                  value={[tempGoal]}
                  onValueChange={([value]) => setTempGoal(value)}
                  max={50}
                  min={1}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1 hour</span>
                  <span>50 hours</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setGoalHours(tempGoal);
                    setGoalDialogOpen(false);
                    toast({ title: 'Goal updated!' });
                  }}
                >
                  Save Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="text-muted-foreground">
            {Math.round(progressPercentage)}% complete
          </span>
          {progressPercentage >= 100 ? (
            <span className="text-success font-medium">🎉 Goal reached!</span>
          ) : (
            <span className="text-muted-foreground">
              {goalHours - scheduledHours} hours to go
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="saved" className="gap-1">
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {savedOpportunities.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="matched" className="gap-1">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Matched</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {matchedOpportunities.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="applied" className="gap-1">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Applied</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {appliedOpportunities.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Done</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {completedOpportunities.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {(['saved', 'matched', 'applied', 'completed'] as TabValue[]).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {tabData[tab].opportunities.length === 0 ? (
              <div className="text-center py-12">
                {tabData[tab].emptyIcon}
                <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
                  {tabData[tab].emptyText}
                </p>
              </div>
            ) : (
              tabData[tab].opportunities.map((opp) => (
                <ListItem
                  key={opp.id}
                  opportunity={opp}
                  status={tab}
                  onView={() => handleView(opp)}
                  onRemove={() => handleRemove(opp, tab)}
                  onAction={() => handleAction(opp, tab)}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Opportunity Drawer */}
      <OpportunityDrawer
        opportunity={selectedOpportunity}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
