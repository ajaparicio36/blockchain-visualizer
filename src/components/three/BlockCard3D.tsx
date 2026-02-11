import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

import type { BlockData } from '../../types';
import { BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH } from '../../types';
import { formatHash, truncateData } from '../../utils/formatHash';

interface BlockCard3DProps {
  block: BlockData;
  position: [number, number, number];
  isSelected: boolean;
  isValid: boolean;
  onClick: () => void;
}

/** Colour / emissive config per block state. */
function getMaterial(block: BlockData, isValid: boolean) {
  if (block.index === 0) {
    // Genesis block — plasma purple
    return {
      color: '#2d1b4e',
      emissive: '#a855f7',
      emissiveIntensity: 0.25,
      metalness: 0.7,
      roughness: 0.3,
    };
  }
  if (!isValid) {
    // Tampered / invalid
    return {
      color: '#450a0a',
      emissive: '#ef4444',
      emissiveIntensity: 0.35,
      metalness: 0.5,
      roughness: 0.5,
    };
  }
  // Normal mined block
  return {
    color: '#1e1e28',
    emissive: '#00d9ff',
    emissiveIntensity: 0.08,
    metalness: 0.6,
    roughness: 0.4,
  };
}

/**
 * BlockCard3D — a single block rendered as a RoundedBox
 * with text labels on the front face.
 */
export default function BlockCard3D({
  block,
  position,
  isSelected,
  isValid,
  onClick,
}: BlockCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const mat = useMemo(() => getMaterial(block, isValid), [block, isValid]);

  // Smooth hover / select scale
  const scaleTarget = hovered || isSelected ? 1.06 : 1;
  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const s = meshRef.current.scale.x;
    const next = THREE.MathUtils.lerp(s, scaleTarget, 1 - Math.exp(-10 * delta));
    meshRef.current.scale.setScalar(next);
  });

  const textColor = block.index === 0 ? '#e2d4f5' : '#e5e7eb';
  const hashColor = '#00d9ff';
  const zFace = BLOCK_DEPTH / 2 + 0.01; // slightly in front

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <RoundedBox args={[BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={mat.color}
            metalness={mat.metalness}
            roughness={mat.roughness}
            emissive={mat.emissive}
            emissiveIntensity={
              hovered || isSelected ? mat.emissiveIntensity * 3 : mat.emissiveIntensity
            }
          />
        </RoundedBox>

        {/* ── Front-face text ───────────────────────────── */}

        {/* Block number */}
        <Text
          position={[0, 0.5, zFace]}
          fontSize={0.22}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Bold.ttf"
        >
          {block.index === 0 ? 'GENESIS' : `Block #${block.index}`}
        </Text>

        {/* Hash */}
        <Text
          position={[0, 0.18, zFace]}
          fontSize={0.11}
          color={hashColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
        >
          {formatHash(block.hash)}
        </Text>

        {/* Nonce */}
        <Text
          position={[0, -0.1, zFace]}
          fontSize={0.1}
          color={textColor}
          anchorX="center"
          anchorY="middle"
        >
          {`Nonce: ${block.nonce}`}
        </Text>

        {/* Data (truncated) */}
        <Text
          position={[0, -0.38, zFace]}
          fontSize={0.09}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={BLOCK_WIDTH - 0.3}
        >
          {truncateData(block.data, 22)}
        </Text>
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.15, 0.025, 16, 48]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
