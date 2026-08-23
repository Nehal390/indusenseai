import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductItem } from '../../types';
import { Network, Zap, Cpu, Sparkles } from 'lucide-react';

interface Node3D {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  z: number;
  color: number;
  product?: ProductItem;
  mesh: THREE.Mesh;
}

export const ThreeGraphScene: React.FC<{
  products: ProductItem[];
  onSelectProduct?: (product: ProductItem) => void;
}> = ({ products, onSelectProduct }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<ProductItem | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Color palette by category
    const categoryColors: Record<string, number> = {
      'Motors & Drives': 0x06b6d4, // cyan
      'Bearings & Bushings': 0x3b82f6, // blue
      'Pumps & Hydraulics': 0x8b5cf6, // violet
      'Pneumatic Actuators': 0x10b981, // emerald
      'Industrial Sensors': 0xf59e0b, // amber
    };

    const nodeGeometry = new THREE.SphereGeometry(0.75, 24, 24);
    const nodes: Node3D[] = [];

    // Create Category Hubs & Products in 3D clusters
    const sampleNodes = products.slice(0, 16);
    const count = sampleNodes.length;

    sampleNodes.forEach((p, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const radius = 7.5 + (idx % 3) * 1.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.65);
      const z = (Math.sin(idx * 1.8) * 4);

      const color = categoryColors[p.category] || 0x38bdf8;
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.8,
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.set(x, y, z);
      (mesh as any).userData = { product: p };
      graphGroup.add(mesh);

      // Outer ring for node
      const ringGeo = new THREE.RingGeometry(0.9, 1.05, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color, wireframe: true, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.add(ringMesh);

      nodes.push({
        id: p.id,
        label: p.cleanName,
        category: p.category,
        x, y, z,
        color,
        product: p,
        mesh,
      });
    });

    // Create Connecting Edges (Lines) between similar / same-category nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y, n1.z - n2.z);

        if (n1.category === n2.category || dist < 8) {
          const points = [new THREE.Vector3(n1.x, n1.y, n1.z), new THREE.Vector3(n2.x, n2.y, n2.z)];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMaterial);
          graphGroup.add(line);
        }
      }
    }

    // Lighting
    const ambient = new THREE.AmbientLight(0x0f172a, 3.0);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // Raycasting for node selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as any;
        if (hit.userData?.product) {
          setHoveredNode(hit.userData.product.cleanName);
        }
      } else {
        setHoveredNode(null);
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as any;
        if (hit.userData?.product) {
          setSelectedNode(hit.userData.product);
          onSelectProduct?.(hit.userData.product);
        }
      }
    };

    mount.addEventListener('mousemove', onPointerMove);
    mount.addEventListener('click', onPointerDown);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) * 0.001;

      graphGroup.rotation.y = t * 0.08;
      graphGroup.rotation.x = Math.sin(t * 0.05) * 0.05;

      nodes.forEach((n, i) => {
        n.mesh.rotation.y = t * 0.5 + i;
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
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousemove', onPointerMove);
      mount.removeEventListener('click', onPointerDown);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [products]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-zinc-950/90 border border-zinc-800/80 overflow-hidden backdrop-blur-xl">
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Top telemetry bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 backdrop-blur-md">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-zinc-300">Semantic Topology Graph</span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            {products.length} Node Vertices
          </span>
        </div>

        {hoveredNode && (
          <div className="bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs px-3 py-1.5 rounded-xl font-mono animate-fade-in backdrop-blur-md">
            Target: {hoveredNode}
          </div>
        )}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 max-w-md bg-zinc-900/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-xl animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                {selectedNode.category}
              </span>
              <h4 className="text-sm font-semibold text-zinc-100 mt-1">{selectedNode.cleanName}</h4>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{selectedNode.aiDescription}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-zinc-500 hover:text-zinc-300 text-sm p-1"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800 text-xs">
            <span className="font-mono text-zinc-400">Price: <strong className="text-zinc-100">${selectedNode.price.toLocaleString()}</strong></span>
            <button
              onClick={() => onSelectProduct?.(selectedNode)}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-medium text-xs rounded-lg transition"
            >
              Open Product Profile
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800">
        Click node to inspect • Real-time vector layout
      </div>
    </div>
  );
};
