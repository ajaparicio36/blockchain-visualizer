/**
 * Shared TypeScript types & interfaces for the Blockchain Visualizer.
 */

/** Serializable snapshot of a Block (used by the store & UI). */
export interface BlockData {
  readonly index: number;
  readonly timestamp: number;
  data: string;
  readonly previousHash: string;
  nonce: number;
  hash: string;
}

/** State shape exposed by the Zustand blockchain store. */
export interface BlockchainState {
  chain: BlockData[];
  difficulty: number;
  isValid: boolean;
  isMining: boolean;
  lastMineTimeMs: number | null;
  selectedBlockIndex: number | null;

  // Actions
  addBlock: (data: string) => Promise<void>;
  editBlockData: (index: number, newData: string) => void;
  setDifficulty: (d: number) => void;
  validateChain: () => void;
  selectBlock: (index: number | null) => void;
}

/** Mining difficulty bounds. */
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 4;

/** Block spacing constant for 3D layout. */
export const BLOCK_SPACING = 4.5;

/** Block geometry dimensions — actual cube proportions. */
export const BLOCK_WIDTH = 2.4;
export const BLOCK_HEIGHT = 2.4;
export const BLOCK_DEPTH = 2.4;
