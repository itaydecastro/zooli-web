
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    var els = document.querySelectorAll('.reveal, .crow');
    var lit = 0;

    function light(el) {
      if (el.classList.contains('on')) return;
      el.classList.add('on');
      countIn(el);
    }

    if (!('IntersectionObserver' in window) || REDUCED) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('on');
      countIn(document);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        lit++;
        light(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);

    setTimeout(function () {
      for (var k = 0; k < els.length; k++) {
        var box = els[k].getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          light(els[k]);
          io.unobserve(els[k]);
        }
      }
    }, 1200);
    setTimeout(function () {
      if (lit) return;
      for (var m = 0; m < els.length; m++) { light(els[m]); io.unobserve(els[m]); }
    }, 2500);
  }

  function countIn(scope) {
    var nums = scope.querySelectorAll ? scope.querySelectorAll('[data-count]') : [];
    for (var i = 0; i < nums.length; i++) run(nums[i]);
    if (scope.hasAttribute && scope.hasAttribute('data-count')) run(scope);

    function run(el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseInt(el.dataset.count, 10);
      if (!target || REDUCED) return;
      var final = el.textContent, t0 = null, DUR = 1200;
      requestAnimationFrame(function frame(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / DUR);
        if (p < 1) {
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)))
                               .toLocaleString('he-IL');
          requestAnimationFrame(frame);
        } else {
          el.textContent = final;
        }
      });
    }
  }

  function rigMascot() {
    var svg = document.getElementById('zooli');
    if (!svg) return;
    var pupils = [
      { el: document.getElementById('z-pupil-l'), cx: 99,  cy: 119 },
      { el: document.getElementById('z-pupil-r'), cx: 141, cy: 119 }
    ].filter(function (p) { return p.el; });

    if (pupils.length) {

      window.addEventListener('mousemove', function (e) {
        var r = svg.getBoundingClientRect();
        if (!r.width) return;
        pupils.forEach(function (p) {
          var dx = e.clientX - (r.left + r.width * (p.cx / 240)),
              dy = e.clientY - (r.top + r.height * (p.cy / 232)),
              d = Math.sqrt(dx * dx + dy * dy) || 1,
              k = Math.min(d, 260) / 260;
          p.el.style.transform =
            'translate(' + (dx / d * 4.5 * k).toFixed(2) + 'px,' +
                           (dy / d * 3.4 * k).toFixed(2) + 'px)';
        });
      }, { passive: true });
    }

    if (REDUCED) return;
    var eyes = [document.getElementById('z-eye-l'),
                document.getElementById('z-eye-r')].filter(Boolean);
    if (!eyes.length) return;
    function shut(ms) {
      eyes.forEach(function (e) { e.classList.add('shut'); });
      setTimeout(function () {
        eyes.forEach(function (e) { e.classList.remove('shut'); });
      }, ms);
    }

    (function loop() {
      setTimeout(function () {
        shut(115);
        if (Math.random() < 0.28) setTimeout(function () { shut(105); }, 260);
        loop();
      }, 2400 + Math.random() * 3600);
    })();
  }

  var NCHAINS = (document.body && document.body.dataset.chains) || '19';

  var REPLIES = [
    { k: ['מבצע', 'הנחה', 'הנחות'],
      a: 'בשלב הזה אני משווה מחירי מדף רגילים, בלי מבצעים — ככה ההשוואה בין הרשתות אחידה והוגנת. מבצעים יתווספו בהמשך 😉' },

    { k: ['מאיפה', 'מקור', 'מחירונים', 'אמין'],
      a: 'המחירים מגיעים מהמחירונים הרשמיים שכל רשת מחויבת בחוק לפרסם — אלה מחירי המדף האמיתיים בסניפים עצמם, ואני מושך אותם מחדש כל יום.' },

    { k: ['אופייני', 'הכי זול', 'איך מחשבים', 'איך אתם מחשבים',
          'איך אתה מחשב', 'איזה מחיר'],
      a: 'שתי הדרכים לחשב מחיר, כשלא ציינת מותג:\n1️⃣ אופייני — מה שרוב המשפחות משלמות על המוצר, לפי אמצע המדף באותה רשת.\n2️⃣ הכי זול — המותג הזול ביותר שיש על המדף באותה רשת.\nבשני המצבים אני משווה את אותו מוצר בין כל הרשתות — ומי שמציין מותג ("חלב תנובה") מקבל את המותג, בלי קשר להגדרה.' },

    { k: ['אילו רשתות', 'איזה רשתות', 'כמה רשתות', 'מי בהשוואה'],
      a: 'אני משווה ' + NCHAINS + ' רשתות מכל רחבי הארץ — ובכל עיר נכנסות להשוואה אלה שבאמת יש להן סניף באזור.' },

    { k: ['יוצא לסופר', 'לסופר', 'כמה יוצא', 'כמה עולה הסל'],
      a: '🛒 הסל שלך — 3 פריטים\n\n📍 ברדיוס 20 ק"מ ממך:\n\nיוחננוף · 29 ₪  ✅ הזול ביותר\n   רעננה · 1.3 ק"מ\nסופר ברקת · 29 ₪  ✅ הזול ביותר\nרמי לוי · 29 ₪  ✅ הזול ביותר\nמעיין 2000 · 30 ₪  (+1 ₪)\n\nועוד 13 רשתות יקרות יותר, עד 33 ₪ — לראות את כולן, תכתוב "כל הרשתות".' },

    { k: ['חלב תנובה', 'תנובה'],
      a: '💰 חלב תנובה — המחיר האופייני:\n\n  זול ובגדול · 7.35 ₪  ✅  (אין לי מחיר של תנובה שם — לפי חלב רגיל)\n  אושר עד · 7.65 ₪\n  יוחננוף · 8.07 ₪\n\nועוד 16 רשתות יקרות יותר, עד 14.70 ₪ — לראות את כולן תכתוב "כל הרשתות", או תשאל על רשת מסוימת: "חלב תנובה ברמי לוי".' },

    { k: ['כמה עולה חלב', 'מחיר חלב', 'חלב'],
      a: '💰 חלב — המחיר האופייני:\n\n  מעיין 2000 · 6.41 ₪  ✅\n  רמי לוי · 7.00 ₪\n  סופר ברקת · 7.13 ₪\n\nועוד 16 רשתות יקרות יותר, עד 9.70 ₪ — לראות את כולן תכתוב "כל הרשתות", או תשאל על רשת מסוימת: "חלב באושר עד".' },

    { k: ['רשימה קבועה', 'קבוע'],
      a: 'אין לך רשימה קבועה עדיין. 🙂\nאם משהו חוזר אצלך כל שבוע — "תוסיף חלב לרשימה הקבועה".' }
  ];

  var ADD = /(תוסיף|תוסיפי|נגמר|נגמרו|צריך|צריכה|תכניס)/;
  var BOUGHT = /(קניתי|לקחתי|שמתי)/;
  var SHOW = /(הצג|תציג|תראה|מה יש|מה ברשימה|הרשימה שלי)/;
  var DONE = /(סיימתי|גמרתי)/;
  var STORE = /(אני בסופר|נכנסתי לסופר|בתוך הסופר)/;
  var BARCODE = /^\s*\d[\d\s-]{6,}\d\s*$/;

  var REACT = '\u2064👍';
  var BREAK = '\n\u2063\n';

  var UNITS = {
    'מים מינרליים': 'מים מינרליים (בקבוק 1.5 ל\')',
    'שום': 'שום (ראש)',
    'סלמון': 'סלמון (חצי קילו)'
  };

  var REMOVE = /(תוריד|תורידי|להוריד|תמחק|תמחקי)/;
  var SHARE = /(לשתף|שיתוף|להצטרף|בן זוג|אישתי|בעלי|משותפת)/;

  var list = ['חלב', 'לחם', 'ביצים', 'מים מינרליים (בקבוק 1.5 ל\')'];
  var marked = [];

  var inStore = false;

  function lines() {
    return list.map(function (item, i) {
      var mark = marked.indexOf(item) !== -1;

      return '  ' + (i + 1) + '. ' + (mark ? '~' + item + '~ ✅' : item);
    }).join('\n');
  }

  function showList() { return '🛒 הרשימה שלך:\n' + lines(); }

  function items(n) { return n === 1 ? 'פריט אחד' : n + ' פריטים'; }

  function itemIn(rest) {
    var forms = [];
    var raw = (rest || '').trim();
    forms.push(raw);
    forms.push(raw.replace(/^\s*(?:את|לי)\s+/, '').trim());
    forms.push(raw.replace(/^\s*(?:את|לי)\s+/, '').replace(/^ה/, '').trim());
    for (var f = 0; f < forms.length; f++) {
      var want = forms[f];
      if (!want) continue;
      for (var i = 0; i < list.length; i++) {
        if (list[i].indexOf(want) === 0) return list[i];
      }
    }
    return null;
  }

  function reply(text) {
    var t = (text || '').trim();

    if (BARCODE.test(t)) {
      var code = t.replace(/\D/g, '');
      if (code === '7290004131074') {
        if (list.indexOf('חלב תנובה 3%') === -1) list.push('חלב תנובה 3%');
        return REACT + BREAK +
               '📷 חלב תנובה 3% שומן קרטון 1 ליטר מהדרין';
      }
      return 'לא מצאתי את הברקוד הזה אצלי. 🙂\n' +
             'תכתוב לי מה זה במילים ואוסיף לרשימה.';
    }

    if (STORE.test(t)) {
      inStore = true;
      return '🛒 קניות מהנות! הנה הרשימה:\n\n' + lines() + '\n\n' +
             'מה שלקחת — "קניתי חלב", או פשוט המספר: "2", "1 3".\n' +
             'ובסוף — "סיימתי".';
    }

    if (DONE.test(t)) {
      var n = marked.length;
      if (!n) return 'לא סימנת כלום, אז לא נגעתי ברשימה. 🙂';
      list = list.filter(function (i) { return marked.indexOf(i) === -1; });
      marked = [];
      inStore = false;
      return 'סיימנו. הורדתי ' + items(n) + ', ונשאר ברשימה:\n\n' + lines() +
             '\n\nמתחילים שבוע חדש 🙂 כשנגמר לך משהו — תכתוב לי.';
    }

    if (BOUGHT.test(t)) {
      var found = itemIn(t.replace(BOUGHT, ''));
      if (!found) return 'לא מצאתי את זה ברשימה. 🤔 תכתוב "הצג רשימה" ונראה מה יש.';
      if (!inStore) {

        list = list.filter(function (i) { return i !== found; });
        return 'הורדתי ' + found + ' מהרשימה. ✅\n\n🛒 הרשימה שלך עכשיו:\n' + lines();
      }
      if (marked.indexOf(found) === -1) marked.push(found);
      return 'סימנתי ' + found + '. ✅ נשארו ' +
             (list.length - marked.length) + ' מתוך ' + list.length +
             ':\n\n' + lines();
    }

    if (REMOVE.test(t)) {
      var gone = itemIn(t.replace(REMOVE, ''));
      if (!gone) return 'לא מצאתי את זה ברשימה. 🤔 תכתוב "הצג רשימה" ונראה מה יש.';
      list = list.filter(function (i) { return i !== gone; });
      marked = marked.filter(function (i) { return i !== gone; });
      return 'הורדתי ' + gone + ' מהרשימה. ✅\n\n🛒 הרשימה שלך עכשיו:\n' + lines();
    }

    if (SHOW.test(t)) return showList();

    if (SHARE.test(t)) {
      return 'אפשר לנהל את הרשימה ביחד. 👫\n\n' +
             'תשלח להם את הקוד הזה:  *A7K2M9*\n\n' +
             'הקוד תקף 24 שעות. מרגע שהם מצטרפים אתם רואים את אותה רשימה, ' +
             'ומה שאחד מוסיף השני רואה.';
    }

    if (ADD.test(t)) {

      var item = t.replace(/^\s*(?:סופרלי|זולי)\s*/, '').replace(ADD, '')
                  .replace(/^\s*(את|לי|ה)?\s*/, '').trim();
      if (!item) return REACT;
      var noted = UNITS[item] || item;
      if (list.indexOf(noted) === -1) list.push(noted);

      return noted === item ? REACT : REACT + BREAK + noted;
    }

    for (var i = 0; i < REPLIES.length; i++) {
      for (var j = 0; j < REPLIES[i].k.length; j++) {
        if (t.indexOf(REPLIES[i].k[j]) !== -1) return REPLIES[i].a;
      }
    }

    var KNOWN = ['חלב','לחם','ביצים','קוטג','גבינה צהובה','גבינה לבנה',
      'במבה','ביסלי','שוקו','אורז','פסטה','סוכר','קמח','מלח','שמן זית',
      'טונה','מיץ','עגבניות','מלפפונים','בצל','תפוחי אדמה','בננות',
      'תפוחים','מילקי','יוגורט','שמנת','חמאה','נייר טואלט','אבקת כביסה',
      'שמפו','סבון','משחת שיניים','חיתולים','מגבונים','קפה','נס קפה',
      'תה','דגני בוקר','קורנפלקס','פתי בר','קולה זירו','קוקה קולה',
      'קולה','ספרייט','ביצה','חומוס','טחינה','פיתות','לחמניות','מעדן',
      'מים','מים מינרליים','סודה','שוקולד','גלידה','שניצל','קטשופ',
      'מיונז','חרדל','מלפפון','עגבניה','לימון','אבוקדו','בשר טחון',
      'עוף','חזה עוף','גבינה','ביסקוויטים','וופלים','קרקרים','פסטרמה',
      'סלמון','דבש','ריבה','גרנולה','קורנפלור','פלפל','גזר','בטטה',
      "צ'יטוס","ציטוס",'פרינגלס','נוטלה','אוראו','טישו'];
    var bare = t.replace(/^\s*(?:נגמר|נגמרה|נגמרו|צריך|תוסיף|גם)?\s*(?:לי|ה)?\s*/, '').trim();
    for (var k = 0; k < KNOWN.length; k++) {
      if (bare === KNOWN[k] || bare === 'ה' + KNOWN[k] ||
          bare.indexOf(KNOWN[k]) === 0 && bare.length <= KNOWN[k].length + 8) {
        var name = UNITS[KNOWN[k]] || KNOWN[k];
        if (list.indexOf(name) === -1) list.push(name);
        return REACT;
      }
    }

    return 'פה אני רק שיחה לדוגמה 🙂 סופרלי האמיתי מבין הרבה יותר — ' +
           'מ"נגמר החלב" ועד צילום של רשימת קניות.\n' +
           'רוצים אותו? הכפתור הירוק למעלה 👆';
  }

  function whatsapp(text) {
    return text.replace(/[&<>]/g, function (c) {
             return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
           })
           .replace(/~([^~\n]+)~/g, '<s>$1</s>')
           .replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
  }

  function Chat(body, opts) {
    opts = opts || {};
    var busy = false, queue = [];

    function add(cls, text) {
      var el = document.createElement('div');
      el.className = 'msg ' + cls;
      el.innerHTML = whatsapp(text);
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    function botSays(text, done) {
      var dots = document.createElement('div');
      dots.className = 'msg bot typing';
      dots.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(dots);
      body.scrollTop = body.scrollHeight;
      setTimeout(function () {
        if (dots.parentNode) dots.parentNode.removeChild(dots);
        add('bot', text);
        if (done) done();
      }, REDUCED ? 0 : 620);
    }

    function pump() {
      if (busy || !queue.length) return;
      busy = true;
      var text = queue.shift();
      var mine = add('me', text);
      var out = reply(text) || '';

      if (out.charAt(0) !== '⁤') {
        botSays(out, function () { busy = false; pump(); });
        return;
      }

      var nl = out.indexOf('\n');
      var emoji = (nl === -1 ? out.slice(1) : out.slice(1, nl)).trim();
      var rest = (nl === -1 ? '' : out.slice(nl)).replace(/[\s⁣]+/, '').trim();

      setTimeout(function () {
        var chip = document.createElement('span');
        chip.className = 'react';
        chip.textContent = emoji;
        mine.appendChild(chip);
        body.scrollTop = body.scrollHeight;
        if (rest) {
          botSays(rest, function () { busy = false; pump(); });
        } else {
          busy = false; pump();
        }
      }, REDUCED ? 0 : 420);
    }

    return {
      send: function (text) {
        if (!text || !text.trim()) return;
        queue.push(text);
        pump();
      },

      photo: function (caption, replyText, after) {
        busy = true;
        var el = document.createElement('div');
        el.className = 'msg me photo';
        el.innerHTML = '<span class="bc" aria-hidden="true"></span>' +
                       '<span class="bc-num">' + caption + '</span>';
        body.appendChild(el);
        body.scrollTop = body.scrollHeight;
        botSays(replyText, function () {
          busy = false;
          if (after) after();
          pump();
        });
      },
      greet: function (text) {
        busy = true;
        botSays(text, function () { busy = false; pump(); });
      },
      reset: function () {
        body.innerHTML = '';
        queue = [];
        busy = false;
      }
    };
  }

  function inlineDemo() {
    var body = document.getElementById('demoBody');
    if (!body) return;
    var chat = Chat(body);
    var started = false;

    function start() {
      if (started) return;
      started = true;
      chat.greet('היי! אני סופרלי 👋 לחצו על אחת הדוגמאות למטה, או תכתבו לי משהו.');
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { start(); io.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(body.closest('.demo-phone') || body);
    } else {
      start();
    }

    var chips = document.querySelectorAll('[data-say]');
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener('click', function () {
        start();
        var say = c.getAttribute('data-say');

        if (/^\d{8,14}$/.test(say)) {
          if (list.indexOf('חלב תנובה 3%') === -1) list.push('חלב תנובה 3%');
          chat.photo(say,
            '📷 זיהיתי והוספתי: חלב תנובה 3% שומן קרטון 1 ליטר מהדרין ✅');
          return;
        }
        chat.send(say);
      });
    });

    var form = document.getElementById('demoForm');
    if (form) {
      var input = document.getElementById('demoInput');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        start();
        chat.send(input.value);
        input.value = '';
      });
    }

    var reset = document.getElementById('demoReset');
    if (reset) {
      reset.addEventListener('click', function () {
        chat.reset();
        started = false;
        start();
      });
    }
  }

  function cornerChat() {
    var fab = document.getElementById('fab'),
        box = document.getElementById('chatbox'),
        body = document.getElementById('cbBody');
    if (!fab || !box || !body) return;

    var chat = Chat(body), opened = false;
    var hint = document.getElementById('fabHint');

    function toggle(state) {
      box.classList.toggle('open', state);
      fab.classList.toggle('open', state);
      fab.setAttribute('aria-expanded', state ? 'true' : 'false');
      if (hint) hint.classList.toggle('gone', state);
      if (state && !opened) {
        opened = true;

        chat.greet('היי! אני סופרלי 👋 לחצו על אחת ההצעות למטה, או תכתבו לי מה נגמר בבית.');
      }
      if (state) setTimeout(function () {
        var i = document.getElementById('cbInput');
        if (i) i.focus();
      }, 260);
    }

    fab.addEventListener('click', function () {
      toggle(!box.classList.contains('open'));
    });

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-open-demo]'),
      function (b) {
        b.addEventListener('click', function () {
          toggle(true);
          box.scrollIntoView({ block: 'nearest' });
        });
      }
    );
    var x = document.getElementById('cbClose');
    if (x) x.addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('open')) {
        toggle(false); fab.focus();
      }
    });

    var form = document.getElementById('cbForm');
    if (form) {
      var input = document.getElementById('cbInput');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        chat.send(input.value);
        input.value = '';
      });
    }
    Array.prototype.forEach.call(box.querySelectorAll('[data-cbsay]'), function (b) {
      b.addEventListener('click', function () { chat.send(b.getAttribute('data-cbsay')); });
    });
  }

  var REEL = [
    { msgs: [
        ['me', 'תוסיף חלב', '👍'],
        ['me', 'נגמר הלחם', '👍'],
        ['me', 'תוסיף מים מינרליים', '👍'],
        ['bot', "מים מינרליים (בקבוק 1.5 ל')"]
      ] },
    { msgs: [
        ['me', 'הצג רשימה'],
        ['bot', '🛒 הרשימה שלך:\n  1. חלב\n  2. לחם\n  3. ביצים\n' +
                "  4. מים מינרליים (בקבוק 1.5 ל')"]
      ] },
    { msgs: [
        ['me', 'כמה עולה חלב'],
        ['bot', '💰 חלב — המחיר האופייני:\n\n  מעיין 2000 · 6.41 ₪  ✅\n' +
                '  רמי לוי · 7.00 ₪\n  סופר ברקת · 7.13 ₪\n\n' +
                'ועוד 16 רשתות יקרות יותר, עד 9.70 ₪.']
      ] },
    { msgs: [
        ['me', 'אני יוצא לסופר'],
        ['bot', '🛒 הסל שלך — 3 פריטים\n\n📍 ברדיוס 20 ק"מ ממך:\n\n' +
                'יוחננוף · 29 ₪  ✅ הזול ביותר\n   רעננה · 1.3 ק"מ\n' +
                'סופר ברקת · 29 ₪  ✅ הזול ביותר\nרמי לוי · 29 ₪  ✅ הזול ביותר\n' +
                'מעיין 2000 · 30 ₪  (+1 ₪)\n\n' +
                'ועוד 13 רשתות יקרות יותר, עד 33 ₪.']
      ] },
    { msgs: [
        ['me', 'קניתי חלב'],
        ['bot', 'סימנתי חלב. ✅ נשארו 2 מתוך 3:\n\n  1. ~חלב~ ✅\n  2. לחם\n  3. ביצים'],
        ['me', 'סיימתי'],
        ['bot', 'סיימנו. הורדתי פריט אחד, ונשאר ברשימה:\n\n  1. לחם\n  2. ביצים\n\n' +
                'מתחילים שבוע חדש 🙂']
      ] }
  ];

  function reel() {
    var body  = document.getElementById('reelBody');
    var stage = document.querySelector('.reel-stage');
    var wrap  = document.querySelector('.reel');
    var steps = [].slice.call(document.querySelectorAll('.reel-step'));
    if (!body || !stage || !steps.length) return;

    var shown = -1, token = 0, pending = null;

    function atEnd() {
      return body.scrollTop + body.clientHeight >= body.scrollHeight - 24;
    }

    function bubble(who, text, react) {
      var stick = atEnd();
      var el = document.createElement('div');
      el.className = 'msg ' + who;
      el.innerHTML = whatsapp(text);
      if (react) {
        var chip = document.createElement('span');
        chip.className = 'react';
        chip.textContent = react;
        el.appendChild(chip);
      }
      body.appendChild(el);
      if (stick) body.scrollTop = body.scrollHeight;
      return el;
    }

    function render(i, instant) {
      if (i === shown) return;
      shown = i;
      steps.forEach(function (s, n) { s.classList.toggle('on', n === i); });
      paint();
      var mine = ++token;
      body.innerHTML = '';
      var msgs = REEL[i].msgs, at = 0;

      if (REDUCED || instant) {
        msgs.forEach(function (m) { bubble(m[0], m[1], m[2]); });
        return;
      }

      (function next() {
        if (mine !== token || at >= msgs.length) return;
        var m = msgs[at++];
        if (m[0] === 'me') {
          var el = bubble('me', m[1]);
          if (m[2]) setTimeout(function () {
            if (mine !== token) return;
            var chip = document.createElement('span');
            chip.className = 'react';
            chip.textContent = m[2];
            el.appendChild(chip);
          }, 420);
          setTimeout(next, 620);
          return;
        }
        var stick = atEnd();
        var dots = document.createElement('div');
        dots.className = 'msg bot typing';
        dots.innerHTML = '<i></i><i></i><i></i>';
        body.appendChild(dots);
        if (stick) body.scrollTop = body.scrollHeight;
        setTimeout(function () {
          if (mine !== token) { if (dots.parentNode) dots.remove(); return; }
          dots.remove();
          bubble('bot', m[1]);
          setTimeout(next, 520);
        }, 700);
      })();
    }

    function anchor() {

      if (wrap && getComputedStyle(wrap).display === 'grid') {
        return window.innerHeight / 2;
      }
      var top = Math.max(stage.getBoundingClientRect().bottom, 0);
      var bottom = window.innerHeight;
      var bar = document.querySelector('.sticky-cta');
      if (bar) {
        var b = bar.getBoundingClientRect();
        if (b.height && b.top > top && b.top < bottom) bottom = b.top;
      }
      return (top + bottom) / 2;
    }

    function nearest() {
      var mid = anchor(), best = 0, gap = Infinity;
      steps.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < gap) { gap = d; best = i; }
      });
      return best;
    }

    var painting = false;
    function paint() {
      painting = false;
      var grid = wrap && getComputedStyle(wrap).display === 'grid';
      var box = stage.getBoundingClientRect();
      var top = Math.max(box.bottom, 0);

      var fade = Math.max(70, box.height * 0.24);
      var mid = anchor();
      steps.forEach(function (s, i) {
        if (REDUCED) { s.style.opacity = 1; return; }
        if (grid) { s.style.opacity = (i === shown) ? 1 : 0.34; return; }
        var r = s.getBoundingClientRect();
        var y = (r.top + r.bottom) / 2, o;

        if (y >= mid) {
          o = 1 - Math.min(1, (y - mid) / (r.height * 0.9)) * 0.66;
        } else if (y >= top) {
          o = 1;
        } else {
          o = Math.max(0, 1 - (top - y) / fade);
        }
        s.style.opacity = o;
      });
    }
    function repaint() {
      if (painting) return;
      painting = true;
      requestAnimationFrame(paint);
    }

    function onScroll() {
      repaint();
      var want = nearest();
      if (want === shown) return;

      clearTimeout(pending);
      pending = setTimeout(function () {
        var want2 = nearest();
        render(want2, Math.abs(want2 - shown) > 1);
      }, 130);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    render(0);

    window.__reel = { render: render, nearest: nearest, anchor: anchor,
                      paint: paint, steps: steps };
  }

  function init() {
    reveal();
    rigMascot();
    inlineDemo();
    reel();
    cornerChat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
