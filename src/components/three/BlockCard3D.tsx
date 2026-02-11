import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

import type { BlockData } from '../../types';
import { BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH } from '../../types';
import { formatHash, truncateData } from '../../utils/formatHash';

interface BlockCard3DProps {
  block: BlockData;
  position: [number, number, number];
  isSelected: boolean;
  isValid: boolean;
  isTampered: boolean;
  onClick: () => void;
}

/** Colour / emissive config per block state. */
function getMaterial(block: BlockData, isValid: boolean, isTampered: boolean) {
  if (block.index === 0) {
    // Genesis block — plasma purple
    return {
      color: '#2d1b4e',
      emissive: '#a855f7',
      emissiveIntensity: 0.25,
      metalness: 0.7,
      roughness: 0.3,
      edgeColor: '#a855f7',
    };
  }
  if (isTampered) {
    // Directly tampered block — dark red with strong alert glow
    return {
      color: '#450a0a',
      emissive: '#ef4444',
      emissiveIntensity: 0.35,
      metalness: 0.5,
      roughness: 0.5,
      edgeColor: '#ef4444',
    };
  }
  if (!isValid) {
    // Downstream invalid (cascade) — subtler red tint
    return {
      color: '#2a0f0f',
      emissive: '#ef4444',
      emissiveIntensity: 0.15,
      metalness: 0.5,
      roughness: 0.5,
      edgeColor: '#ef4444',
    };
  }
  // Normal mined block
  return {
    color: '#1e1e28',
    emissive: '#00d9ff',
    emissiveIntensity: 0.08,
    metalness: 0.6,
    roughness: 0.4,
    edgeColor: '#00d9ff',
  };
}

/**
 * BlockCard3D — a single block rendered as an actual 3D cube
 * with text labels on the front face and glowing wireframe edges.
 */
export default function BlockCard3D({
  block,
  position,
  isSelected,
  isValid,
  isTampered,
  onClick,
}: BlockCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const mat = useMemo(() => getMaterial(block, isValid, isTampered), [block, isValid, isTampered]);

  // Smooth hover / select scale + tamper shake + emissive pulse
  const scaleTarget = hovered || isSelected ? 1.08 : 1;
  const shakeRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Scale lerp
    const s = meshRef.current.scale.x;
    const next = THREE.MathUtils.lerp(s, scaleTarget, 1 - Math.exp(-10 * delta));
    meshRef.current.scale.setScalar(next);

    // Tamper shake — quick oscillation on X
    if (isTampered) {
      shakeRef.current += delta * 20;
      const shakeMag = Math.sin(shakeRef.current) * 0.03 * Math.exp(-delta * 2);
      groupRef.current.position.x = position[0] + shakeMag;
    } else {
      groupRef.current.position.x = position[0];
      shakeRef.current = 0;
    }

    // Emissive pulse for tampered / invalid blocks
    if (matRef.current && (isTampered || !isValid)) {
      matRef.current.emissiveIntensity =
        mat.emissiveIntensity + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    } else if (matRef.current) {
      matRef.current.emissiveIntensity =
        hovered || isSelected ? mat.emissiveIntensity * 3 : mat.emissiveIntensity;
    }

    // Slow idle rotation for visual interest
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + block.index) * 0.04;
    }
  });

  const textColor = block.index === 0 ? '#e2d4f5' : '#e5e7eb';
  const hashColor = isTampered ? '#ef4444' : '#00d9ff';
  const zFace = BLOCK_DEPTH / 2 + 0.01; // slightly in front of the face

  return (
    <group ref={groupRef} position={position}>
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
        castShadow
        receiveShadow
      >
        <boxGeometry args={[BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH]} />
        <meshStandardMaterial
          ref={matRef}
          color={mat.color}
          metalness={mat.metalness}
          roughness={mat.roughness}
          emissive={mat.emissive}
          emissiveIntensity={mat.emissiveIntensity}
          envMapIntensity={0.7}
        />

        {/* Glowing wireframe edges */}
        <Edges
          threshold={15}
          color={hovered || isSelected ? '#ffffff' : mat.edgeColor}
          linewidth={hovered || isSelected ? 2.5 : 1.5}
          scale={1.002}
        />

        {/* ── Front-face text ───────────────────────────── */}

        {/* Block number / title */}
        <Text
          position={[0, 0.72, zFace]}
          fontSize={0.2}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Bold.ttf"
        >
          {block.index === 0 ? 'GENESIS' : `BLOCK #${block.index}`}
        </Text>

        {/* Separator line */}
        <mesh position={[0, 0.52, zFace]}>
          <planeGeometry args={[BLOCK_WIDTH * 0.7, 0.008]} />
          <meshBasicMaterial color={mat.edgeColor} transparent opacity={0.5} />
        </mesh>

        {/* Hash label */}
        <Text
          position={[-BLOCK_WIDTH * 0.35 + 0.15, 0.32, zFace]}
          fontSize={0.08}
          color="#9ca3af"
          anchorX="left"
          anchorY="middle"
        >
          HASH
        </Text>

        {/* Hash value */}
        <Text
          position={[0, 0.18, zFace]}
          fontSize={0.1}
          color={hashColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
        >
          {formatHash(block.hash, 18)}
        </Text>

        {/* Nonce label + value */}
        <Text
          position={[-BLOCK_WIDTH * 0.35 + 0.15, -0.02, zFace]}
          fontSize={0.08}
          color="#9ca3af"
          anchorX="left"
          anchorY="middle"
        >
          NONCE
        </Text>
        <Text
          position={[0, -0.16, zFace]}
          fontSize={0.12}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
        >
          {String(block.nonce)}
        </Text>

        {/* Data label + value */}
        <Text
          position={[-BLOCK_WIDTH * 0.35 + 0.15, -0.36, zFace]}
          fontSize={0.08}
          color="#9ca3af"
          anchorX="left"
          anchorY="middle"
        >
          DATA
        </Text>
        <Text
          position={[0, -0.52, zFace]}
          fontSize={0.1}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={BLOCK_WIDTH - 0.4}
        >
          {truncateData(block.data, 18)}
        </Text>

        {/* Status indicator dot at bottom */}
        <mesh position={[0, -0.82, zFace]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial
            color={
              isTampered
                ? '#ef4444'
                : !isValid
                  ? '#ef4444'
                  : block.index === 0
                    ? '#a855f7'
                    : '#00ff88'
            }
          />
        </mesh>

        {/* ── Top face label ─────────────────────────────── */}
        <Text
          position={[0, BLOCK_HEIGHT / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.15}
          color={mat.edgeColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Bold.ttf"
        >
          {`#${block.index}`}
        </Text>
      </mesh>

      {/* Selection ring — orbiting torus */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.02, 16, 64]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Tampered warning indicator — floating exclamation above block */}
      {isTampered && (
        <Text
          position={[0, BLOCK_HEIGHT / 2 + 0.4, 0]}
          fontSize={0.35}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Bold.ttf"
        >
          ⚠
        </Text>
      )}
    </group>
  );
}
