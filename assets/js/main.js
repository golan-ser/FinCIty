/* ==========================================================================
   FinCity — Main choreography
   GSAP ScrollTrigger reveals · split-text hero · AI typing · count-ups ·
   progress bars · lead form (logic preserved from previous version)
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined';
  if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------
     1) Split-text hero reveal (word-level, RTL-safe)
     ------------------------------------------------------------------ */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    // background-clip:text does not reach into transformed children,
    // so a gradient on the parent must move onto each word span
    var gradient = el.classList.contains('text-gradient');
    if (gradient) el.classList.remove('text-gradient');
    el.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'split-word' + (gradient ? ' text-gradient' : '');
      span.style.cssText = 'display:inline-block;white-space:pre;';
      span.textContent = w + (i < words.length - 1 ? ' ' : '');
      el.appendChild(span);
    });
    return el.querySelectorAll('.split-word');
  }

  function heroIntro() {
    var l1 = document.getElementById('hero-line-1');
    var l2 = document.getElementById('hero-line-2');
    if (!l1 || !l2) return;

    if (reduceMotion || !hasGsap) return;

    var w1 = splitWords(l1);
    var w2 = splitWords(l2);

    gsap.set([w1, w2], { yPercent: 110, opacity: 0 });
    var tl = gsap.timeline({ delay: 0.25 });
    tl.to(w1, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.09, ease: 'expo.out' })
      .to(w2, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.09, ease: 'expo.out' }, '-=0.75');
  }

  /* ------------------------------------------------------------------
     2) AI prompt typing simulation (video 0:04–0:12)
     ------------------------------------------------------------------ */
  function typeLoop() {
    var target = document.getElementById('typed-question');
    var answer = document.getElementById('ai-answer');
    if (!target) return;

    var QUESTIONS = [
      'מצא את כל התקציבים שעלו לסיכון השנה...',
      'אילו תב"רים מסתיימים ברבעון הקרוב?',
      'כמה נשאר לניצול מול מפעל הפיס?'
    ];
    // Pages can override via data-questions='["...", "..."]' on #typed-question
    if (target.dataset.questions) {
      try { QUESTIONS = JSON.parse(target.dataset.questions); } catch (e) { /* keep defaults */ }
    }
    var qi = 0;

    if (reduceMotion) {
      target.textContent = QUESTIONS[0];
      if (answer) { answer.style.opacity = '1'; answer.style.transform = 'none'; }
      return;
    }

    function typeText(text, done) {
      var i = 0;
      (function step() {
        target.textContent = text.slice(0, i++);
        if (i <= text.length) setTimeout(step, 34 + Math.random() * 40);
        else done();
      })();
    }

    function eraseText(done) {
      var text = target.textContent;
      (function step() {
        text = text.slice(0, -2);
        target.textContent = text;
        if (text.length) setTimeout(step, 12);
        else done();
      })();
    }

    (function cycle() {
      typeText(QUESTIONS[qi], function () {
        if (answer && qi === 0) {
          answer.style.opacity = '1';
          answer.style.transform = 'translateY(0)';
        }
        setTimeout(function () {
          eraseText(function () {
            qi = (qi + 1) % QUESTIONS.length;
            setTimeout(cycle, 400);
          });
        }, 3200);
      });
    })();
  }

  /* ------------------------------------------------------------------
     3) Generic reveals
     ------------------------------------------------------------------ */
  function reveals() {
    var els = document.querySelectorAll('.reveal');
    if (hasGsap && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
      els.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: function () { el.classList.add('is-visible'); }
        });
      });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.05 });
      els.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------------------
     4) Risk cards stagger (video 0:16–0:20)
     ------------------------------------------------------------------ */
  function riskCards() {
    var cards = document.querySelectorAll('.risk-item');
    if (!cards.length) return;

    if (hasGsap && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
      gsap.set(cards, { y: 60, opacity: 0, scale: 0.96 });
      ScrollTrigger.create({
        trigger: '#risk-cards',
        start: 'top 78%',
        once: true,
        onEnter: function () {
          gsap.to(cards, {
            y: 0, opacity: 1, scale: 1,
            duration: 1.1, stagger: 0.18, ease: 'expo.out',
            onComplete: fillConfidence
          });
        }
      });
    } else {
      cards.forEach(function (c) { c.style.opacity = '1'; });
      fillConfidence();
    }

    function fillConfidence() {
      document.querySelectorAll('.confidence-fill').forEach(function (f) {
        f.style.width = (f.dataset.confidence || 0) + '%';
      });
    }
  }

  /* ------------------------------------------------------------------
     5) Count-ups + KPI bars (video 0:22–0:26)
     ------------------------------------------------------------------ */
  function formatNum(v, decimals) {
    if (decimals > 0) return v.toFixed(decimals);
    return Math.round(v).toLocaleString('en-US');
  }

  function countUps() {
    var els = document.querySelectorAll('[data-countup]');
    els.forEach(function (el) {
      var end = parseFloat(el.dataset.countup);
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      var prefix = el.dataset.prefix || '';

      function run() {
        if (reduceMotion || !hasGsap) {
          el.textContent = prefix + formatNum(end, decimals);
          return;
        }
        var obj = { v: 0 };
        gsap.to(obj, {
          v: end, duration: 1.8, ease: 'power2.out',
          onUpdate: function () { el.textContent = prefix + formatNum(obj.v, decimals); }
        });
      }

      if (hasGsap && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: run });
      } else {
        new IntersectionObserver(function (entries, obs) {
          if (entries[0].isIntersecting) { run(); obs.disconnect(); }
        }, { threshold: 0.4 }).observe(el);
      }
    });
  }

  function kpiBars() {
    var panel = document.getElementById('live-panel');
    if (!panel) return;

    function fill() {
      panel.querySelectorAll('.kpi-bar-fill').forEach(function (f, i) {
        setTimeout(function () {
          f.style.width = (f.dataset.fill || 0) + '%';
        }, i * 110);
      });
    }

    if (hasGsap && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
      ScrollTrigger.create({ trigger: panel, start: 'top 75%', once: true, onEnter: fill });
    } else {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { fill(); obs.disconnect(); }
      }, { threshold: 0.2 }).observe(panel);
    }
  }

  /* ------------------------------------------------------------------
     6) Scroll-to-pilot focus helper (preserved behavior)
     ------------------------------------------------------------------ */
  function pilotFocus() {
    document.querySelectorAll('[data-scroll-to-pilot]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        setTimeout(function () {
          var leadFullName = document.getElementById('leadFullName');
          if (leadFullName) leadFullName.focus({ preventScroll: true });
        }, 650);
      });
    });
  }

  /* ------------------------------------------------------------------
     7) Lead form — logic preserved exactly (endpoint, payload, messages)
     ------------------------------------------------------------------ */
  function leadForm() {
    var form = document.getElementById('leadForm');
    if (!form) return;

    var fullNameInput = document.getElementById('leadFullName');
    var emailInput = document.getElementById('leadEmail');
    var municipalityInput = document.getElementById('leadMunicipality');
    var roleInput = document.getElementById('leadRole');
    var phoneInput = document.getElementById('leadPhone');
    var messageBox = document.getElementById('formMessage');
    var submitBtn = document.getElementById('submitBtn');
    var submitBtnDefaultText = submitBtn.innerText;
    var isSubmitting = false;

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showMessage(text, type) {
      messageBox.classList.remove('hidden');
      messageBox.innerText = text;
      if (type === 'success') {
        messageBox.classList.remove('text-rose-400');
        messageBox.classList.add('text-emerald-300');
      } else {
        messageBox.classList.remove('text-emerald-300');
        messageBox.classList.add('text-rose-400');
      }
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      var fullName = fullNameInput.value.trim();
      var email = emailInput.value.trim();
      var municipality = municipalityInput.value.trim();
      var role = roleInput ? roleInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';

      if (!fullName) {
        showMessage('נא להזין שם מלא.', 'error');
        fullNameInput.focus();
        return;
      }
      if (!email || !emailPattern.test(email)) {
        showMessage('נא להזין כתובת מייל תקינה.', 'error');
        emailInput.focus();
        return;
      }
      if (!municipality) {
        showMessage('נא להזין את שם הרשות.', 'error');
        municipalityInput.focus();
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.innerText = 'שולח...';
      messageBox.classList.add('hidden');

      try {
        // Which product page the lead came from (form data-product attr; backend defaults to tabarim)
        var payload = {
          fullName: fullName, email: email, municipality: municipality,
          role: role, phone: phone,
          product: form.dataset.product || 'tabarim'
        };

        var response = await fetch('https://fincity-mail-func-prod.azurewebsites.net/api/sendlead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Server error');

        showMessage('תודה, הפנייה התקבלה.\nנבחן את הפרטים וניצור קשר בהתאם.', 'success');
        submitBtn.innerText = 'הפנייה נשלחה';
      } catch (error) {
        showMessage('משהו השתבש בשליחת הפנייה. אפשר לנסות שוב בעוד רגע.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerText = submitBtnDefaultText;
        isSubmitting = false;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  function init() {
    heroIntro();
    typeLoop();
    reveals();
    riskCards();
    countUps();
    kpiBars();
    pilotFocus();
    leadForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
