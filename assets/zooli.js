/* ==========================================================================
   זולי — הקוד המשותף לכל דפי האתר.
   חשיפה בגלילה · ספירת מספרים · הנפשת הדמות · מנוע השיחה לדוגמה.

   ⚠️ **קובץ אחד ולא עותק בכל דף.** דף הנחיתה והדשבורד מריצים את אותה
   הדגמה; שני עותקים היו מתפצלים ברגע שמישהו מתקן ניסוח באחד מהם.

   ⚠️ **התשובות בשיחה הן הניסוחים האמיתיים של הבוט** (messages.py) ופלט
   מוקלט של הרצה אמיתית. **המחירים נקראו מטבלאות המחירים** ולא הומצאו
   כדי להיראות טוב. אסור להוסיף כאן תשובה שהבוט לא יודע לתת: הדגמה
   שמבטיחה התנהגות שלא קיימת היא בדיוק השקר שהמוצר לא יכול להרשות
   לעצמו.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------ חשיפה בגלילה */
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

    /* ⚠️ **רשת ביטחון מפני מסך ראשון לבן.** 14 אלמנטים בגיבור — ובהם
       ה-H1 עצמו — מתחילים בשקיפות 0 ומחכים ל-observer. הייתה נפילה
       לאחור אם הוא **לא קיים**, ולא הייתה שום נפילה אם הוא קיים
       ו**לא יורה** — ואז הדף עולה ריק, בלי שגיאה אחת בקונסולה. זה לא
       תיאורטי: זה נראה בפועל בחלון תצוגה אחד שמקפיא observers.

       שתי שכבות, ושתיהן לא נוגעות במקרה התקין: אחרי 1.2 שניות נחשף מה
       שנמצא בתוך המסך, ואם אחרי 2.5 שניות **לא נחשף כלום** — כלומר
       ה-observer שבור ולא איטי — נחשף הכול. */
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

  /* ----------------------------------------------------- ספירת מספרים
   * ⚠️ הטקסט בקובץ הוא כבר הערך הסופי, וה-JS רק מנפיש אליו. דף שבו
   * המספר נכתב ב-JS מציג אפס למי שהסקריפט נכשל אצלו — כלומר משקר
   * דווקא כשמשהו שבור.
   */
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
          el.textContent = final;      /* תמיד חוזרים למחרוזת המקורית */
        }
      });
    }
  }

  /* ---------------------------------------------------------- הדמות */
  function rigMascot() {
    var svg = document.getElementById('zooli');
    if (!svg) return;
    var pupils = [
      { el: document.getElementById('z-pupil-l'), cx: 99,  cy: 119 },
      { el: document.getElementById('z-pupil-r'), cx: 141, cy: 119 }
    ].filter(function (p) { return p.el; });

    if (pupils.length) {
      /* האישונים מרוסנים בכוונה: אישון שנוסע עד קצה גלגל העין נראה
         מבוהל, לא סקרן. */
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
    /* קצב לא סדיר, ולפעמים מצמוץ כפול — עין שנעצמת כל שנייה בדיוק
       נקראת כנורית ולא כיצור חי. */
    (function loop() {
      setTimeout(function () {
        shut(115);
        if (Math.random() < 0.28) setTimeout(function () { shut(105); }, 260);
        loop();
      }, 2400 + Math.random() * 3600);
    })();
  }

  /* ------------------------------------------------------ מנוע השיחה */
  var NCHAINS = (document.body && document.body.dataset.chains) || '19';

  var REPLIES = [
    { k: ['מבצע', 'הנחה', 'הנחות'],
      a: 'בשלב הזה אני משווה מחירי מדף רגילים, בלי מבצעים — ככה ההשוואה בין הרשתות אחידה והוגנת. מבצעים יתווספו בהמשך 😉' },

    { k: ['מאיפה', 'מקור', 'מחירונים', 'אמין'],
      a: 'המחירים מגיעים מהמחירונים הרשמיים שכל רשת מחויבת בחוק לפרסם — אלה מחירי המדף האמיתיים בסניפים עצמם, ואני מושך אותם מחדש כל יום.' },

    /* ⚠️ **ההדגמה כאן מקדימה את הבוט, וזו הכרעה מפורשת של איתי.**
       נמדד: הבוט האמיתי עונה על "מה זה אופייני?" ועל "מה זה הכי זול?",
       אבל "איך מחשבים את המחיר?" ו"איזה מחיר אתם לוקחים" נופלים שם
       ל"לא זיהיתי" — ואחד מהם אפילו מציע להוסיף את השאלה לרשימת
       הקניות. איתי ביקש בכל זאת את הניסוח הטבעי בדף, כי הוא זה שמסביר
       למבקר מה הוא מקבל.

       ⚠️ **ולכן זה חוב, ולא פיצ'ר.** הדף אינו יכול להישאר כך אחרי
       שיהיה מספר לבוט. `_faq_answer` ב-bot.py צריך לקבל את המפתחות
       הבאים: `איך מחשבים` · `איך אתם מחשבים` · `איך אתה מחשב` ·
       `איזה מחיר`. עד אז אף אחד לא יכול לכתוב לבוט האמיתי — אין לו
       מספר — אז הפער אינו מגיע לאף משתמש. **ברגע שהמספר קיים, הוא
       כן.** */
    { k: ['אופייני', 'הכי זול', 'איך מחשבים', 'איך אתם מחשבים',
          'איך אתה מחשב', 'איזה מחיר'],
      a: 'שתי הדרכים לחשב מחיר, כשלא ציינת מותג:\n1️⃣ אופייני — מה שרוב המשפחות משלמות על המוצר, לפי אמצע המדף באותה רשת.\n2️⃣ הכי זול — המותג הזול ביותר שיש על המדף באותה רשת.\nבשני המצבים אני משווה את אותו מוצר בין כל הרשתות — ומי שמציין מותג ("חלב תנובה") מקבל את המותג, בלי קשר להגדרה.' },

    { k: ['אילו רשתות', 'איזה רשתות', 'כמה רשתות', 'מי בהשוואה'],
      a: 'אני משווה ' + NCHAINS + ' רשתות מכל רחבי הארץ — ובכל עיר נכנסות להשוואה אלה שבאמת יש להן סניף באזור.' },

    /* פלט מוקלט מהרצה אמיתית (רעננה, סל של שלושה פריטים). */
    { k: ['יוצא לסופר', 'לסופר', 'כמה יוצא', 'כמה עולה הסל'],
      a: '🛒 הסל שלך — 3 פריטים\n\n📍 ברדיוס 20 ק"מ ממך:\n\nיוחננוף · 29 ₪  ✅ הזול ביותר\n   רעננה · 1.3 ק"מ\nסופר ברקת · 29 ₪  ✅ הזול ביותר\nרמי לוי · 29 ₪  ✅ הזול ביותר\nמעיין 2000 · 30 ₪  (+1 ₪)\n\nועוד 13 רשתות יקרות יותר, עד 33 ₪ — לראות את כולן, תכתוב "כל הרשתות".' },

    /* מחירים אמיתיים מטבלת המחירים (ראשון לציון). חמש הזולות ואז מונה,
       בדיוק כמו שהבוט מציג — החלטה 11. */
    { k: ['חלב תנובה', 'תנובה'],
      a: '💰 חלב תנובה — המחיר האופייני:\n\n  זול ובגדול · 7.35 ₪  ✅  (אין לי מחיר של תנובה שם — לפי חלב רגיל)\n  אושר עד · 7.65 ₪\n  יוחננוף · 8.07 ₪\n\nועוד 16 רשתות יקרות יותר, עד 14.70 ₪ — לראות את כולן תכתוב "כל הרשתות", או תשאל על רשת מסוימת: "חלב תנובה ברמי לוי".' },

    { k: ['כמה עולה חלב', 'מחיר חלב', 'חלב'],
      a: '💰 חלב — המחיר האופייני:\n\n  מעיין 2000 · 6.41 ₪  ✅\n  רמי לוי · 7.00 ₪\n  סופר ברקת · 7.13 ₪\n\nועוד 16 רשתות יקרות יותר, עד 9.70 ₪ — לראות את כולן תכתוב "כל הרשתות", או תשאל על רשת מסוימת: "חלב באושר עד".' },

    { k: ['רשימה קבועה', 'קבוע'],
      a: 'אין לך רשימה קבועה עדיין. 🙂\nאם משהו חוזר אצלך כל שבוע — "תוסיף חלב לרשימה הקבועה".' }
  ];
  /* ⚠️ "לשתף", "קניתי" ו"סיימתי" ישבו כאן פעם וירדו: הם פעולות, והן
     נבדקות למעלה ב-reply() לפני מילות הנושא. שתי רשימות שעונות על
     אותה מילה הן בדיוק הדרך שבה אחת מהן מפסיקה להיקרא בשקט. */

  var ADD = /(תוסיף|תוסיפי|נגמר|נגמרו|צריך|צריכה|תכניס)/;
  var BOUGHT = /(קניתי|לקחתי|שמתי)/;
  var SHOW = /(הצג|תציג|תראה|מה יש|מה ברשימה|הרשימה שלי)/;
  var DONE = /(סיימתי|גמרתי)/;
  var STORE = /(אני בסופר|נכנסתי לסופר|בתוך הסופר)/;
  var BARCODE = /^\s*\d[\d\s-]{6,}\d\s*$/;

  /* הריאקט רוכב על המחרוזת מאחורי סימן בלתי נראה — בדיוק כמו אצל
     הבוט (REACTION_MARK), והגשר שם קורא split_reaction(). הדף עושה
     את אותו הדבר, כדי שההדגמה תדבר באותו פרוטוקול ולא בהמצאה. */
  var REACT = '\u2064👍';
  var BREAK = '\n\u2063\n';

  /* מוצרים שהבוט מוסיף להם יחידת מכירה — ואז הוא כן אומר משהו. */
  var UNITS = {
    'מים מינרליים': 'מים מינרליים (בקבוק 1.5 ל\')',
    'שום': 'שום (ראש)',
    'סלמון': 'סלמון (חצי קילו)'
  };
  /* ⚠️ הורדה חייבת להיבדק לפני מילות הנושא: "תוריד את החלב" מכיל
     "חלב", ובלי הכלל הזה הוא היה מחזיר את רשימת מחירי החלב. זו
     מלכודת 22 של הפרויקט, שכבר תפסה כאן פעם אחת. */
  var REMOVE = /(תוריד|תורידי|להוריד|תמחק|תמחקי)/;
  var SHARE = /(לשתף|שיתוף|להצטרף|בן זוג|אישתי|בעלי|משותפת)/;

  /* הרשימה של ההדגמה. נשמרת כדי שהתשובות יתייחסו זו לזו — מי שמוסיף
     חלב ואז מבקש "הצג רשימה" חייב לראות אותו שם, אחרת ההדגמה שקרית. */
  var list = ['חלב', 'לחם', 'ביצים', 'מים מינרליים (בקבוק 1.5 ל\')'];
  var marked = [];
  /* ⚠️ הבוט מבדיל בין "קניתי" בבית לבין "קניתי" בתוך הסופר: בבית זה
     מוריד מהרשימה, ובסופר זה מסמן בקו ורק "סיימתי" מוריד. ההדגמה
     החזיקה רק את ההתנהגות השנייה, כלומר הראתה סימון למי שלא נכנס
     לסופר — הדגמה נאמנה חייבת להחזיק את שתיהן. */
  var inStore = false;

  function lines() {
    return list.map(function (item, i) {
      var mark = marked.indexOf(item) !== -1;
      /* הבוט מסמן פריט שנלקח בקו חוצה, ומוריד אותו רק ב"סיימתי" */
      return '  ' + (i + 1) + '. ' + (mark ? '~' + item + '~ ✅' : item);
    }).join('\n');
  }

  /* ⚠️ שתי כותרות שונות, ולא אחת: "הצג רשימה" עונה "🛒 הרשימה שלך:",
     ו"אני יוצא לסופר" פותח במניין. ההדגמה ערבבה ביניהן. */
  function showList() { return '🛒 הרשימה שלך:\n' + lines(); }

  /* עברית סופרת אחרת ביחיד. "1 פריטים" הוא בדיוק סוג הפרט שגורם
     להדגמה להיראות כמו תרגום מכונה. */
  function items(n) { return n === 1 ? 'פריט אחד' : n + ' פריטים'; }

  /* מוצא פריט ברשימה מתוך שארית ההודעה.
     ⚠️ **הצורה הגולמית נבדקת ראשונה, ורק אחר כך המקוצצת.** הגרסה
     הקודמת קיצצה `את|ה` אחת בלבד, אז "תוריד את החלב" הגיע כ"החלב"
     ולא נמצא — ואילו קיצוץ ה' גורף היה הופך "הודו" ל"ודו". לכן
     מנסים לפי הסדר, ועוצרים בראשון שנמצא. */
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

  /* ⚠️ **פעולות נבדקות לפני שאלות, וזה לא סגנון אלא תיקון באג.**
     כשהבדיקה הראשונה הייתה על מילות נושא, "זולי תוסיף חלב" ו"קניתי
     חלב" החזירו שניהם את רשימת מחירי החלב — כי המילה "חלב" יושבת
     בתוך שניהם ונבדקה קודם. זו מלכודת 22 של הפרויקט: מילה שיושבת
     בתוך מילה אחרת, והצרה נקראת ראשונה. */
  function reply(text) {
    var t = (text || '').trim();

    /* ⚠️ ברקוד נבדק **ראשון**: הודעה שכולה ספרות אינה יכולה להיות שום
       פקודה אחרת, ומספר שנופל לנתיב הכמויות הופך ל"תוסיף 7290…".
       הפלט כאן הוא מה שהבוט האמיתי מחזיר על הספרות האלה, כולל נוסח
       ההחטאה — הוא נמדד ולא נוסח. */
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
        /* מחוץ לסופר "קניתי" מוריד — זו ההתנהגות האמיתית של הבוט. */
        list = list.filter(function (i) { return i !== found; });
        return 'הורדתי ' + found + ' מהרשימה. ✅\n\n🛒 הרשימה שלך עכשיו:\n' + lines();
      }
      if (marked.indexOf(found) === -1) marked.push(found);
      return 'סימנתי ' + found + '. ✅ נשארו ' +
             (list.length - marked.length) + ' מתוך ' + list.length +
             ':\n\n' + lines();
    }

    /* הורדה מפורשת. אותו פלט בדיוק של "קניתי" מחוץ לסופר, כי אצל הבוט
       זו אותה פעולה — ההבדל היחיד הוא שהניסוח הזה אומר מה הוא עושה. */
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

    /* ⚠️ **הוספה מחזירה ריאקט, לא בועה.** זה מה שהבוט באמת עושה
       בשלב השקט מאז 30.08: 👍 על ההודעה של הקונה, בלי הודעה חדשה.
       הוא פותח את הפה **רק** כשמה שנרשם שונה ממה שנכתב — יחידת מכירה,
       גודל אריזה. הדף הציג קודם בועת "👍 חלב", שהיא שני דברים שלא
       קורים: בועה, ושם מוצר בתוכה. */
    if (ADD.test(t)) {
      /* חילוץ גס של שם המוצר. ⚠️ זו הדגמה ולא הפרסר של הבוט — שם
         יושבות מאות שורות שמטפלות בכמויות, בשלילה ובמונחים עמומים. */
      var item = t.replace(/^\s*זולי\s*/, '').replace(ADD, '')
                  .replace(/^\s*(את|לי|ה)?\s*/, '').trim();
      if (!item) return REACT;
      var noted = UNITS[item] || item;
      if (list.indexOf(noted) === -1) list.push(noted);
      /* שקט כשאין מה להוסיף, ומילה אחת כשיש. */
      return noted === item ? REACT : REACT + BREAK + noted;
    }

    for (var i = 0; i < REPLIES.length; i++) {
      for (var j = 0; j < REPLIES[i].k.length; j++) {
        if (t.indexOf(REPLIES[i].k[j]) !== -1) return REPLIES[i].a;
      }
    }

    /* שם מוצר חשוף — כמו בבוט האמיתי: 👍 על ההודעה, בלי בועה.
       (בקשת איתי, 31.08: "שירשום מעצמו כל מיני מוצרים אז שיעשה לו
       ריאקט".) אוצר קטן של מה שמשפחה באמת כותבת — ההדגמה לא צריכה
       את כל 539 הקטגוריות כדי להרגיש אמיתית. */
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

    /* וכשההדגמה באמת לא יודעת — היא אומרת שהיא הדגמה, ושולחת לבוט
       האמיתי במקום להעמיד פנים. */
    return 'פה אני רק שיחה לדוגמה 🙂 זולי האמיתי מבין הרבה יותר — ' +
           'מ"נגמר החלב" ועד צילום של רשימת קניות.\n' +
           'רוצים אותו? הכפתור הירוק למעלה 👆';
  }

  /* וואטסאפ מציג ~טקסט~ בקו חוצה ו-*טקסט* במודגש, והבוט שולח בדיוק
     את הסימנים האלה. בועה שמראה את התווים עצמם אינה מה שהמשתמש רואה
     בטלפון — אז מציגים כמו וואטסאפ. הבריחה קודמת, תמיד.
     ⚠️ ברמת המודול ולא בתוך Chat: **שני** הטלפונים בדף משתמשים בו,
     ועותק שני היה מתפצל ברגע שמישהו מתקן אחד מהם. */
  function whatsapp(text) {
    return text.replace(/[&<>]/g, function (c) {
             return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
           })
           .replace(/~([^~\n]+)~/g, '<s>$1</s>')
           .replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
  }

  /* --------------------------------------------------- מנהל חלון שיחה
   * משמש גם את הטלפון הגדול שבאמצע הדף וגם את הבועה שבפינה.
   */
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

    /* ⚠️ תור ולא שליחה מיידית. בלעדיו לחיצה מהירה על שתי הצעות מציגה
       את שתי ההודעות שלי ואז את שתי התשובות — שיחה שלא נראית כמו
       שיחה. גם הודעת הפתיחה עוברת דרך התור מאותה סיבה. */
    /* ⚠️ **ריאקט מסומן על ההודעה של הקונה, לא נשלח כבועה.** הבוט מחזיר
       אותו מאחורי סימן בלתי נראה בראש המחרוזת (U+2064), ואחריו — אם יש
       מה להגיד — מפריד הודעות (U+2063) והטקסט. זה בדיוק הפרוטוקול
       שהגשר קורא ב-split_reaction(), אז ההדגמה מדברת בו ולא בהמצאה. */
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

  /* ------------------------------------------- הטלפון הגדול שבתוך הדף */
  function inlineDemo() {
    var body = document.getElementById('demoBody');
    if (!body) return;
    var chat = Chat(body);
    var started = false;

    function start() {
      if (started) return;
      started = true;
      chat.greet('היי! אני זולי 👋 לחצו על אחת הדוגמאות למטה, או תכתבו לי משהו.');
    }

    /* מתחילים רק כשההדגמה נראית — אחרת הפתיחה "נאמרת" בזמן שאף אחד
       לא מסתכל, והמבקר מגיע לשיחה שכבר קרתה. */
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
        chat.send(c.getAttribute('data-say'));
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

  /* ------------------------------------------------- הבועה שבפינה
   * ⚠️ הכפתור נושא את הפרצוף של זולי ולא אייקון של וואטסאפ, ולידו
   * תווית "שיחה לדוגמה". באייקון וואטסאפ הוא נקרא כקישור שמוציא
   * אותך מהדף — וזה בדיוק ההפך ממה שהוא עושה.
   */
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
        /* התיבה שמעל כבר אומרת שזו הדגמה, אז הפתיחה מזמינה ולא חוזרת
           על אותו משפט פעמיים ברצף. */
        chat.greet('היי! אני זולי 👋 לחצו על אחת ההצעות למטה, או תכתבו לי מה נגמר בבית.');
      }
      if (state) setTimeout(function () {
        var i = document.getElementById('cbInput');
        if (i) i.focus();
      }, 260);
    }

    fab.addEventListener('click', function () {
      toggle(!box.classList.contains('open'));
    });

    /* כל כפתור בדף שמסומן data-open-demo פותח את אותה שיחה. ככה
       הקריאה לפעולה בגיבור ובסוף הדף מגיעה לאותו מקום. */
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

  /* ================================================== הטלפון הנעוץ
   * ⚠️ **הטלפון נשאר, הגלילה מתקדמת.** במקום חמישה בלוקים של בועות
   * שגוללים אחד אחרי השני — מסך אחד שהתוכן שלו מתחלף. נמדד לפני:
   * הדף היה 10,812px בטלפון.
   *
   * ⚠️ **ואין חטיפת גלילה.** הדף לא לוקח שליטה ולא מאט; הטלפון רק
   * מגיב למה שכבר קרה. עמוד שנלחם בגלילה של המבקר מאבד אותו.
   *
   * ⚠️ **מאזין scroll ולא IntersectionObserver**, בכוונה: כאן צריך
   * לדעת מי הכי קרוב למרכז המסך ולא רק מי נראה, ושני שלבים גלויים
   * יחד הם המצב הרגיל ולא החריג.
   */
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

    /* ⚠️ **לא לגרור את מי שגלל למעלה בחזרה לתחתית.** אפשר עכשיו לגלול
       בתוך השיחה כדי לקרוא הודעה ארוכה, ואם ההנפשה תמשיך לדחוף לתחתית
       היא תילחם באצבע. אותו כלל של כל אפליקציית צ'אט: יורדים לתחתית רק
       למי שכבר שם. */
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

      /* דיווח איתי 31.08: בגלילה מהירה הטלפון "נתקע" — כי כל שלב
         שחלפנו דרכו איפס את השיחה והתחיל להקליד מאפס, והנוחת ראה
         טלפון ריק עם שלוש נקודות. קפיצה של יותר משלב אחד מציירת
         את השיחה שלמה מיד; גלילה רגועה עדיין מקבלת את ההנפשה. */
      if (REDUCED || instant) {            /* בלי הנפשה — הכול בבת אחת */
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

    /* ⚠️ **מרכז המסך אינו מרכז הקריאה בטלפון.** שם הטלפון נעוץ מעל
       הטקסט וסרגל ה-CTA יושב מתחתיו, ומרכז המסך נופל **מאחורי
       הטלפון** — כלומר השלב שנבחר לפיו הוא בדיוק השלב שאי אפשר
       לקרוא. העוגן נמדד מהרצועה הפנויה עצמה, ולכן הוא נשאר נכון גם
       אם גובה הטלפון או הסרגל ישתנו. */
    function anchor() {
      /* בדסקטופ לטלפון עמודה משלו והטקסט לצידו — שם המרכז נכון. */
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

    /* מי הכי קרוב לעוגן הקריאה. פונקציה טהורה — אפשר לבדוק אותה. */
    function nearest() {
      var mid = anchor(), best = 0, gap = Infinity;
      steps.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < gap) { gap = d; best = i; }
      });
      return best;
    }

    /* ⚠️ **הטקסט עובר מֵעל הטלפון ונמוג שם — לא מתחתיו.** בקשה של איתי
       במילים שלו: "שזה יהיה קצת על הטלפון, שהכתב עדיין ייראה, ואז
       ייעלם". הגרסה הקודמת החביאה אותו מאחורי הטלפון, וזה בדיוק ההפך:
       הטקסט נעלם ברגע שהוא מעניין.

       ⚠️ **וההבחנה שעושה את זה נכון:** טקסט ש**מעל** רצועת הקריאה הוא
       זה שכבר נקרא, ולכן הוא מתחיל משקיפות מלאה ונמוג ככל שהוא מטפס.
       טקסט **מתחת** לרצועה עוד לא הגיע לתורו, ולכן הוא עמום. שני
       מצבים שונים, ולא "פעיל/לא פעיל".

       ⚠️ ובדסקטופ אין חפיפה בכלל — עמודה לכל אחד — אז שם זה כבוי. */
    var painting = false;
    function paint() {
      painting = false;
      var grid = wrap && getComputedStyle(wrap).display === 'grid';
      var box = stage.getBoundingClientRect();
      var top = Math.max(box.bottom, 0);
      /* ⚠️ **טיפה על הטלפון, לא לאורכו.** היה 0.55 — כלומר הטקסט
         חצה כמעט את כל המסך לפני שנעלם, וזה הסתיר את השיחה
         בזמן שהיא מתנגנת. הכרעת איתי: לעלות קצת ולהיעלם. */
      var fade = Math.max(70, box.height * 0.24);
      var mid = anchor();
      steps.forEach(function (s, i) {
        if (REDUCED) { s.style.opacity = 1; return; }
        if (grid) { s.style.opacity = (i === shown) ? 1 : 0.34; return; }
        var r = s.getBoundingClientRect();
        var y = (r.top + r.bottom) / 2, o;
        /* ⚠️ **רצף, ולא שלושה מצבים.** הגרסה הראשונה החזיקה את
           היוצא ב-0.34 עד שהוא נוגע בטלפון ואז הקפיצה אותו ל-1 —
           **הטקסט הבזיק בדיוק בשנייה שהוא אמור להיעלם.** נתפס
           במדידה, לא בעין. עכשיו השקיפות היא פונקציה רציפה של
           המיקום: מתעמעם כלעוד לא הגיע תורו, מלא ברצועת הקריאה,
           ונמוג רק כשהוא מטפס על הטלפון. */
        if (y >= mid) {            /* מתחת לרצועה — עוד לא הגיע תורו */
          o = 1 - Math.min(1, (y - mid) / (r.height * 0.9)) * 0.66;
        } else if (y >= top) {     /* נקרא, ועדיין מתחת לטלפון */
          o = 1;
        } else {                   /* מטפס על הטלפון ונמוג שם */
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
      /* השהיה קצרה: מי שגולל מהר עובר דרך שלושה שלבים, ואין טעם
         להתחיל לנגן כל אחד מהם. */
      clearTimeout(pending);
      pending = setTimeout(function () {
        var want2 = nearest();
        render(want2, Math.abs(want2 - shown) > 1);
      }, 130);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    render(0);
    /* נחשף לבדיקה: חלון התצוגה כאן מקפיא IntersectionObserver ומעברי
       CSS, ובלי זה אי אפשר לאמת את הסרט בכלל. */
    window.__reel = { render: render, nearest: nearest, anchor: anchor,
                      paint: paint, steps: steps };
  }

  /* ------------------------------------------------------------ הפעלה */
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
