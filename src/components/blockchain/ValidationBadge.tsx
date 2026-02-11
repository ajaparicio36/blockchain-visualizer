import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { Badge } from '@/components/ui/badge';

/**
 * ValidationBadge — global chain validity indicator,
 * positioned at the top-left of the viewport.
 *
 * Three states:
 *  - Mining (amber pulsing)
 *  - Valid  (green)
 *  - Invalid (red pulsing)
 */
export default function ValidationBadge() {
  const isValid = useBlockchainStore((s) => s.isValid);
  const isMining = useBlockchainStore((s) => s.isMining);
  const chainLength = useBlockchainStore((s) => s.chain.length);

  /* ── Mining state ─────────────────────────────────────── */
  if (isMining) {
    return (
      <div className="fixed top-6 left-6 z-50">
        <Badge variant="warning" className="animate-pulse-slow backdrop-blur-xl">
          <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
          <span className="tracking-wide">Mining…</span>
        </Badge>
      </div>
    );
  }

  /* ── Valid / Invalid state ────────────────────────────── */
  return (
    <div className="fixed top-6 left-6 z-50">
      {isValid ? (
        <Badge variant="default" className="backdrop-blur-xl transition-all duration-300">
          <ShieldCheck size={18} strokeWidth={2.5} />
          <span className="tracking-wide">Chain Valid</span>
          <span className="ml-1 rounded-full bg-neon-green/20 px-2.5 py-0.5 text-xs font-bold">
            {chainLength} {chainLength === 1 ? 'block' : 'blocks'}
          </span>
        </Badge>
      ) : (
        <Badge variant="destructive" className="backdrop-blur-xl transition-all duration-300">
          <ShieldAlert size={18} strokeWidth={2.5} />
          <span className="tracking-wide">Chain Invalid</span>
          <span className="ml-1 rounded-full bg-alert-red/20 px-2.5 py-0.5 text-xs font-bold">
            {chainLength} {chainLength === 1 ? 'block' : 'blocks'}
          </span>
        </Badge>
      )}
    </div>
  );
}
