import * as THREE from "three";

// Three.jsシーン・カメラ・レンダラー初期化
export function initThreeScene(width: number, height: number, dpr: number) {
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
    far,
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
export function createTexturedPlane(scene: THREE.Scene, imageUrl: string) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace; // sRGBカラースペースを使用
    scene.background = texture; // 背景として設定
  });
}

// サイズ・カメラ更新
export function updateCameraAndRenderer(
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  width: number,
  height: number,
  dpr: number,
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
export function handleResize(
  mount: HTMLDivElement,
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  dpr: number,
) {
  return (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      if (newW && newH) {
        updateCameraAndRenderer(camera, renderer, newW, newH, dpr);
      }
    }
  };
}
