"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 1000;
const MAX_R = 160;

export function ParticleGlobe() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 300);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 80 + Math.random() * 80;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const speed = i % 7 === 0 ? 0.08 : 0.04;
      velocities[i * 3] = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    const curve = new THREE.EllipseCurve(0, 0, 180, 80, 0, Math.PI * 2);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
    const ring = new THREE.Line(
      ringGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
    );
    ring.rotation.x = Math.PI * 0.2;
    ring.rotation.z = Math.PI * 0.1;
    scene.add(ring);

    const mouse = new THREE.Vector2(10, 10);
    const cursor = { x: 0, y: 0, tx: 0, ty: 0 };
    const raycaster = new THREE.Raycaster();

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      cursor.tx = event.clientX - 10;
      cursor.ty = event.clientY - 10;
    };

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    let frame = 0;
    let raf = 0;
    const applyMouseForce = () => {
      raycaster.setFromCamera(mouse, camera);
      const attr = particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        const worldPos = new THREE.Vector3(attr.getX(i), attr.getY(i), attr.getZ(i)).applyMatrix4(particles.matrixWorld);
        const d = raycaster.ray.distanceToPoint(worldPos);
        if (d < 60) {
          const dir = worldPos.sub(raycaster.ray.origin).normalize();
          velocities[i * 3] += dir.x * 0.3;
          velocities[i * 3 + 1] += dir.y * 0.3;
          velocities[i * 3 + 2] += dir.z * 0.3;
        }
      }
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame += 1;
      const attr = particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        let x = attr.getX(i) + velocities[i * 3];
        let y = attr.getY(i) + velocities[i * 3 + 1];
        let z = attr.getZ(i) + velocities[i * 3 + 2];
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist > MAX_R) {
          velocities[i * 3] *= -1;
          velocities[i * 3 + 1] *= -1;
          velocities[i * 3 + 2] *= -1;
          x *= 0.995;
          y *= 0.995;
          z *= 0.995;
        }
        velocities[i * 3] *= 0.99;
        velocities[i * 3 + 1] *= 0.99;
        velocities[i * 3 + 2] *= 0.99;
        attr.setXYZ(i, x, y, z);
      }
      attr.needsUpdate = true;
      if (frame % 2 === 0) applyMouseForce();
      ring.rotation.y += 0.002;
      scene.rotation.y += 0.001;
      cursor.x += (cursor.tx - cursor.x) * 0.12;
      cursor.y += (cursor.ty - cursor.y) * 0.12;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      host.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={hostRef} className="absolute right-0 top-0 z-0 h-screen w-[60vw] opacity-0 motion-safe:animate-[fadeIn_800ms_200ms_forwards]" />
      <div ref={cursorRef} className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-5 w-5 rounded-full border border-white/40 lg:block" />
      <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
    </>
  );
}
