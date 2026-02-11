import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

import { BLOCK_SPACING, BLOCK_WIDTH } from '../../types';
import type { BlockData } from '../../types';

interface ChainLinks3DProps {
  chain: BlockData[];
}

/**
 * ChainLinks3D — render a glowing line between every adjacent pair of blocks.
 * Green = valid link, Red = broken link.
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

      const valid = curr.previousHash === prev.hash;

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
        <group key={key}>
          <Line
            points={points}
            color={valid ? '#00ff88' : '#ef4444'}
            lineWidth={valid ? 2.5 : 3.5}
            transparent
            opacity={valid ? 0.85 : 0.95}
          />
          {/* Small arrow cone at the receiving end */}
          <mesh position={points[1]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshBasicMaterial color={valid ? '#00ff88' : '#ef4444'} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}
