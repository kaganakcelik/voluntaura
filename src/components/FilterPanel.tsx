import { useState } from 'react';
import { useVolunteerStore } from '@/lib/store';
import { Cause, TimeCommitment, Availability, LocationType } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const causes: Cause[] = ['Environment', 'Education', 'Animals', 'Health', 'Food', 'Community'];
const timeCommitments: TimeCommitment[] = ['One-time', 'Weekly', 'Monthly', 'Flexible'];
const availabilities: Availability[] = ['Weekdays', 'Weekends', 'Evenings'];

const causeEmojis: Record<Cause, string> = {
  Environment: '🌿',
  Education: '📚',
  Animals: '🐾',
  Health: '❤️',
  Food: '🍎',
  Community: '🏘️',
};

interface FilterPanelProps {
  className?: string;
  isMobile?: boolean;
}

export function FilterPanel({ className, isMobile = false }: FilterPanelProps) {
  const { filters, setFilters, clearFilters } = useVolunteerStore();
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.causes.length > 0 ||
    filters.timeCommitment.length > 0 ||
    filters.availability.length > 0 ||
    filters.locationType !== 'all' ||
    filters.maxDistance < 25;

  const toggleCause = (cause: Cause) => {
    const newCauses = filters.causes.includes(cause)
      ? filters.causes.filter((c) => c !== cause)
      : [...filters.causes, cause];
    setFilters({ causes: newCauses });
  };

  const toggleTimeCommitment = (tc: TimeCommitment) => {
    const newTC = filters.timeCommitment.includes(tc)
      ? filters.timeCommitment.filter((t) => t !== tc)
      : [...filters.timeCommitment, tc];
    setFilters({ timeCommitment: newTC });
  };

  const toggleAvailability = (av: Availability) => {
    const newAv = filters.availability.includes(av)
      ? filters.availability.filter((a) => a !== av)
      : [...filters.availability, av];
    setFilters({ availability: newAv });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search causes, organizations..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Causes */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Causes</Label>
        <div className="flex flex-wrap gap-2">
          {causes.map((cause) => (
            <button
              key={cause}
              onClick={() => toggleCause(cause)}
              className={cn(
                'filter-chip',
                filters.causes.includes(cause)
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

      {/* Distance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Distance</Label>
          <span className="text-sm text-muted-foreground">
            {filters.maxDistance} miles
          </span>
        </div>
        <Slider
          value={[filters.maxDistance]}
          onValueChange={([value]) => setFilters({ maxDistance: value })}
          max={25}
          min={1}
          step={1}
          className="py-2"
        />
      </div>

      {/* Time Commitment */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Time Commitment</Label>
        <div className="flex flex-wrap gap-2">
          {timeCommitments.map((tc) => (
            <button
              key={tc}
              onClick={() => toggleTimeCommitment(tc)}
              className={cn(
                'filter-chip',
                filters.timeCommitment.includes(tc)
                  ? 'filter-chip-active'
                  : 'filter-chip-inactive'
              )}
            >
              {tc}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Availability</Label>
        <div className="flex flex-wrap gap-2">
          {availabilities.map((av) => (
            <button
              key={av}
              onClick={() => toggleAvailability(av)}
              className={cn(
                'filter-chip',
                filters.availability.includes(av)
                  ? 'filter-chip-active'
                  : 'filter-chip-inactive'
              )}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Location Type */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Location</Label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilters({ locationType: 'all' })}
            className={cn(
              'filter-chip',
              filters.locationType === 'all'
                ? 'filter-chip-active'
                : 'filter-chip-inactive'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilters({ locationType: 'In-person' })}
            className={cn(
              'filter-chip',
              filters.locationType === 'In-person'
                ? 'filter-chip-active'
                : 'filter-chip-inactive'
            )}
          >
            In-person
          </button>
          <button
            onClick={() => setFilters({ locationType: 'Remote' })}
            className={cn(
              'filter-chip',
              filters.locationType === 'Remote'
                ? 'filter-chip-active'
                : 'filter-chip-inactive'
            )}
          >
            Remote
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-2" />
          Clear all filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('relative', hasActiveFilters && 'border-primary')}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {filters.causes.length +
                  filters.timeCommitment.length +
                  filters.availability.length +
                  (filters.locationType !== 'all' ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto pb-safe">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={cn('p-4 space-y-6', className)}>
      <FilterContent />
    </div>
  );
}
