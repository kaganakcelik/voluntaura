import { useState, useRef } from 'react';
import { Opportunity, causeColors, causeIcons } from '@/lib/mockData';
import { useVolunteerStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Heart, Bookmark, MapPin, Clock, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SwipeCardProps {
  opportunity: Opportunity;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSave: () => void;
  isTop: boolean;
  style?: React.CSSProperties;
}

export function SwipeCard({
  opportunity,
  onSwipeLeft,
  onSwipeRight,
  onSave,
  isTop,
  style,
}: SwipeCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTop) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart || !isTop) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleDragEnd = () => {
    if (!isTop) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (dragOffset.x > threshold) {
      onSwipeRight();
    } else if (dragOffset.x < -threshold) {
      onSwipeLeft();
    }
    
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.05;
  const opacity = Math.max(0, 1 - Math.abs(dragOffset.x) / 300);

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          'swipe-card bg-card border cursor-grab active:cursor-grabbing',
          isTop && 'z-10'
        )}
        style={{
          ...style,
          transform: isTop
            ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.3}px) rotate(${rotation}deg)`
            : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Swipe indicators */}
        {isTop && Math.abs(dragOffset.x) > 30 && (
          <>
            <div
              className="absolute top-8 left-8 z-20 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-bold text-lg rotate-[-15deg] border-4 border-destructive"
              style={{ opacity: dragOffset.x < 0 ? Math.min(1, Math.abs(dragOffset.x) / 100) : 0 }}
            >
              PASS
            </div>
            <div
              className="absolute top-8 right-8 z-20 px-4 py-2 rounded-lg gradient-hero text-primary-foreground font-bold text-lg rotate-[15deg] border-4 border-primary"
              style={{ opacity: dragOffset.x > 0 ? Math.min(1, dragOffset.x / 100) : 0 }}
            >
              MATCH!
            </div>
          </>
        )}

        {/* Image */}
        <div className="h-[45%] relative overflow-hidden">
          <img
            src={opportunity.imageUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800';
            }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* View details button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/90 backdrop-blur-sm text-foreground hover:bg-card transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">{opportunity.title}</h3>
            <p className="text-muted-foreground">{opportunity.organization}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {opportunity.causes.slice(0, 3).map((cause) => (
              <span key={cause} className={cn('cause-badge', causeColors[cause])}>
                <span>{causeIcons[cause]}</span>
                {cause}
              </span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {opportunity.shortDescription}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {opportunity.distance > 0 ? `${opportunity.distance} mi` : 'Remote'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {opportunity.duration}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isTop && (
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-center gap-4 bg-gradient-to-t from-card via-card to-transparent">
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onSwipeLeft();
              }}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-12 h-12 rounded-full border-2 border-warning text-warning hover:bg-warning hover:text-warning-foreground transition-all hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
            >
              <Bookmark className="w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              className="w-14 h-14 rounded-full gradient-hero text-primary-foreground shadow-glow hover:shadow-elevated transition-all hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onSwipeRight();
              }}
            >
              <Heart className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{opportunity.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={opportunity.imageUrl}
              alt={opportunity.title}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800';
              }}
            />
            <div>
              <p className="font-medium">{opportunity.organization}</p>
              <p className="text-sm text-muted-foreground">{opportunity.location}</p>
            </div>
            <p className="text-sm text-muted-foreground">{opportunity.description}</p>
            <div>
              <h4 className="font-medium mb-2">Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {opportunity.requirements.map((req, i) => (
                  <li key={i}>• {req}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
