import { X, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { formatTimestamp } from '../../utils/formatHash';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
      <Card>
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

          <CardTitle>{block.index === 0 ? '⛓ Genesis Block' : `Block #${block.index}`}</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Fields */}
          <div className="space-y-4 text-sm">
            {/* Block Number */}
            <Field label="Block Number" value={`#${block.index}`} />

            {/* Timestamp */}
            <Field label="Timestamp" value={formatTimestamp(block.timestamp)} />

            {/* Data */}
            <Field label="Data" value={block.data} />

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

            {/* Hash */}
            <HashField
              label="Hash"
              value={block.hash}
              isValid={!!linkValid}
              field="hash"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
          </div>

          <Separator className="mt-5" />

          {/* Validity badge */}
          <div className="mt-4">
            {linkValid ? (
              <Badge variant="default">
                <Check size={14} strokeWidth={3} /> Valid Link
              </Badge>
            ) : (
              <Badge variant="destructive">⚠ Broken Link</Badge>
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
}: {
  label: string;
  value: string;
  isValid: boolean;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs uppercase tracking-widest text-ghost-gray">{label}</span>
      <div className="flex items-start gap-2.5 rounded-lg border border-ghost-gray/20 bg-slate-shadow/40 px-3 py-2">
        <span
          className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full"
          style={{
            backgroundColor: isValid ? '#00ff88' : '#ef4444',
            boxShadow: isValid ? '0 0 6px rgba(0,255,136,0.5)' : '0 0 6px rgba(239,68,68,0.5)',
          }}
        />
        <code className="flex-1 break-all font-mono text-xs leading-relaxed text-cyber-cyan">
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
