# Living Building Assembly

Interactive 3D model of how a Living Building forms on site, following the paper
*Morphogenesis of a Living Building* (Living Things project).

## Open

Double-click `index.html`. No server, no internet and no build step are needed.
Three.js r147 is bundled in `vendor/three.min.js` (MIT licence, see `vendor/THREE-LICENSE`).

## Controls

- Drag: rotate · Scroll: zoom · Right-drag or Shift+drag: pan
- Slider / Play: formation time, 7 stages
- Click a stage in the list to jump to its end

## Stages (v0.1)

1. Site & material substrate (underground tanks, pipes)
2. Foundation formed from two morphogenetic centres
3. Robotic reinforcement (cages)
4. Ground floor, layer-by-layer formation
5. First floor slab
6. Upper floor
7. Roof: a functional body

## Files

- `index.html`: page and UI
- `style.css`: layout
- `app.js`: scene, building elements, timeline, robots, camera

## Status

Illustrative model. Geometry and timing are demonstration rules, not a structural calculation.

## Roadmap

- v0.2: living envelope (transformable shutters, actuators, glazing)
- v0.3: damage and recovery from a chosen centre
- v0.1.1: real-world video references (ETH Zurich, ICON) on stages 3–4
- then: link from the Egregor Cloud portal (`buildings/`)

## v0.2-A: networks

- Layer **Nervous (IoT)**: an IoT chip in every element, linked to the elements it touches and to the two centre hubs. Pulses show telemetry. Click a chip to see its card.
- Layer **Circulatory**: material channels from the substrate tanks through the foundation, columns, slabs and walls; particles show material flow.
- Layer **X-ray**: makes concrete transparent (switched on automatically with the network layers).
- Previous version is kept in `_versions/v0.1.1/`.
