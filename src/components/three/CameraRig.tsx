import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useBlockchainStore } from '../../store/useBlockchainStore';
import { BLOCK_SPACING } from '../../types';

/**
 * CameraRig — smoothly moves the OrbitControls target toward the
 * selected block (if any) or the chain midpoint. Does NOT override
 * camera.position, so the user is free to orbit / pan / zoom.
 *
 * On first mount and when a new block is added the camera drifts to
 * a sensible default position, but only as a gentle suggestion — the
 * user's orbit state is preserved otherwise.
 */
export default function CameraRig() {
  const chain = useBlockchainStore((s) => s.chain);
  const selectedBlockIndex = useBlockchainStore((s) => s.selectedBlockIndex);
  const { controls, camera } = useThree();

  const desiredTarget = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const isFirstMount = useRef(true);
  const prevChainLen = useRef(chain.length);
  /** When true the camera position is also nudged (not just the target). */
  const nudgeCamera = useRef(true);

  // Nudge camera when chain grows (new block mined)
  useEffect(() => {
    if (chain.length > prevChainLen.current) {
      nudgeCamera.current = true;
    }
    prevChainLen.current = chain.length;
  }, [chain.length]);

  // Nudge camera when a block is selected / deselected
  useEffect(() => {
    nudgeCamera.current = true;
  }, [selectedBlockIndex]);

  useFrame((_state, delta) => {
    // OrbitControls from drei expose a `target` Vector3
    const orbit = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (!orbit?.target) return;

    // Determine the focus X
    const lastX = (chain.length - 1) * BLOCK_SPACING;
    const midX = lastX / 2;

    const focusX = selectedBlockIndex !== null ? selectedBlockIndex * BLOCK_SPACING : midX;

    desiredTarget.current.set(focusX, 0, 0);

    // Smoothly lerp the orbit target
    const speed = 1 - Math.exp(-3 * delta);
    orbit.target.lerp(desiredTarget.current, speed);

    // Suggest a camera position (slightly elevated, behind)
    const dist = selectedBlockIndex !== null ? 8 : 10 + chain.length * 0.35;
    desiredPos.current.set(focusX, 3.5, dist);

    if (isFirstMount.current) {
      // Jump instantly on first mount
      orbit.target.copy(desiredTarget.current);
      camera.position.copy(desiredPos.current);
      isFirstMount.current = false;
      nudgeCamera.current = false;
    } else if (nudgeCamera.current) {
      // Gently nudge the camera toward the suggestion
      camera.position.lerp(desiredPos.current, speed * 0.6);

      // Stop nudging once close enough
      if (camera.position.distanceTo(desiredPos.current) < 0.05) {
        nudgeCamera.current = false;
      }
    }

    orbit.update();
  });

  return null;
}
