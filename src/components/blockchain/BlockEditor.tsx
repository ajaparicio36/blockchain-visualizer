/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlockEditorProps {
  blockIndex: number;
  currentData: string;
}

/**
 * BlockEditor — inline edit form for tampering with a block's data.
 *
 * Clicking the pencil icon opens an input pre-filled with the current data.
 * Saving modifies the data WITHOUT re-mining, deliberately breaking the chain.
 */
export default function BlockEditor({ blockIndex, currentData }: BlockEditorProps) {
  const editBlockData = useBlockchainStore((s) => s.editBlockData);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentData);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when edit mode opens
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  // Sync if external data changes
  useEffect(() => {
    if (!editing) setValue(currentData);
  }, [currentData, editing]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== currentData) {
      editBlockData(blockIndex, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(currentData);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (!editing) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-ghost-gray hover:text-cyber-cyan"
        onClick={() => setEditing(true)}
        title="Tamper with block data"
      >
        <Pencil size={14} />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8 text-xs"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-neon-green hover:text-neon-green"
        onClick={handleSave}
        title="Save tampered data"
      >
        <Save size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-alert-red hover:text-alert-red"
        onClick={handleCancel}
        title="Cancel"
      >
        <X size={14} />
      </Button>
    </div>
  );
}
