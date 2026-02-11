import { useState } from 'react';
import { Pickaxe, Loader2 } from 'lucide-react';

import { useBlockchainStore } from '../../store/useBlockchainStore';

/**
 * AddBlockForm — input field + mine button, displayed as a floating
 * HUD panel over the 3D scene.
 */
export default function AddBlockForm() {
  const [data, setData] = useState('');
  const addBlock = useBlockchainStore((s) => s.addBlock);
  const isMining = useBlockchainStore((s) => s.isMining);
  const lastMineTimeMs = useBlockchainStore((s) => s.lastMineTimeMs);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = data.trim();
    if (!trimmed || isMining) return;

    await addBlock(trimmed);
    setData('');
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
      <div className="relative rounded-2xl border-2 border-electric-blue/25 bg-deep-space/92 p-6 backdrop-blur-2xl shadow-card">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />

        <form onSubmit={handleSubmit} className="flex items-end gap-4">
          {/* Data input */}
          <div className="flex-1">
            <label
              htmlFor="block-data"
              className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ghost-gray"
            >
              Block Data
            </label>
            <input
              id="block-data"
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder='e.g. "Alice pays Bob 10"'
              disabled={isMining}
              className="w-full rounded-lg border-2 border-ghost-gray/40 bg-slate-shadow/60 px-4 py-3 text-sm text-bright-gray backdrop-blur-sm transition-all placeholder:text-ghost-gray/70 focus:border-cyber-cyan focus:shadow-[0_0_0_3px_rgba(0,217,255,0.15)]"
            />
          </div>

          {/* Mine button */}
          <button
            type="submit"
            disabled={!data.trim() || isMining}
            className="flex items-center gap-2.5 rounded-lg border border-cyber-cyan/30 bg-gradient-to-br from-electric-blue to-cyber-cyan px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-neon-cyan transition-all hover:-translate-y-0.5 hover:shadow-neon-cyan-lg disabled:pointer-events-none disabled:opacity-40"
          >
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
          </button>
        </form>

        {/* Last mine time */}
        {lastMineTimeMs !== null && !isMining && (
          <p className="mt-3 text-right text-xs text-steel-gray">
            Last mined in{' '}
            <span className="font-mono font-semibold text-neon-green">{lastMineTimeMs} ms</span>
          </p>
        )}
      </div>
    </div>
  );
}
