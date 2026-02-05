import { Opportunity, causeColors, causeIcons } from '@/lib/mockData';
import { useVolunteerStore } from '@/lib/store';
import { Bookmark, MapPin, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick?: () => void;
  compact?: boolean;
}

export function OpportunityCard({ opportunity, onClick, compact = false }: OpportunityCardProps) {
  const { savedOpportunities, saveOpportunity, unsaveOpportunity } = useVolunteerStore();
  const isSaved = savedOpportunities.includes(opportunity.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      unsaveOpportunity(opportunity.id);
    } else {
      saveOpportunity(opportunity.id);
    }
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="card-interactive p-3 flex items-center gap-3 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={opportunity.imageUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{opportunity.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{opportunity.organization}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {opportunity.distance > 0 ? `${opportunity.distance} mi` : 'Remote'}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="card-interactive p-4 space-y-3 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {opportunity.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {opportunity.organization}
          </p>
        </div>
        
        <button
          onClick={handleSave}
          className={cn(
            'p-2 rounded-full transition-all hover:scale-110',
            isSaved
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          )}
        >
          <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {opportunity.causes.map((cause) => (
          <span key={cause} className={cn('cause-badge', causeColors[cause])}>
            <span>{causeIcons[cause]}</span>
            {cause}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {opportunity.shortDescription}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {opportunity.distance > 0 ? `${opportunity.distance} mi` : 'Remote'}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {opportunity.duration}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {opportunity.timeCommitment}
        </div>
      </div>
    </div>
  );
}
