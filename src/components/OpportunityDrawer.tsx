import { Opportunity, causeColors, causeIcons } from '@/lib/mockData';
import { useVolunteerStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OpportunityCard } from './OpportunityCard';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Mail,
  Phone,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockOpportunities } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface OpportunityDrawerProps {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpportunityDrawer({ opportunity, open, onOpenChange }: OpportunityDrawerProps) {
  const {
    savedOpportunities,
    saveOpportunity,
    unsaveOpportunity,
    appliedOpportunities,
    applyToOpportunity,
  } = useVolunteerStore();

  if (!opportunity) return null;

  const isSaved = savedOpportunities.includes(opportunity.id);
  const isApplied = appliedOpportunities.includes(opportunity.id);

  const handleSave = () => {
    if (isSaved) {
      unsaveOpportunity(opportunity.id);
      toast({
        title: 'Removed from saved',
        description: `${opportunity.title} has been removed from your saved list.`,
      });
    } else {
      saveOpportunity(opportunity.id);
      toast({
        title: 'Saved!',
        description: `${opportunity.title} has been saved to your list.`,
      });
    }
  };

  const handleApply = () => {
    if (!isApplied) {
      applyToOpportunity(opportunity.id);
      toast({
        title: 'Application submitted! 🎉',
        description: `Your interest in ${opportunity.title} has been recorded.`,
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: opportunity.title,
        text: opportunity.shortDescription,
        url: window.location.href,
      });
    } catch {
      toast({
        title: 'Link copied!',
        description: 'Share link has been copied to clipboard.',
      });
    }
  };

  // Get similar opportunities (same causes, excluding current)
  const similarOpportunities = mockOpportunities
    .filter(
      (o) =>
        o.id !== opportunity.id &&
        o.causes.some((c) => opportunity.causes.includes(c))
    )
    .slice(0, 3);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 -mx-2">
            <img
              src={opportunity.imageUrl}
              alt={opportunity.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800';
              }}
            />
          </div>
          
          <SheetTitle className="text-2xl">{opportunity.title}</SheetTitle>
          <p className="text-muted-foreground">{opportunity.organization}</p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {opportunity.location}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Cause badges */}
          <div className="flex flex-wrap gap-2">
            {opportunity.causes.map((cause) => (
              <span key={cause} className={cn('cause-badge', causeColors[cause])}>
                <span>{causeIcons[cause]}</span>
                {cause}
              </span>
            ))}
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                Schedule
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {opportunity.schedule}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-primary" />
                Duration
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {opportunity.duration}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4 text-primary" />
                Spots Available
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {opportunity.spotsAvailable} of {opportunity.totalSpots}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                Distance
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {opportunity.distance > 0 ? `${opportunity.distance} miles` : 'Remote'}
              </p>
            </div>
          </div>

          <Separator />

          {/* About */}
          <div>
            <h3 className="font-semibold mb-2">About This Opportunity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold mb-2">Requirements</h3>
            <ul className="space-y-2">
              {opportunity.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${opportunity.contactEmail}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                {opportunity.contactEmail}
              </a>
              <a
                href={`tel:${opportunity.contactPhone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {opportunity.contactPhone}
              </a>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleApply}
              className="flex-1 btn-primary-glow"
              disabled={isApplied}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Applied
                </>
              ) : (
                'Apply Now'
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              className={cn(isSaved && 'text-primary border-primary')}
            >
              <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Similar opportunities */}
          {similarOpportunities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Similar Opportunities</h3>
              <div className="space-y-2">
                {similarOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    compact
                    onClick={() => {
                      onOpenChange(false);
                      setTimeout(() => {
                        // Could navigate to this opportunity
                      }, 300);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
