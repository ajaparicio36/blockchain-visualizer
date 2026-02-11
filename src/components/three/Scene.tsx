import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import Lighting from './Lighting';
import CameraRig from './CameraRig';
import ChainGroup from './ChainGroup';

/**
 * Scene — top-level R3F Canvas with camera, lighting, grid,
 * post-processing, and the chain group.
 */
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 12], fov: 50, near: 0.1, far: 200 }}
      style={{ background: '#0a0a0f' }}
      gl={{ antialias: true, toneMapping: 3 /* ACESFilmicToneMapping */ }}
    >
      {/* Camera auto-tracking */}
      <CameraRig />

      {/* Lighting rig */}
      <Lighting />

      {/* Subtle environment reflections */}
      <Environment preset="city" environmentIntensity={0.3} />

      {/* Ground grid — "Tron" aesthetic */}
      <Grid
        position={[0, -1.2, 0]}
        args={[100, 100]}
        cellSize={1}
        sectionSize={10}
        cellColor="#1e1e28"
        sectionColor="#00d9ff"
        cellThickness={0.6}
        sectionThickness={1}
        fadeDistance={50}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* Blockchain visualisation */}
      <ChainGroup />

      {/* Orbit controls — damping for smooth feel */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />

      {/* Post-processing: subtle bloom + vignette */}
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.5} luminanceSmoothing={0.9} />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
