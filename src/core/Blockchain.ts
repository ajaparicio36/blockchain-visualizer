import { Block } from './Block';

import type { BlockData } from '../types';

/**
 * Blockchain — an ordered list of Blocks with proof-of-work mining.
 */
export class Blockchain {
  public chain: Block[];
  public difficulty: number;

  constructor(difficulty = 2) {
    this.difficulty = difficulty;
    this.chain = [this.createGenesisBlock()];
  }

  /** Create the hard-coded genesis block (index 0). */
  private createGenesisBlock(): Block {
    const genesis = new Block(0, 'Genesis Block', '0', Date.now());
    genesis.nonce = 0;
    genesis.hash = genesis.calculateHash();
    return genesis;
  }

  /** Last block in the chain, or undefined if the chain is empty. */
  getLatestBlock(): Block | undefined {
    return this.chain.length > 0 ? this.chain[this.chain.length - 1] : undefined;
  }

  /**
   * Create a new block, mine it (async/non-blocking), and append.
   * If the chain is empty, create a genesis block.
   */
  async addBlock(data: string): Promise<Block> {
    const prev = this.getLatestBlock();
    const index = prev ? prev.index + 1 : 0;
    const previousHash = prev ? prev.hash : '0';
    const block = new Block(index, data, previousHash);
    await block.mineBlock(this.difficulty);
    this.chain.push(block);
    return block;
  }

  /**
   * Walk the chain and verify two invariants for every block (except genesis):
   * 1. Stored hash matches recalculated hash.
   * 2. `previousHash` matches the previous block's stored hash.
   */
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.previousHash !== prev.hash) return false;
    }
    return true;
  }

  /** Snapshot the entire chain as plain objects. */
  toData(): BlockData[] {
    return this.chain.map((b) => b.toData());
  }
}
