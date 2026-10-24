// RyuTube Dojo — language toggle, mobile menu, click-to-play videos, kata clip
(function () {
  var root = document.documentElement;
  var meta = {
    ja: {
      title: 'RyuTube道場｜りゅう先生の空手『形』動画分析・プライベートレッスン',
      desc: 'YouTube「RyuTube道場」のりゅう先生による空手の形指導。全流派対応の動画分析、対面・オンラインのプライベートレッスン、道場セミナー。ご予約・ご相談は公式LINEから。'
    },
    en: {
      title: 'RyuTube Dojo | Karate kata video analysis & private lessons with Ryu Sensei',
      desc: 'Karate kata coaching from Ryu Sensei of RyuTube Dojo: video analysis for every major style, private lessons in person or online, and dojo seminars. Book on LINE.'
    }
  };

  function setLang(lang) {
    root.lang = lang;
    document.title = meta[lang].title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.content = meta[lang].desc;
    try { localStorage.setItem('lang', lang); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }
  setLang(root.lang === 'en' ? 'en' : 'ja');

  document.querySelector('[data-lang-toggle]').addEventListener('click', function () {
    setLang(root.lang === 'ja' ? 'en' : 'ja');
  });

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Load the YouTube player only when a video is clicked
  document.querySelectorAll('.video[data-yt]').forEach(function (v) {
    v.addEventListener('click', function () {
      var box = document.createElement('div');
      var f = document.createElement('iframe');
      var title = v.querySelector('.video-title');
      box.className = 'video playing';
      f.src = 'https://www.youtube-nocookie.com/embed/' + v.dataset.yt + '?autoplay=1&rel=0';
      f.title = title.textContent.trim();
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      box.append(f, title);
      v.replaceWith(box);
    });
  });

  // Kata clip: play only while on screen, and not at all for reduced motion
  var clip = document.querySelector('[data-clip]');
  if (clip && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { clip.play().catch(function () {}); } else { clip.pause(); }
      });
    }, { threshold: 0.3 }).observe(clip);
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
