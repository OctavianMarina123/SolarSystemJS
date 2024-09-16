import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import getStarfield from "./getStarfield.js";
import {getFresnelMat} from "./getFresnelMat.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Create the scene
const scene = new THREE.Scene()


// Init the texture loader
const textureLoader = new THREE.TextureLoader()

// Get the textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");


// Create the spehere geometry
const sphere = new THREE.SphereGeometry(1,32,32)

// Create the materials
const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    emissive: new THREE.Color(0xffff00), // Yellow emissive color
    emissiveIntensity: 1.0,
});

const mercuryMaterial = new THREE.MeshStandardMaterial({
    map: mercuryTexture
})
const venusMaterial = new THREE.MeshStandardMaterial({
    map: venusTexture
})
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture
})
const marsMaterial = new THREE.MeshStandardMaterial({
    map: marsTexture
})
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture
})


const sunRimHex =0xFFA500
const sunFacingHex = 0xFF4500

// add the sun
const sun = new THREE.Mesh(sphere, sunMaterial)
sun.scale.setScalar(5)


// setup the sun atmosphere
const fresnelMat = getFresnelMat({
    rimHex: sunRimHex,
    facingHex: sunFacingHex,
});
const geometry = new THREE.IcosahedronGeometry(1, 12);

const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);

sun.add(glowMesh)

scene.add(sun)



// create the planets array
const planets = [
    {
        name: "Mercury",
        radius: 0.5,
        distance: 10,
        speed: 0.01,
        material: mercuryMaterial,
        moons: [],
        rimHex:0x9E9E9E,
        facingHex:0x6E6E6E,
        edgeGlow: 1.1,
        hasGlow: true
    },
    {
        name: "Venus",
        radius: 0.8,
        distance: 15,
        speed: 0.007,
        material: venusMaterial,
        moons: [],
        rimHex:0xFF7F50,
        facingHex:0xFF4500,
        edgeGlow: 1.1,
        hasGlow: false
    },
    {
        name: "Earth",
        radius: 1,
        distance: 20,
        speed: 0.005,
        material: earthMaterial,
        rimHex:0x9E9E9E,
        facingHex:0x6E6E6E,
        edgeGlow: 1.1,
        moons: [
            {
                name: "Moon",
                radius: 0.3,
                distance: 3,
                speed: 0.015,
            },
        ],
        hasGlow: true
    },
    {
        name: "Mars",
        radius: 0.7,
        distance: 25,
        speed: 0.003,
        material: marsMaterial,
        rimHex:0xFF6F31,
        facingHex:0x8B4513,
        edgeGlow:1.0,
        hasGlow: false,
        moons: [
            {
                name: "Phobos",
                radius: 0.1,
                distance: 2,
                speed: 0.02,
            },
            {
                name: "Deimos",
                radius: 0.2,
                distance: 3,
                speed: 0.015,
            },
        ],
    },
];
// init the camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    400
)
camera.position.z = 70;
camera.position.y = 5
scene.add(camera)

// add the starfield
const stars = getStarfield()
scene.add(stars)
// add the light
const ambientLight = new THREE.AmbientLight(0xffffff,0.1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,1.0)
scene.add(pointLight)


// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;



// Initialize the composer for post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Configure the bloom effect
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
);
composer.addPass(bloomPass);



// Add the planets
const planetsMeshes = planets.map((planet) => {
    const planetMesh = new THREE.Mesh(sphere, planet.material);
    planetMesh.position.x = planet.distance;
    planetMesh.scale.setScalar(planet.radius);

    // Create the atmosphere
    if (planet.hasGlow) {
        const fresnelMat = getFresnelMat({
            rimHex: planet.rimHex,
            facingHex: planet.facingHex,
        });
        const glowMesh = new THREE.Mesh(geometry, fresnelMat);
        glowMesh.scale.setScalar(1.02);

        planetMesh.add(glowMesh);
    }
    scene.add(planetMesh);

    // Create and add the moons
    const moons = planet.moons;
    const moonMeshes = [];
    moons.forEach((moon) => {
        const moonMesh = new THREE.Mesh(sphere, moonMaterial);
        moonMesh.position.x = moon.distance;
        moonMesh.scale.setScalar(moon.radius);
        planetMesh.add(moonMesh);
        moonMeshes.push(moonMesh);
    });

    // Attach moon meshes to planetMesh
    planetMesh.userData.moonMeshes = moonMeshes;

    return planetMesh;
});



// add resize listener
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});


const clock = new THREE.Clock();


// Render loop
const renderloop = () => {
    const elapsedTime = clock.getElapsedTime();

    // Move the planets
    planetsMeshes.forEach((planetMesh, planetIndex) => {
        planetMesh.rotation.y += planets[planetIndex].speed;
        planetMesh.position.x = Math.sin(planetMesh.rotation.y) * planets[planetIndex].distance;
        planetMesh.position.z = Math.cos(planetMesh.rotation.y) * planets[planetIndex].distance;

        // Move the moons
        const moonMeshes = planetMesh.userData.moonMeshes || [];
        moonMeshes.forEach((moonMesh, moonIndex) => {
            moonMesh.rotation.y += planets[planetIndex].moons[moonIndex].speed;
            moonMesh.position.x = Math.sin(moonMesh.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
            moonMesh.position.z = Math.cos(moonMesh.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
        });
    });

    // Animate the sun's emissive intensity
    const emissiveIntensity = 0.65 + Math.abs(Math.sin(elapsedTime * 0.5)) * 0.07;
    sunMaterial.emissiveIntensity = emissiveIntensity;

    controls.update();
    composer.render(scene, camera);
    window.requestAnimationFrame(renderloop);
};

renderloop();


renderloop();