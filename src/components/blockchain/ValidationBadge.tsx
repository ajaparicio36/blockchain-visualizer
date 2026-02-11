import { ShieldCheck, ShieldAlert } from 'lucide-react';

import { useBlockchainStore } from '../../store/useBlockchainStore';

/**
 * ValidationBadge — global chain validity indicator,
 * positioned at the top-left of the viewport.
 */
export default function ValidationBadge() {
  const isValid = useBlockchainStore((s) => s.isValid);
  const chainLength = useBlockchainStore((s) => s.chain.length);

  return (
    <div className="fixed top-6 left-6 z-50">
      {isValid ? (
        <div className="flex items-center gap-3 rounded-full border-2 border-neon-green/60 bg-neon-green/10 px-5 py-2.5 text-sm font-semibold text-neon-green shadow-neon-green backdrop-blur-xl">
          <ShieldCheck size={18} strokeWidth={2.5} />
          <span className="tracking-wide">Chain Valid</span>
          <span className="ml-1 rounded-full bg-neon-green/20 px-2.5 py-0.5 text-xs font-bold">
            {chainLength} {chainLength === 1 ? 'block' : 'blocks'}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-full border-2 border-alert-red/60 bg-alert-red/10 px-5 py-2.5 text-sm font-semibold text-alert-red shadow-neon-red backdrop-blur-xl animate-pulse-slow">
          <ShieldAlert size={18} strokeWidth={2.5} />
          <span className="tracking-wide">Chain Invalid</span>
          <span className="ml-1 rounded-full bg-alert-red/20 px-2.5 py-0.5 text-xs font-bold">
            {chainLength} {chainLength === 1 ? 'block' : 'blocks'}
          </span>
        </div>
      )}
    </div>
  );
}
