"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** The gold compass coin from the landing page (public/models/coin.glb). */
export const COIN_URL = "/models/coin.glb";

/**
 * What a driver can steer, in radians / units. GSAP mutates this ref; the scene reads it every frame,
 * so nothing re-renders React at 60fps. `spin` is an idle turn in revolutions per second (0 = held),
 * exactly like the landing page's stage coin.
 */
export type CoinPose = { rotY: number; spin: number; bob: number; scale: number };
export const idlePose = (): CoinPose => ({ rotY: 0, spin: 0.18, bob: 0.04, scale: 1 });

/** Soft studio light from a room environment (no network fetch). */
function Studio() {
  const gl = useThree((s) => s.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  useFrame(({ scene }) => { if (scene.environment !== env) scene.environment = env; });
  return null;
}

function Model({ pose }: { pose: MutableRefObject<CoinPose> }) {
  const { scene } = useGLTF(COIN_URL);
  const group = useRef<THREE.Group>(null);
  const idle = useRef(0);
  // centre the asset, fit it to ~2.2 units and turn its thin axis to the camera so it rests face-on
  const prepared = useMemo(() => {
    const root = scene.clone(true), box = new THREE.Box3().setFromObject(root), size = new THREE.Vector3(), centre = new THREE.Vector3();
    box.getSize(size); box.getCenter(centre); root.position.sub(centre);
    const holder = new THREE.Group(); holder.add(root);
    const thin = [size.x, size.y, size.z].indexOf(Math.min(size.x, size.y, size.z));
    if (thin === 0) holder.rotation.y = Math.PI / 2;
    if (thin === 1) holder.rotation.x = Math.PI / 2;
    holder.scale.setScalar(2.2 / Math.max(size.x, size.y, size.z));
    root.traverse((o) => { if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) o.material.envMapIntensity = 1.1; });
    return holder;
  }, [scene]);
  useFrame((state, delta) => {
    const g = group.current; if (!g) return;
    const p = pose.current;
    if (p.spin > 0) idle.current += delta * p.spin * Math.PI * 2;
    else if (idle.current !== 0) {
      // the scroll has taken over: wind the idle turn back to face-on the short way round (~¼ s)
      let a = idle.current % (Math.PI * 2);
      if (a > Math.PI) a -= Math.PI * 2;
      if (a < -Math.PI) a += Math.PI * 2;
      a *= Math.max(0, 1 - delta * 4);
      idle.current = Math.abs(a) < 1e-3 ? 0 : a;
    }
    g.rotation.set(0, p.rotY + idle.current, 0);
    g.position.y = p.bob ? Math.sin(state.clock.elapsedTime * 1.4) * p.bob : 0;
    g.scale.setScalar(p.scale);
  });
  return <group ref={group}><primitive object={prepared} /></group>;
}

useGLTF.preload(COIN_URL);

/** A transparent canvas with the coin; size it with the wrapper (the coin fills ~74% of the box). */
export default function Coin3D({ pose, active = true, className = "" }: { pose: MutableRefObject<CoinPose>; active?: boolean; className?: string }) {
  const phone = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <Canvas frameloop={active ? "always" : "never"} dpr={phone ? [1, 1.5] : [1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 32 }}
        gl={{ alpha: true, antialias: !phone, powerPreference: phone ? "default" : "high-performance" }} style={{ background: "transparent" }}>
        <Studio />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, 3]} intensity={0.5} />
        <Model pose={pose} />
      </Canvas>
    </div>
  );
}
