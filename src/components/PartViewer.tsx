"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Environment } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { useInView } from "framer-motion";
import dynamic from 'next/dynamic';

// Type for useFrame state
interface FrameState {
  clock: {
    getElapsedTime: () => number;
  };
}

// 3D model of a metallic cylinder/bracket
function PartModel() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  
  // Animate the rotation
  useFrame((state: FrameState) => {
    if (meshRef.current) {
      // Rotate the mesh smoothly
      meshRef.current.rotation.y += 0.005;
      
      // Optional: Slightly change the rotation on x axis based on time
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Simple cylinder as placeholder */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 2.5, 32, 1, false]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#888"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Add some details to make it look more like a machine part */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#777" metalness={0.9} roughness={0.4} />
      </mesh>
      
      <mesh position={[0, -1.4, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#777" metalness={0.9} roughness={0.4} />
      </mesh>
      
      {/* Drill holes */}
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh 
          key={i}
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.5, 
            0, 
            Math.cos((angle * Math.PI) / 180) * 0.5
          ]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// Scene setup with lights and controls
function Scene() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Center the model */}
      <Center>
        <PartModel />
      </Center>
      
      {/* Camera controls - disable zoom */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      {/* Environment map for realistic reflections */}
      <Environment preset="studio" />
    </>
  );
}

// Main component with responsive container
function PartViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [hasMounted, setHasMounted] = useState(false);
  
  // Prevent hydration issues
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-[300px] md:h-[400px] bg-slate-900/60 rounded-lg overflow-hidden flex items-center justify-center"
      >
        <div className="text-slate-500 animate-pulse">Loading 3D Viewer...</div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-[300px] md:h-[400px] bg-slate-900/60 rounded-lg overflow-hidden"
    >
      {isInView && (
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true }}
          dpr={[1, 2]} // Responsive resolution
        >
          <Scene />
        </Canvas>
      )}
    </div>
  );
}

// Use dynamic import with SSR disabled for the 3D component
const DynamicPartViewer = dynamic(() => Promise.resolve(PartViewer), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] bg-slate-900/60 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-slate-500">Loading 3D Viewer...</div>
    </div>
  ),
});

export default DynamicPartViewer;

// Import line for page.tsx:
// import PartViewer from "@/components/PartViewer"; 