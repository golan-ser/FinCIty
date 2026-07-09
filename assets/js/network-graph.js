/* ==========================================================================
   FinCity — Connected Knowledge Graph (video 0:09–0:15)
   Organic living graph: DOM nodes drift, SVG lines follow in real time,
   data pulses travel along the connections toward the AI core.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  /* Node definitions — positions in % of stage (x from right, RTL feel) */
  var NODES = [
    { id: 'core',     label: 'FinCity AI',          icon: 'fa-brain',                x: 50, y: 46, size: 92, type: 'center' },
    { id: 'tabar',    label: 'תב"ר 0982 · מרכז קהילתי', icon: 'fa-shekel-sign',      x: 30, y: 30, size: 62, type: '' },
    { id: 'pais',     label: 'מפעל הפיס',            icon: 'fa-building-columns',     x: 14, y: 62, size: 56, type: '' },
    { id: 'approve',  label: 'אישור תקציבי',         icon: 'fa-check',                x: 33, y: 76, size: 56, type: 'ok' },
    { id: 'council',  label: 'מועצה מקומית',         icon: 'fa-landmark',             x: 68, y: 22, size: 58, type: '' },
    { id: 'supplier', label: 'ספקים',                icon: 'fa-truck',                x: 84, y: 44, size: 56, type: '' },
    { id: 'milestone',label: 'אבן דרך',              icon: 'fa-flag-checkered',       x: 66, y: 78, size: 54, type: '' },
    { id: 'report',   label: 'דיווח חסר',            icon: 'fa-triangle-exclamation', x: 85, y: 68, size: 56, type: 'warn' },
    { id: 'risk',     label: 'סיכון לאובדן תקציב',   icon: 'fa-radiation',            x: 15, y: 20, size: 58, type: 'danger' }
  ];

  /* Mobile: tighter vertical spread */
  var NODES_MOBILE = {
    core:      { x: 50, y: 48 },
    tabar:     { x: 24, y: 26 },
    pais:      { x: 16, y: 66 },
    approve:   { x: 38, y: 84 },
    council:   { x: 74, y: 18 },
    supplier:  { x: 84, y: 42 },
    milestone: { x: 68, y: 84 },
    report:    { x: 82, y: 66 },
    risk:      { x: 20, y: 8 }
  };

  var EDGES = [
    ['core', 'tabar'], ['core', 'council'], ['core', 'supplier'],
    ['core', 'milestone'], ['core', 'approve'],
    ['tabar', 'pais'], ['tabar', 'risk'],
    ['supplier', 'report'], ['report', 'risk']
  ];

  /* Edges that light up red-ish — the detected risk chain */
  var RISK_CHAIN = { 'tabar-risk': true, 'report-risk': true, 'supplier-report': true };

  function init() {
    var stage = document.getElementById('graph-stage');
    var svg = document.getElementById('graph-svg');
    if (!stage || !svg) return;

    var isMobile = window.innerWidth < 768;
    var nodeEls = {};
    var drift = {};

    /* Extra gradient for risk chain */
    var defs = svg.querySelector('defs');
    var riskGrad = document.createElementNS(SVG_NS, 'linearGradient');
    riskGrad.setAttribute('id', 'riskGradient');
    riskGrad.innerHTML =
      '<stop offset="0%" stop-color="#fb7185" stop-opacity="0.9"/>' +
      '<stop offset="100%" stop-color="#fbbf24" stop-opacity="0.35"/>';
    defs.appendChild(riskGrad);

    /* Build DOM nodes */
    NODES.forEach(function (n, idx) {
      var el = document.createElement('div');
      el.className = 'graph-node' + (n.type ? ' graph-node--' + n.type : '');
      el.dataset.id = n.id;

      var pos = isMobile && NODES_MOBILE[n.id] ? NODES_MOBILE[n.id] : n;
      el.style.left = pos.x + '%';
      el.style.top = pos.y + '%';

      var size = isMobile ? Math.round(n.size * 0.78) : n.size;
      el.innerHTML =
        '<div class="graph-node-core" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.34) + 'px">' +
        '<i class="fas ' + n.icon + '"></i></div>' +
        '<span class="graph-node-label">' + n.label + '</span>' +
        (n.id === 'risk' ? '<span class="graph-node-badge">זוהה בביטחון 96%</span>' : '');

      stage.appendChild(el);
      nodeEls[n.id] = el;

      drift[n.id] = {
        ax: 4 + Math.random() * 5,
        ay: 4 + Math.random() * 5,
        sx: 0.25 + Math.random() * 0.3,
        sy: 0.2 + Math.random() * 0.3,
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2,
        ox: 0, oy: 0
      };
    });

    /* Build SVG edges */
    var lines = [];
    EDGES.forEach(function (e) {
      var key = [e[0], e[1]].sort().join('-');
      var isRisk = !!RISK_CHAIN[key];

      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('class', 'graph-line');
      if (isRisk) {
        path.style.stroke = 'url(#riskGradient)';
        path.style.filter = 'drop-shadow(0 0 5px rgba(251,113,133,0.55))';
      }
      svg.appendChild(path);

      var pulse = document.createElementNS(SVG_NS, 'circle');
      pulse.setAttribute('r', isRisk ? 3.2 : 2.6);
      pulse.setAttribute('fill', isRisk ? '#fb7185' : '#7dd3fc');
      pulse.style.filter = 'drop-shadow(0 0 6px ' + (isRisk ? 'rgba(251,113,133,0.9)' : 'rgba(125,211,252,0.9)') + ')';
      pulse.style.opacity = '0';
      svg.appendChild(pulse);

      lines.push({
        from: e[0], to: e[1], path: path, pulse: pulse, isRisk: isRisk,
        pulseT: Math.random(), pulseSpeed: 0.0022 + Math.random() * 0.0025,
        drawn: 0
      });
    });

    function center(id) {
      var el = nodeEls[id];
      var d = drift[id];
      var stageRect = stage.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      // node core center = top of node el + half core height
      var core = el.firstElementChild.getBoundingClientRect();
      return {
        x: core.left + core.width / 2 - stageRect.left,
        y: core.top + core.height / 2 - stageRect.top
      };
    }

    var revealed = false;
    var driftActive = false; // starts after pop-in choreography ends
    var lineProgress = 0;    // 0..1, animated on reveal

    function frame(t) {
      requestAnimationFrame(frame);
      if (!revealed) return;

      var time = t * 0.001;

      /* Organic drift — only after pop-in finished, so it never fights the CSS transition */
      if (driftActive && !reduceMotion) {
        NODES.forEach(function (n) {
          var d = drift[n.id];
          var el = nodeEls[n.id];
          d.ox = Math.sin(time * d.sx + d.px) * d.ax;
          d.oy = Math.cos(time * d.sy + d.py) * d.ay;
          el.style.transition = 'none';
          el.style.transform = 'translate(calc(-50% + ' + d.ox + 'px), calc(-50% + ' + d.oy + 'px)) scale(1)';
        });
      }

      if (lineProgress < 1) lineProgress = Math.min(1, lineProgress + 0.012);

      /* Redraw lines to follow drifting nodes */
      lines.forEach(function (L, i) {
        var a = center(L.from), b = center(L.to);
        // gentle curve: control point offset perpendicular
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        var dx = b.x - a.x, dy = b.y - a.y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var bend = Math.min(30, len * 0.12);
        var cx = mx + (-dy / len) * bend;
        var cy = my + (dx / len) * bend;

        L.path.setAttribute('d', 'M' + a.x + ',' + a.y + ' Q' + cx + ',' + cy + ' ' + b.x + ',' + b.y);

        // draw-in effect
        var total = L.path.getTotalLength();
        var local = Math.max(0, Math.min(1, lineProgress * lines.length - i * 0.55));
        L.path.style.strokeDasharray = total;
        L.path.style.strokeDashoffset = total * (1 - local);
        L.path.style.opacity = local > 0 ? '' : '0';

        /* Pulse traveling along the curve */
        if (local >= 1 && !reduceMotion) {
          L.pulseT += L.pulseSpeed * (L.isRisk ? 1.6 : 1);
          if (L.pulseT > 1) L.pulseT = 0;
          var pt = L.path.getPointAtLength(total * L.pulseT);
          L.pulse.setAttribute('cx', pt.x);
          L.pulse.setAttribute('cy', pt.y);
          L.pulse.style.opacity = '1';
        }
      });
    }
    requestAnimationFrame(frame);

    /* Reveal choreography: core first, then ring of nodes, then lines */
    function reveal() {
      if (revealed) return;
      revealed = true;

      var order = ['core', 'tabar', 'council', 'supplier', 'pais', 'approve', 'milestone', 'report', 'risk'];
      order.forEach(function (id, i) {
        setTimeout(function () {
          nodeEls[id].classList.add('is-visible');
        }, 120 + i * 160);
      });
      // hand over to the organic drift once the last node has popped in
      setTimeout(function () { driftActive = true; }, 120 + order.length * 160 + 650);
      // lines start after first few nodes are in
      lineProgress = reduceMotion ? 1 : 0;
      if (reduceMotion) {
        order.forEach(function (id) { nodeEls[id].classList.add('is-visible'); });
      }
    }

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 70%',
        once: true,
        onEnter: reveal
      });
    } else {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { reveal(); obs.disconnect(); }
      }, { threshold: 0.25 }).observe(stage);
    }

    /* Hover: highlight direct connections */
    Object.keys(nodeEls).forEach(function (id) {
      var el = nodeEls[id];
      el.addEventListener('pointerenter', function () {
        lines.forEach(function (L) {
          var connected = (L.from === id || L.to === id);
          L.path.style.strokeWidth = connected ? '2.6' : '1';
          L.path.style.opacity = connected ? '1' : '0.25';
        });
      });
      el.addEventListener('pointerleave', function () {
        lines.forEach(function (L) {
          L.path.style.strokeWidth = '';
          L.path.style.opacity = '';
        });
      });
    });

    /* Rebuild on resize breakpoint change */
    var wasMobile = isMobile;
    window.addEventListener('resize', function () {
      var nowMobile = window.innerWidth < 768;
      if (nowMobile !== wasMobile) location.reload();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
