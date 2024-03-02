import { useRef } from "react";

import { easing } from "maath";

import { ReactThreeFiber, useFrame } from "@react-three/fiber";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { Mesh, PlaneGeometry, ShaderMaterial, Texture } from "three";

type SoftShadowMaterialProps = {
  map: Texture;
  color?: ReactThreeFiber.Color;
  alphaTest?: number;
  blend?: number;
};

interface AccumulativeContext {
  lights: Map<any, any>;
  temporal: boolean;
  frames: number;
  blend: number;
  count: number;
  /** Returns the plane geometry onto which the shadow is cast */
  getMesh: () => Mesh<PlaneGeometry, SoftShadowMaterialProps & ShaderMaterial>;
  /** Resets the buffers, starting from scratch */
  reset: () => void;
  /** Updates the lightmap for a number of frames accumulartively */
  update: (frames?: number) => void;
}

const Backdrop = () => {
  const shadow = useRef<AccumulativeContext | null>(null);

  return (
    <AccumulativeShadows
      position={[0, 0, -0.14]}
      ref={shadow}
      temporal
      frames={60}
      alphaTest={0.32}
      scale={8}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <RandomizedLight
        amount={4}
        radius={10}
        intensity={0.75}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.55}
        ambient={0.75}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;
