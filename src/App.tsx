import Scene from './components/three/Scene';
import BlockDetailPanel from './components/blockchain/BlockDetailPanel';
import AddBlockForm from './components/blockchain/AddBlockForm';
import ValidationBadge from './components/blockchain/ValidationBadge';

/**
 * App — root layout shell.
 *
 * Full-viewport 3D canvas with floating HUD overlays:
 *   - ValidationBadge  (top-left)
 *   - BlockDetailPanel (top-right, when a block is selected)
 *   - AddBlockForm     (bottom-center)
 */
function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void-black">
      {/* 3D Canvas — fills entire viewport */}
      <Scene />

      {/* HUD Overlays */}
      <ValidationBadge />
      <BlockDetailPanel />
      <AddBlockForm />
    </div>
  );
}

export default App;
