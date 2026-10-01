'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface PackedItem {
  name: string;
  position: [number, number, number];
  dimension?: [number, number, number];
}

interface TruckDimensions {
  width: number;
  height: number;
  depth: number;
}

interface ViewerProps {
  truck: TruckDimensions;
  packedItems: PackedItem[];
  allManifestItems: { name: string; width: number; height: number; depth: number }[];
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 75%, 60%)`;
};

const SCALE = 0.01;

export default function Viewer3D({ truck, packedItems, allManifestItems }: ViewerProps) {
  const truckW = truck.width * SCALE;
  const truckH = truck.height * SCALE;
  const truckD = truck.depth * SCALE;

  return (
    <div className="w-full h-[520px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-2xl backdrop-blur-md">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 backdrop-blur pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        3D Engine • Left Click: Rotate • Right Click: Pan • Scroll: Zoom
      </div>

      <Canvas shadows camera={{ position: [truckW * 1.6, truckH * 2.0, truckD * 1.6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 15]} intensity={1.2} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.4} />

        {/* Global centering so the container rotates around its midpoint */}
        <group position={[-truckW / 2, 0, -truckD / 2]}>
          
          {/* Container wireframe */}
          <group position={[truckW / 2, truckH / 2, truckD / 2]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(truckW, truckH, truckD)]} />
              <lineBasicMaterial color="#38bdf8" linewidth={2} />
            </lineSegments>
            <mesh position={[0, -truckH / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[truckW, truckD]} />
              <meshStandardMaterial color="#0f172a" transparent opacity={0.7} />
            </mesh>
          </group>

          {/* Packed Items */}
          {packedItems.map((item, idx) => {
            const manifestFallback = allManifestItems.find((m) => m.name === item.name) || {
              width: 60,
              height: 60,
              depth: 60,
            };

            // Use the rotated dimension returned by the Python algorithm
            const w = (item.dimension ? item.dimension[0] : manifestFallback.width) * SCALE;
            const h = (item.dimension ? item.dimension[1] : manifestFallback.height) * SCALE;
            const d = (item.dimension ? item.dimension[2] : manifestFallback.depth) * SCALE;

            const posX = item.position[0] * SCALE + w / 2;
            const posY = item.position[1] * SCALE + h / 2;
            const posZ = item.position[2] * SCALE + d / 2;

            const color = stringToColor(item.name);

            return (
              <group key={idx} position={[posX, posY, posZ]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[w, h, d]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.1}
                    transparent
                    opacity={0.92}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
                  <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
                </lineSegments>
              </group>
            );
          })}
        </group>

        {/* Floor grid */}
        <Grid
          position={[0, -0.01, 0]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={1}
          cellColor="#334155"
          sectionSize={2}
          sectionThickness={1.5}
          sectionColor="#0284c7"
          fadeDistance={25}
          fadeStrength={1.5}
        />

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}