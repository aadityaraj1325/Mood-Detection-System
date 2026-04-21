import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function BrainMeshWidget() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountElement.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const coreGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      emissive: 0x005f99,
      emissiveIntensity: 0.6,
      metalness: 0.25,
      roughness: 0.35,
      wireframe: true
    });
    const brainCore = new THREE.Mesh(coreGeometry, coreMaterial);
    root.add(brainCore);

    const particles = [];
    const pointGeometry = new THREE.SphereGeometry(0.12, 12, 12);
    const pointMaterial = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x2dd4bf,
      emissiveIntensity: 1,
      metalness: 0.15,
      roughness: 0.25
    });

    for (let index = 0; index < 28; index += 1) {
      const point = new THREE.Mesh(pointGeometry, pointMaterial.clone());
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.7 + Math.random() * 0.8;
      point.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      point.userData = {
        base: point.position.clone(),
        speed: 0.5 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2
      };
      particles.push(point);
      root.add(point);
    }

    const lines = [];
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.14 });
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        if (particles[i].position.distanceTo(particles[j].position) > 2.6) continue;

        const geometry = new THREE.BufferGeometry().setFromPoints([particles[i].position, particles[j].position]);
        const line = new THREE.Line(geometry, lineMaterial.clone());
        line.userData = { start: particles[i], end: particles[j], phase: Math.random() * Math.PI * 2 };
        lines.push(line);
        root.add(line);
      }
    }

    const light = new THREE.PointLight(0x00aaff, 2.4, 30);
    light.position.set(0, 0, 8);
    scene.add(light, new THREE.AmbientLight(0xffffff, 1.3));

    const handleResize = () => {
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      root.rotation.y = elapsed * 0.18;
      root.rotation.x = Math.sin(elapsed * 0.3) * 0.14;

      particles.forEach((point) => {
        const { base, speed, phase } = point.userData;
        point.position.x = base.x + Math.sin(elapsed * speed + phase) * 0.08;
        point.position.y = base.y + Math.cos(elapsed * speed + phase) * 0.08;
        point.position.z = base.z + Math.sin(elapsed * speed * 0.8 + phase) * 0.08;
      });

      lines.forEach((line) => {
        const positions = line.geometry.attributes.position.array;
        positions[0] = line.userData.start.position.x;
        positions[1] = line.userData.start.position.y;
        positions[2] = line.userData.start.position.z;
        positions[3] = line.userData.end.position.x;
        positions[4] = line.userData.end.position.y;
        positions[5] = line.userData.end.position.z;
        line.geometry.attributes.position.needsUpdate = true;
        line.material.opacity = 0.06 + Math.abs(Math.sin(elapsed * 2 + line.userData.phase)) * 0.2;
      });

      light.position.x = Math.sin(elapsed * 0.8) * 2;
      light.position.y = Math.cos(elapsed * 0.7) * 1.4;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);

    if (!reducedMotion) {
      animate();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      coreGeometry.dispose();
      coreMaterial.dispose();
      pointGeometry.dispose();
      pointMaterial.dispose();
      lines.forEach((line) => {
        line.geometry.dispose();
        line.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

export default BrainMeshWidget;
