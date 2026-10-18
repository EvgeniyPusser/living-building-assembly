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
- **Utilities** (the circulatory system): five networks with their own colour and switch: Water, Power, Gas, Air (ducts + roof unit), Repair material (from the substrate tanks). Routes are an illustrative layout, not an engineering design.
- Layer **Nervous (control)**: sensors (chips), controllers at the centres, data links.
- Layer **X-ray**: makes concrete transparent (switched on automatically with the network layers).
- Previous version is kept in `_versions/v0.1.1/`.

## v0.3-B1: stress map and integrity sensors

- Layer **Stress**: colours every formed element by its load relative to the most loaded element (blue → red).
- Simplified tributary-area gravity model: self-weight (25 kN/m³), finishes 1 kN/m², use 2 kN/m² (roof 1 kN/m²).
  Columns/walls: N/A vs assumed 12 MPa. Slabs: M = qL²/8 vs assumed 120 kNm/m. Foundation: soil pressure vs assumed 150 kPa.
  **Not a structural design.**
- Integrity sensors (diamonds) at the critical points of each element; the four riskiest pulse red and are listed in the panel.
- Click an element, chip or sensor for its reading.

## v0.3-B2: mobile sensors

- In the Stress panel, **Deploy mobile sensors** releases 1–3 sensors per element (columns 1, walls 2, slabs and foundation 4).
- Each sensor does a stochastic hill climb on the element's local stress field: it tries 14 neighbouring points, moves to the highest one, and shrinks its step when no neighbour is higher. Where it stops becomes an integrity sensor; trails show the route.
- Local stress fields are rules of thumb (columns: base; walls: ends at the base; slabs: mid-span sagging and hogging over loaded supports; foundation: under heavy supports), not FEM.
- **Rule-based** returns to the fixed sensors of v0.3-B1.

## v0.4-C: damage and load-plan response

- **Stress colours are now absolute**: share of the assumed capacity (red = 100 % or more).
- **Damage simulation** (bottom of the panel): Impact (column G5 destroyed), Crack (back wall, 35 % capacity), Overheating (column U3, 45 %), Water leak (first floor slab, 70 %).
- Each scenario runs in phases: event → detection (alarm wave over the nervous links) → redistribution (loads recalculated) → response:
  temporary prop installed by a robot, restricted zone (use load 0), neighbours within 3.5 m stiffen within their DNA range (+20 %). For the leak the water branch is closed.
- A table shows utilisation before damage, after damage and after the response. **Reset** restores the building.
