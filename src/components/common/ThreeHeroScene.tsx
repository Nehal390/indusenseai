import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Group for the entire industrial assembly
    const industrialGroup = new THREE.Group();
    scene.add(industrialGroup);

    // Dark metallic materials with subtle cyan and electric blue highlights
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x161b22,
      metalness: 0.9,
      roughness: 0.25,
    });

    const brushedChromeMat = new THREE.MeshStandardMaterial({
      color: 0x4a5568,
      metalness: 0.95,
      roughness: 0.15,
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const electricBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });

    // 1. Central Rotor Core Cylinder
    const rotorGeo = new THREE.CylinderGeometry(2.4, 2.4, 6.5, 32);
    const rotorMesh = new THREE.Mesh(rotorGeo, darkMetalMat);
    industrialGroup.add(rotorMesh);

    // 2. Wireframe Telemetry Cage around Rotor
    const cageGeo = new THREE.CylinderGeometry(2.6, 2.6, 6.8, 16, 4, true);
    const cageMesh = new THREE.Mesh(cageGeo, glowCyanMat);
    industrialGroup.add(cageMesh);

    // 3. Central Precision Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.8, 0.8, 11, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, brushedChromeMat);
    industrialGroup.add(shaftMesh);

    // 4. Planetary Gear Ring / Outer Casing Ribs
    const ringGeo = new THREE.TorusGeometry(4.2, 0.45, 16, 64);
    const ringMesh1 = new THREE.Mesh(ringGeo, brushedChromeMat);
    ringMesh1.rotation.x = Math.PI / 2;
    ringMesh1.position.y = 1.8;
    industrialGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, brushedChromeMat);
    ringMesh2.rotation.x = Math.PI / 2;
    ringMesh2.position.y = -1.8;
    industrialGroup.add(ringMesh2);

    // 5. Outer Telemetry Orbit Rings
    const orbitRingGeo1 = new THREE.TorusGeometry(6.2, 0.04, 8, 80);
    const orbitRingMesh1 = new THREE.Mesh(orbitRingGeo1, glowCyanMat);
    orbitRingMesh1.rotation.x = Math.PI / 3;
    industrialGroup.add(orbitRingMesh1);

    const orbitRingGeo2 = new THREE.TorusGeometry(7.5, 0.05, 8, 80);
    const orbitRingMesh2 = new THREE.Mesh(orbitRingGeo2, electricBlueMat);
    orbitRingMesh2.rotation.y = Math.PI / 4;
    industrialGroup.add(orbitRingMesh2);

    // 6. Planetary Bearing Spheres / Nodes
    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const sphereCount = 8;
    const bearingNodes: THREE.Mesh[] = [];
    for (let i = 0; i < sphereCount; i++) {
      const angle = (i / sphereCount) * Math.PI * 2;
      const sphere = new THREE.Mesh(sphereGeo, brushedChromeMat);
      sphere.position.set(Math.cos(angle) * 4.2, 1.8, Math.sin(angle) * 4.2);
      industrialGroup.add(sphere);
      bearingNodes.push(sphere);
    }

    // 7. Data Stream Particles in 3D Space
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;

      // Cyan / Blue / White gradient
      const isCyan = Math.random() > 0.4;
      particleColors[i] = isCyan ? 0.0 : 0.4;
      particleColors[i + 1] = isCyan ? 0.85 : 0.6;
      particleColors[i + 2] = 1.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Studio Volumetric Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x00f2fe, 3.5);
    cyanKeyLight.position.set(10, 15, 12);
    scene.add(cyanKeyLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    blueRimLight.position.set(-12, -8, -10);
    scene.add(blueRimLight);

    const purpleFillLight = new THREE.PointLight(0x818cf8, 2.0, 30);
    purpleFillLight.position.set(0, -6, 8);
    scene.add(purpleFillLight);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation
      industrialGroup.rotation.y = elapsedTime * 0.25 + mouseX * 1.5;
      industrialGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15 + mouseY * 1.2;
      industrialGroup.rotation.z = Math.cos(elapsedTime * 0.1) * 0.08;

      // Inner components counter-rotation
      cageMesh.rotation.y = -elapsedTime * 0.5;
      orbitRingMesh1.rotation.z = elapsedTime * 0.4;
      orbitRingMesh2.rotation.x = -elapsedTime * 0.3;

      // Orbit particles gently
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[640px] select-none pointer-events-none">
      <div ref={mountRef} className="w-full h-full" />
      {/* Subtle depth lighting vignette */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-zinc-950/20 to-zinc-950" />
    </div>
  );
};
