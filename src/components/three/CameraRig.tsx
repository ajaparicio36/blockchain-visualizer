import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { BLOCK_SPACING } from '../../types';

/**
 * CameraRig — smoothly tracks the chain's midpoint so the latest block
 * is always visible. Camera sits slightly elevated and angled.
 */
export default function CameraRig() {
  const chain = useBlockchainStore((s) => s.chain);
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((_state, delta) => {
    // Centre the camera on the midpoint of the chain
    const lastX = (chain.length - 1) * BLOCK_SPACING;
    const midX = lastX / 2;

    target.current.set(midX, 0, 0);

    // Position camera above and behind
    const desiredPos = new THREE.Vector3(midX, 3.5, 10 + chain.length * 0.4);

    camera.position.lerp(desiredPos, 1 - Math.exp(-2 * delta));
    camera.lookAt(target.current);
  });

  return null;
}
