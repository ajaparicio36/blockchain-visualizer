import { X, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { formatTimestamp } from '../../utils/formatHash';

/**
 * BlockDetailPanel — 2D overlay showing all 6 fields of the selected block.
 * Positioned fixed over the 3D canvas.
 */
export default function BlockDetailPanel() {
  const chain = useBlockchainStore((s) => s.chain);
  const selectedIndex = useBlockchainStore((s) => s.selectedBlockIndex);
  const selectBlock = useBlockchainStore((s) => s.selectBlock);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const block = selectedIndex !== null ? chain[selectedIndex] : null;

  const copyToClipboard = useCallback((text: string, field: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }, []);

  if (!block) return null;

  const prevBlock = selectedIndex !== null && selectedIndex > 0 ? chain[selectedIndex - 1] : null;

  // Check link validity
  const linkValid = selectedIndex === 0 || (prevBlock && block.previousHash === prevBlock.hash);

  return (
    <div className="fixed top-6 right-6 w-[420px] z-50 animate-in fade-in slide-in-from-right-4">
      {/* Panel */}
      <div className="relative rounded-2xl border-2 border-electric-blue/25 bg-deep-space/92 p-7 backdrop-blur-2xl shadow-card">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />

        {/* Close button */}
        <button
          onClick={() => selectBlock(null)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-ghost-gray transition-colors hover:bg-slate-shadow hover:text-cyber-cyan"
        >
          <X size={18} />
        </button>

        {/* Block title */}
        <h2 className="mb-5 font-orbitron text-xl font-bold tracking-wider text-white">
          {block.index === 0 ? '⛓ Genesis Block' : `Block #${block.index}`}
        </h2>

        {/* Fields */}
        <div className="space-y-4 text-sm">
          {/* Block Number */}
          <Field label="Block Number" value={`#${block.index}`} />

          {/* Timestamp */}
          <Field label="Timestamp" value={formatTimestamp(block.timestamp)} />

          {/* Data */}
          <Field label="Data" value={block.data} />

          {/* Previous Hash */}
          <div>
            <span className="mb-1 block text-xs uppercase tracking-widest text-ghost-gray">
              Previous Hash
            </span>
            <div className="flex items-start gap-2.5 rounded-lg border border-ghost-gray/20 bg-slate-shadow/40 px-3 py-2">
              {/* Colour swatch linking to previous block */}
              <span
                className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: linkValid ? '#00ff88' : '#ef4444',
                  boxShadow: linkValid
                    ? '0 0 6px rgba(0,255,136,0.5)'
                    : '0 0 6px rgba(239,68,68,0.5)',
                }}
              />
              <code className="flex-1 break-all font-mono text-xs leading-relaxed text-cyber-cyan">
                {block.previousHash}
              </code>
              <CopyButton
                text={block.previousHash}
                field="prevHash"
                copied={copiedField === 'prevHash'}
                onCopy={copyToClipboard}
              />
            </div>
          </div>

          {/* Nonce */}
          <Field label="Nonce" value={String(block.nonce)} />

          {/* Hash */}
          <div>
            <span className="mb-1 block text-xs uppercase tracking-widest text-ghost-gray">
              Hash
            </span>
            <div className="flex items-start gap-2.5 rounded-lg border border-ghost-gray/20 bg-slate-shadow/40 px-3 py-2">
              <span
                className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: linkValid ? '#00ff88' : '#ef4444',
                  boxShadow: linkValid
                    ? '0 0 6px rgba(0,255,136,0.5)'
                    : '0 0 6px rgba(239,68,68,0.5)',
                }}
              />
              <code className="flex-1 break-all font-mono text-xs leading-relaxed text-cyber-cyan">
                {block.hash}
              </code>
              <CopyButton
                text={block.hash}
                field="hash"
                copied={copiedField === 'hash'}
                onCopy={copyToClipboard}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 border-t border-ghost-gray/20" />

        {/* Validity badge */}
        <div className="mt-4">
          {linkValid ? (
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-neon-green/50 bg-neon-green/10 px-4 py-1.5 text-xs font-bold tracking-wide text-neon-green shadow-neon-green">
              <Check size={14} strokeWidth={3} /> Valid Link
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-alert-red/50 bg-alert-red/10 px-4 py-1.5 text-xs font-bold tracking-wide text-alert-red shadow-neon-red animate-pulse-slow">
              ⚠ Broken Link
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────── */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-xs uppercase tracking-widest text-ghost-gray">{label}</span>
      <p className="text-bright-gray leading-relaxed">{value}</p>
    </div>
  );
}

function CopyButton({
  text,
  field,
  copied,
  onCopy,
}: {
  text: string;
  field: string;
  copied: boolean;
  onCopy: (text: string, field: string) => void;
}) {
  return (
    <button
      onClick={() => onCopy(text, field)}
      className="shrink-0 rounded p-1 text-ghost-gray transition-colors hover:text-cyber-cyan"
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
    </button>
  );
}
