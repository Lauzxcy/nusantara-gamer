/* =========================================================
   Nusantara Legends — script.js
   Navbar, reveal-on-scroll, count-up, typewriter, form
   ========================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Navbar: shadow saat scroll + toggle mobile ---------- */
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- 3. Count-up statistik hero ---------- */
  var statEls = document.querySelectorAll('#stats strong');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var start = null;

    if (prefersReduced) { el.textContent = String(target); return; }

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statEls.length) {
    if ('IntersectionObserver' in window) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      statEls.forEach(function (el) { statObserver.observe(el); });
    } else {
      statEls.forEach(animateCount);
    }
  }

  /* ---------- 4. Typewriter tagline ---------- */
  var tw = document.getElementById('typewriter');
  if (tw) {
    var phrases = [
      '> memuat region nusantara...',
      '> 150 spesies terdeteksi',
      '> petualangan dimulai'
    ];

    if (prefersReduced) {
      tw.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;

      (function tick() {
        var text = phrases[pi];
        if (!deleting) {
          ci++;
          tw.textContent = text.slice(0, ci);
          if (ci === text.length) {
            deleting = true;
            return setTimeout(tick, 1600);
          }
          return setTimeout(tick, 45);
        }
        ci--;
        tw.textContent = text.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          return setTimeout(tick, 350);
        }
        setTimeout(tick, 22);
      })();
    }
  }

  /* ---------- 5. Form playtest ---------- */
  var form = document.getElementById('playtestForm');
  var note = document.getElementById('formNote');
  var emailInput = document.getElementById('email');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = (emailInput.value || '').trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      note.classList.toggle('is-error', !valid);

      if (!valid) {
        note.textContent = 'Masukkan alamat email yang valid, ya.';
        emailInput.focus();
        return;
      }

      note.textContent = 'Berhasil! Undangan playtest akan dikirim ke ' + value + '.';
      form.reset();
    });

    emailInput.addEventListener('input', function () {
      if (note.classList.contains('is-error')) {
        note.textContent = '';
        note.classList.remove('is-error');
      }
    });
  }

  /* ---------- 6. Data detail starter & region ---------- */
  var STARTERS = {
    barawo: {
      no: '#001',
      name: 'BARAWO',
      type: 'Api',
      cls: 'fire',
      blurb: 'Kadal vulkanik kecil yang tidur di dalam abu panas. Sisiknya menyimpan panas dari kaldera Pulau Bara dan memercikkan api saat emosinya naik.',
      evo: [
        { name: 'Barawo', lvl: 'Lv. 16', final: false },
        { name: 'Baraka', lvl: 'Lv. 34', final: false },
        { name: 'Magmawang', lvl: 'Final', final: true }
      ],
      moves: [
        { name: 'Ember Pijar', type: 'Api', pow: 40 },
        { name: 'Cakar Abu', type: 'Normal', pow: 35 },
        { name: 'Panas Bara', type: 'Api', pow: 55 },
        { name: 'Semburan Kaldera', type: 'Api', pow: 90 }
      ],
      stats: { HP: 70, ATK: 85, DEF: 55, 'SP.ATK': 78, 'SP.DEF': 60, SPD: 75 }
    },
    arunai: {
      no: '#002',
      name: 'ARUNAI',
      type: 'Air',
      cls: 'water',
      blurb: 'Ikan arwana muda berlapis sisir kristal dari Selat Karang. Gelembung bertekanannya mampu memecah karang tanpa suara.',
      evo: [
        { name: 'Arunai', lvl: 'Lv. 16', final: false },
        { name: 'Arunaga', lvl: 'Lv. 34', final: false },
        { name: 'Bahariel', lvl: 'Final', final: true }
      ],
      moves: [
        { name: 'Sembur Gelembung', type: 'Air', pow: 40 },
        { name: 'Sisik Kilau', type: 'Normal', pow: 30 },
        { name: 'Pusaran Karang', type: 'Air', pow: 60 },
        { name: 'Gelombang Samudra', type: 'Air', pow: 95 }
      ],
      stats: { HP: 80, ATK: 60, DEF: 75, 'SP.ATK': 82, 'SP.DEF': 78, SPD: 70 }
    },
    rimboa: {
      no: '#003',
      name: 'RIMBOA',
      type: 'Rumput',
      cls: 'grass',
      blurb: 'Primata mungil penjaga tunas dari Rimba Borneo. Daun di punggungnya mekar mengikuti musim hujan dan menyembuhkan luka temannya.',
      evo: [
        { name: 'Rimboa', lvl: 'Lv. 16', final: false },
        { name: 'Rimbani', lvl: 'Lv. 34', final: false },
        { name: 'Wanaraksa', lvl: 'Final', final: true }
      ],
      moves: [
        { name: 'Pucuk Cambuk', type: 'Rumput', pow: 40 },
        { name: 'Pukul Ranting', type: 'Normal', pow: 35 },
        { name: 'Serbuk Spora', type: 'Rumput', pow: 50 },
        { name: 'Murka Rimba', type: 'Rumput', pow: 92 }
      ],
      stats: { HP: 75, ATK: 65, DEF: 85, 'SP.ATK': 70, 'SP.DEF': 88, SPD: 60 }
    }
  };

  var REGIONS = {
    bara: {
      name: 'Pulau Bara',
      kicker: '// Region 2',
      blurb: 'Kaldera raksasa yang masih bernapas. Kota pandai besi menempa logam di tepi kawah, dan gym tipe Api menanti di jantung gunung. Legenda penjaga magma tertidur di dasar kaldera — hanya terbangun saat gerhana.',
      highlights: ['Kawah Hidup', 'Kota Tempa Api', 'Gym Tipe Api', 'Legenda Magmawang'],
      gallery: [
        { label: 'Kawah saat senja' },
        { label: 'Kota pandai besi' },
        { label: 'Gerhana magma' }
      ]
    },
    karang: {
      name: 'Selat Karang',
      kicker: '// Region 1 — Titik Awal',
      blurb: 'Gugusan pulau karang tempat petualangan dimulai. Pasar terapung menjadi pusat trade dan kontes, sementara jalur selam menyimpan bangkai kapal kuno yang penuh Pokémon tipe Air langka.',
      highlights: ['Pasar Terapung', 'Jalur Selam', 'Kontes & Trade', 'Gym Tipe Air'],
      gallery: [
        { label: 'Pasar terapung' },
        { label: 'Taman karang' },
        { label: 'Bangkai kapal' }
      ]
    },
    rimba: {
      name: 'Rimba Borneo',
      kicker: '// Region 3',
      blurb: 'Hutan hujan berkabut dengan kanopi berlapis tiga. Saat hujan turun, jalur baru terbuka dan Pokémon endemik bermunculan. Gym tipe Rumput bersembunyi di puncak pohon raksasa.',
      highlights: ['Kanopi Berlapis', 'Hujan Endemik', 'Pohon Raksasa', 'Gym Tipe Rumput'],
      gallery: [
        { label: 'Kabut pagi' },
        { label: 'Kanopi raksasa' },
        { label: 'Sungai tersembunyi' }
      ]
    },
    papua: {
      name: 'Dataran Papua',
      kicker: '// Region 4 — Ujian Akhir',
      blurb: 'Pegunungan tinggi dan lembah tersembunyi di atas awan. Di sinilah para penantang menyelesaikan ujian terakhir sebelum melangkah ke Liga Nusantara. Cuaca bisa berubah dalam hitungan menit.',
      highlights: ['Lembah Awan', 'Ujian Puncak', 'Cuaca Ekstrem', 'Gerbang Liga'],
      gallery: [
        { label: 'Puncak bersalju' },
        { label: 'Lembah awan' },
        { label: 'Gerbang Liga' }
      ]
    }
  };

  /* ---------- 7. Modal ---------- */
  var modal = document.getElementById('modal');
  var modalContent = document.getElementById('modalContent');
  var modalClose = document.getElementById('modalClose');
  var lastFocused = null;

  function statBars(stats) {
    return Object.keys(stats).map(function (k) {
      return '<li><span>' + k + '</span><i style="--v:' + stats[k] + '%"></i><b>' + stats[k] + '</b></li>';
    }).join('');
  }

  function starterHTML(s) {
    return '' +
      '<div class="modal__hero">' +
        '<div class="sprite sprite--' + s.cls + '" aria-hidden="true"></div>' +
        '<div>' +
          '<p class="modal__no">POKÉDEX ' + s.no + ' · TIPE ' + s.type.toUpperCase() + '</p>' +
          '<h3 id="modalTitle">' + s.name + '</h3>' +
          '<p class="modal__blurb">' + s.blurb + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="modal__grid">' +
        '<div>' +
          '<span class="modal__label">// EVOLUSI</span>' +
          '<div class="evo">' +
            s.evo.map(function (e, i) {
              return (i ? '<span class="evo__arrow" aria-hidden="true"></span>' : '') +
                '<div class="evo__node">' +
                  '<div class="evo__mini' + (e.final ? ' evo__mini--final' : '') + '" style="--tint:var(--' + s.cls + ')"></div>' +
                  '<span class="evo__name">' + e.name + '</span>' +
                  '<span class="evo__lvl">' + e.lvl + '</span>' +
                '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div>' +
          '<span class="modal__label">// MOVESET</span>' +
          '<ul class="moves">' +
            s.moves.map(function (m) {
              return '<li><span>' + m.name + '</span><em>' + m.type + ' · ' + m.pow + '</em></li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="modal__foot">' +
        '<span class="modal__label">// BASE STATS</span>' +
        '<ul class="stats-row" style="--tint:var(--' + s.cls + ')">' + statBars(s.stats) + '</ul>' +
      '</div>';
  }

  function regionHTML(r) {
    var slug = r.name.toLowerCase().indexOf('bara') > -1 ? 'bara'
             : r.name.toLowerCase().indexOf('karang') > -1 ? 'karang'
             : r.name.toLowerCase().indexOf('rimba') > -1 ? 'rimba'
             : 'papua';
    return '' +
      '<div class="modal__hero">' +
        '<div>' +
          '<p class="modal__no">' + r.kicker + '</p>' +
          '<h3 id="modalTitle">' + r.name + '</h3>' +
          '<p class="modal__blurb">' + r.blurb + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="modal__grid">' +
        '<div>' +
          '<span class="modal__label">// HIGHLIGHT</span>' +
          '<ul class="moves">' +
            r.highlights.map(function (h) { return '<li><span>' + h + '</span><em>+</em></li>'; }).join('') +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<span class="modal__label">// GALERI</span>' +
          '<div class="gallery gallery--' + slug + '">' +
            r.gallery.map(function (g) {
              return '<figure><div class="gallery__thumb"></div><figcaption>' + g.label + '</figcaption></figure>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function openModal(html) {
    if (!modal || !modalContent) return;
    lastFocused = document.activeElement;
    modalContent.innerHTML = html;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (modal) {
    document.querySelectorAll('[data-starter]').forEach(function (el) {
      el.addEventListener('click', function () {
        var s = STARTERS[el.getAttribute('data-starter')];
        if (s) openModal(starterHTML(s));
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });

    document.querySelectorAll('[data-region]').forEach(function (el) {
      el.addEventListener('click', function () {
        var r = REGIONS[el.getAttribute('data-region')];
        if (r) openModal(regionHTML(r));
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------- 8. Pokédex: data, render, search, filter ---------- */
  var DEX = [
    { no:'#001', name:'Barawo',  type:'api',     cls:'fire',     blurb:'Kadal vulkanik kecil yang tidur di dalam abu panas.' },
    { no:'#002', name:'Arunai',  type:'air',     cls:'water',    blurb:'Ikan arwana muda berlapis sisir kristal.' },
    { no:'#003', name:'Rimboa',  type:'rumput',  cls:'grass',    blurb:'Primata mungil penjaga tunas rimba.' },
    { no:'#004', name:'Kilatno', type:'listrik', cls:'listrik',  blurb:'Tikus awan yang menyerap petir tropis.' },
    { no:'#005', name:'Batusu',  type:'batu',    cls:'batu',     blurb:'Bongkahan karang hidup penjaga pesisir.' },
    { no:'#006', name:'Baraka',  type:'api',     cls:'fire',     blurb:'Evolusi Barawo, punggungnya retak oleh magma.' },
    { no:'#007', name:'Arunaga', type:'air',     cls:'water',    blurb:'Naga sungai bersisik kristal dari Selat Karang.' },
    { no:'#008', name:'Rimbani', type:'rumput',  cls:'grass',    blurb:'Penjaga kanopi, akarnya menembus batu.' },
    { no:'#009', name:'Gunturo', type:'listrik', cls:'listrik',  blurb:'Burung badai yang bersarang di awan cumulus.' },
    { no:'#010', name:'Karanggo',type:'batu',    cls:'batu',     blurb:'Golem karang yang menumbuhkan terumbu baru.' },
    { no:'#011', name:'Magmawang',type:'api',    cls:'fire',     blurb:'Legenda penjaga kaldera, tidur di dasar gunung.' },
    { no:'#012', name:'Bahariel',type:'air',     cls:'water',    blurb:'Roh samudra yang menenangkan badai laut.' }
  ];

  var TYPE_LABEL = { api:'Api', air:'Air', rumput:'Rumput', listrik:'Listrik', batu:'Batu' };
  var TYPE_COLOR = { api:'var(--fire)', air:'var(--water)', rumput:'var(--grass)', listrik:'var(--brand-2)', batu:'#a8a29e' };

  var dexGrid = document.getElementById('dexGrid');
  var dexSearch = document.getElementById('dexSearch');
  var dexFilters = document.getElementById('dexFilters');
  var dexCount = document.getElementById('dexCount');
  var dexEmpty = document.getElementById('dexEmpty');
  var dexState = { q: '', type: 'all' };

  function dexCardHTML(p) {
    return '' +
      '<article class="dex-card" tabindex="0" role="button" style="--tint:' + TYPE_COLOR[p.type] + '" ' +
        'aria-label="Lihat detail ' + p.name + '" data-dex="' + p.name.toLowerCase() + '">' +
        '<p class="dex-card__no">' + p.no + '</p>' +
        '<div class="dex-card__sprite" aria-hidden="true"></div>' +
        '<h3>' + p.name + '</h3>' +
        '<span class="starter__type type--' + p.type + '">' + TYPE_LABEL[p.type] + '</span>' +
      '</article>';
  }

  function renderDex() {
    if (!dexGrid) return;
    var q = dexState.q.toLowerCase().trim();

    var list = DEX.filter(function (p) {
      var okType = dexState.type === 'all' || p.type === dexState.type;
      var okQ = !q || p.name.toLowerCase().indexOf(q) > -1 || p.no.indexOf(q) > -1;
      return okType && okQ;
    });

    dexGrid.innerHTML = list.map(dexCardHTML).join('');
    if (dexCount) {
      dexCount.innerHTML = 'Menampilkan <b>' + list.length + '</b> dari <b>' + DEX.length + '</b> spesies';
    }
    if (dexEmpty) dexEmpty.hidden = list.length > 0;
  }

  if (dexGrid) {
    renderDex();

    if (dexSearch) {
      dexSearch.addEventListener('input', function () {
        dexState.q = dexSearch.value;
        renderDex();
      });
    }

    if (dexFilters) {
      dexFilters.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter');
        if (!btn) return;
        dexState.type = btn.getAttribute('data-type');
        dexFilters.querySelectorAll('.filter').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        renderDex();
      });
    }

    dexGrid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-dex]');
      if (!card) return;
      var name = card.getAttribute('data-dex');
      var found = DEX.filter(function (p) { return p.name.toLowerCase() === name; })[0];
      if (!found) return;
      openModal(
        '<div class="modal__hero">' +
          '<div class="sprite sprite--' + found.cls + '" aria-hidden="true"></div>' +
          '<div>' +
            '<p class="modal__no">POKÉDEX ' + found.no + ' · TIPE ' + TYPE_LABEL[found.type].toUpperCase() + '</p>' +
            '<h3 id="modalTitle">' + found.name.toUpperCase() + '</h3>' +
            '<p class="modal__blurb">' + found.blurb + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="modal__foot">' +
          '<span class="modal__label">// CATATAN PENELITI</span>' +
          '<p class="modal__blurb" style="margin:0">Entri ini masih dalam pendataan. Selesaikan demo untuk membuka data lengkap: evolusi, moveset, dan habitat.</p>' +
        '</div>'
      );
    });

    dexGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('[data-dex]');
      if (!card) return;
      e.preventDefault();
      card.click();
    });
  }

  /* ---------- 9. Tahun footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
