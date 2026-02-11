/**
 * Lighting — all light sources for the 3D scene.
 *
 * Follows the DESIGN_STYLE.md specification:
 *   - Ambient fill (#0a0a0f)
 *   - Directional key light
 *   - Cyan point light (rim/left)
 *   - Purple point light (accent/right)
 */
export default function Lighting() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.3} color="#0a0a0f" />

      {/* Key light — main shadow caster */}
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.7}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cyan accent from the left */}
      <pointLight position={[-5, 8, -8]} intensity={0.6} color="#00d9ff" />

      {/* Purple accent from the right */}
      <pointLight position={[8, 5, 8]} intensity={0.4} color="#a855f7" />
    </>
  );
}
