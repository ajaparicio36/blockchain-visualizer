import { useBlockchainStore } from '../../store/useBlockchainStore';
import { BLOCK_SPACING } from '../../types';

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
   * Block i is valid if its previousHash matches chain[i-1].hash
   * AND its own hash matches calculateHash().
   */
  const blockValidity = chain.map((block, i) => {
    if (i === 0) return true;
    const prev = chain[i - 1];
    return block.previousHash === prev.hash;
  });

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
          onClick={() => selectBlock(selectedIndex === i ? null : i)}
        />
      ))}
    </group>
  );
}
