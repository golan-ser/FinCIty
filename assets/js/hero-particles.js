/* ==========================================================================
   FinCity — Hero: Three.js glowing particle field + floating "lost documents"
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Three.js particle field ---------------- */
  function initParticles() {
    var canvas = document.getElementById('hero-particles');
    if (!canvas || typeof THREE === 'undefined') return;

    var hero = canvas.parentElement;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 10;

    var COUNT = window.innerWidth < 768 ? 350 : 700;
    var positions = new Float32Array(COUNT * 3);
    var speeds = new Float32Array(COUNT);
    var phases = new Float32Array(COUNT);

    for (var i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;      // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;  // z
      speeds[i] = 0.15 + Math.random() * 0.45;
      phases[i] = Math.random() * Math.PI * 2;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft round glow sprite drawn on an offscreen canvas
    var spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    var ctx = spriteCanvas.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(125, 211, 252, 1)');
    grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.55)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    var texture = new THREE.CanvasTexture(spriteCanvas);
    var material = new THREE.PointsMaterial({
      size: 0.14,
      map: texture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color('#7dd3fc')
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    // A few larger "beacon" particles in amber/green — budget health accents
    function beaconLayer(color, count, size) {
      var pos = new Float32Array(count * 3);
      for (var j = 0; j < count; j++) {
        pos[j * 3] = (Math.random() - 0.5) * 22;
        pos[j * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[j * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var m = new THREE.PointsMaterial({
        size: size, map: texture, transparent: true, opacity: 0.7,
        depthWrite: false, blending: THREE.AdditiveBlending,
        color: new THREE.Color(color)
      });
      var p = new THREE.Points(g, m);
      scene.add(p);
      return p;
    }
    var amber = beaconLayer('#fbbf24', 18, 0.22);
    var green = beaconLayer('#34d399', 18, 0.2);

    var mouseX = 0, mouseY = 0;
    window.addEventListener('pointermove', function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    var clock = new THREE.Clock();
    var running = true;

    // Pause rendering when hero is off-screen
    new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(hero);

    function tick() {
      requestAnimationFrame(tick);
      if (!running) return;

      var t = clock.getElapsedTime();
      var pos = geometry.attributes.position.array;
      for (var i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += Math.sin(t * speeds[i] + phases[i]) * 0.0012;
        pos[i * 3] += Math.cos(t * speeds[i] * 0.6 + phases[i]) * 0.0008;
      }
      geometry.attributes.position.needsUpdate = true;

      points.rotation.y = t * 0.015 + mouseX * 0.05;
      points.rotation.x = mouseY * 0.03;
      amber.rotation.y = t * 0.022;
      green.rotation.y = -t * 0.018;

      // Gentle breathing of the whole field
      var breathe = 1 + Math.sin(t * 0.4) * 0.02;
      points.scale.set(breathe, breathe, breathe);

      renderer.render(scene, camera);
    }

    if (reduceMotion) {
      resize();
      renderer.render(scene, camera);
    } else {
      tick();
    }
  }

  /* ---------------- Floating "lost documents" (video 0:01) ---------------- */
  function initFloatingDocs() {
    var layer = document.getElementById('float-docs');
    if (!layer) return;

    var ACCENTS = ['#38bdf8', '#34d399', '#fbbf24', '#818cf8'];
    var isMobile = window.innerWidth < 768;
    var COUNT = isMobile ? 6 : 12;

    for (var i = 0; i < COUNT; i++) {
      var doc = document.createElement('div');
      var accent = ACCENTS[i % ACCENTS.length];
      var size = 52 + Math.random() * 46;
      var left = Math.random() * 100;
      var top = 5 + Math.random() * 88;
      var depth = 0.25 + Math.random() * 0.55; // fake z: opacity+blur+scale
      var dur = 14 + Math.random() * 14;
      var delay = -Math.random() * 20;

      doc.className = 'float-doc';
      doc.style.cssText =
        'left:' + left + '%;top:' + top + '%;' +
        'width:' + size + 'px;height:' + (size * 1.3) + 'px;' +
        'opacity:' + (depth * 0.5) + ';' +
        'filter:blur(' + ((1 - depth) * 2.5) + 'px);' +
        'transform:scale(' + depth + ') rotate(' + ((Math.random() - 0.5) * 14) + 'deg);' +
        'animation-duration:' + dur + 's;animation-delay:' + delay + 's;';

      doc.innerHTML =
        '<span class="float-doc-tab" style="background:' + accent + '"></span>' +
        '<span class="float-doc-line" style="width:85%"></span>' +
        '<span class="float-doc-line" style="width:65%"></span>' +
        '<span class="float-doc-line" style="width:75%"></span>' +
        '<span class="float-doc-ring" style="border-color:' + accent + '"></span>';

      layer.appendChild(doc);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initParticles();
      initFloatingDocs();
    });
  } else {
    initParticles();
    initFloatingDocs();
  }
})();
