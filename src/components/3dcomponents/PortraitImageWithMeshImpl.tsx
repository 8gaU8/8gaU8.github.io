import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import faceInfos from "./face_mesh_data.json";

// Three.jsシーン・カメラ・レンダラー初期化
function initThreeScene(width: number, height: number, dpr: number) {
  const aspect = width / height;
  const planeHeight = 1;
  const planeWidth = aspect * planeHeight;
  const left = -planeWidth / 2;
  const right = planeWidth / 2;
  const top = planeHeight / 2;
  const bottom = -planeHeight / 2;
  const near = 0.1;
  const far = 10;
  const camera = new THREE.OrthographicCamera(
    left,
    right,
    top,
    bottom,
    near,
    far
  );
  camera.position.z = 1;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width * dpr, height * dpr, false);
  renderer.domElement.style.width = width + "px";
  renderer.domElement.style.height = height + "px";
  renderer.domElement.style.borderRadius = "1.5rem";
  renderer.domElement.style.boxShadow = "var(--shadow-md)";
  return { scene, camera, renderer, planeWidth, planeHeight };
}

// テクスチャ付きPlane生成
function createTexturedPlane(
  scene: THREE.Scene,
  imageUrl: string,
  planeWidth: number,
  planeHeight: number
) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageUrl, (texture) => {
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    material.needsUpdate = false;
    scene.add(plane);
  });
}

// ランドマークライン生成（Groupを返すように変更）
function createLandmarkLines() {
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
  return lines;
}

// サイズ・カメラ更新
function updateCameraAndRenderer(
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  width: number,
  height: number,
  dpr: number
) {
  const aspect = width / height;
  const planeHeight = 1;
  const planeWidth = aspect * planeHeight;
  camera.left = -planeWidth / 2;
  camera.right = planeWidth / 2;
  camera.top = planeHeight / 2;
  camera.bottom = -planeHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(width * dpr, height * dpr, false);
  renderer.domElement.style.width = width + "px";
  renderer.domElement.style.height = height + "px";
}

// ResizeObserverコールバック
function handleResize(
  mount: HTMLDivElement,
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  dpr: number
) {
  return (entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      if (newW && newH) {
        updateCameraAndRenderer(camera, renderer, newW, newH, dpr);
      }
    }
  };
}

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
  const linesRef = useRef<THREE.Group>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [linesVisible, setLinesVisible] = useState(true);

  // 画像のオリジナルサイズ取得
  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Three.js初期化
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth || width || 480;
    const h = mount.clientHeight || height || 620;
    const dpr = window.devicePixelRatio || 1;
    const { scene, camera, renderer, planeWidth, planeHeight } = initThreeScene(
      w,
      h,
      dpr
    );
    mount.appendChild(renderer.domElement);
    createTexturedPlane(scene, imageUrl, planeWidth, planeHeight);

    // ランドマークライン生成・追加
    const lines = createLandmarkLines();
    lines.visible = linesVisible;
    linesRef.current = lines;
    scene.add(lines);


    let animationId: number;
    function animate() {
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();
    // ResizeObserverで親サイズ変化を監視
    const resizeObserver = new window.ResizeObserver(
      handleResize(mount, camera, renderer, dpr)
    );
    resizeObserver.observe(mount);
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [imageUrl, width, height, linesVisible]);

  // クリック/タップでvisible切り替え
  const handleToggle = useCallback(() => {
    setLinesVisible((v) => !v);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: width ? width : "100%",
        aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
        height: "auto",
        borderRadius: "1.5rem",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      ref={mountRef}
      onClick={handleToggle}
      onTouchStart={handleToggle}
      title="メッシュの表示/非表示を切り替え"
    />
  );
}
