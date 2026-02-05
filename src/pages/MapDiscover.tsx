import { useState, useMemo } from 'react';
import { mockOpportunities, Opportunity } from '@/lib/mockData';
import { useVolunteerStore } from '@/lib/store';
import { FilterPanel } from '@/components/FilterPanel';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityDrawer } from '@/components/OpportunityDrawer';
import { MapPin, List, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Map placeholder pins for demonstration
function MapPlaceholder({
  opportunities,
  onPinClick,
}: {
  opportunities: Opportunity[];
  onPinClick: (opportunity: Opportunity) => void;
}) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-teal-50 to-sage-100 rounded-xl overflow-hidden">
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative roads */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 0 300 Q 200 280 400 320 T 800 300"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="3"
            opacity="0.2"
          />
          <path
            d="M 400 0 Q 420 150 380 300 T 420 600"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="3"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Map pins */}
      {opportunities.slice(0, 8).map((opp, index) => {
        // Distribute pins across the map area
        const positions = [
          { top: '20%', left: '25%' },
          { top: '35%', left: '60%' },
          { top: '55%', left: '30%' },
          { top: '45%', left: '75%' },
          { top: '70%', left: '50%' },
          { top: '25%', left: '80%' },
          { top: '60%', left: '15%' },
          { top: '80%', left: '70%' },
        ];
        const pos = positions[index] || positions[0];

        return (
          <button
            key={opp.id}
            onClick={() => onPinClick(opp)}
            className="absolute transform -translate-x-1/2 -translate-y-full group"
            style={{ top: pos.top, left: pos.left }}
          >
            {/* Pin shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-foreground/20 rounded-full blur-sm" />
            
            {/* Pin */}
            <div className="relative animate-bounce-subtle" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="map-pin group-hover:scale-125 group-hover:shadow-glow transition-all">
                <MapPin className="w-4 h-4" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-card px-3 py-2 rounded-lg shadow-elevated whitespace-nowrap text-sm font-medium">
                  {opp.title}
                  <div className="text-xs text-muted-foreground">{opp.organization}</div>
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-soft text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>{opportunities.length} opportunities nearby</span>
        </div>
      </div>

      {/* Zoom controls (decorative) */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-card rounded-lg shadow-soft flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-card rounded-lg shadow-soft flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          −
        </button>
      </div>
    </div>
  );
}

export default function MapDiscoverPage() {
  const { filters } = useVolunteerStore();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter((opp) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          opp.title.toLowerCase().includes(query) ||
          opp.organization.toLowerCase().includes(query) ||
          opp.causes.some((c) => c.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Causes
      if (filters.causes.length > 0) {
        if (!opp.causes.some((c) => filters.causes.includes(c))) return false;
      }

      // Distance
      if (opp.distance > filters.maxDistance && opp.locationType !== 'Remote') {
        return false;
      }

      // Time commitment
      if (filters.timeCommitment.length > 0) {
        if (!filters.timeCommitment.includes(opp.timeCommitment)) return false;
      }

      // Availability
      if (filters.availability.length > 0) {
        if (!opp.availability.some((a) => filters.availability.includes(a))) return false;
      }

      // Location type
      if (filters.locationType !== 'all') {
        if (opp.locationType !== filters.locationType) return false;
      }

      return true;
    });
  }, [filters]);

  const handlePinClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDrawerOpen(true);
  };

  const handleCardClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      {/* Filter Panel - Desktop */}
      <aside className="hidden md:block w-80 lg:w-96 border-r overflow-y-auto bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Discover Opportunities</h2>
          <p className="text-sm text-muted-foreground">
            {filteredOpportunities.length} opportunities found
          </p>
        </div>
        <FilterPanel />
        
        {/* Results list */}
        <div className="border-t">
          <div className="p-4 space-y-3">
            {filteredOpportunities.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No opportunities found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={() => handleCardClick(opp)}
                />
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-card border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Discover</h1>
            <p className="text-sm text-muted-foreground">
              {filteredOpportunities.length} opportunities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FilterPanel isMobile />
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'map'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground'
                )}
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24 md:pb-4 overflow-hidden">
        {/* Desktop: Always show map */}
        <div className="hidden md:block h-full">
          <MapPlaceholder
            opportunities={filteredOpportunities}
            onPinClick={handlePinClick}
          />
        </div>

        {/* Mobile: Toggle between map and list */}
        <div className="md:hidden h-full overflow-y-auto">
          {viewMode === 'map' ? (
            <div className="h-[50vh]">
              <MapPlaceholder
                opportunities={filteredOpportunities}
                onPinClick={handlePinClick}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">No opportunities found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                filteredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onClick={() => handleCardClick(opp)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Opportunity Drawer */}
      <OpportunityDrawer
        opportunity={selectedOpportunity}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
