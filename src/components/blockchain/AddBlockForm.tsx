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
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4">
      <div className="relative rounded-2xl border border-electric-blue/20 bg-deep-space/90 p-5 backdrop-blur-xl shadow-card">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />

        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Data input */}
          <div className="flex-1">
            <label
              htmlFor="block-data"
              className="mb-1.5 block text-xs uppercase tracking-widest text-ghost-gray"
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
              className="w-full rounded-lg border border-ghost-gray/50 bg-slate-shadow/60 px-4 py-2.5 text-sm text-bright-gray backdrop-blur transition-all placeholder:text-ghost-gray focus:border-cyber-cyan focus:shadow-[0_0_0_2px_rgba(0,217,255,0.2)]"
            />
          </div>

          {/* Mine button */}
          <button
            type="submit"
            disabled={!data.trim() || isMining}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-electric-blue to-cyber-cyan px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-neon-cyan transition-all hover:-translate-y-0.5 hover:shadow-neon-cyan-lg disabled:pointer-events-none disabled:opacity-50"
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
          <p className="mt-2 text-right text-xs text-steel-gray">
            Last mined in <span className="font-mono text-neon-green">{lastMineTimeMs} ms</span>
          </p>
        )}
      </div>
    </div>
  );
}
