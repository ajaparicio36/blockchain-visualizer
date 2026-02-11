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
    <div className="fixed top-4 left-4 z-50">
      {isValid ? (
        <div className="flex items-center gap-2 rounded-full border border-neon-green bg-neon-green/15 px-4 py-2 text-sm font-semibold text-neon-green shadow-neon-green backdrop-blur-md">
          <ShieldCheck size={18} />
          <span>Chain Valid</span>
          <span className="ml-1 rounded-full bg-neon-green/20 px-2 py-0.5 text-xs">
            {chainLength} {chainLength === 1 ? 'block' : 'blocks'}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-alert-red bg-alert-red/15 px-4 py-2 text-sm font-semibold text-alert-red shadow-neon-red backdrop-blur-md animate-pulse-slow">
          <ShieldAlert size={18} />
          <span>Chain Invalid</span>
          <span className="ml-1 rounded-full bg-alert-red/20 px-2 py-0.5 text-xs">
            {chainLength} {chainLength === 1 ? 'block' : 'blocks'}
          </span>
        </div>
      )}
    </div>
  );
}
