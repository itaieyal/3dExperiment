import "./style.css";
import gsap from "gsap";

import {
  BufferAttribute,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Raycaster,
  Scene,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PerspectiveCamera } from "three";
import { WebGL1Renderer } from "three";

const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  },
};
const planeMaterial = new MeshPhongMaterial({
  side: DoubleSide,
  flatShading: true,
  vertexColors: true,
});
// const gui = new dat.GUI();
const planeGeometry = new PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMesh = new Mesh(planeGeometry, planeMaterial);
function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = planeGeometry;
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const z = array[i + 2];
    // @ts-ignore
    array[i + 2] = z + Math.random();
  }
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }
  planeMesh.geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colors), 3)
  );
}
generatePlane();
// gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
// gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
// gui.add(world.plane, "widthSegments", 1, 50).onChange(generatePlane);
// gui.add(world.plane, "heightSegments", 1, 50).onChange(generatePlane);

const raycaster = new Raycaster();
const scene = new Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderer = new WebGL1Renderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;
camera.rotation.set(0.6, 0, 0);

const light = new DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 2);
scene.add(light);

const backLight = new DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);
scene.add(planeMesh);

const randomValues = [];
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  // @ts-ignore
  array[i] = x + (Math.random() - 0.5) * 3;
  // @ts-ignore
  array[i + 1] = y + (Math.random() - 0.5) * 3;
  // @ts-ignore
  array[i + 2] = z + (Math.random() - 0.5) * 3;
  randomValues.push((Math.random() - 0.5) * 8);
  randomValues.push((Math.random() - 0.5) * 8);
  randomValues.push((Math.random() - 0.5) * 8);
}
//@ts-ignore
planeMesh.geometry.attributes.position.randomValues = randomValues;
//@ts-ignore
planeMesh.geometry.attributes.position.originalPosition =
  planeMesh.geometry.attributes.position.array;

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}
planeMesh.geometry.setAttribute(
  "color",
  new BufferAttribute(new Float32Array(colors), 3)
);

const mouse: {
  x?: number;
  y?: number;
} = {
  x: undefined,
  y: undefined,
};
let frame = 0;
function animate() {
  frame += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //@ts-ignore
  raycaster.setFromCamera(mouse, camera);

  //@ts-ignore
  const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    //@ts-ignore
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.005;
    //@ts-ignore
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.005;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    // const intersect = intersects[0].object as ;
    const mesh = intersects[0].object as Mesh;
    const { color } = mesh.geometry.attributes;
    // Vertex 1
    //@ts-ignore
    color.setX(intersects[0].face.a, 0.1);
    //@ts-ignore
    color.setY(intersects[0].face.a, 0.5);
    //@ts-ignore
    color.setZ(intersects[0].face.a, 1);

    // Vertex 2
    //@ts-ignore
    color.setX(intersects[0].face.b, 0.1);
    //@ts-ignore
    color.setY(intersects[0].face.b, 0.5);
    //@ts-ignore
    color.setZ(intersects[0].face.b, 1);

    // Vertex 3
    //@ts-ignore
    color.setX(intersects[0].face.c, 0.1);
    //@ts-ignore
    color.setY(intersects[0].face.c, 0.5);
    //@ts-ignore
    color.setZ(intersects[0].face.c, 1);
    mesh.geometry.attributes.color.needsUpdate = true;
    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    };

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        //@ts-ignore
        color.setX(intersects[0].face.a, hoverColor.r);
        //@ts-ignore
        color.setY(intersects[0].face.a, hoverColor.g);
        //@ts-ignore
        color.setZ(intersects[0].face.a, hoverColor.b);

        // Vertex 2
        //@ts-ignore
        color.setX(intersects[0].face.b, hoverColor.r);
        //@ts-ignore
        color.setY(intersects[0].face.b, hoverColor.g);
        //@ts-ignore
        color.setZ(intersects[0].face.b, hoverColor.b);

        // Vertex 3
        //@ts-ignore
        color.setX(intersects[0].face.c, hoverColor.r);
        //@ts-ignore
        color.setY(intersects[0].face.c, hoverColor.g);
        //@ts-ignore
        color.setZ(intersects[0].face.c, hoverColor.b);
      },
    });
  }
}
animate();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
