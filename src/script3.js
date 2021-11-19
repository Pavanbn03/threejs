import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

gsap.registerPlugin(ScrollTrigger);
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/matcaps/3.png");
// Scene
const scene = new THREE.Scene();
let mixer = null;
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/Duck/glTF/Duck.gltf", (gltf) => {
  // mixer = new THREE.AnimationMixer(gltf.scene);
  // const action = mixer.clipAction(gltf.animations[2]);
  // action.play();
  // gltf.scene.scale.set(0.008, 0.008, 0.008);
  // gltf.scene.position.set(1, -0.3, 0);
  model = gltf.scene.children[0];
  model.scale.set(0.003, 0.003, 0.003);
  model.rotation.set(0.5, 3.5, 0);
  // model.position.set(-1, 0, 0);
  scene.add(model);
});
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".webgl",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    markers: true,
  },
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Objects
 */
// Material
const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});
material.transparent = true;
material.opacity = 0.5;

// material.metalness = 0.2;

// Objects
const cylinder = new THREE.Mesh(
  new THREE.CylinderBufferGeometry(0.5, 0.5, 0.8, 32),
  material
);
cylinder.position.x = -1.5;
const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
  material
);
const octahedron = new THREE.Mesh(
  new THREE.OctahedronBufferGeometry(0.5),
  material
);

octahedron.position.x = 1.5;

// scene.add(cube, octahedron, cylinder);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xffffff, 1);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// }

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 1);
/**
 * Animate
 */
const clock = new THREE.Clock();
// const tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".webgl",
//     start: "top top",
//     end: "bottom top",
//     scrub: true,
//     pin: true,
//     markers: true,
//   },
// });
// // tl.from
// tl.to(
//   cube.rotation,
//   {
//     x: Math.PI,
//     y: Math.PI,
//   },
//   0
// );
// tl.to(
//   cylinder.rotation,
//   {
//     x: Math.PI,
//     y: Math.PI,
//   },
//   0
// );
// tl.to(
//   octahedron.rotation,
//   {
//     x: Math.PI,
//     y: Math.PI,
//   },
//   0
// );
setTimeout(() => {
  tl.to(model.rotation, {
    // x: Math.PI * 2,
    y: 10,
  });
  gui.add(model.rotation, "x", 0, 10, 0.1);
  gui.add(model.rotation, "y", 0, 10, 0.1);
  gui.add(model.rotation, "z", 0, 10, 0.1);
}, 1000);
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  let deltatime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // mixer !== null && mixer.update(deltatime);
  //   cube.position.x = Math.PI * Math.sin(elapsedTime) * 0.4;
  //   cube.position.y = Math.PI * Math.cos(elapsedTime) * 0.4;
  //   octahedron.position.x = Math.PI * Math.sin(elapsedTime + 2) * 0.4;
  //   octahedron.position.y = Math.PI * Math.cos(elapsedTime + 2) * 0.4;
  //   cylinder.position.x = Math.PI * Math.sin(elapsedTime + 4) * 0.4;
  //   cylinder.position.y = Math.PI * Math.cos(elapsedTime + 4) * 0.4;

  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
