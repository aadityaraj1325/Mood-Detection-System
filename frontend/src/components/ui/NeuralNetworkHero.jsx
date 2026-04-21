import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function NeuralNetworkHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountElement.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const nodeGroup = new THREE.Group();
    rootGroup.add(nodeGroup);

    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.28, 24, 24);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      emissive: 0x00aaff,
      emissiveIntensity: 0.8,
      roughness: 0.35,
      metalness: 0.2
    });

    for (let index = 0; index < 36; index += 1) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      const radius = 5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      node.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      node.userData = {
        basePosition: node.position.clone(),
        wobble: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      };
      nodes.push(node);
      nodeGroup.add(node);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.12
    });

    const lineSegments = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance > 4.2) continue;

        const positions = new Float32Array([
          nodes[i].position.x,
          nodes[i].position.y,
          nodes[i].position.z,
          nodes[j].position.x,
          nodes[j].position.y,
          nodes[j].position.z
        ]);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const line = new THREE.Line(geometry, lineMaterial.clone());
        line.userData = {
          start: nodes[i],
          end: nodes[j],
          phase: Math.random() * Math.PI * 2
        };
        lineSegments.push(line);
        rootGroup.add(line);
      }
    }

    const ambientLight = new THREE.AmbientLight(0x8c7bff, 1.2);
    const directionalLight = new THREE.DirectionalLight(0x2de2e6, 2.4);
    directionalLight.position.set(7, 8, 10);
    scene.add(ambientLight, directionalLight);

    const pointLight = new THREE.PointLight(0x00aaff, 3.5, 30);
    pointLight.position.set(-2, 3, 10);
    scene.add(pointLight);

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event) => {
      const rect = mountElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleResize = () => {
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    mountElement.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animateScene = () => {
      const elapsed = clock.getElapsedTime();
      rootGroup.rotation.y = elapsed * 0.18 + pointer.x * 0.12;
      rootGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.1 + pointer.y * 0.08;

      nodes.forEach((node) => {
        const { basePosition, wobble, phase } = node.userData;
        node.position.x = basePosition.x + Math.sin(elapsed * wobble + phase) * 0.18;
        node.position.y = basePosition.y + Math.cos(elapsed * wobble + phase) * 0.18;
        node.position.z = basePosition.z + Math.sin(elapsed * wobble * 0.8 + phase) * 0.14;
        node.scale.setScalar(1 + Math.sin(elapsed * 1.4 + phase) * 0.08);
      });

      lineSegments.forEach((line) => {
        const positions = line.geometry.attributes.position.array;
        positions[0] = line.userData.start.position.x;
        positions[1] = line.userData.start.position.y;
        positions[2] = line.userData.start.position.z;
        positions[3] = line.userData.end.position.x;
        positions[4] = line.userData.end.position.y;
        positions[5] = line.userData.end.position.z;
        line.geometry.attributes.position.needsUpdate = true;
        line.material.opacity = 0.08 + Math.abs(Math.sin(elapsed * 2 + line.userData.phase)) * 0.22;
      });

      pointLight.position.x = pointer.x * 4;
      pointLight.position.y = pointer.y * 3;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animateScene);
    };

    if (!reducedMotion) {
      animateScene();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      mountElement.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineSegments.forEach((line) => {
        line.geometry.dispose();
        line.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="glass-card relative min-h-[560px] overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-br from-neural-500/5 via-transparent to-pulse-500/10" />
      <div className="absolute left-8 top-8 max-w-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-neural-300/80">Neural Glass</p>
        <h2 className="font-display mt-3 text-4xl text-text-primary text-glow-neural">
          PulseMind AI
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          A living wellness interface where emotional signals move through an adaptive neural network.
        </p>
      </div>
      <div className="absolute bottom-8 left-8 flex flex-wrap gap-2">
        {['AI Mood Detection', 'Personalized Insights', '100% Private'].map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-border-glass bg-glass-ultra px-3 py-1 text-xs text-text-primary backdrop-blur-xl"
          >
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default NeuralNetworkHero;
