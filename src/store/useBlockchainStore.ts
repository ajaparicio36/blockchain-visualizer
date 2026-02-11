import { create } from 'zustand';

import { Blockchain } from '../core/Blockchain';
import type { BlockchainState } from '../types';

/**
 * Global Zustand store that wraps a `Blockchain` instance and exposes
 * reactive state + actions consumed by every UI component.
 */
const blockchain = new Blockchain(2);

export const useBlockchainStore = create<BlockchainState>((set) => ({
  // ── State ────────────────────────────────────────────────
  chain: blockchain.toData(),
  difficulty: blockchain.difficulty,
  isValid: true,
  isMining: false,
  lastMineTimeMs: null,
  selectedBlockIndex: null,

  // ── Actions ──────────────────────────────────────────────

  addBlock: async (data: string) => {
    set({ isMining: true });
    const start = performance.now();

    await blockchain.addBlock(data);

    const elapsed = performance.now() - start;
    set({
      chain: blockchain.toData(),
      isMining: false,
      isValid: blockchain.isChainValid(),
      lastMineTimeMs: Math.round(elapsed),
    });
  },

  editBlockData: (index: number, newData: string) => {
    const block = blockchain.chain[index];
    if (!block) return;

    // Mutate data WITHOUT re-mining — deliberately breaks the chain
    block.data = newData;
    block.hash = block.calculateHash();

    set({
      chain: blockchain.toData(),
      isValid: blockchain.isChainValid(),
    });
  },

  setDifficulty: (d: number) => {
    blockchain.difficulty = d;
    set({ difficulty: d, isValid: blockchain.isChainValid() });
  },

  validateChain: () => {
    set({ isValid: blockchain.isChainValid() });
  },

  selectBlock: (index: number | null) => {
    set({ selectedBlockIndex: index });
  },
}));
