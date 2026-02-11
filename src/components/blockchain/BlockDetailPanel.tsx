import { X, Copy, Check, AlertTriangle } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { formatTimestamp, computeActualHash, isBlockHashValid } from '../../utils/formatHash';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BlockEditor from './BlockEditor';

/**
 * BlockDetailPanel — 2D overlay showing all 6 fields of the selected block.
 * Positioned fixed over the 3D canvas. Includes tamper editing (F-06).
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

  // Compute actual hash for tamper comparison
  const actualHash = useMemo(() => (block ? computeActualHash(block) : ''), [block]);
  const hashValid = useMemo(() => (block ? isBlockHashValid(block) : true), [block]);

  if (!block) return null;

  const prevBlock = selectedIndex !== null && selectedIndex > 0 ? chain[selectedIndex - 1] : null;
  const isGenesis = selectedIndex === 0;

  // Check link validity
  const linkValid = isGenesis || (prevBlock && block.previousHash === prevBlock.hash);

  return (
    <div className="fixed top-6 right-6 w-[420px] z-50 animate-in fade-in slide-in-from-right-4">
      <Card className={!hashValid ? 'border-alert-red/50 shadow-neon-red' : ''}>
        <CardHeader>
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => selectBlock(null)}
            className="absolute top-4 right-4"
          >
            <X size={18} />
          </Button>

          <CardTitle>{isGenesis ? '⛓ Genesis Block' : `Block #${block.index}`}</CardTitle>

          {/* Tampered warning */}
          {!hashValid && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-alert-red/30 bg-alert-red/10 px-3 py-2 text-xs text-alert-red">
              <AlertTriangle size={14} />
              <span className="font-semibold">Block has been tampered with!</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Fields */}
          <div className="space-y-4 text-sm">
            {/* Block Number */}
            <Field label="Block Number" value={`#${block.index}`} />

            {/* Timestamp */}
            <Field label="Timestamp" value={formatTimestamp(block.timestamp)} />

            {/* Data — with inline editor for non-genesis blocks */}
            <div>
              <span className="mb-1 block text-xs uppercase tracking-widest text-ghost-gray">
                Data
              </span>
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-bright-gray leading-relaxed">{block.data}</p>
                {!isGenesis && <BlockEditor blockIndex={block.index} currentData={block.data} />}
              </div>
            </div>

            {/* Previous Hash */}
            <HashField
              label="Previous Hash"
              value={block.previousHash}
              isValid={!!linkValid}
              field="prevHash"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />

            {/* Nonce */}
            <Field label="Nonce" value={String(block.nonce)} />

            {/* Stored Hash */}
            <HashField
              label={hashValid ? 'Hash' : 'Stored Hash (stale)'}
              value={block.hash}
              isValid={hashValid}
              field="hash"
              copiedField={copiedField}
              onCopy={copyToClipboard}
              strikethrough={!hashValid}
            />

            {/* Actual Hash — only shown when tampered */}
            {!hashValid && (
              <HashField
                label="Actual Hash (recalculated)"
                value={actualHash}
                isValid={false}
                field="actualHash"
                copiedField={copiedField}
                onCopy={copyToClipboard}
                highlight
              />
            )}
          </div>

          <Separator className="mt-5" />

          {/* Validity badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {linkValid ? (
              <Badge variant="default">
                <Check size={14} strokeWidth={3} /> Valid Link
              </Badge>
            ) : (
              <Badge variant="destructive">⚠ Broken Link</Badge>
            )}
            {hashValid ? (
              <Badge variant="default">
                <Check size={14} strokeWidth={3} /> Hash Intact
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle size={14} /> Hash Mismatch
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
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

function HashField({
  label,
  value,
  isValid,
  field,
  copiedField,
  onCopy,
  strikethrough = false,
  highlight = false,
}: {
  label: string;
  value: string;
  isValid: boolean;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
  strikethrough?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs uppercase tracking-widest text-ghost-gray">{label}</span>
      <div
        className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 ${
          highlight
            ? 'border-alert-red/40 bg-alert-red/10'
            : 'border-ghost-gray/20 bg-slate-shadow/40'
        }`}
      >
        <span
          className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full"
          style={{
            backgroundColor: isValid ? '#00ff88' : '#ef4444',
            boxShadow: isValid ? '0 0 6px rgba(0,255,136,0.5)' : '0 0 6px rgba(239,68,68,0.5)',
          }}
        />
        <code
          className={`flex-1 break-all font-mono text-xs leading-relaxed ${
            strikethrough
              ? 'text-alert-red line-through opacity-60'
              : highlight
                ? 'text-alert-red'
                : 'text-cyber-cyan'
          }`}
        >
          {value}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => onCopy(value, field)}
          title="Copy to clipboard"
        >
          {copiedField === field ? (
            <Check size={14} className="text-neon-green" />
          ) : (
            <Copy size={14} />
          )}
        </Button>
      </div>
    </div>
  );
}
