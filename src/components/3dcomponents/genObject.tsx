import { BoxGeometry, MeshNormalMaterial, Mesh } from "three";

export function genCube(): Mesh {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshNormalMaterial({ flatShading: true });
  const cube = new Mesh(geometry, material);
  return cube;
}
