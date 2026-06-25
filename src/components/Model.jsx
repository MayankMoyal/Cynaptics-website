/* eslint-disable react-hooks/exhaustive-deps */
import { useLoader } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { useRef, useEffect, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

const material = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  roughness: 0,
  metalness: 1.0,
  emissive: 0x0000ff,
  emissiveIntensity: 0.2,
  wireframe: true,
  side: THREE.DoubleSide,
  transparent: false,
  opacity: 1,
  depthWrite: true,
  depthTest: true,
});

function RotatingFBX({ url }) {
  const groupRef = useRef();
  const fbx = useLoader(FBXLoader, url);

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [fbx]);

  useEffect(() => {
    groupRef.current = fbx;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 500;
    const scale = isMobile ? 0.1 : 0.125;
    groupRef.current.scale.set(scale, scale, scale);
    groupRef.current.position.set(0, isMobile ? -10 : -15, 0);
    groupRef.current.rotation.set(0, 0, 0);
  }, [fbx]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <primitive object={fbx} />
    </group>
  );
}

const BackgroundParticles = memo(function BackgroundParticles() {
  const particleCount = 1500;

  const { geometry, mat } = useMemo(() => {
    const positionArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 1000;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
    const m = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      color: "blue",
      transparent: false,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.5,
    });
    return { geometry: geo, mat: m };
  }, []);

  return <points geometry={geometry} material={mat} />;
});

function Model() {
  return (
    <Canvas
      className="z-[-1] !h-[80%] shadow-[3px_3px_30px_3px] shadow-blue-600 lg:!h-[89%] w-full"
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)]}
      frameloop="demand"
      gl={{ depth: true, alpha: true, antialias: false }}
      camera={{ position: [60, 50, 0], near: 0.1, far: 1000 }}
    >
      <ambientLight intensity={1} />
      <BackgroundParticles />
      <Suspense fallback={null}>
        <RotatingFBX url={"./Models/brain-simple-mesh.fbx"} />
      </Suspense>
    </Canvas>
  );
}

export default Model;