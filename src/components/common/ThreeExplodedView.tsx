import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCcw, ZoomIn, Info } from 'lucide-react';

interface ExplodedPart {
  name: string;
  materialSpec: string;
  tolerance: string;
  mesh: THREE.Object3D;
  initialPos: THREE.Vector3;
  targetOffset: THREE.Vector3;
}

export const ThreeExplodedView: React.FC<{ productName?: string }> = ({
  productName = 'Siemens SIMOTICS GP 184T Industrial Drive Assembly',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explosionFactor, setExplosionFactor] = useState<number>(0.65);
  const [activePartIndex, setActivePartIndex] = useState<number | null>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const partsRef = useRef<ExplodedPart[]>([]);

  const partDetails = [
    { name: 'Cast-Iron Drive-End Endbell', material: 'EN-GJL-200 Cast Iron', tolerance: 'ISO JS6', role: 'Main structural bearing housing' },
    { name: 'Deep Groove Radial Ball Bearing', material: '100Cr6 High-Carbon Chrome Steel', tolerance: 'ABEC-5 / DIN P5', role: 'High-speed radial support' },
    { name: 'Magnetic Core Stator & Windings', material: 'M400-50A Silicon Steel + Class H Enamel', tolerance: 'NEMA MG1', role: 'Electromagnetic field generation' },
    { name: 'Precision Ground Rotor Assembly', material: 'Die-cast Aluminum Squirrel Cage', tolerance: 'ISO G2.5 Dynamic Balance', role: 'Torque conversion & shaft drive' },
    { name: 'Non-Drive End Shield & Seal', material: 'Viton FKM Double-Lip Seal', tolerance: 'IP55 Ingress', role: 'Thermal expansion compensation' },
  ];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(10, 8, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // Materials
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.85, roughness: 0.35 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.25 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.95, roughness: 0.1 });
    const cyanWireMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });

    // 1. Front Endbell
    const frontGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.8, 32);
    const frontMesh = new THREE.Mesh(frontGeo, ironMat);
    frontMesh.rotation.z = Math.PI / 2;
    assemblyGroup.add(frontMesh);

    // 2. Front Bearing
    const frontBearingGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
    const frontBearingMesh = new THREE.Mesh(frontBearingGeo, chromeMat);
    frontBearingMesh.rotation.y = Math.PI / 2;
    assemblyGroup.add(frontBearingMesh);

    // 3. Stator Casing & Coils
    const statorGroup = new THREE.Group();
    const statorCasingGeo = new THREE.CylinderGeometry(2.8, 2.8, 4.0, 32, 1, true);
    const statorCasingMesh = new THREE.Mesh(statorCasingGeo, ironMat);
    statorCasingMesh.rotation.z = Math.PI / 2;
    statorGroup.add(statorCasingMesh);

    const statorCoilGeo = new THREE.TorusGeometry(2.4, 0.35, 12, 32);
    const statorCoilMesh1 = new THREE.Mesh(statorCoilGeo, copperMat);
    statorCoilMesh1.rotation.y = Math.PI / 2;
    statorCoilMesh1.position.x = -1.6;
    statorGroup.add(statorCoilMesh1);

    const statorCoilMesh2 = new THREE.Mesh(statorCoilGeo, copperMat);
    statorCoilMesh2.rotation.y = Math.PI / 2;
    statorCoilMesh2.position.x = 1.6;
    statorGroup.add(statorCoilMesh2);
    assemblyGroup.add(statorGroup);

    // 4. Rotor & Central Shaft
    const rotorGroup = new THREE.Group();
    const rotorCoreGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.2, 32);
    const rotorCoreMesh = new THREE.Mesh(rotorCoreGeo, ironMat);
    rotorCoreMesh.rotation.z = Math.PI / 2;
    rotorGroup.add(rotorCoreMesh);

    const shaftGeo = new THREE.CylinderGeometry(0.55, 0.55, 9.0, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, chromeMat);
    shaftMesh.rotation.z = Math.PI / 2;
    rotorGroup.add(shaftMesh);
    assemblyGroup.add(rotorGroup);

    // 5. Rear End Shield
    const rearGeo = new THREE.CylinderGeometry(2.6, 2.4, 0.8, 32);
    const rearMesh = new THREE.Mesh(rearGeo, ironMat);
    rearMesh.rotation.z = Math.PI / 2;
    assemblyGroup.add(rearMesh);

    // Track parts for explosion calculation
    partsRef.current = [
      {
        name: partDetails[0].name,
        materialSpec: partDetails[0].material,
        tolerance: partDetails[0].tolerance,
        mesh: frontMesh,
        initialPos: new THREE.Vector3(2.5, 0, 0),
        targetOffset: new THREE.Vector3(5.5, 0, 0),
      },
      {
        name: partDetails[1].name,
        materialSpec: partDetails[1].material,
        tolerance: partDetails[1].tolerance,
        mesh: frontBearingMesh,
        initialPos: new THREE.Vector3(2.0, 0, 0),
        targetOffset: new THREE.Vector3(3.6, 0, 0),
      },
      {
        name: partDetails[2].name,
        materialSpec: partDetails[2].material,
        tolerance: partDetails[2].tolerance,
        mesh: statorGroup,
        initialPos: new THREE.Vector3(0, 0, 0),
        targetOffset: new THREE.Vector3(0, 0, 0),
      },
      {
        name: partDetails[3].name,
        materialSpec: partDetails[3].material,
        tolerance: partDetails[3].tolerance,
        mesh: rotorGroup,
        initialPos: new THREE.Vector3(0, 0, 0),
        targetOffset: new THREE.Vector3(0, 2.5, 2.5),
      },
      {
        name: partDetails[4].name,
        materialSpec: partDetails[4].material,
        tolerance: partDetails[4].tolerance,
        mesh: rearMesh,
        initialPos: new THREE.Vector3(-2.5, 0, 0),
        targetOffset: new THREE.Vector3(-5.5, 0, 0),
      },
    ];

    // Lighting
    const ambient = new THREE.AmbientLight(0x0f172a, 3.0);
    scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 3.0);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 2.0);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) * 0.001;

      assemblyGroup.rotation.y = t * 0.2;

      // Update positions based on explosionFactor state
      partsRef.current.forEach((part) => {
        part.mesh.position.lerpVectors(
          part.initialPos,
          new THREE.Vector3().addVectors(part.initialPos, part.targetOffset),
          explosionFactor
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [explosionFactor]);

  return (
    <div className="relative w-full rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-5 overflow-hidden backdrop-blur-xl">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-cyan-400 uppercase">3D CAD Exploded Telemetry</span>
          </div>
          <h3 className="text-base font-semibold text-zinc-100 mt-1">{productName}</h3>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExplosionFactor(prev => (prev > 0.1 ? 0 : 0.75))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{explosionFactor > 0.1 ? 'Collapse Assembly' : 'Explode View'}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[360px] my-2">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Floating Telemetry Annotation Badge */}
        <div className="absolute top-3 left-3 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 max-w-xs backdrop-blur-md">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Sub-assembly Component</div>
          <div className="text-xs font-semibold text-cyan-300 mt-0.5">
            {activePartIndex !== null ? partDetails[activePartIndex].name : partDetails[0].name}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            <span className="text-zinc-500">Spec:</span> {activePartIndex !== null ? partDetails[activePartIndex].material : partDetails[0].material}
          </div>
          <div className="text-[11px] text-zinc-400">
            <span className="text-zinc-500">Tolerance:</span> {activePartIndex !== null ? partDetails[activePartIndex].tolerance : partDetails[0].tolerance}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800">
          GL Render Engine v4.2 • High Precision
        </div>
      </div>

      {/* Explosion Control Slider & Layer Picker */}
      <div className="pt-4 border-t border-zinc-800/60 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Explosion Separation Distance:
          </span>
          <span className="font-mono text-cyan-400">{Math.round(explosionFactor * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={explosionFactor}
          onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        {/* Sub-assembly layers pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {partDetails.map((part, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActivePartIndex(idx)}
              onMouseLeave={() => setActivePartIndex(null)}
              className={`text-[11px] px-2.5 py-1 rounded-md border transition ${
                activePartIndex === idx
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
