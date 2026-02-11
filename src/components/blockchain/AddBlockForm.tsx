/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { Pickaxe, Loader2, CheckCircle } from 'lucide-react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * AddBlockForm — input field + mine button, displayed as a floating
 * HUD panel over the 3D scene. Includes a success toast on mine completion.
 */
export default function AddBlockForm() {
  const [data, setData] = useState('');
  const addBlock = useBlockchainStore((s) => s.addBlock);
  const isMining = useBlockchainStore((s) => s.isMining);
  const lastMineTimeMs = useBlockchainStore((s) => s.lastMineTimeMs);
  const chainLength = useBlockchainStore((s) => s.chain.length);

  // Toast state
  const [toast, setToast] = useState<{ blockIndex: number; ms: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevChainLen = useRef(chainLength);

  // Show toast when a new block is added
  useEffect(() => {
    if (chainLength > prevChainLen.current && lastMineTimeMs !== null) {
      // Clear any existing timer
      if (toastTimer.current) clearTimeout(toastTimer.current);

      setToast({ blockIndex: chainLength - 1, ms: lastMineTimeMs });
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    }
    prevChainLen.current = chainLength;
  }, [chainLength, lastMineTimeMs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = data.trim();
    if (!trimmed || isMining) return;

    await addBlock(trimmed);
    setData('');
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex items-end gap-4">
          {/* Data input */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="block-data">Block Data</Label>
            <Input
              id="block-data"
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder='e.g. "Alice pays Bob 10"'
              disabled={isMining}
            />
          </div>

          {/* Mine button */}
          <Button type="submit" disabled={!data.trim() || isMining}>
            {isMining ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Mining…
              </>
            ) : (
              <>
                <Pickaxe size={16} />
                Mine Block
              </>
            )}
          </Button>
        </form>

        {/* Last mine time */}
        {lastMineTimeMs !== null && !isMining && (
          <p className="mt-3 text-right text-xs text-steel-gray">
            Last mined in{' '}
            <span className="font-mono font-semibold text-neon-green">{lastMineTimeMs} ms</span>
          </p>
        )}
      </Card>

      {/* ── Success toast ─────────────────────────────── */}
      {toast && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap animate-[fadeSlideUp_0.35s_ease-out]">
          <Badge>
            <CheckCircle size={15} strokeWidth={2.5} />
            Block #{toast.blockIndex} mined in {toast.ms} ms
          </Badge>
        </div>
      )}
    </div>
  );
}
