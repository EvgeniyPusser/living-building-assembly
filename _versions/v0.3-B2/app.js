/* Living Building Assembly — v0.1
   Illustrative 3D model of on-site formation of a Living Building.
   Units: 1 unit ≈ 1 metre. y is up. Time T runs from 0 to 7 (one unit per stage). */
(() => {
  "use strict";
  const T_MAX = 7;

  // ---------------- real-world references ----------------
  const REFS = {
    ethVideo: { label: "ETH Zurich · In situ Fabricator & Mesh Mould: complete construction (video)", url: "https://www.youtube.com/watch?v=ZeLEeY8yK2Y", where: "Switzerland" },
    ethFab: { label: "DFAB HOUSE · In situ Fabricator: mobile robot building rebar on site", url: "https://dfabhouse.ch/in_situ_fabricator/", where: "Switzerland" },
    ethMesh: { label: "DFAB HOUSE · Mesh Mould: robotic reinforcement as formwork", url: "https://dfabhouse.ch/mesh_mould/", where: "Switzerland" },
    icon: { label: "ICON · Wolf Ranch: 100 homes printed on site by Vulcan (videos)", url: "https://www.iconbuild.com/projects/wolf-ranch", where: "USA" }
  };

  // ---------------- stages (text) ----------------
  const STAGES = [
    { title: "Site & material substrate",
      text: "What arrives on site is not a finished form, but information, material substrate and means of formation. Underground tanks hold the substrate; pipes and hoses will feed it to the formation robots." },
    { title: "Foundation from the centres",
      text: "Two formation robots dock at the morphogenetic centres (gold rings). They form the base slab locally, layer by layer, from the delivered substrate. Utility channels are laid inside the slab: water, power, gas, air and repair material. Together they are the circulatory system of the building (layer \"Utilities\")." },
    { title: "Robotic reinforcement",
      text: "Reinforcement cages for columns and walls are formed first. They fix the relational positions of the future elements: what connects to what, and where loads will travel. Every cage receives an IoT chip: a sensor of its element. Chips link with the elements they touch and with the controllers at the centres: the nervous system that senses and controls the building (layer \"Nervous\").",
      refs: ["ethVideo", "ethFab", "ethMesh"] },
    { title: "Ground floor: layer-by-layer formation",
      text: "Concrete is formed around the cages. The dark band on each element is the active formation front, where fresh material is being deposited. Each robot works on the elements nearest to its centre.",
      refs: ["icon"] },
    { title: "First floor slab",
      text: "The robots move up and form the slab that connects the ground-floor elements into one body. The slab mesh appears first, then the material." },
    { title: "Upper floor",
      text: "The same developmental rules are applied again one level higher: cages first, then formation. The upper floor is not a copy of the ground floor, because it has fewer columns and different walls." },
    { title: "Roof: a functional body",
      text: "The body reaches a fully functional state. The formation capability stays on site, so morphogenesis does not end here. It can continue as growth, adaptation and recovery (next versions)." }
  ];

  // ---------------- renderer / scene ----------------
  const canvas = document.getElementById("scene");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 0.62));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.position.set(-12, 22, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // ---------------- materials ----------------
  const M = {
    concrete: new THREE.MeshStandardMaterial({ color: 0xcfcac0, roughness: 0.92 }),
    front: new THREE.MeshStandardMaterial({ color: 0x6e6a62, roughness: 0.6 }),
    soil: new THREE.MeshStandardMaterial({ color: 0x7a5b40, roughness: 1 }),
    soilDark: new THREE.MeshStandardMaterial({ color: 0x5f4632, roughness: 1 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x8ea476, roughness: 1 }),
    tank: new THREE.MeshStandardMaterial({ color: 0xb9c0c6, roughness: 0.35, metalness: 0.55 }),
    pipe: new THREE.MeshStandardMaterial({ color: 0x8a9096, roughness: 0.4, metalness: 0.5 }),
    hose: new THREE.MeshStandardMaterial({ color: 0x2c2f33, roughness: 0.7 }),
    robot: new THREE.MeshStandardMaterial({ color: 0xe0a526, roughness: 0.45, metalness: 0.2 }),
    robotDark: new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.8 }),
    centre: new THREE.MeshBasicMaterial({ color: 0xe0a526 }),
    rebar: new THREE.LineBasicMaterial({ color: 0x8a4f22 })
  };

  function box(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
  }
  function boxFrom(x0, x1, y0, y1, z0, z1, mat) { return box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); }

  // ---------------- ground with a cut-away corner ----------------
  boxFrom(-10, 2, -3, 0, -9, 9, M.soil);
  boxFrom(2, 10, -3, 0, -9, 3, M.soil);
  boxFrom(2, 10, -3.2, -2.9, 3, 9, M.soilDark);
  boxFrom(-10, 2, 0, 0.02, -9, 9, M.grass).receiveShadow = true;
  boxFrom(2, 10, 0, 0.02, -9, 3, M.grass).receiveShadow = true;
  // a few shrubs
  [[-8, -7], [-8.5, 6], [8, -7.5], [-3, 7.8]].forEach(([x, z], i) => {
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 + (i % 2) * 0.2, 0), new THREE.MeshStandardMaterial({ color: 0x7f9a6a, roughness: 1, flatShading: true }));
    s.position.set(x, 0.5, z); s.castShadow = true; scene.add(s);
  });

  // ---------------- material substrate: tanks and pipes ----------------
  const TANKS = [new THREE.Vector3(4.0, -1.75, 6.4), new THREE.Vector3(7.0, -1.75, 6.4)];
  const tankMeshes = TANKS.map(p => {
    const g = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 28); g.translate(0, 0.75, 0);
    const m = new THREE.Mesh(g, M.tank); m.position.set(p.x, -2.9, p.z); m.castShadow = true; scene.add(m);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.tank);
    cap.position.set(0, 1.5, 0); m.add(cap); return m;
  });
  function tube(points, r, mat) {
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.1);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, r, 8, false), mat);
    m.castShadow = true; scene.add(m); return m;
  }
  const pipes = TANKS.map((p, i) => tube([
    new THREE.Vector3(p.x, -0.8, p.z), new THREE.Vector3(p.x, -0.6, p.z - 1.2),
    new THREE.Vector3(p.x - 0.3, -0.45, 3.2), new THREE.Vector3(i ? 4.6 : 3.4, -0.45, 2.9), new THREE.Vector3(i ? 4.6 : 3.4, 0.1, 2.9)
  ], 0.12, M.pipe));

  // ---------------- building elements ----------------
  // Each element: concrete box that grows upward (fill), a rebar cage that grows first, and a dark formation front.
  const elements = [];
  const rebarGroup = new THREE.Group(); scene.add(rebarGroup);

  function cageGeometry(w, h, d, slab) {
    const pts = []; const inset = 0.07;
    if (slab) {
      const y = h * 0.5; const sp = 0.42;
      for (let x = -w / 2 + inset; x <= w / 2 - inset + 1e-6; x += sp) pts.push(x, y, -d / 2 + inset, x, y, d / 2 - inset);
      for (let z = -d / 2 + inset; z <= d / 2 - inset + 1e-6; z += sp) pts.push(-w / 2 + inset, y, z, w / 2 - inset, y, z);
    } else {
      const hw = w / 2 - inset, hd = d / 2 - inset, top = h + 0.4, sp = 0.24;
      const per = [];
      const nx = Math.max(1, Math.round((2 * hw) / sp)), nz = Math.max(1, Math.round((2 * hd) / sp));
      for (let i = 0; i <= nx; i++) { per.push([-hw + (2 * hw * i) / nx, -hd], [-hw + (2 * hw * i) / nx, hd]); }
      for (let i = 1; i < nz; i++) { per.push([-hw, -hd + (2 * hd * i) / nz], [hw, -hd + (2 * hd * i) / nz]); }
      per.forEach(([x, z]) => pts.push(x, 0, z, x, top, z));
      for (let y = 0.15; y <= h; y += 0.28) {
        pts.push(-hw, y, -hd, hw, y, -hd, hw, y, -hd, hw, y, hd, hw, y, hd, -hw, y, hd, -hw, y, hd, -hw, y, -hd);
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return g;
  }

  function element(name, x0, x1, y0, y1, z0, z1, opts) {
    const w = x1 - x0, h = y1 - y0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const slab = !!opts.slab;
    const g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0);
    const mesh = new THREE.Mesh(g, M.concrete); mesh.position.set(cx, y0, cz); mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh);
    const fh = Math.min(0.12, h * 0.3);
    const fg = new THREE.BoxGeometry(w + 0.01, fh, d + 0.01); fg.translate(0, -fh / 2, 0);
    const front = new THREE.Mesh(fg, M.front); scene.add(front);
    const cage = new THREE.LineSegments(cageGeometry(w, h, d, slab), M.rebar); cage.position.set(cx, y0, cz); rebarGroup.add(cage);
    const e = Object.assign({ name, x0, x1, y0, y1, z0, z1, w, h, d, cx, cz, slab, mesh, front, cage, segs: cage.geometry.attributes.position.count }, opts);
    elements.push(e); return e;
  }

  // Stagger a group of elements inside a time window.
  function stagger(list, key, a, b) {
    const n = list.length;
    list.forEach((e, i) => { const s = a + (b - a) * (i / n) * 0.6; e[key] = [s, s + (b - a) * 0.4]; });
  }

  // Foundation
  element("Foundation slab", -5.6, 5.6, 0, 0.5, -4.6, 4.6, { slab: true, rebar: [1.0, 1.4], fill: [1.3, 2.0], robot: "both" });

  // Ground floor (0.5 → 3.5)
  const gf = [];
  const colsG = [[-4.7, -3.7], [0, -3.7], [4.7, -3.7], [-4.7, 3.7], [0, 3.7], [4.7, 3.7]];
  colsG.forEach(([x, z], i) => gf.push(element("Column G" + (i + 1), x - 0.3, x + 0.3, 0.5, 3.5, z - 0.3, z + 0.3, { robot: x <= 0 ? 0 : 1 })));
  gf.push(element("Back wall G-left", -4.4, -0.3, 0.5, 3.5, -3.85, -3.55, { robot: 0 }));
  gf.push(element("Back wall G-right", 0.3, 4.4, 0.5, 3.5, -3.85, -3.55, { robot: 1 }));
  gf.push(element("Side wall G", -4.85, -4.55, 0.5, 3.5, -3.4, 1.2, { robot: 0 }));
  gf.push(element("Core wall G", 1.6, 1.9, 0.5, 3.5, -3.4, -0.6, { robot: 1 }));
  gf.sort((a, b) => a.cx - b.cx);
  stagger(gf, "rebar", 2.0, 3.0);
  stagger(gf, "fill", 3.0, 4.0);

  // First floor slab (3.5 → 3.9)
  element("First floor slab", -5.2, 5.2, 3.5, 3.9, -4.2, 4.2, { slab: true, rebar: [4.0, 4.4], fill: [4.35, 5.0], robot: "both" });

  // Upper floor (3.9 → 6.9)
  const uf = [];
  [[-4.7, -3.7], [4.7, -3.7], [-4.7, 3.7], [4.7, 3.7]].forEach(([x, z], i) => uf.push(element("Column U" + (i + 1), x - 0.3, x + 0.3, 3.9, 6.9, z - 0.3, z + 0.3, { robot: x <= 0 ? 0 : 1 })));
  uf.push(element("Back wall U", -4.4, 4.4, 3.9, 6.9, -3.85, -3.55, { robot: 1 }));
  uf.push(element("Side wall U", 4.55, 4.85, 3.9, 6.9, -3.4, 0.4, { robot: 1 }));
  uf.push(element("Partition U", -1.2, -0.9, 3.9, 6.9, -3.4, 0.8, { robot: 0 }));
  uf.sort((a, b) => a.cx - b.cx);
  stagger(uf, "rebar", 5.0, 5.4);
  stagger(uf, "fill", 5.3, 6.0);

  // Roof slab + parapet
  element("Roof slab", -5.3, 5.3, 6.9, 7.3, -4.3, 4.3, { slab: true, rebar: [6.0, 6.3], fill: [6.25, 6.8], robot: "both" });
  const par = [
    element("Parapet N", -5.3, 5.3, 7.3, 7.75, -4.3, -4.05, { robot: 1 }),
    element("Parapet S", -5.3, 5.3, 7.3, 7.75, 4.05, 4.3, { robot: 0 }),
    element("Parapet W", -5.3, -5.05, 7.3, 7.75, -4.05, 4.05, { robot: 0 }),
    element("Parapet E", 5.05, 5.3, 7.3, 7.75, -4.05, 4.05, { robot: 1 })
  ];
  par.forEach(e => { e.rebar = [6.75, 6.85]; });
  stagger(par, "fill", 6.8, 7.0);

  // Morphogenetic centres (robot docking points)
  const CENTRES = [new THREE.Vector3(-2.4, 0, 0.6), new THREE.Vector3(2.4, 0, 0.6)];
  const centreRings = CENTRES.map(c => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, 40), M.centre);
    r.rotation.x = Math.PI / 2; r.position.set(c.x, 0.53, c.z); scene.add(r); return r;
  });

  // ---------------- robots ----------------
  function cyl(r, mat) { const g = new THREE.CylinderGeometry(r, r, 1, 12); g.translate(0, 0.5, 0); const m = new THREE.Mesh(g, mat); m.castShadow = true; scene.add(m); return m; }
  function between(m, a, b) {
    const dir = new THREE.Vector3().subVectors(b, a); const len = dir.length();
    m.position.copy(a); m.scale.set(1, Math.max(len, 0.001), 1);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  }
  function makeRobot(i) {
    const base = new THREE.Group(); scene.add(base);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 0.8), M.robotDark); tr.position.y = 0.14; tr.castShadow = true; base.add(tr);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.32, 0.6), M.robot); body.position.y = 0.44; body.castShadow = true; base.add(body);
    const tur = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.3, 16), M.robot); tur.position.y = 0.75; tur.castShadow = true; base.add(tur);
    const upper = cyl(0.08, M.robot), fore = cyl(0.065, M.robot);
    const elbowJ = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), M.robotDark); scene.add(elbowJ);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.26), M.robotDark); head.castShadow = true; scene.add(head);
    const nozzle = cyl(0.04, M.robot);
    const hose = new THREE.Mesh(new THREE.BufferGeometry(), M.hose); hose.castShadow = true; scene.add(hose);
    return { i, base, upper, fore, elbowJ, head, nozzle, hose, pos: CENTRES[i].clone(), headPos: CENTRES[i].clone().add(new THREE.Vector3(0.6, 1.3, 0)), parts: [base, upper, fore, elbowJ, head, nozzle, hose] };
  }
  const robots = [makeRobot(0), makeRobot(1)];

  // ================= NETWORKS (v0.2-A) =================
  // Nervous system: an IoT chip in every element, linked to touching neighbours and to the centre hubs.
  // Circulatory system: material channels from the substrate tanks through slabs, columns and walls.
  const NET = { nervous: false, blood: false, xray: false, selected: null };
  const CYAN = 0x1fb6ff, RED = 0xff5a3c;
  const chipMat = new THREE.MeshBasicMaterial({ color: CYAN, depthTest: false, transparent: true });
  const chipSelMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, depthTest: false, transparent: true });
  const linkMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5, depthTest: false });
  const linkSelMat = new THREE.LineBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 1, depthTest: false });
  const linkDimMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.12, depthTest: false });
  const chanMat = new THREE.MeshBasicMaterial({ color: 0xe8412a, transparent: true, opacity: 0.95, depthTest: false });

  const chips = [];
  elements.forEach((e, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.26), chipMat);
    m.position.set(e.cx, e.y0 + e.h / 2, e.cz); m.renderOrder = 20; m.visible = false; scene.add(m);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.32, 28), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.45, depthTest: false, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2; halo.renderOrder = 20; m.add(halo);
    e.chip = { id: "IoT-" + String(i + 1).padStart(2, "0"), mesh: m, halo, links: [] };
    m.userData.el = e; chips.push(m);
  });
  const hubs = CENTRES.map((c, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), chipMat);
    m.position.set(c.x, 0.75, c.z); m.renderOrder = 20; m.visible = false; scene.add(m);
    return { name: "Controller c" + (i + 1), mesh: m };
  });

  const touch = (a, b, t = 0.12) => a.x0 <= b.x1 + t && b.x0 <= a.x1 + t && a.y0 <= b.y1 + t && b.y0 <= a.y1 + t && a.z0 <= b.z1 + t && b.z0 <= a.z1 + t;
  const links = [];
  function addLink(pa, pb, ea, eb, hub) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pa, pb]), linkMat);
    line.renderOrder = 19; line.visible = false; scene.add(line);
    const L = { pa, pb, ea, eb, hub, line }; links.push(L);
    if (ea) ea.chip.links.push(L); if (eb) eb.chip.links.push(L); return L;
  }
  for (let i = 0; i < elements.length; i++) for (let j = i + 1; j < elements.length; j++) {
    if (touch(elements[i], elements[j])) addLink(elements[i].chip.mesh.position, elements[j].chip.mesh.position, elements[i], elements[j]);
  }
  const foundationEl = elements[0];
  hubs.forEach(h => addLink(h.mesh.position, foundationEl.chip.mesh.position, null, foundationEl, h));

  const chipOn = e => e.pr >= 0.5 || e.pf > 0;
  const linkOn = (L, T) => (L.ea ? chipOn(L.ea) : T > 0.8) && (L.eb ? chipOn(L.eb) : T > 0.8);

  // Signal pulses travelling along links
  const pulses = [];
  const pulseGeo = new THREE.SphereGeometry(0.08, 8, 6);
  for (let i = 0; i < 48; i++) {
    const m = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color: 0xbff0ff, depthTest: false, transparent: true }));
    m.renderOrder = 21; m.visible = false; scene.add(m); pulses.push({ m, L: null, t: 0, rev: false });
  }

  // Circulatory system = utility networks. Each network is a list of straight pieces hosted by an element
  // (a piece appears when its host element is formed). Routes are an illustrative layout, not an MEP design.
  const NETS = {
    water:  { label: "Water",           color: 0x2f6fde, flow: 0xbcd4ff, r: 0.05, on: false, pieces: [] },
    power:  { label: "Power",           color: 0xf2b200, flow: 0xfff3b0, r: 0.045, on: false, pieces: [] },
    gas:    { label: "Gas",             color: 0x2fa36b, flow: 0xc8f5dc, r: 0.045, on: false, pieces: [] },
    air:    { label: "Air",             color: 0x8e9bb0, flow: 0xffffff, r: 0.09, on: false, pieces: [] },
    repair: { label: "Repair material", color: 0xe8412a, flow: 0xfff1c2, r: 0.05, on: false, pieces: [] }
  };
  Object.values(NETS).forEach(n => { n.mat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.95, depthTest: false }); });
  const pieces = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function chanPiece(a, b, host, key) {
    const n = NETS[key];
    const g = new THREE.CylinderGeometry(n.r, n.r, 1, 8); g.translate(0, 0.5, 0);
    const m = new THREE.Mesh(g, n.mat); m.renderOrder = 18; m.visible = false; scene.add(m);
    between(m, a, b); const P = { a, b, host, key, m }; pieces.push(P); n.pieces.push(P);
    if (host) { host.nets = host.nets || new Set(); host.nets.add(key); }
  }
  const chanPath = (key, host, pts) => { for (let i = 0; i < pts.length - 1; i++) chanPiece(pts[i], pts[i + 1], host, key); };
  const byName = n => elements.find(e => e.name === n);
  const slab1 = byName("First floor slab"), roof = byName("Roof slab");

  // --- Repair material: from the substrate tanks into foundation, columns and slabs
  const rring = (y, host) => chanPath("repair", host, [V(4.7, y, 3.7), V(-4.7, y, 3.7), V(-4.7, y, -3.7), V(4.7, y, -3.7), V(4.7, y, 3.7)]);
  chanPath("repair", foundationEl, [V(3.4, -0.45, 2.9), V(3.4, 0.25, 2.9), V(3.4, 0.25, 3.7)]);
  chanPath("repair", foundationEl, [V(4.6, -0.45, 2.9), V(4.6, 0.25, 2.9), V(4.6, 0.25, 3.7)]);
  rring(0.25, foundationEl); rring(3.7, slab1); rring(7.1, roof);
  elements.filter(e => /^Column G/.test(e.name)).forEach(e => chanPath("repair", e, [V(e.cx, 0.25, e.cz), V(e.cx, 3.7, e.cz)]));
  elements.filter(e => /^Column U/.test(e.name)).forEach(e => chanPath("repair", e, [V(e.cx, 3.7, e.cz), V(e.cx, 7.1, e.cz)]));

  // --- Water: service inlet from the back, riser in the core wall, branches to kitchen and bathrooms
  chanPath("water", foundationEl, [V(1.75, -0.6, -8), V(1.75, -0.6, -3.2), V(1.75, 0.25, -3.2)]);
  chanPath("water", byName("Core wall G"), [V(1.75, 0.25, -3.2), V(1.75, 3.6, -3.2)]);
  chanPath("water", byName("Core wall G"), [V(1.75, 0.8, -3.2), V(3.8, 0.8, -3.2), V(3.8, 0.8, -2.2)]);
  chanPath("water", byName("Core wall G"), [V(1.75, 0.8, -2.4), V(-0.6, 0.8, -2.4)]);
  chanPath("water", byName("Back wall U"), [V(1.75, 3.6, -3.2), V(1.75, 6.5, -3.2)]);
  chanPath("water", byName("Back wall U"), [V(1.75, 4.2, -3.2), V(-0.9, 4.2, -3.2), V(-0.9, 4.2, -1.6)]);

  // --- Power: inlet on the left, riser in the side wall, a ring in each floor slab, riser through the partition
  const pring = (y, host) => chanPath("power", host, [V(4.9, y, 3.95), V(-4.9, y, 3.95), V(-4.9, y, -3.95), V(4.9, y, -3.95), V(4.9, y, 3.95)]);
  chanPath("power", foundationEl, [V(-9, -0.4, -1.5), V(-4.7, -0.4, -1.5), V(-4.7, 0.3, -1.5)]);
  chanPath("power", byName("Side wall G"), [V(-4.7, 0.3, -1.5), V(-4.7, 3.75, -1.5), V(-4.9, 3.75, -1.5)]);
  chanPath("power", byName("Side wall G"), [V(-4.7, 1.1, -3.2), V(-4.7, 1.1, 1.0)]);
  pring(3.75, slab1);
  chanPath("power", byName("Partition U"), [V(-1.05, 3.75, -3.95), V(-1.05, 3.75, -1.0), V(-1.05, 7.15, -1.0), V(-1.05, 7.15, -3.95)]);
  chanPath("power", byName("Partition U"), [V(-1.05, 4.5, -3.3), V(-1.05, 4.5, 0.6)]);
  pring(7.15, roof);

  // --- Gas: short line from the right to the ground-floor kitchen
  chanPath("gas", foundationEl, [V(9, -0.4, -2.6), V(4.4, -0.4, -2.6), V(4.4, 0.3, -2.6)]);
  chanPath("gas", byName("Back wall G-right"), [V(4.4, 0.3, -2.6), V(4.4, 1.25, -2.6), V(4.4, 1.25, -3.35), V(3.2, 1.25, -3.35)]);

  // --- Air: ducts under each ceiling, riser to a ventilation unit on the roof
  const ducts = (y, host) => {
    chanPath("air", host, [V(-4.0, y, 0.2), V(3.0, y, 0.2)]);
    chanPath("air", host, [V(-2.6, y, -3.0), V(-2.6, y, 3.0)]);
    chanPath("air", host, [V(1.0, y, -3.0), V(1.0, y, 3.0)]);
  };
  ducts(3.25, slab1); ducts(6.65, roof);
  chanPath("air", slab1, [V(3.0, 3.25, 0.2), V(3.0, 3.25, -2.6), V(3.0, 6.65, -2.6)]);
  chanPath("air", roof, [V(3.0, 6.65, -2.6), V(3.0, 6.65, 0.2)]);
  chanPath("air", roof, [V(3.0, 6.65, -2.6), V(3.0, 7.75, -2.6)]);
  const airUnit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.0), new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.5, metalness: 0.4 }));
  airUnit.position.set(3.0, 7.6, -2.6); airUnit.castShadow = true; airUnit.visible = false; scene.add(airUnit);

  const flows = [];
  const flowGeo = new THREE.SphereGeometry(0.1, 8, 6);
  for (let i = 0; i < 90; i++) {
    const m = new THREE.Mesh(flowGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true }));
    m.renderOrder = 21; m.visible = false; scene.add(m); flows.push({ m, P: null, t: 0 });
  }
  const anyNet = () => Object.values(NETS).some(n => n.on);

  function setXray(on) {
    [M.concrete, M.front].forEach(mat => { mat.transparent = on; mat.opacity = on ? 0.28 : 1; mat.depthWrite = !on; mat.needsUpdate = true; });
  }

  function updateNetworks(T) {
    chips.forEach(m => { const e = m.userData.el; m.visible = NET.nervous && chipOn(e); m.material = NET.selected === e ? chipSelMat : chipMat; m.scale.setScalar(NET.selected === e ? 1.9 : 1); });
    hubs.forEach(h => { h.mesh.visible = NET.nervous && T > 0.8; });
    links.forEach(L => {
      L.line.visible = NET.nervous && linkOn(L, T);
      L.line.material = !NET.selected ? linkMat : (L.ea === NET.selected || L.eb === NET.selected) ? linkSelMat : linkDimMat;
    });
    pieces.forEach(p => { p.m.visible = NETS[p.key].on && (!p.host || p.host.pf > 0); });
    airUnit.visible = roof.pf >= 1;
  }

  let netLast = 0, pulseAcc = 0, flowAcc = 0;
  function animateNetworks(now) {
    const dt = Math.min(0.1, (now - (netLast || now)) / 1000); netLast = now;
    animateMobile(dt);
    if (STR.on) STR.sensors.forEach(sn => { if (sn.risk && sn.m) sn.m.scale.setScalar(1.15 + 0.4 * Math.sin(now / 180)); });
    // pulses
    if (NET.nervous) {
      pulseAcc += dt;
      const live = links.filter(L => L.line.visible);
      while (pulseAcc > 0.07 && live.length) {
        pulseAcc -= 0.07;
        const p = pulses.find(q => !q.L); if (!p) break;
        p.L = live[(Math.random() * live.length) | 0]; p.t = 0; p.rev = Math.random() < 0.5; p.m.visible = true;
      }
    }
    pulses.forEach(p => {
      if (!p.L) return;
      p.t += dt / 0.7;
      if (p.t >= 1 || !NET.nervous || !p.L.line.visible) { p.L = null; p.m.visible = false; return; }
      const a = p.rev ? p.L.pb : p.L.pa, b = p.rev ? p.L.pa : p.L.pb;
      p.m.position.lerpVectors(a, b, p.t);
    });
    // material flow
    if (anyNet()) {
      flowAcc += dt;
      const live = pieces.filter(q => q.m.visible);
      while (flowAcc > 0.05 && live.length) {
        flowAcc -= 0.05;
        const f = flows.find(q => !q.P); if (!f) break;
        f.P = live[(Math.random() * live.length) | 0]; f.t = 0; f.m.visible = true; f.m.material.color.setHex(NETS[f.P.key].flow);
      }
    }
    flows.forEach(f => {
      if (!f.P) return;
      f.t += dt * 2.2 / Math.max(0.6, f.P.a.distanceTo(f.P.b));
      if (f.t >= 1 || !f.P.m.visible) { f.P = null; f.m.visible = false; return; }
      f.m.position.lerpVectors(f.P.a, f.P.b, f.t);
    });
  }

  function chipCard(e) {
    const card = document.getElementById("chip-card");
    if (!e) { card.hidden = true; return; }
    const ci = e.robot === "both" ? (e.cx <= 0 ? 0 : 1) : e.robot;
    const c = CENTRES[ci];
    const nb = e.chip.links.map(L => (L.hub ? L.hub.name : (L.ea === e ? L.eb : L.ea).name));
    card.hidden = false;
    card.innerHTML = `<p class="refs-title">IoT chip · nervous system</p><h3>${e.chip.id} · ${e.name}</h3>
      <dl>
        <dt>Position relative to centre c${ci + 1}</dt><dd>dx ${(e.cx - c.x).toFixed(1)} m · dy ${(e.y0 + e.h / 2).toFixed(1)} m · dz ${(e.cz - c.z).toFixed(1)} m</dd>
        <dt>Signal links (${nb.length})</dt><dd>${nb.join(", ")}</dd>
        <dt>Utility networks through this element</dt><dd>${e.nets ? [...e.nets].map(k => NETS[k].label).join(", ") : "none"}</dd>
        <dt>Status</dt><dd>${e.pf >= 1 ? "online · formed" : e.pf > 0 ? "online · element being formed" : "online · in reinforcement cage"}</dd>
        ${structuralReading(e)}
      </dl>
      <p class="small">${STR.on ? "Numbers come from a simplified tributary-area model with assumed capacities. Not a structural design." : "Turn on the Stress layer to see structural readings."}</p>`;
  }


  // ================= STRUCTURAL MONITORING (v0.3-B1) =================
  // Simplified gravity-load model (tributary areas), NOT a structural design:
  //  - every slab gives its weight + finishes + live load to the nearest supporting element below it
  //  - every vertical element passes its total force down to the slab/foundation it stands on
  //  - columns/walls: stress = N / A, compared with an assumed design strength
  //  - slabs: M = q·L²/8 with L = 2 × (largest distance from any slab point to its nearest support)
  //  - foundation: soil pressure = total load / footprint area
  const STR = { on: false, sig: "", res: new Map(), maxU: 0, sensors: [] };
  const RHO = 25;                     // kN/m³, reinforced concrete
  const FIN = 1.0;                    // kN/m², finishes
  const LIVE = { "Foundation slab": 2.0, "First floor slab": 2.0, "Roof slab": 1.0 }; // kN/m², use
  const F_CAP = 12000;                // kN/m² = 12 MPa, assumed design compressive strength
  const M_CAP = 120;                  // kNm per metre width, assumed slab bending capacity
  const SOIL_CAP = 150;               // kPa, assumed allowable soil pressure
  const formed = e => e.pf >= 1 && !e.failed;
  const rectDist = (px, pz, e) => Math.hypot(Math.max(e.x0 - px, 0, px - e.x1), Math.max(e.z0 - pz, 0, pz - e.z1));

  function computeStress() {
    const res = new Map();
    elements.forEach(e => res.set(e, { own: 0, got: 0, points: [] }));
    const list = elements.filter(formed).sort((a, b) => b.y0 - a.y0); // top-down
    for (const e of list) {
      const r = res.get(e); r.own = e.w * e.h * e.d * RHO;
      if (!e.slab) {
        r.N = r.own + r.got;
        r.A = e.w * e.d; r.sigma = r.N / r.A; r.util = r.sigma / F_CAP;
        const below = list.find(s => s.slab && Math.abs(s.y1 - e.y0) < 0.05 && rectDist(e.cx, e.cz, s) < 0.01);
        if (below) res.get(below).points.push({ x: e.cx, z: e.cz, P: r.N, from: e });
        continue;
      }
      const area = e.w * e.d;
      r.q = r.own / area + FIN + (LIVE[e.name] || 0);
      r.N = r.q * area + r.points.reduce((s, p) => s + p.P, 0);
      if (e.y0 < 0.01) { // foundation on soil
        r.p = r.N / area; r.util = r.p / SOIL_CAP;
        const top = r.points.slice().sort((a, b) => b.P - a.P)[0];
        r.hot = top ? { x: top.x, z: top.z } : { x: e.cx, z: e.cz };
        continue;
      }
      const sup = list.filter(v => !v.slab && Math.abs(v.y1 - e.y0) < 0.05 && v.x1 > e.x0 && v.x0 < e.x1 && v.z1 > e.z0 && v.z0 < e.z1);
      if (!sup.length) { r.util = 0; continue; }
      let maxD = 0, mid = { x: e.cx, z: e.cz };
      const step = 0.25, dA = step * step;
      for (let x = e.x0 + step / 2; x < e.x1; x += step) for (let z = e.z0 + step / 2; z < e.z1; z += step) {
        let best = null, bd = Infinity;
        for (const s of sup) { const d = rectDist(x, z, s); if (d < bd) { bd = d; best = s; } }
        res.get(best).got += r.q * dA;
        if (bd > maxD) { maxD = bd; mid = { x, z }; }
      }
      for (const p of r.points) {
        let best = null, bd = Infinity;
        for (const s of sup) { const d = rectDist(p.x, p.z, s); if (d < bd) { bd = d; best = s; } }
        res.get(best).got += p.P;
      }
      r.L = Math.max(1, 2 * maxD); r.M = r.q * r.L * r.L / 8; r.util = r.M / M_CAP; r.mid = mid; r.sup = sup; r.maxD = Math.max(maxD, 0.5);
      const heavy = sup.slice().sort((a, b) => res.get(b).got - res.get(a).got)[0];
      r.over = heavy ? { x: heavy.cx, z: heavy.cz, name: heavy.name } : null;
    }
    STR.res = res;
    STR.maxU = Math.max(1e-6, ...list.map(e => res.get(e).util || 0));
    buildSensors(list);
  }

  // fixed sensors at the known critical points of each element
  const sensorGeo = new THREE.OctahedronGeometry(0.15);
  function buildSensors(list) {
    STR.sensors.forEach(s => scene.remove(s.m)); STR.sensors = [];
    const add = (e, x, y, z, factor, what) => {
      const r = STR.res.get(e);
      STR.sensors.push({ e, pos: new THREE.Vector3(x, y, z), score: (r.util || 0) * factor, what, m: null });
    };
    for (const e of list) {
      const r = STR.res.get(e);
      if (/^Parapet/.test(e.name)) continue;
      if (!e.slab && e.w < 0.7 && e.d < 0.7) { // column
        add(e, e.cx, e.y0 + 0.2, e.cz, 1.0, "base of column: largest axial force");
        add(e, e.cx, e.y1 - 0.2, e.cz, 0.9, "top of column: load enters from the slab");
      } else if (!e.slab) { // wall
        const along = e.w >= e.d;
        add(e, along ? e.x0 + 0.25 : e.cx, e.y0 + 0.25, along ? e.cz : e.z0 + 0.25, 1.15, "wall end at the base: stress concentration over the support");
        add(e, along ? e.x1 - 0.25 : e.cx, e.y0 + 0.25, along ? e.cz : e.z1 - 0.25, 1.15, "wall end at the base: stress concentration over the support");
      } else if (e.y0 < 0.01) {
        add(e, r.hot.x, e.y1, r.hot.z, 1.0, "foundation under the most loaded support");
      } else {
        add(e, r.mid.x, e.y0 + e.h / 2, r.mid.z, 1.0, "mid-span: largest sagging moment");
        if (r.over) add(e, r.over.x, e.y0 + e.h / 2, r.over.z, 0.9, "over " + r.over.name + ": hogging moment and punching shear");
      }
    }
    placeSensors(STR.sensors);
  }

  function placeSensors(arr) {
    STR.sensors.forEach(s => { if (s.m) scene.remove(s.m); });
    STR.sensors = arr;
    const ranked = STR.sensors.slice().sort((a, b) => b.score - a.score);
    ranked.forEach((s, i) => { s.rank = i + 1; s.risk = i < 4; });
    STR.sensors.forEach(s => {
      s.m = new THREE.Mesh(sensorGeo, new THREE.MeshBasicMaterial({ color: s.risk ? 0xff2d55 : 0xff9500, depthTest: false, transparent: true }));
      s.m.position.copy(s.pos); s.m.renderOrder = 22; s.m.userData.sensor = s; scene.add(s.m);
    });
    renderRiskList(ranked.slice(0, 4));
    updateStressVisibility();
  }
  function updateStressVisibility() { STR.sensors.forEach(s => { if (s.m) s.m.visible = STR.on && !MOB.running; }); }

  function stressColor(share) { return new THREE.Color().setHSL(0.62 * (1 - Math.min(1, share)), 0.78, 0.52); }

  function updateStress() {
    if (!STR.on) {
      elements.forEach(e => { if (e.mesh.material !== M.concrete) e.mesh.material = M.concrete; });
      STR.sensors.forEach(s => { s.m.visible = false; });
      document.getElementById("stress-box").hidden = true;
      return;
    }
    const sig = elements.map(e => (formed(e) ? 1 : 0)).join("");
    if (sig !== STR.sig) { STR.sig = sig; clearCrawlers(); computeStress(); setSensorStatus("Rule-based sensors: placed at the known critical points of each element."); }
    elements.forEach(e => {
      const r = STR.res.get(e);
      if (!formed(e) || r.util === undefined) { e.mesh.material = M.concrete; return; }
      if (!e.stressMat) e.stressMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
      e.stressMat.color.copy(stressColor(r.util / STR.maxU));
      e.mesh.material = e.stressMat;
    });
    updateStressVisibility();
    document.getElementById("stress-box").hidden = false;
  }

  function renderRiskList(top) {
    const box = document.getElementById("risk-list"); if (!box) return;
    box.innerHTML = top.length ? top.map(s => `<li><b>${s.rank}</b>${s.e.name} · ${s.what} · ${Math.round(s.score * 100)} % of capacity</li>`).join("") : "<li>No formed elements yet.</li>";
  }

  function structuralReading(e) {
    if (!STR.on) return "";
    const r = STR.res.get(e); if (!r || r.util === undefined || !formed(e)) return "";
    const pct = v => Math.round(v * 100) + " %";
    let txt;
    if (!e.slab) txt = `Axial force ${Math.round(r.N)} kN · section ${r.A.toFixed(2)} m² · stress ${(r.sigma / 1000).toFixed(2)} MPa<br>Utilisation ${pct(r.util)} of assumed 12 MPa`;
    else if (e.y0 < 0.01) txt = `Total load ${Math.round(r.N)} kN · soil pressure ${Math.round(r.p)} kPa<br>Utilisation ${pct(r.util)} of assumed 150 kPa`;
    else txt = `q ${r.q.toFixed(1)} kN/m² · effective span ${r.L.toFixed(1)} m · M ${Math.round(r.M)} kNm/m<br>Utilisation ${pct(r.util)} of assumed 120 kNm/m`;
    const sens = STR.sensors.filter(s => s.e === e).map(s => `${s.risk ? "⚠ risk point #" + s.rank : "sensor #" + s.rank}: ${s.what}`).join("<br>");
    return `<dt>Structural reading (simplified)</dt><dd>${txt}<br>Relative to the most loaded element: ${pct(r.util / STR.maxU)}</dd>` + (sens ? `<dt>Integrity sensors</dt><dd>${sens}</dd>` : "");
  }

  // ================= MOBILE SENSORS (v0.3-B2) =================
  // Local stress field inside an element (engineering rules of thumb, not FEM), as a fraction of capacity.
  const isColumn = e => !e.slab && e.w < 0.7 && e.d < 0.7;
  function localStress(e, p) {
    const r = STR.res.get(e); if (!r || !r.util) return 0;
    const ny = Math.min(1, Math.max(0, (p.y - e.y0) / e.h));
    if (isColumn(e)) return r.util * ((1 - 0.25 * ny) + 0.15 * Math.exp(-(1 - ny) * e.h / 0.3));
    if (!e.slab) {
      const along = e.w >= e.d, s = along ? p.x - e.x0 : p.z - e.z0, L = along ? e.w : e.d;
      const de = Math.min(s, L - s);
      return r.util * (1 + 0.6 * Math.exp(-de / 0.4)) * (1 - 0.25 * ny);
    }
    if (e.y0 < 0.01) {
      const Pmax = Math.max(1e-6, ...r.points.map(q => q.P));
      let peak = 0; r.points.forEach(q => { peak = Math.max(peak, (q.P / Pmax) * Math.exp(-Math.hypot(p.x - q.x, p.z - q.z) / 0.6)); });
      return r.util * (0.5 + 1.5 * peak);
    }
    let d = Infinity; r.sup.forEach(s => { d = Math.min(d, rectDist(p.x, p.z, s)); });
    const gmax = Math.max(1e-6, ...r.sup.map(s => STR.res.get(s).got));
    let hog = 0; r.sup.forEach(s => { hog = Math.max(hog, 0.75 * (STR.res.get(s).got / gmax) * Math.exp(-rectDist(p.x, p.z, s) / 0.35)); });
    return r.util * Math.max((d / r.maxD) ** 2, hog);
  }

  // Search domain of an element: two free coordinates; the third is fixed.
  function domain(e) {
    if (isColumn(e)) return { a: "y", amin: e.y0 + 0.1, amax: e.y1 - 0.1, b: null, fixed: { x: e.cx, z: e.cz } };
    if (!e.slab) {
      const along = e.w >= e.d;
      return along ? { a: "x", amin: e.x0 + 0.05, amax: e.x1 - 0.05, b: "y", bmin: e.y0 + 0.1, bmax: e.y1 - 0.1, fixed: { z: e.cz } }
                   : { a: "z", amin: e.z0 + 0.05, amax: e.z1 - 0.05, b: "y", bmin: e.y0 + 0.1, bmax: e.y1 - 0.1, fixed: { x: e.cx } };
    }
    return { a: "x", amin: e.x0 + 0.1, amax: e.x1 - 0.1, b: "z", bmin: e.z0 + 0.1, bmax: e.z1 - 0.1, fixed: { y: e.y0 < 0.01 ? e.y1 : e.y0 + e.h / 2 } };
  }
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // Stochastic hill climbing: try neighbours, move to a higher-stress point, shrink the step when stuck.
  function climb(e, start, rand) {
    const D = domain(e);
    const toP = (a, b) => { const p = Object.assign({ x: 0, y: 0, z: 0 }, D.fixed); p[D.a] = a; if (D.b) p[D.b] = b; return p; };
    let a = start[0], b = start[1], cur = localStress(e, toP(a, b));
    const span = Math.max(D.amax - D.amin, D.b ? D.bmax - D.bmin : 0);
    let step = Math.max(0.18, span * 0.08);
    const path = [toP(a, b)];
    for (let it = 0; it < 160 && step > 0.03; it++) {
      let best = null, bv = cur;
      for (let k = 0; k < 14; k++) {
        const ang = rand() * Math.PI * 2;
        const na = Math.min(D.amax, Math.max(D.amin, a + Math.cos(ang) * step));
        const nb = D.b ? Math.min(D.bmax, Math.max(D.bmin, b + Math.sin(ang) * step)) : 0;
        const v = localStress(e, toP(na, nb));
        if (v > bv + 1e-9) { bv = v; best = [na, nb]; }
      }
      if (best) { a = best[0]; b = best[1]; cur = bv; path.push(toP(a, b)); } else step *= 0.55;
    }
    return { path, value: cur, end: toP(a, b) };
  }

  function describe(e, p) {
    if (isColumn(e)) return (p.y - e.y0) / e.h < 0.5 ? "found: base of column, largest axial force" : "found: top of column, load enters from the slab";
    if (!e.slab) return "found: near the wall end at the base, stress concentration";
    const r = STR.res.get(e);
    if (e.y0 < 0.01) { let n = null, bd = Infinity; r.points.forEach(q => { const d = Math.hypot(p.x - q.x, p.z - q.z); if (d < bd) { bd = d; n = q.from.name; } }); return "found: under " + n; }
    let n = null, bd = Infinity; r.sup.forEach(s => { const d = rectDist(p.x, p.z, s); if (d < bd) { bd = d; n = s.name; } });
    return bd < 0.8 ? "found: over " + n + ", hogging moment" : "found: mid-span, largest sagging moment";
  }

  const MOB = { running: false, crawlers: [], t: 0, steps: 0 };
  const crawlGeo = new THREE.SphereGeometry(0.11, 12, 8);
  function clearCrawlers() { MOB.crawlers.forEach(c => { scene.remove(c.m); scene.remove(c.trail); }); MOB.crawlers = []; MOB.running = false; }

  function deployMobile() {
    if (!STR.on) return;
    clearCrawlers();
    STR.sensors.forEach(s => { s.m.visible = false; });
    const rand = rng(20261018);
    for (const e of elements.filter(formed)) {
      if (/^Parapet/.test(e.name)) continue;
      const D = domain(e);
      const n = isColumn(e) ? 1 : e.slab ? 4 : 2;
      for (let i = 0; i < n; i++) {
        const fa = isColumn(e) ? 0.5 : (i + 0.5) / n, fb = e.slab ? rand() : 0.5;
        const start = [D.amin + (D.amax - D.amin) * fa, D.b ? D.bmin + (D.bmax - D.bmin) * fb : 0];
        const res = climb(e, start, rand);
        const m = new THREE.Mesh(crawlGeo, new THREE.MeshBasicMaterial({ color: 0x00e5ff, depthTest: false, transparent: true }));
        m.renderOrder = 23; scene.add(m);
        const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x00b8e6, transparent: true, opacity: 0.8, depthTest: false }));
        trail.renderOrder = 22; scene.add(trail);
        MOB.crawlers.push({ e, path: res.path.map(q => new THREE.Vector3(q.x, q.y, q.z)), value: res.value, end: res.end, m, trail });
      }
    }
    MOB.t = 0; MOB.steps = Math.max(...MOB.crawlers.map(c => c.path.length));
    MOB.running = true;
    setSensorStatus(`Searching… ${MOB.crawlers.length} mobile sensors climb towards the highest local stress.`);
  }

  function finishMobile() {
    MOB.running = false;
    // merge crawlers that ended at the same spot of the same element
    const found = [];
    for (const c of MOB.crawlers) {
      const dup = found.find(f => f.e === c.e && f.pos.distanceTo(c.path[c.path.length - 1]) < 0.4);
      if (dup) { if (c.value > dup.score) { dup.score = c.value; dup.pos = c.path[c.path.length - 1].clone(); } continue; }
      found.push({ e: c.e, pos: c.path[c.path.length - 1].clone(), score: c.value, what: describe(c.e, c.end), m: null, mobile: true });
    }
    placeSensors(found);
    setSensorStatus(`Done: ${MOB.crawlers.length} mobile sensors settled at ${found.length} hotspots (${MOB.steps} search steps). Trails show the route each sensor took.`);
  }

  function animateMobile(dt) {
    if (!MOB.crawlers.length) return;
    if (MOB.running) MOB.t += dt / 0.35;
    const k = Math.min(MOB.t, MOB.steps - 1);
    for (const c of MOB.crawlers) {
      const vis = STR.on;
      c.m.visible = vis && MOB.running; c.trail.visible = vis;
      const i = Math.min(Math.floor(k), c.path.length - 1), f = Math.min(1, k - i);
      const j = Math.min(i + 1, c.path.length - 1);
      c.m.position.lerpVectors(c.path[i], c.path[j], i === j ? 0 : f);
      const pts = c.path.slice(0, i + 1).concat([c.m.position.clone()]);
      c.trail.geometry.dispose(); c.trail.geometry = new THREE.BufferGeometry().setFromPoints(pts);
      const v = localStress(c.e, c.m.position) / STR.maxU;
      c.m.material.color.copy(stressColor(v));
    }
    if (MOB.running && MOB.t >= MOB.steps - 1) finishMobile();
  }

  function setSensorStatus(t) { const el = document.getElementById("sensor-status"); if (el) el.textContent = t; }

  // ---------------- time evaluation ----------------
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const prog = (T, [a, b]) => clamp01((T - a) / (b - a));
  let showRebar = true;

  function robotGoal(r, T) {
    // active element for this robot
    for (const e of elements) {
      const p = prog(T, e.fill);
      if (p <= 0 || p >= 1) continue;
      if (e.robot !== "both" && e.robot !== r.i) continue;
      const top = e.y0 + e.h * p;
      let hx, hz, bx, bz, by;
      if (e.robot === "both") {
        const xa = r.i === 0 ? e.x0 + 0.6 : e.cx + 0.3, xb = r.i === 0 ? e.cx - 0.3 : e.x1 - 0.6;
        hx = xa + (xb - xa) * p;
        hz = e.z0 + 0.8 + (e.d - 1.6) * (0.5 + 0.5 * Math.sin(p * 26 + r.i * 2));
        bx = hx; bz = hz > 0 ? hz - 1.7 : hz + 1.7; by = e.y1;
        return { head: new THREE.Vector3(hx, e.y1 + 0.25, hz), base: new THREE.Vector3(bx, by, bz), e };
      }
      const s = 0.5 + 0.5 * Math.sin(p * 22);
      if (e.w >= e.d) { hx = e.x0 + 0.2 + (e.w - 0.4) * s; hz = e.cz; } else { hx = e.cx; hz = e.z0 + 0.2 + (e.d - 0.4) * s; }
      const dir = new THREE.Vector2(-hx, -hz); if (dir.length() < 0.01) dir.set(0, 1); dir.normalize();
      bx = hx + dir.x * 1.7; bz = hz + dir.y * 1.7; by = e.y0;
      return { head: new THREE.Vector3(hx, top + 0.3, hz), base: new THREE.Vector3(bx, by, bz), e };
    }
    return null;
  }

  function update(T, smooth) {
    for (const e of elements) {
      const pr = prog(T, e.rebar), pf = prog(T, e.fill); e.pr = pr; e.pf = pf;
      // rebar
      e.cage.visible = showRebar && pr > 0 && (pf < 1 || T < T_MAX - 0.02);
      if (e.slab) { e.cage.geometry.setDrawRange(0, Math.floor(e.segs * pr / 2) * 2); }
      else { e.cage.scale.y = Math.max(pr, 0.001); }
      // concrete
      e.mesh.visible = pf > 0;
      e.mesh.scale.y = Math.max(pf, 0.001);
      e.front.visible = pf > 0 && pf < 1;
      e.front.position.set(e.cx, e.y0 + e.h * pf + 0.005, e.cz);
    }
    // substrate
    const p0 = prog(T, [0, 0.7]);
    tankMeshes.forEach(m => { m.scale.y = Math.max(p0, 0.001); m.visible = p0 > 0; });
    pipes.forEach(m => { m.visible = T > 0.6; });
    centreRings.forEach(r => { r.visible = T > 0.8; r.position.y = T >= 2 ? 0.53 : 0.53 * prog(T, [1.3, 2]) + 0.03; });
    // robots
    const robotsOn = T > 0.8;
    for (const r of robots) {
      r.parts.forEach(p => { p.visible = robotsOn; });
      if (!robotsOn) continue;
      const goal = robotGoal(r, T);
      let tb, th;
      if (goal) { tb = goal.base; th = goal.head; }
      else {
        // idle: stay on the highest finished level near the centre
        const lvl = T >= 6.8 ? 7.3 : T >= 5 ? 3.9 : T >= 2 ? 0.5 : 0;
        const c = CENTRES[r.i];
        tb = new THREE.Vector3(c.x, lvl, c.z); th = tb.clone().add(new THREE.Vector3(r.i ? -0.7 : 0.7, 1.35, 0));
      }
      const k = smooth ? 0.18 : 1;
      r.pos.lerp(tb, k); r.headPos.lerp(th, k);
      r.base.position.copy(r.pos);
      r.base.rotation.y = Math.atan2(r.headPos.x - r.pos.x, r.headPos.z - r.pos.z);
      const shoulder = r.pos.clone().add(new THREE.Vector3(0, 0.9, 0));
      const head = r.headPos.clone().add(new THREE.Vector3(0, 0.35, 0));
      const mid = shoulder.clone().lerp(head, 0.5);
      const span = shoulder.distanceTo(head);
      const elbow = mid.add(new THREE.Vector3(0, Math.max(0.3, 2.4 - span * 0.5), 0));
      between(r.upper, shoulder, elbow); between(r.fore, elbow, head);
      r.elbowJ.position.copy(elbow); r.head.position.copy(head);
      between(r.nozzle, head, r.headPos.clone().add(new THREE.Vector3(0, 0.05, 0)));
      // hose from a tank to the robot
      const t = TANKS[r.i];
      const pts = [
        new THREE.Vector3(t.x, -0.75, t.z), new THREE.Vector3(t.x, 0.6, t.z - 0.5),
        new THREE.Vector3(r.pos.x * 0.5 + t.x * 0.5, 0.9, 5.3),
        new THREE.Vector3(r.pos.x, Math.max(r.pos.y, 0) + 1.4, 5.1),
        new THREE.Vector3(r.pos.x, Math.max(r.pos.y, 0) + 1.1, Math.min(r.pos.z + 1.2, 4.9)),
        r.pos.clone().add(new THREE.Vector3(0, 0.55, 0))
      ];
      r.hose.geometry.dispose();
      r.hose.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.07, 6, false);
      r.hose.visible = T > 1;
    }
    updateNetworks(T);
    updateStress();
  }

  // ---------------- camera orbit (drag / wheel / right-drag pan) ----------------
  const target = new THREE.Vector3(0, 2.0, 0.6);
  const orbit = { theta: 0.62, phi: 1.05, radius: 38 };
  function placeCamera() {
    const { theta, phi, radius } = orbit;
    camera.position.set(target.x + radius * Math.sin(phi) * Math.sin(theta), target.y + radius * Math.cos(phi), target.z + radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(target);
  }
  let drag = null;
  canvas.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
    if (drag.pan) {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const s = orbit.radius * 0.0016;
      target.addScaledVector(right, -dx * s).addScaledVector(up, dy * s);
    } else {
      orbit.theta -= dx * 0.006;
      orbit.phi = Math.min(1.5, Math.max(0.25, orbit.phi - dy * 0.005));
    }
    placeCamera();
  });
  canvas.addEventListener("pointerup", () => { drag = null; });
  canvas.addEventListener("contextmenu", e => e.preventDefault());
  canvas.addEventListener("wheel", e => { e.preventDefault(); orbit.radius = Math.min(80, Math.max(12, orbit.radius * (1 + Math.sign(e.deltaY) * 0.08))); placeCamera(); }, { passive: false });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // On narrow screens move the model up, away from the bottom panel.
    camera.setViewOffset(w, h, w > 760 ? Math.round(w * 0.1) : 0, w > 760 ? 0 : Math.round(h * 0.18), w, h);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  // ---------------- UI ----------------
  const slider = document.getElementById("time"), playBtn = document.getElementById("play");
  const list = document.getElementById("stages");
  const stageBtns = STAGES.map((s, i) => {
    const li = document.createElement("li"); const b = document.createElement("button");
    b.innerHTML = `<b>${i + 1}</b><span>${s.title}</span>`;
    b.addEventListener("click", () => { stop(); setT(i + 0.999); });
    li.appendChild(b); list.appendChild(li); return b;
  });
  function refLink(r) {
    const a = document.createElement("a"); a.href = r.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.innerHTML = `<span class="where">${r.where}</span>${r.label} ↗`; return a;
  }
  const allRefs = document.getElementById("all-refs");
  Object.values(REFS).forEach(r => allRefs.appendChild(refLink(r)));
  let T = 0, playing = false, last = 0;
  function setT(v, smooth) {
    T = Math.max(0, Math.min(T_MAX, v)); slider.value = Math.round(T * 1000);
    const si = Math.min(STAGES.length - 1, Math.floor(T));
    stageBtns.forEach((b, i) => { b.className = i < si || T >= T_MAX ? "done" : i === si ? "now" : ""; });
    document.getElementById("st-num").textContent = `Stage ${si + 1} of ${STAGES.length}`;
    document.getElementById("st-title").textContent = STAGES[si].title;
    document.getElementById("st-text").textContent = STAGES[si].text;
    const rb = document.getElementById("st-refs"); rb.innerHTML = "";
    if (STAGES[si].refs) {
      const h = document.createElement("p"); h.className = "refs-title"; h.textContent = "See it in reality"; rb.appendChild(h);
      STAGES[si].refs.forEach(k => rb.appendChild(refLink(REFS[k])));
    }
    document.getElementById("clock").textContent = `t = ${T.toFixed(2)} / ${T_MAX}`;
    update(T, smooth);
  }
  function stop() { playing = false; playBtn.textContent = "▶ Play"; }
  slider.addEventListener("input", () => { stop(); setT(slider.value / 1000); });
  playBtn.addEventListener("click", () => {
    if (playing) return stop();
    if (T >= T_MAX) setT(0);
    playing = true; playBtn.textContent = "❚❚ Pause"; last = performance.now();
  });
  document.getElementById("rebar").addEventListener("change", e => { showRebar = e.target.checked; update(T, false); });
  const xrayBox = document.getElementById("lay-xray");
  function layersChanged() { NET.nervous = document.getElementById("lay-nerv").checked; STR.on = document.getElementById("lay-stress").checked; Object.keys(NETS).forEach(k => { NETS[k].on = document.getElementById("net-" + k).checked; }); NET.xray = xrayBox.checked; setXray(NET.xray); update(T, false); }
  document.getElementById("lay-stress").addEventListener("change", layersChanged);
  document.getElementById("btn-mobile").addEventListener("click", () => { stop(); deployMobile(); });
  document.getElementById("btn-rules").addEventListener("click", () => { clearCrawlers(); STR.sig = ""; update(T, false); });
  ["lay-nerv", ...Object.keys(NETS).map(k => "net-" + k)].forEach(id => document.getElementById(id).addEventListener("change", ev => { if (ev.target.checked) xrayBox.checked = true; layersChanged(); }));
  xrayBox.addEventListener("change", layersChanged);
  // click on a chip
  const ray = new THREE.Raycaster(); let downAt = null;
  canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5 || !(NET.nervous || STR.on)) return;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    let hit = ray.intersectObjects(chips.filter(m => m.visible).concat(STR.sensors.filter(s => s.m.visible).map(s => s.m)), false)[0];
    let el = hit ? (hit.object.userData.el || hit.object.userData.sensor.e) : null;
    if (!el && STR.on) { const h2 = ray.intersectObjects(elements.filter(x => x.mesh.visible).map(x => x.mesh), false)[0]; if (h2) el = elements.find(x => x.mesh === h2.object); }
    NET.selected = el; chipCard(NET.selected); update(T, false);
  });

  function loop(now) {
    if (playing) {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      setT(T + dt * 0.2 * +document.getElementById("speed").value, true);
      if (T >= T_MAX) stop();
    }
    animateNetworks(now);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  resize(); placeCamera(); setT(0);
  // read the real checkbox state at start (browsers may restore it on reload)
  showRebar = document.getElementById("rebar").checked; layersChanged();
  // expose for testing
  window.__lba = { setT };
  requestAnimationFrame(loop);
})();
