# Solar System Visualization with Three.js

This project is a 3D visualization of the solar system built using **Three.js**. The visualization includes several planets with textures and materials, post-processing effects, and animations to simulate planetary orbits and rotations. The Sun has a glowing atmosphere, and some planets are accompanied by moons.

## Features

- Realistic planet textures and materials
- Sun with a glowing atmosphere and animated emissive intensity
- Orbiting planets with custom distances, speeds, and radii
- Moons orbiting their respective planets
- Starfield background for a more immersive scene
- Interactive camera controls (via **OrbitControls**) to explore the solar system
- Post-processing bloom effect for a more realistic space glow

## Key Components

### Sun
- The Sun is created using a `SphereGeometry` and a custom material with a yellow emissive color.
- A glowing atmosphere is added using the Fresnel effect to simulate light scattering.

### Planets
- Each planet is modeled as a sphere with a specific texture applied.
- Every planet has unique properties such as `radius`, `distance` from the Sun, and `orbit speed`.
- Some planets have glowing atmospheres (e.g., Earth), while others do not.

### Moons
- Moons orbit around their respective planets using simple transformations based on the planet's position.

## Rendering & Post-processing

- A starfield background is added for a realistic outer space feel.
- **UnrealBloomPass** is applied to create a bloom effect around the glowing celestial bodies like the Sun.
- **EffectComposer** is used to manage post-processing effects in the rendering pipeline.

## Controls

- The user can rotate, pan, and zoom into the scene using the **OrbitControls**.
- Camera movement is smooth with damping enabled.

## Animation

- The planets orbit around the Sun based on their defined speed.
- Moons rotate around their parent planets.
- The Sun's emissive intensity is animated to simulate a glowing effect over time.

