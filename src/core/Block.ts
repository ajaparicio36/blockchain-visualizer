import SHA256 from 'crypto-js/sha256';

import type { BlockData } from '../types';

/**
 * Block — a single unit in the blockchain.
 *
 * All properties are public for serialisation but should be treated as
 * immutable after mining (except `data` for the tamper demo).
 */
export class Block implements BlockData {
  public readonly index: number;
  public readonly timestamp: number;
  public data: string;
  public readonly previousHash: string;
  public nonce: number;
  public hash: string;

  constructor(index: number, data: string, previousHash: string, timestamp: number = Date.now()) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Deterministic SHA-256 hash of all block fields.
   */
  calculateHash(): string {
    return SHA256(
      `${this.index}${this.previousHash}${this.timestamp}${this.data}${this.nonce}`,
    ).toString();
  }

  /**
   * Non-blocking proof-of-work: increment `nonce` until the hash
   * has `difficulty` leading zeros.
   *
   * Uses `setTimeout(0)` batching so the main thread is never
   * blocked for more than ~5 ms at a time.
   */
  mineBlock(difficulty: number): Promise<void> {
    const target = '0'.repeat(difficulty);
    const BATCH_SIZE = 5_000; // iterations per tick

    return new Promise<void>((resolve) => {
      const tick = () => {
        for (let i = 0; i < BATCH_SIZE; i++) {
          this.hash = this.calculateHash();
          if (this.hash.startsWith(target)) {
            resolve();
            return;
          }
          this.nonce++;
        }
        // Yield to the event loop
        setTimeout(tick, 0);
      };
      tick();
    });
  }

  /** Return a plain-object snapshot (for Zustand immutable state). */
  toData(): BlockData {
    return {
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previousHash: this.previousHash,
      nonce: this.nonce,
      hash: this.hash,
    };
  }

  /** Rehydrate a Block instance from a plain snapshot. */
  static fromData(d: BlockData): Block {
    const b = new Block(d.index, d.data, d.previousHash, d.timestamp);
    b.nonce = d.nonce;
    b.hash = d.hash;
    return b;
  }
}
