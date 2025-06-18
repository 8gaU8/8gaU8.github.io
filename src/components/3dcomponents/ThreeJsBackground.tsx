import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three-stdlib";
import { genCube } from "./genObject";

export function ThreeJsBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // サイズ取得
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // シーン、カメラ、レンダラー
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);

    const effect = new AsciiEffect(renderer, " .:-+*=%@#", {
      alpha: true,
      invert: false,
      resolution: 0.3,
    });
    effect.setSize(width, height);
    effect.domElement.style.backgroundColor = "transparent";
    effect.domElement.style.fontWeight = "bold";
    mount.appendChild(effect.domElement);

    const cube = genCube();
    scene.add(cube);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(2, 2, 0);
    scene.add(pointLight1);

    // テーマに応じた色をセット
    function setEffectColor() {
      const isDark = document.documentElement.classList.contains("theme-dark");
      // CSS変数から色を取得
      let color = "#007700"; // デフォルトの色
      if (isDark) color = "#00ff00";
      console.log("Effect color:", color, "isDark:", isDark);
      effect.domElement.style.color = color.trim();
    }
    setEffectColor();

    // テーマ切り替え監視
    const observer = new MutationObserver(() => setEffectColor());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let frameId: number;
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      effect.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    function onWindowResize() {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      effect.setSize(newWidth, newHeight);
    }
    window.addEventListener("resize", onWindowResize);

    // クリーンアップ
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", onWindowResize);
      mount.removeChild(effect.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        aspectRatio: "5 / 4", // 例: 5:4 のアスペクト比を常に維持
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
