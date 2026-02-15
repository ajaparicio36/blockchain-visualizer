import { useBlockchainStore } from '../../store/useBlockchainStore';
import { BLOCK_SPACING } from '../../types';
import { isBlockHashValid } from '../../utils/formatHash';

import BlockCard3D from './BlockCard3D';
import ChainLinks3D from './ChainLinks3D';

/**
 * ChainGroup — reads the blockchain store and renders each block
 * plus the connecting links between them.
 */
export default function ChainGroup() {
  const chain = useBlockchainStore((s) => s.chain);
  const selectedIndex = useBlockchainStore((s) => s.selectedBlockIndex);
  const selectBlock = useBlockchainStore((s) => s.selectBlock);

  /**
   * Per-block validity:
   * Block 0 (genesis) is always "valid".
   * Block i is valid if:
   *   1. Its stored hash matches recalculated hash (not tampered).
   *   2. Its previousHash matches chain[i-1].hash (link intact).
   *
   * If any upstream block is tampered, downstream blocks are also
   * marked invalid (cascade effect) since previous hashes no longer match.
   */
  const blockValidity: boolean[] = [];
  for (let i = 0; i < chain.length; i++) {
    if (i === 0) {
      blockValidity.push(true);
      continue;
    }
    const prev = chain[i - 1];
    const hashValid = isBlockHashValid(chain[i]);
    const linkValid = chain[i].previousHash === prev.hash;
    // Cascade: if the previous block is invalid, this one is too
    const upstreamValid = blockValidity[i - 1];
    blockValidity.push(hashValid && linkValid && upstreamValid);
  }

  /** Which blocks are directly tampered (their own hash is stale). */
  const blockTampered = chain.map((block) => !isBlockHashValid(block));

  return (
    <group>
      {/* Chain links behind the blocks */}
      <ChainLinks3D chain={chain} />

      {/* Individual blocks */}
      {chain.map((block, i) => (
        <BlockCard3D
          key={block.index}
          block={block}
          position={[i * BLOCK_SPACING, 0, 0]}
          isSelected={selectedIndex === i}
          isValid={blockValidity[i]}
          isTampered={blockTampered[i]}
          onClick={() => selectBlock(selectedIndex === i ? null : i)}
        />
      ))}
    </group>
  );
}
