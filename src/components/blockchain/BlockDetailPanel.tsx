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
    <div className="fixed top-4 right-4 w-96 z-50 animate-in fade-in slide-in-from-right-4">
      {/* Panel */}
      <div className="relative rounded-2xl border border-electric-blue/20 bg-deep-space/90 p-6 backdrop-blur-xl shadow-card">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />

        {/* Close button */}
        <button
          onClick={() => selectBlock(null)}
          className="absolute top-3 right-3 rounded-lg p-1 text-ghost-gray transition-colors hover:bg-slate-shadow hover:text-cyber-cyan"
        >
          <X size={18} />
        </button>

        {/* Block title */}
        <h2 className="mb-4 font-orbitron text-lg font-bold tracking-wider text-white">
          {block.index === 0 ? '⛓ Genesis Block' : `Block #${block.index}`}
        </h2>

        {/* Fields */}
        <div className="space-y-3 text-sm">
          {/* Block Number */}
          <Field label="Block Number" value={`#${block.index}`} />

          {/* Timestamp */}
          <Field label="Timestamp" value={formatTimestamp(block.timestamp)} />

          {/* Data */}
          <Field label="Data" value={block.data} />

          {/* Previous Hash */}
          <div>
            <span className="text-xs uppercase tracking-widest text-ghost-gray">Previous Hash</span>
            <div className="mt-0.5 flex items-center gap-2">
              {/* Colour swatch linking to previous block */}
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: linkValid ? '#00ff88' : '#ef4444',
                }}
              />
              <code className="flex-1 break-all font-mono text-xs text-cyber-cyan">
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
            <span className="text-xs uppercase tracking-widest text-ghost-gray">Hash</span>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: linkValid ? '#00ff88' : '#ef4444' }}
              />
              <code className="flex-1 break-all font-mono text-xs text-cyber-cyan">
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

        {/* Validity badge */}
        <div className="mt-4">
          {linkValid ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green bg-neon-green/15 px-3 py-1 text-xs font-semibold text-neon-green shadow-neon-green">
              <Check size={14} /> Valid Link
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-alert-red bg-alert-red/15 px-3 py-1 text-xs font-semibold text-alert-red shadow-neon-red animate-pulse-slow">
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
      <span className="text-xs uppercase tracking-widest text-ghost-gray">{label}</span>
      <p className="mt-0.5 text-bright-gray">{value}</p>
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
