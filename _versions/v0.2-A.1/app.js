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
      text: "Two formation robots dock at the morphogenetic centres (gold rings). They form the base slab locally, layer by layer, from the delivered substrate. Material channels are laid inside the slab: the circulatory system of the building (layer \"Circulatory\")." },
    { title: "Robotic reinforcement",
      text: "Reinforcement cages for columns and walls are formed first. They fix the relational positions of the future elements: what connects to what, and where loads will travel. Every cage receives an IoT chip. The chips link with the elements they touch and with the centre hubs: the nervous system of the building (layer \"Nervous\").",
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
  const chipSelMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true });
  const linkMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5, depthTest: false });
  const linkSelMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, depthTest: false });
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
    return { name: "Centre hub c" + (i + 1), mesh: m };
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

  // Circulatory channels: list of straight pieces, each hosted by an element
  const pieces = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function chanPiece(a, b, host) {
    const g = new THREE.CylinderGeometry(0.05, 0.05, 1, 8); g.translate(0, 0.5, 0);
    const m = new THREE.Mesh(g, chanMat); m.renderOrder = 18; m.visible = false; scene.add(m);
    between(m, a, b); pieces.push({ a, b, host, m });
    host.channel = true;
  }
  function chanPath(pts, host) { for (let i = 0; i < pts.length - 1; i++) chanPiece(pts[i], pts[i + 1], host); }
  const byName = n => elements.find(e => e.name === n);
  const ring = (y, host) => chanPath([V(4.7, y, 3.7), V(-4.7, y, 3.7), V(-4.7, y, -3.7), V(4.7, y, -3.7), V(4.7, y, 3.7)], host);
  // inlets from the substrate pipes into the foundation manifold
  chanPath([V(3.4, -0.45, 2.9), V(3.4, 0.25, 2.9), V(3.4, 0.25, 3.7)], foundationEl);
  chanPath([V(4.6, -0.45, 2.9), V(4.6, 0.25, 2.9), V(4.6, 0.25, 3.7)], foundationEl);
  ring(0.25, foundationEl);
  ring(3.7, byName("First floor slab"));
  ring(7.1, byName("Roof slab"));
  elements.filter(e => /^Column G/.test(e.name)).forEach(e => chanPath([V(e.cx, 0.25, e.cz), V(e.cx, 3.7, e.cz)], e));
  elements.filter(e => /^Column U/.test(e.name)).forEach(e => chanPath([V(e.cx, 3.7, e.cz), V(e.cx, 7.1, e.cz)], e));
  elements.filter(e => /wall|Partition/i.test(e.name)).forEach(e => {
    const y = e.y0 + e.h * 0.5;
    if (e.w >= e.d) chanPath([V(e.x0, y, e.cz), V(e.x1, y, e.cz)], e); else chanPath([V(e.cx, y, e.z0), V(e.cx, y, e.z1)], e);
  });

  const flows = [];
  const flowGeo = new THREE.SphereGeometry(0.1, 8, 6);
  for (let i = 0; i < 70; i++) {
    const m = new THREE.Mesh(flowGeo, new THREE.MeshBasicMaterial({ color: 0xfff1c2, depthTest: false, transparent: true }));
    m.renderOrder = 21; m.visible = false; scene.add(m); flows.push({ m, P: null, t: 0 });
  }

  function setXray(on) {
    [M.concrete, M.front].forEach(mat => { mat.transparent = on; mat.opacity = on ? 0.28 : 1; mat.depthWrite = !on; mat.needsUpdate = true; });
  }

  function updateNetworks(T) {
    chips.forEach(m => { const e = m.userData.el; m.visible = NET.nervous && chipOn(e); m.material = NET.selected === e ? chipSelMat : chipMat; m.scale.setScalar(NET.selected === e ? 1.9 : 1); });
    hubs.forEach(h => { h.mesh.visible = NET.nervous && T > 0.8; });
    links.forEach(L => {
      L.line.visible = NET.nervous && linkOn(L, T);
      L.line.material = NET.selected && (L.ea === NET.selected || L.eb === NET.selected) ? linkSelMat : linkMat;
    });
    pieces.forEach(p => { p.m.visible = NET.blood && p.host.pf > 0; });
  }

  let netLast = 0, pulseAcc = 0, flowAcc = 0;
  function animateNetworks(now) {
    const dt = Math.min(0.1, (now - (netLast || now)) / 1000); netLast = now;
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
    if (NET.blood) {
      flowAcc += dt;
      const live = pieces.filter(q => q.m.visible);
      while (flowAcc > 0.05 && live.length) {
        flowAcc -= 0.05;
        const f = flows.find(q => !q.P); if (!f) break;
        f.P = live[(Math.random() * live.length) | 0]; f.t = 0; f.m.visible = true;
      }
    }
    flows.forEach(f => {
      if (!f.P) return;
      f.t += dt * 2.2 / Math.max(0.6, f.P.a.distanceTo(f.P.b));
      if (f.t >= 1 || !NET.blood || !f.P.m.visible) { f.P = null; f.m.visible = false; return; }
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
    card.innerHTML = `<p class="refs-title">IoT chip</p><h3>${e.chip.id} · ${e.name}</h3>
      <dl>
        <dt>Position relative to centre c${ci + 1}</dt><dd>dx ${(e.cx - c.x).toFixed(1)} m · dy ${(e.y0 + e.h / 2).toFixed(1)} m · dz ${(e.cz - c.z).toFixed(1)} m</dd>
        <dt>Signal links (${nb.length})</dt><dd>${nb.join(", ")}</dd>
        <dt>Material channel</dt><dd>${e.channel ? "yes, connected to the substrate tanks" : "no"}</dd>
        <dt>Status</dt><dd>${e.pf >= 1 ? "online · formed" : e.pf > 0 ? "online · element being formed" : "online · in reinforcement cage"}</dd>
      </dl>
      <p class="small">Property readings and damage response come in the next step.</p>`;
  }

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
  function layersChanged() { NET.nervous = document.getElementById("lay-nerv").checked; NET.blood = document.getElementById("lay-blood").checked; NET.xray = xrayBox.checked; setXray(NET.xray); update(T, false); }
  ["lay-nerv", "lay-blood"].forEach(id => document.getElementById(id).addEventListener("change", ev => { if (ev.target.checked) xrayBox.checked = true; layersChanged(); }));
  xrayBox.addEventListener("change", layersChanged);
  // click on a chip
  const ray = new THREE.Raycaster(); let downAt = null;
  canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5 || !NET.nervous) return;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    const hit = ray.intersectObjects(chips.filter(m => m.visible), false)[0];
    NET.selected = hit ? hit.object.userData.el : null; chipCard(NET.selected); update(T, false);
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
