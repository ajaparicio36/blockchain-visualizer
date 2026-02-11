import { Sliders } from 'lucide-react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { MIN_DIFFICULTY, MAX_DIFFICULTY } from '../../types';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/** Human-readable hint per difficulty level. */
const DIFFICULTY_HINTS: Record<number, string> = {
  1: '~instant',
  2: '~fast',
  3: '~moderate',
  4: '~slow (seconds)',
};

/**
 * DifficultySelector — segmented button group (1–4) that controls
 * how many leading zeros the next mined hash must have.
 */
export default function DifficultySelector() {
  const difficulty = useBlockchainStore((s) => s.difficulty);
  const setDifficulty = useBlockchainStore((s) => s.setDifficulty);
  const isMining = useBlockchainStore((s) => s.isMining);

  const levels = Array.from(
    { length: MAX_DIFFICULTY - MIN_DIFFICULTY + 1 },
    (_, i) => i + MIN_DIFFICULTY,
  );

  return (
    <div className="fixed top-24 left-6 z-50">
      <Card className="px-5 py-4 before:via-electric-blue">
        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <Sliders size={14} className="text-electric-blue" />
          <Label>Difficulty</Label>
        </div>

        {/* Segmented buttons */}
        <TooltipProvider delayDuration={200}>
          <div className="flex gap-1.5">
            {levels.map((level) => {
              const isActive = level === difficulty;
              return (
                <Tooltip key={level}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={isActive ? 'default' : 'outline'}
                      onClick={() => setDifficulty(level)}
                      disabled={isMining}
                      className={isActive ? 'scale-110' : ''}
                    >
                      {level}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{DIFFICULTY_HINTS[level]}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Dynamic subtitle — shows required pattern */}
        <p className="mt-2.5 font-mono text-xs text-steel-gray">
          Hash prefix: <span className="text-cyber-cyan">{'0'.repeat(difficulty)}</span>
          <span className="text-ghost-gray">{'x'.repeat(Math.max(0, 6 - difficulty))}</span>
        </p>

        {/* Estimated time */}
        <p className="mt-1 text-[10px] text-ghost-gray">
          Est. speed: {DIFFICULTY_HINTS[difficulty]}
        </p>
      </Card>
    </div>
  );
}
