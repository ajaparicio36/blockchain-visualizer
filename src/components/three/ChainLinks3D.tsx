import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { BLOCK_SPACING, BLOCK_WIDTH } from '../../types';
import type { BlockData } from '../../types';
import { isBlockHashValid } from '../../utils/formatHash';

interface ChainLinks3DProps {
  chain: BlockData[];
}

/**
 * ChainLinks3D — render a glowing line between every adjacent pair of blocks.
 * Green = valid link, Red = broken link (tampered upstream or previousHash mismatch).
 */
export default function ChainLinks3D({ chain }: ChainLinks3DProps) {
  const links = useMemo(() => {
    const result: {
      key: string;
      points: [THREE.Vector3, THREE.Vector3];
      valid: boolean;
    }[] = [];

    for (let i = 1; i < chain.length; i++) {
      const prev = chain[i - 1];
      const curr = chain[i];

      // Previous block right edge → current block left edge
      const startX = (i - 1) * BLOCK_SPACING + BLOCK_WIDTH / 2 + 0.05;
      const endX = i * BLOCK_SPACING - BLOCK_WIDTH / 2 - 0.05;

      // Link is valid only if the previous block's hash is self-consistent
      // AND the current block's previousHash matches it
      const prevHashValid = isBlockHashValid(prev);
      const linkMatches = curr.previousHash === prev.hash;
      const valid = prevHashValid && linkMatches;

      result.push({
        key: `link-${i}`,
        points: [new THREE.Vector3(startX, 0, 0), new THREE.Vector3(endX, 0, 0)],
        valid,
      });
    }
    return result;
  }, [chain]);

  return (
    <>
      {links.map(({ key, points, valid }) => (
        <ChainLink key={key} points={points} valid={valid} />
      ))}
    </>
  );
}

/** Individual link with pulsing effect when invalid. */
function ChainLink({ points, valid }: { points: [THREE.Vector3, THREE.Vector3]; valid: boolean }) {
  const coneRef = useRef<THREE.Mesh>(null);

  // Pulse invalid links
  useFrame((state) => {
    if (!coneRef.current || valid) return;
    const mat = coneRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.35;
  });

  return (
    <group>
      <Line
        points={points}
        color={valid ? '#00ff88' : '#ef4444'}
        lineWidth={valid ? 2.5 : 3.5}
        transparent
        opacity={valid ? 0.85 : 0.95}
      />
      {/* Small arrow cone at the receiving end */}
      <mesh ref={coneRef} position={points[1]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshBasicMaterial color={valid ? '#00ff88' : '#ef4444'} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
