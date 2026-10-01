import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

import { OrbitControls }
from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc6d7d6);

const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(13, 10, 19);
camera.lookAt(0, 3.2, -0.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3.1, -0.4);
controls.enableDamping = true;
controls.minDistance = 12;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI * 0.48;

const materials = {
    floor: new THREE.MeshStandardMaterial({ color: 0xb89d79, roughness: 0.78 }),
    wall: new THREE.MeshStandardMaterial({ color: 0xe6dfd0, roughness: 0.9 }),
    trim: new THREE.MeshStandardMaterial({ color: 0xf4eee2, roughness: 0.55 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x76503d, roughness: 0.52 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x49372f, roughness: 0.42 }),
    fabric: new THREE.MeshStandardMaterial({ color: 0xc45d43, roughness: 0.94 }),
    cushion: new THREE.MeshStandardMaterial({ color: 0xd47a5e, roughness: 0.96 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x373a3b, metalness: 0.65, roughness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({
        color: 0xc3e4e6,
        transparent: true,
        opacity: 0.23,
        roughness: 0.08,
        metalness: 0.12
    })
};

function box(name, size, position, material, castShadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
}

function sphere(name, radius, position, material) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 12), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
}

// The open front and ceiling keep the furnished room easy to see.
box("room floor", [12, 0.28, 10], [0, -0.14, 0], materials.floor);
box("left wall", [0.24, 8, 10], [-6, 4, 0], materials.wall);
box("right wall", [0.24, 8, 10], [6, 4, 0], materials.wall);
box("back wall left", [1.15, 8, 0.24], [-5.425, 4, -5], materials.wall);
box("back wall right", [3.3, 8, 0.24], [4.35, 4, -5], materials.wall);
box("back wall between windows", [0.4, 8, 0.24], [-1.35, 4, -5], materials.wall);
box("back wall window header", [6.15, 2.2, 0.24], [-1.5, 6.9, -5], materials.wall);
box("back wall window sill", [6.15, 1.05, 0.24], [-1.5, 0.525, -5], materials.wall);

// A soft blue daytime landscape sits beyond the openings in the rear wall.
const sky = new THREE.MeshBasicMaterial({ color: 0x283b68 });
const distantHill = new THREE.MeshBasicMaterial({ color: 0x5b5365 });
const nearHill = new THREE.MeshBasicMaterial({ color: 0x364b4b });
box("outside sky", [14, 12, 0.12], [0, 5, -5.8], sky, false);
box("distant landscape", [14, 2.3, 0.18], [0, 1.65, -5.65], distantHill, false);
box("meadow", [14, 1.2, 0.18], [0, 0.15, -5.6], nearHill, false);
sphere("sun", 0.55, [-4.25, 2.8, -5.5], new THREE.MeshBasicMaterial({ color: 0xff8a55 }));

for (const x of [-3.25, 0.2]) {
    box("window glass", [2.2, 4.55, 0.08], [x, 3.425, -4.78], materials.glass, false);
    for (const dx of [-1.16, 1.16]) {
        box("window jamb", [0.12, 4.85, 0.2], [x + dx, 3.425, -4.68], materials.trim);
    }
    for (const y of [1.12, 5.73]) {
        box("window rail", [2.44, 0.14, 0.2], [x, y, -4.68], materials.trim);
    }
    box("window mullion", [0.1, 4.62, 0.18], [x, 3.425, -4.63], materials.trim);
}
box("window crossbar one", [2.25, 0.1, 0.18], [-3.25, 3.43, -4.63], materials.trim);
box("window crossbar two", [2.25, 0.1, 0.18], [0.2, 3.43, -4.63], materials.trim);
box("back baseboard", [11.7, 0.22, 0.16], [0, 0.16, -4.82], materials.trim);
box("left baseboard", [0.16, 0.22, 9.7], [-5.82, 0.16, 0], materials.trim);
box("right baseboard", [0.16, 0.22, 9.7], [5.82, 0.16, 0], materials.trim);

// TV and low walnut console, centered on the solid section of the back wall.
box("console body", [4.25, 0.72, 0.72], [2.95, 0.48, -4.25], materials.wood);
box("console top", [4.45, 0.12, 0.82], [2.95, 0.9, -4.25], materials.darkWood);
for (const x of [1.05, 4.85]) {
    box("console leg", [0.12, 0.34, 0.62], [x, 0.17, -4.2], materials.darkWood);
}
for (const x of [2.1, 3.55]) {
    box("console door", [1.25, 0.46, 0.06], [x, 0.48, -3.875], materials.darkWood);
    box("console handle", [0.22, 0.045, 0.07], [x, 0.49, -3.825], materials.metal);
}
box("television frame", [3.5, 2.15, 0.16], [2.95, 2.42, -4.43], materials.metal);
const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
box("television screen", [3.28, 1.92, 0.025], [2.95, 2.43, -4.335], screenMaterial, false);
box("tv stand neck", [0.16, 0.35, 0.16], [2.95, 1.32, -4.34], materials.metal);
box("tv stand foot", [0.9, 0.08, 0.38], [2.95, 1.13, -4.32], materials.metal);
const tvLight =
new THREE.PointLight(
    0x0000ff,
    24,
    12
);
tvLight.position.set(2.95, 2.43, -4.05);
scene.add(tvLight);
// A compact upholstered armchair, turned toward the TV.
box("chair seat", [3.15, 0.52, 2.45], [-1.05, 1.22, 1.0], materials.fabric);
box("chair seat cushion", [2.76, 0.25, 2.05], [-1.05, 1.59, 0.95], materials.cushion);
const chairBack = box("chair back", [3.05, 2.25, 0.55], [-1.05, 2.65, -0.05], materials.fabric);
chairBack.rotation.x = -0.12;
box("chair back cushion", [2.62, 1.72, 0.28], [-1.05, 2.75, 0.25], materials.cushion);
for (const x of [-2.53, 0.43]) {
    box("chair arm", [0.48, 1.08, 2.05], [x, 1.76, 0.88], materials.fabric);
    box("chair arm cap", [0.52, 0.16, 1.95], [x, 2.34, 0.88], materials.cushion);
}
for (const x of [-2.25, 0.15]) {
    for (const z of [0.15, 1.82]) {
        box("chair foot", [0.16, 0.62, 0.16], [x, 0.38, z], materials.darkWood);
    }
}

// A small round side table with a reading lamp beside the chair.
const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.14, 32),
    materials.wood
);
tableTop.position.set(1.5, 1.12, 1.15);
tableTop.castShadow = true;
scene.add(tableTop);
const tableLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.18, 1.05, 16),
    materials.darkWood
);
tableLeg.position.set(1.5, 0.55, 1.15);
scene.add(tableLeg);
const lampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.48, 0.56, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xe5b66f, roughness: 0.8, side: THREE.DoubleSide })
);
lampShade.position.set(1.5, 2.18, 1.15);
scene.add(lampShade);
box("lamp stem", [0.09, 0.8, 0.09], [1.5, 1.68, 1.15], materials.metal);

const ambientLight = new THREE.HemisphereLight(0x9db4e8, 0x493448, 0.55);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffb15c, 0.1);
sunlight.position.set(-5, 4, 7);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -10;
sunlight.shadow.camera.right = 10;
sunlight.shadow.camera.top = 12;
sunlight.shadow.camera.bottom = -4;
scene.add(sunlight);

const lampGlow = new THREE.PointLight(0xffc56f, 0, 0);
lampGlow.color.set(0xffcc88);
lampGlow.position.set(1.5, 2.1, 1.15);
scene.add(lampGlow);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();