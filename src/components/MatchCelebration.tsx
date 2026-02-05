import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface MatchCelebrationProps {
  show: boolean;
  opportunityTitle: string;
  onClose: () => void;
}

export function MatchCelebration({ show, opportunityTitle, onClose }: MatchCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti
      const colors = ['#0d9488', '#16a34a', '#f97316', '#ec4899', '#8b5cf6'];
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);

      // Auto close after 2.5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '50%',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Match card */}
      <div className="relative animate-match-celebration">
        <div className="bg-card rounded-3xl p-8 text-center shadow-elevated max-w-sm mx-4">
          {/* Heart icon with glow */}
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 gradient-hero rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-20 h-20 rounded-full gradient-hero flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            It's a Match! 🎉
          </h2>
          
          <p className="text-muted-foreground mb-4">
            You matched with
          </p>
          
          <p className="font-semibold text-lg text-foreground mb-6">
            {opportunityTitle}
          </p>

          <p className="text-sm text-muted-foreground">
            Tap anywhere to continue swiping
          </p>
        </div>
      </div>
    </div>
  );
}
