import { useEffect, useRef } from "react";
import * as THREE from "three";
import faceInfos from "./face_mesh_data.json";

type PortraitImageWithMeshImplProps = {
  imageUrl: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function PortraitImageWithMeshImpl({
  imageUrl,
  width,
  height,
  alt = "",
}: PortraitImageWithMeshImplProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // w, hのデフォルト値を保証
    const w = width || 480;
    const h = height || 620;
    const dpr = window.devicePixelRatio || 1;

    // PlaneGeometryのサイズを画像のアスペクト比に合わせる
    const aspect = w / h;
    const planeHeight = 1;
    const planeWidth = aspect * planeHeight;

    // OrthographicCameraに変更
    let left = -planeWidth / 2;
    let right = planeWidth / 2;
    let top = planeHeight / 2;
    let bottom = -planeHeight / 2;
    const near = 0.1;
    const far = 10;
    const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w * dpr, h * dpr, false);
    renderer.domElement.style.width = w + "px";
    renderer.domElement.style.height = h + "px";
    renderer.domElement.style.borderRadius = "1.5rem";
    renderer.domElement.style.boxShadow = "var(--shadow-md)";
    mount.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const material = new THREE.MeshBasicMaterial({ map: texture});
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
    });

    // ランドマークをPlane上に配置
    console.log(faceInfos);
    const landmarks = faceInfos.landmarks;
    const points = landmarks.map((landmark) => {
      const x = landmark.x - 0.5;
      const y = 0.5 - landmark.y;
      const z = -landmark.z * 0.5 + 0.5;
      return new THREE.Vector3(x, y, z);
    });

    const lines = new THREE.Group();
    const TRIANGULATION = faceInfos.triangulation;
    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
      const idx0 = TRIANGULATION[i * 3];
      const idx1 = TRIANGULATION[i * 3 + 1];
      const idx2 = TRIANGULATION[i * 3 + 2];
      if (points[idx0] && points[idx1] && points[idx2]) {
        [
          [idx0, idx1],
          [idx1, idx2],
          [idx2, idx0],
        ].forEach(([a, b]) => {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            points[a],
            points[b],
          ]);
          const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
          const line = new THREE.Line(geometry, material);
          lines.add(line);
        });
      }
    }
    scene.add(lines);
    let animationId: number;
    function animate() {
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function onWindowResize() {
      const newW = width || 480;
      const newH = height || 620;
      const newAspect = newW / newH;
      const newPlaneWidth = newAspect * planeHeight;
      camera.left = -newPlaneWidth / 2;
      camera.right = newPlaneWidth / 2;
      camera.top = planeHeight / 2;
      camera.bottom = -planeHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(newW * dpr, newH * dpr, false);
      renderer.domElement.style.width = newW + "px";
      renderer.domElement.style.height = newH + "px";
    }
    window.addEventListener("resize", onWindowResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onWindowResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [imageUrl, width, height]);

  return (
    <div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          width: width,
          height: height,
          // aspectRatio: 5 / 4,
          objectFit: "cover",
          objectPosition: "top",
          borderRadius: "1.5rem",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden", // 追加
        }}
        ref={mountRef}
      />
      <img
        src={imageUrl}
        width={width}
        height={height}
        alt={alt}
        style={{ visibility: "hidden", position: "absolute", inset: 0 }}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
