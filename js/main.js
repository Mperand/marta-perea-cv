(() => {
  const $ = (s) => document.querySelector(s);
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ---------- Translations (English text lives in the HTML) ---------- */
  const ES = {
    nav_frida: "Frida",
    frida_title: "Proyecto Frida · iGEM 2026", frida_sub: "El diagnóstico de un bebé no debería depender de su nacionalidad.",
    frida_role: "<b>Team Leader</b> del proyecto Frida en iGEM UMA 25-26.",
    frida_p1: "Unos 300 millones de personas viven con una enfermedad rara, y la mayoría comienza en la infancia. Lo que se le detecta a un recién nacido depende de dónde nace: en España, la prueba del talón cubrió entre 15 y 45 enfermedades en 2024 según la región.",
    frida_p2: "Frida es el proyecto iGEM 2026 de la Universidad de Málaga. Analiza ARN derivado de mutaciones en una muestra de sangre mínimamente invasiva con CRISPR-SHERLOCK: un ARN guía dirige a la enzima LwCas13a hacia una mutación concreta y, al encontrarla, corta reporteros fluorescentes y la muestra se ilumina, sin necesidad de infraestructura de secuenciación.",
    frida_p3: "Con una guía por mutación, se pueden analizar muchas enfermedades a la vez. El equipo también ha creado Diana, una aplicación web que convierte una mutación en un ARN guía listo para pedir.",
    fs1: "personas con enfermedad rara", fs2: "enfermedades raras descritas", fs3: "empiezan en la infancia",
    frida_wiki: "Visitar la wiki del proyecto →", frida_uma: "Web de iGEM UMA",
    nav_about: "Sobre mí", nav_journey: "Trayectoria", nav_skills: "Habilidades", nav_lab: "Laboratorio", nav_contact: "Contacto",
    hero_eyebrow: "Bioquímica · Biología sintética · Biotecnología",
    hero_lead: "Estudiante de Bioquímica y líder del equipo iGEM UMA 25-26, programando la vida circuito genético a circuito genético.",
    cta_lab: "Explorar el laboratorio", cta_contact: "Contactar",
    about_title: "Sobre mí",
    about_p1: "Soy estudiante de Bioquímica en la Universidad de Málaga, con una profunda curiosidad por cómo las células computan, construyen y se adaptan. Mi enfoque es la biología molecular, la biología sintética y la biotecnología.",
    about_p2: "Como líder del equipo iGEM UMA, coordino un equipo estudiantil multidisciplinar que diseña sistemas biológicos modificados, desde la primera idea hasta el laboratorio.",
    stat_fields: "áreas clave", stat_english: "Inglés Cambridge", stat_team: "equipo iGEM liderado",
    journey_title: "Trayectoria",
    t1_date: "Mar 2025 – Actualidad", t1_role: "Miembro y líder del equipo 25-26",
    t1_desc: "Grupo de estudiantes dirigido por los profesores Carlos Rodríguez Caso y Manuel Bernal Muñoz, centrado en Biología Sintética, con el objetivo de recibir una formación práctica e interdisciplinar que complemente nuestros estudios de Grado.",
    t2_date: "Ene 2026", t2_title: "Diseño y metodología bioinformática integradora para el análisis de datos proteómicos",
    t2_desc: "Certificación expedida por la FGUMA, Fundación General de la Universidad de Málaga.",
    t3_date: "Jul 2023 – Actualidad", t3_title: "Grado en Bioquímica", t4_desc: "Universidad de Cambridge",
    skills_title: "Habilidades",
    s1: "Biología molecular", s2: "Biología sintética", s3: "Investigación biotecnológica", s4: "Bioquímica",
    s5: "Análisis de datos proteómicos", s6: "Bioinformática", s7: "Técnicas de laboratorio", s8: "Investigación",
    s9: "Trabajo en equipo", s10: "Resolución de problemas", s11: "Facilidad de adaptación", s12: "Inglés",
    lab_title: "Laboratorio interactivo", lab_sub: "Dos experimentos para jugar. No hace falta bata.",
    dogma_title: "Traductor del dogma central",
    dogma_hint: "Escribe una secuencia codificante de ADN (A, T, G, C) y mira cómo se convierte en ARNm y después en proteína.",
    protein: "Proteína", replay: "Repetir animación",
    circuit_title: "Circuito génico inducible",
    circuit_hint: "Un clásico de la biología sintética: un inductor desbloquea el promotor y la célula empieza a fabricar una proteína reportera fluorescente. Mueve el control.",
    inducer: "Inductor", m_mrna: "ARNm", m_prot: "Proteína (fluorescencia)",
    contact_title: "Conectemos",
    contact_sub: "Abierta a colaboraciones, oportunidades de investigación y conversaciones sobre biología sintética.",
  };
  const EN = {};
  document.querySelectorAll("[data-i18n]").forEach((el) => (EN[el.dataset.i18n] = el.innerHTML));
  let lang = store.get("lang") || "en";
  function setLang(l) {
    lang = l;
    root.lang = l;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.dataset.i18n;
      el.innerHTML = l === "es" && ES[k] ? ES[k] : EN[k];
    });
    $("#langBtn").textContent = l === "es" ? "EN" : "ES";
    store.set("lang", l);
  }
  $("#langBtn").onclick = () => setLang(lang === "en" ? "es" : "en");

  /* ---------- Theme ---------- */
  let colors = {};
  function readColors() {
    const cs = getComputedStyle(root);
    colors = { accent: cs.getPropertyValue("--accent").trim(), accent2: cs.getPropertyValue("--accent2").trim(), ok: cs.getPropertyValue("--ok").trim() };
  }
  function setTheme(t) {
    root.dataset.theme = t;
    $("#themeBtn").textContent = t === "dark" ? "☾" : "☀";
    store.set("theme", t);
    readColors();
  }
  $("#themeBtn").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  setTheme(store.get("theme") || "dark");
  setLang(lang);

  /* ---------- Scroll reveal & counters ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach((c) => {
      const to = +c.dataset.count; let n = 0;
      const t = setInterval(() => { c.textContent = ++n; if (n >= to) clearInterval(t); }, 300);
    });
    io.unobserve(e.target);
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  $("#yr").textContent = new Date().getFullYear();

  /* ---------- Background particles ---------- */
  const bg = $("#bg"), bctx = bg.getContext("2d");
  let W, H, pts = [];
  function sizeBg() {
    W = bg.width = innerWidth; H = bg.height = innerHeight;
    pts = Array.from({ length: Math.min(70, Math.floor(W / 22)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
  }
  addEventListener("resize", sizeBg); sizeBg();
  function drawBg() {
    bctx.clearRect(0, 0, W, H);
    bctx.fillStyle = colors.accent; bctx.strokeStyle = colors.accent;
    for (const p of pts) {
      p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
      bctx.globalAlpha = .5; bctx.beginPath(); bctx.arc(p.x, p.y, 1.6, 0, 7); bctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) { bctx.globalAlpha = (1 - d / 130) * .18; bctx.beginPath(); bctx.moveTo(pts[i].x, pts[i].y); bctx.lineTo(pts[j].x, pts[j].y); bctx.stroke(); }
    }
  }

  /* ---------- DNA double helix ---------- */
  const hc = $("#helix"), hx = hc.getContext("2d");
  function sizeHelix() {
    const r = hc.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    hc.width = r.width * dpr; hc.height = r.height * dpr; hx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", sizeHelix); sizeHelix();
  function drawHelix(t) {
    const w = hc.clientWidth, h = hc.clientHeight, n = 36, amp = Math.min(h * .28, 38);
    hx.clearRect(0, 0, w, h);
    const items = [];
    for (let i = 0; i < n; i++) {
      const x = 14 + (w - 28) * i / (n - 1), a = i * .5 - t * .0004;
      items.push({ x, y1: h / 2 + Math.sin(a) * amp, z1: Math.cos(a), y2: h / 2 - Math.sin(a) * amp, z2: -Math.cos(a) });
    }
    for (const s of items) { // rungs
      hx.globalAlpha = .35; hx.strokeStyle = colors.accent2; hx.lineWidth = 1.5;
      hx.beginPath(); hx.moveTo(s.x, s.y1); hx.lineTo(s.x, s.y2); hx.stroke();
    }
    const balls = [];
    items.forEach((s) => { balls.push([s.x, s.y1, s.z1, colors.accent]); balls.push([s.x, s.y2, s.z2, colors.ok]); });
    balls.sort((a, b) => a[2] - b[2]);
    for (const [x, y, z, c] of balls) {
      hx.globalAlpha = .45 + .55 * (z + 1) / 2; hx.fillStyle = c; hx.shadowColor = c; hx.shadowBlur = 6;
      hx.beginPath(); hx.arc(x, y, 2.5 + 2 * (z + 1) / 2, 0, 7); hx.fill();
    }
    hx.shadowBlur = 0; hx.globalAlpha = 1;
  }

  /* ---------- Central dogma translator ---------- */
  const B = "TCAG", AAS = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  const codon = (c) => AAS[B.indexOf(c[0]) * 16 + B.indexOf(c[1]) * 4 + B.indexOf(c[2])];
  function renderDogma() {
    const dna = $("#dna").value.toUpperCase().replace(/[^ATGC]/g, "");
    const rna = dna.replace(/T/g, "U");
    const base = (b, i, off) => `<span class="b-${b}" style="animation-delay:${(i * 25 + off)}ms">${b}</span>`;
    $("#rowDna").innerHTML = [...dna].map((b, i) => base(b, i, 0)).join("");
    $("#rowRna").innerHTML = [...rna].map((b, i) => base(b, i, 400)).join("");
    let prot = "";
    for (let i = 0; i + 2 < dna.length; i += 3) {
      const aa = codon(dna.slice(i, i + 3));
      prot += `<span class="aa${aa === "*" ? " stop" : ""}" style="animation-delay:${800 + i * 22}ms" title="${rna.slice(i, i + 3)}">${aa === "*" ? "STOP" : aa}</span>`;
      if (aa === "*") break;
    }
    $("#rowProt").innerHTML = prot;
  }
  $("#dna").addEventListener("input", renderDogma);
  $("#dnaPlay").onclick = renderDogma;
  renderDogma();

  /* ---------- Inducible gene circuit ---------- */
  const slider = $("#inducer"), svg = $("#circuit"), mg = $("#mrnas");
  let expr = 0, mRNA = 0, prot = 0, mrnaList = [], spawnAcc = 0;
  const hill = (x) => { const K = 40, n = 3, v = Math.pow(x, n); return v / (Math.pow(K, n) + v); };
  slider.oninput = () => { $("#inducerOut").textContent = slider.value + "%"; };
  function stepCircuit(dt) {
    const target = hill(+slider.value);
    expr += (target - expr) * Math.min(1, dt * 0.002);
    mRNA += (expr - mRNA) * Math.min(1, dt * 0.002);
    prot += (mRNA - prot) * Math.min(1, dt * 0.0007);
    spawnAcc += expr * dt * 0.012;
    while (spawnAcc > 1) {
      spawnAcc--;
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("r", 5); el.setAttribute("class", "mrna"); mg.appendChild(el);
      mrnaList.push({ el, x: 100, y: 95 });
    }
    for (let i = mrnaList.length - 1; i >= 0; i--) {
      const m = mrnaList[i]; m.x += dt * 0.09; m.y = 95 - Math.sin((m.x - 100) / 28) * 12 - 18;
      m.el.setAttribute("cx", m.x); m.el.setAttribute("cy", m.y);
      m.el.setAttribute("opacity", Math.max(0, 1 - (m.x - 100) / 480));
      if (m.x > 580) { m.el.remove(); mrnaList.splice(i, 1); }
    }
    $("#barM").style.width = mRNA * 100 + "%";
    $("#barP").style.width = prot * 100 + "%";
    const l = $("#liquid");
    l.style.opacity = (0.12 + prot * 0.88).toFixed(2);
    l.style.boxShadow = `0 0 ${prot * 50}px ${prot * 22}px ${colors.ok}`;
  }

  /* ---------- Main loop ---------- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(now - last, 60); last = now;
    if (!reduce) { drawBg(); }
    drawHelix(reduce ? 0 : now);
    stepCircuit(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
