import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH } from '../../types';

interface CrackOverlay3DProps {
  /** Seed value to get a deterministic crack pattern per block. */
  seed: number;
  /** Whether to animate (pulse) the cracks. */
  animated?: boolean;
}

/** Deterministic pseudo-random using a seed. */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Each face of the cube is defined by:
 * - a function that maps local 2D coords (u, v) → world 3D position on that face
 * - the half-extents of the face in the u and v directions
 */
interface FaceDef {
  name: string;
  /** Map local (u, v) to 3D world coords on the face surface (with tiny offset). */
  toWorld: (u: number, v: number) => THREE.Vector3;
  halfU: number;
  halfV: number;
}

function getFaces(): FaceDef[] {
  const hw = BLOCK_WIDTH / 2;
  const hh = BLOCK_HEIGHT / 2;
  const hd = BLOCK_DEPTH / 2;
  const eps = 0.03; // offset to float cracks above the surface — must be visible above Edges

  return [
    {
      // Front face (+Z)
      name: 'front',
      toWorld: (u, v) => new THREE.Vector3(u, v, hd + eps),
      halfU: hw,
      halfV: hh,
    },
    {
      // Back face (-Z)
      name: 'back',
      toWorld: (u, v) => new THREE.Vector3(-u, v, -(hd + eps)),
      halfU: hw,
      halfV: hh,
    },
    {
      // Right face (+X)
      name: 'right',
      toWorld: (u, v) => new THREE.Vector3(hw + eps, v, -u),
      halfU: hd,
      halfV: hh,
    },
    {
      // Left face (-X)
      name: 'left',
      toWorld: (u, v) => new THREE.Vector3(-(hw + eps), v, u),
      halfU: hd,
      halfV: hh,
    },
    {
      // Top face (+Y)
      name: 'top',
      toWorld: (u, v) => new THREE.Vector3(u, hh + eps, -v),
      halfU: hw,
      halfV: hd,
    },
    {
      // Bottom face (-Y)
      name: 'bottom',
      toWorld: (u, v) => new THREE.Vector3(u, -(hh + eps), v),
      halfU: hw,
      halfV: hd,
    },
  ];
}

/** Generate a jagged crack path between two points on a face. */
function generateCrackPathOnFace(
  startU: number,
  startV: number,
  endU: number,
  endV: number,
  segments: number,
  jitter: number,
  face: FaceDef,
  rng: () => number,
): THREE.Vector3[] {
  const margin = 0.08;
  const clampU = face.halfU - margin;
  const clampV = face.halfV - margin;
  const points: THREE.Vector3[] = [
    face.toWorld(
      THREE.MathUtils.clamp(startU, -clampU, clampU),
      THREE.MathUtils.clamp(startV, -clampV, clampV),
    ),
  ];

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const u = THREE.MathUtils.lerp(startU, endU, t) + (rng() - 0.5) * jitter;
    const v = THREE.MathUtils.lerp(startV, endV, t) + (rng() - 0.5) * jitter;
    points.push(
      face.toWorld(
        THREE.MathUtils.clamp(u, -clampU, clampU),
        THREE.MathUtils.clamp(v, -clampV, clampV),
      ),
    );
  }

  points.push(
    face.toWorld(
      THREE.MathUtils.clamp(endU, -clampU, clampU),
      THREE.MathUtils.clamp(endV, -clampV, clampV),
    ),
  );
  return points;
}

/**
 * Generate crack patterns on a single face:
 * one main crack + branches.
 */
function generateFaceCracks(face: FaceDef, rng: () => number): THREE.Vector3[][] {
  const cracks: THREE.Vector3[][] = [];
  const hU = face.halfU * 0.85;
  const hV = face.halfV * 0.85;

  // Main crack — roughly corner-to-corner with jitter
  const mainStartU = (rng() - 0.5) * hU * 0.8;
  const mainStartV = hV * (0.5 + rng() * 0.4);
  const mainEndU = (rng() - 0.5) * hU * 1.0;
  const mainEndV = -hV * (0.4 + rng() * 0.5);

  const mainPath = generateCrackPathOnFace(
    mainStartU,
    mainStartV,
    mainEndU,
    mainEndV,
    7,
    0.28,
    face,
    rng,
  );
  cracks.push(mainPath);

  // 2–3 branches splitting off the main crack
  const branchCount = 2 + Math.floor(rng() * 2);
  for (let b = 0; b < branchCount; b++) {
    const splitIdx = 1 + Math.floor(rng() * (mainPath.length - 2));
    // Branch from a point along the main crack
    const splitT = splitIdx / mainPath.length;
    const brEndU = (rng() - 0.5) * hU * 1.4;
    const brEndV = (rng() - 0.5) * hV * 1.0;
    const branchPath = generateCrackPathOnFace(
      mainStartU + (mainEndU - mainStartU) * splitT,
      mainStartV + (mainEndV - mainStartV) * splitT,
      brEndU,
      brEndV,
      3 + Math.floor(rng() * 3),
      0.2,
      face,
      rng,
    );
    cracks.push(branchPath);
  }

  // 1 secondary crack
  if (rng() > 0.3) {
    const sStartU = (rng() - 0.5) * hU * 1.2;
    const sStartV = (rng() - 0.5) * hV * 1.2;
    const sEndU = sStartU + (rng() - 0.5) * hU * 0.9;
    const sEndV = sStartV + (rng() - 0.5) * hV * 0.9;
    cracks.push(generateCrackPathOnFace(sStartU, sStartV, sEndU, sEndV, 4, 0.18, face, rng));
  }

  return cracks;
}

/**
 * Generate cracks across ALL 6 faces of the block.
 */
function generateAllFaceCracks(seed: number) {
  const faces = getFaces();
  const allCracks: { path: THREE.Vector3[]; isMain: boolean }[] = [];

  faces.forEach((face, faceIdx) => {
    const rng = seededRandom(seed * 7919 + faceIdx * 1301 + 31);
    const faceCracks = generateFaceCracks(face, rng);
    faceCracks.forEach((path, i) => {
      allCracks.push({ path, isMain: i === 0 });
    });
  });

  return allCracks;
}

/**
 * CrackOverlay3D — renders procedural white crack lines across ALL faces
 * of a tampered block. Cracks are bright white for high contrast against
 * the dark red tampered material, and pulse for dramatic effect.
 */
export default function CrackOverlay3D({ seed, animated = true }: CrackOverlay3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  const cracks = useMemo(() => generateAllFaceCracks(seed), [seed]);

  // Pulsing opacity for dramatic effect
  useFrame((state) => {
    if (!animated || !groupRef.current) return;
    const pulse = 0.65 + Math.sin(state.clock.elapsedTime * 4) * 0.35;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Line).material) {
        const mat = (child as THREE.Line).material as THREE.Material;
        if ('opacity' in mat) {
          (mat as THREE.LineBasicMaterial).opacity = pulse;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {cracks.map(({ path, isMain }, i) => (
        <Line
          key={`crack-${i}`}
          points={path}
          color="#ffffff"
          lineWidth={isMain ? 2.8 : 1.8}
          transparent
          opacity={1}
        />
      ))}
    </group>
  );
}
