/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import { useLoader } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { useRef, useEffect, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls, Stars, directionalLight } from "@react-three/drei";
import { Suspense } from "react";

function RotatingFBX({ url }) {
  const groupRef = useRef();

  const matAluMedium = new THREE.MeshStandardMaterial({
    color: 0x0000ff, // bright blue color
    roughness: 0, // Increase roughness to add more texture to the surface
    metalness: 1.01, // Slightly decrease metalness to make the material less reflective
    emissive: 0x0000ff, // Change emissive color to white to make it brighter
    emissiveIntensity: 0.2, // Increase emissive intensity to make it even brighter
    envMapIntensity: 2, // Increase envMap intensity to add more reflection
    refractionRatio: 1.7, // Increase refractionRatio for more realistic refraction
    clearcoat: 0.5, // Decrease clearcoat to make it less shiny
    clearcoatRoughness: 0.5, // Decrease clearcoat roughness to make it smoother
    side: THREE.DoubleSide, // Set both sides to be visible for more detail
    transparent: false, // Make the material fully opaque
    opacity: 1, // Set opacity to 1
    depthWrite: true,
    depthTest: true,
    polygonOffset: false, // Disable polygon offset for smoother edges
    alphaMap: null,
    aoMap: null,
    aoMapIntensity: 10,
    displacementBias: 10,
    displacementMap: null,
    displacementScale: 0,
    gradientMap: null,
    lightMap: null,
    lightMapIntensity: 10,
    map: null,
    morphNormals: true,
    morphTargets: true,
    normalMap: null,
    normalMapType: THREE.TangentSpaceNormalMap,
    normalScale: new THREE.Vector2(1, 1),
    roughnessMap: null,
    skinning: true,
    toneMapped: true,
    vertexColors: false,
    wireframe: true,
    clearcoatNormalScale: new THREE.Vector2(1, 1),
    flatShading: false, // Disable flat shading for more realistic lighting
    metalnessMap: null,
    roughnessMap: null,
    envMap: null,
    displacementMap: null,
    displacementScale: 0,
    displacementBias: 0,
    normalMap: null,
    normalScale: new THREE.Vector2(1, 1),
    refractionRatio: 1.7,
    transmission: 1, // Set transmission to 1 for more realistic transparency
    reflectivity: 1, // Set reflectivity to 1 for more realistic reflections

    shininess: 100, // Increase shininess for a more polished look
    specular: 0x000033, // Add a white specular highlight
    combine: THREE.MultiplyOperation, // Set the blending mode to Multiply
    depthFunc: THREE.LessEqualDepth, // Change the depth function to prevent z-fighting
    fog: true, // Enable fog for depth perception and atmospheric effects
    shadowSide: THREE.FrontSide,
  });

  // Load the FBX file using useLoader
  const fbx = useLoader(FBXLoader, url);
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = matAluMedium;
      child.castShadow = true; // enable shadow casting for the mesh
      child.receiveShadow = true; // enable shadow receiving for the mesh
    }
  });

  // Set the group reference and scale it down
  useEffect(() => {
    groupRef.current = fbx;

    if (innerWidth < 500) {
      groupRef.current.scale.set(0.1 / 1, 0.1 / 1, 0.1 / 1); // set the scale to 0.75
      groupRef.current.position.set(0, -10, 0);
    } else {
      groupRef.current.scale.set(0.1 / 0.8, 0.1 / 0.8, 0.1 / 0.8); // set the scale to 0.75
      groupRef.current.position.set(0, -15, 0);
    }

    // set the position to 0,0,0
    groupRef.current.rotation.set(0, 0, 0);
    // Add the mesh to the group
    groupRef.current.add(
      new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), matAluMedium)
    );
  }, [fbx, matAluMedium]);

  // Rotate the group every frame
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
  
  const { geometry, material } = useMemo(() => {
    const positionArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 1000;
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );

    const mat = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      color: "blue",
      transparent: false,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/sprites/disc.png"
      ),
      alphaTest: 0.5,
    });

    return { geometry: bufferGeometry, material: mat };
  }, []);

  return <points geometry={geometry} material={material} />;
});

function Model() {
  return (
    <Canvas
      className=" z-[-1] !h-[80%] shadow-[3px_3px_30px_3px] shadow-blue-600 lg:!h-[89%]  w-full  "
      dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
      frameloop="demand"
      gl={{
        depth: true,
        alpha: true,
      }}
      camera={{ position: [60, 50, 0], near: 0.1, far: 1000 }}
      backgroundcolor={"#e9e9e9"}
    >
      {/* Add an ambient light to the scene */}
      <ambientLight intensity={1} />

      {/* Add a ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={1} />
      </mesh>

      {/* Add a torus knot */}
      <BackgroundParticles />

      {/* Add the rotating FBX */}
      <RotatingFBX url={"./Models/brain-simple-mesh.fbx"} />
    </Canvas>
  );
}

export default Model;
