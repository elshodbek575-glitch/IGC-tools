import type { Dict } from "../types";

/**
 * Coverage completion.
 *
 * Every locale falls back to English for keys it does not define, so a locale
 * that is only partly translated shows a mix of languages. This file holds the
 * keys that were still falling back for each locale, so those locales become
 * fully translated without touching the tier files.
 *
 * Add a locale here (or extend an existing entry) whenever a gap is found — the
 * audit in `en.ts` terms is: every key in `en` should exist for a locale that is
 * meant to be complete.
 */
export const COMPLETION: Record<string, Dict> = {
  // ── Uzbek — full coverage ────────────────────────────────────────────────
  uz: {
    "header.igcseSubjects": "IGCSE fanlari",
    "header.openMenu": "Menyuni ochish",
    "header.searchAria": "Vositalarni qidirish",
    "header.selectLanguage": "Tilni tanlash",

    "common.copyResult": "Natijani nusxalash",
    "common.explorePhysics": "Fizikani koʻrish",
    "common.live": "Ishlayapti",
    "common.toolNumber": "{number}-vosita",

    "footer.description":
      "Matematika, Fizika, Kimyo, Biologiya va Informatika uchun bepul IGCSE STEM takrorlash toʻplami. Har bir vosita yechimini koʻrsatadi.",
    "footer.copyright": "© {year} IGCtools · IGCSE oʻquvchilari uchun yaratilgan.",
    "footer.disclaimer":
      "Cambridge va Edexcel IGCSE fan spetsifikatsiyalarining ochiq eʼlon qilingan hujjatlari asosida yozilgan. Imtihon kengashlari bilan bogʻliq emas va ular tomonidan tasdiqlanmagan.",

    "search.dialogTitle": "Vositalarni qidirish",
    "search.dialogDescription":
      "IGCSE takrorlash vositasini nomi yoki mavzusi boʻyicha toping",
    "search.inputPlaceholder": "Vositalarni qidirish…",

    "home.seoTitle": "IGCtools · IGCSE STEM takrorlash toʻplami",
    "home.seoDescription":
      "Matematika, Fizika, Kimyo, Biologiya va Informatika uchun bepul IGCSE takrorlash vositalari. Har bir vosita yechimini koʻrsatadi — Cambridge va Edexcel oʻquv dasturlari asosida.",
    "home.heroBody":
      "IGCtools Matematika, Fizika, Kimyo, Biologiya va Informatika uchun kalkulyatorlar, yechuvchilar va mashq generatorlarini yaratadi — va ularning har biri faqat javobni emas, butun yechimni koʻrsatadi.",
    "home.statUploaded": "Serverga yuklangan",
    "home.subjectsBody":
      "Har bir fanning oʻz sahifasi bor: vositalar roʻyxati va ular mos keladigan oʻquv dasturi mavzulari. Navigatsiya orqali istalgan vaqtda ular orasida oʻtishingiz mumkin.",
    "home.builtTitle": "Fanga qarab qurilmoqda",
    "home.builtBody":
      "Avval Matematika, keyin Fizika, Kimyo, Biologiya va Informatika quriladi. Boʻlimni ochib, uning mavzulari va vositalar roʻyxatini koʻring.",
    "home.p1Title": "Har bir vosita yechimini koʻrsatadi",
    "home.p1Body":
      "Har bir kalkulyator, yechuvchi va generator toʻliq usulni ochib beradi — formula, oʻrniga qoʻyish va birliklarni — faqat yakuniy javobni emas.",
    "home.p2Title": "Faqat original kontent",
    "home.p2Body":
      "Savollar, tushuntirishlar va chizmalar noldan yoziladi va chiziladi. Chizmalar original SVG boʻlib, hech qachon darslik rasmlari emas.",
    "home.p3Title": "Toʻliq brauzeringizda ishlaydi",
    "home.p3Body":
      "Vositalar saytning qolgan qismi kabi brauzerda ishlaydi. Hech narsa serverga yuklanmaydi yoki saqlanmaydi, shuning uchun takrorlash tez va maxfiy.",
    "home.syllabusTitle": "Rasmiy oʻquv dasturiga moslangan",
    "home.syllabusBody":
      "Biz Cambridge va Edexcel IGCSE fan spetsifikatsiyalarining ochiq eʼlon qilingan hujjatlaridan foydalanamiz — bu hujjatlar har bir mavzu va kerakli koʻnikmani sanab chiqadi. Mualliflik huquqi bilan himoyalangan darslik kontenti ishlatilmaydi.",
    "home.roadmapBody":
      "Har bir fan toʻliq vositalar toʻplami bilan chiqadi, shundan keyingina keyingisi boshlanadi, shuning uchun saytdagi hamma narsa doim tugallangan va ishonchli.",
    "home.step": "{number}-qadam",
    "home.ctaBody":
      "Oʻquv dasturi mavzularini va ular uchun qurilayotgan vositalarni koʻrish uchun fanni tanlang.",

    "subject.notFoundTitle": "Fan topilmadi",
    "subject.notFoundBody": "Bunday fan hali mavjud emas.",
    "subject.topicAreas": "Mavzu sohalari",
    "subject.glanceNote":
      "Bu boʻlimdagi har bir vosita toʻliq yechimini koʻrsatadi. Vositalar qurilguniga qadar quyidagi sahifalar tayyor qobiq sifatida turadi.",
    "subject.topicsBody":
      "Bu mavzu sohalari eʼlon qilingan {boards} spetsifikatsiyalaridan olingan. Vositalar aynan shu mavzularga bogʻlangan — umumiy STEM gʻoyalariga emas.",
    "subject.toolsMappedTitle": "Bu mavzularga bogʻlangan {count} ta vosita.",
    "subject.toolsBuildingBody":
      "Qurilishni Matematika boshlab beryapti. Bu vosita sahifalari mantiqi yozilguniga qadar qobiq sifatida tayyor.",
    "subject.toolsQueuedBody":
      "Bu boʻlim Matematikadan keyin navbatda. Quyida yuqoridagi mavzularga bogʻlangan vositalar toʻplami.",

    "tool.notFoundTitle": "Vosita topilmadi",
    "tool.notFoundBody":
      "Bu manzilda vosita yoʻq. Boʻlimdagi barcha vositalarni koʻrish uchun fanni oching.",

    "shell.breadcrumb": "Navigatsiya yoʻli",
    "shell.workingTitle": "Yechimini koʻrsatish uchun qurilgan",
    "shell.workingBody":
      "Har bir qadam tartib bilan joylashtirilgan — formula, oʻrniga qoʻyish va arifmetika — yakuniy javobdan yuqorida. Tartib har bir vositada bir xil, shuning uchun mavzular orasida hech narsa joyidan siljimaydi.",
    "shell.placeholderLabel": "Qiymat",
    "shell.placeholderInput": "Kiritmalar vosita bilan birga keladi",
    "shell.placeholderNote":
      "Bu vositaga oid kiritmalar shu yerda, har bir maydon ustida yorliq bilan paydo boʻladi.",
    "shell.placeholderResult":
      "Bajarilgan yechim shu yerda, qadam-baqadam paydo boʻladi.",

    "calc.chooseOption": "Variantni tanlang",
    "calc.emptyHint":
      "Kiritmalarni toʻldirib Hisoblash tugmasini bosing — javob butun yechim bilan shu yerda paydo boʻladi.",
    "calc.cantSolve": "Hozircha yechib boʻlmaydi",

    "explorer.noTopics": "Hozircha mavzular yoʻq.",
    "explorer.nothing": "Koʻrsatadigan narsa yoʻq.",
    "explorer.topicLabel": "{number}-mavzu",
    "explorer.cardOf": "{total} tadan {index}-karta",
    "explorer.tryRecall": "Taʼrifni eslashga harakat qiling, keyin oching.",
    "explorer.hide": "Taʼrifni yashirish",
    "explorer.restart": "Qaytadan boshlash",

    "diagram.labelQuiz": "Belgilash testi",
    "diagram.nextPart": "Keyingi qism",
    "diagram.restartQuiz": "Testni qaytadan boshlash",
    "diagram.settled":
      "Toʻgʻri belgilandi: {total} tadan {solved} · urinishlar {attempts}",
    "diagram.labelledParts": "Belgilangan qismlar",
    "diagram.numbersMatch":
      "Chizmadagi raqamlar shu yerda sanab oʻtilgan qismlarga mos keladi.",
    "diagram.hintQuiz":
      "Chizmadan raqamli qismni toping, keyin nomini tanlang.",
    "diagram.hintReference":
      "Har bir qism belgilangan, nima vazifasini bajarishi bilan.",
    "diagram.wrong": "Bu emas. Belgining turgan joyiga yana qarang.",
    "diagram.choose": "Chapdan javob tanlang.",

    "auth.checkEmail": "Emailingizni tekshiring",
    "auth.sentCode": "{email} manziliga kod yubordik",
    "auth.noCode": "Kod kelmadimi?",
    "auth.tryAgain": "Qaytadan urinish",
    "auth.verifying": "Tekshirilmoqda...",
    "auth.differentEmail": "Boshqa emaildan foydalanish",
    "auth.securedBy": "Xavfsizligini taʼminlaydi",
    "auth.errorSend": "Tasdiqlash kodi yuborilmadi. Qaytadan urinib koʻring.",
    "auth.errorCode": "Kiritilgan tasdiqlash kodi notoʻgʻri.",
    "auth.errorGuest": "Mehmon sifatida kirish amalga oshmadi: {error}",

    "requireAuth.returnNote":
      "Kirganingizdan soʻng darhol bu sahifaga qaytasiz.",

    "dash.seoTitle": "Boshqaruv panelingiz · IGCtools",
    "dash.seoDescription": "IGCtools IGCSE takrorlash ish maydoningiz.",
    "dash.body":
      "Oʻquv dasturi mavzularini va ular uchun qurilayotgan vositalarni koʻrish uchun fanni tanlang. Har bir fan ishga tushishi bilan natijalar shu yerda saqlanadi.",

    "nf.seoTitle": "Sahifa topilmadi · IGCtools",
    "nf.seoDescription": "Siz qidirayotgan sahifa mavjud emas.",
  },

  // ── Tier A — single remaining key each ───────────────────────────────────
  es: {
    "diagram.numbersMatch":
      "Los números del diagrama coinciden con las partes numeradas que figuran aquí.",
  },
  fr: {
    "diagram.numbersMatch":
      "Les numéros du schéma correspondent aux parties numérotées listées ici.",
  },
  de: {
    "diagram.numbersMatch":
      "Die Nummern im Diagramm entsprechen den hier aufgelisteten nummerierten Teilen.",
  },
  pt: {
    "diagram.numbersMatch":
      "Os números do diagrama correspondem às partes numeradas listadas aqui.",
  },
  it: {
    "diagram.numbersMatch":
      "I numeri nel diagramma corrispondono alle parti numerate elencate qui.",
  },

  // ── "Live" badge ─────────────────────────────────────────────────────────
  // The status badges on subject cards and tool cards now read the tool
  // registry, so "Live" appears far more often than it used to. One word per
  // locale so the badge never falls back to English.
  am: { "common.live": "ንቁ" },
  ar: { "common.live": "متاح" },
  az: { "common.live": "Aktiv" },
  bn: { "common.live": "চালু" },
  cs: { "common.live": "Aktivní" },
  el: { "common.live": "Ενεργό" },
  fa: { "common.live": "فعال" },
  gu: { "common.live": "ચાલુ" },
  ha: { "common.live": "Akwai" },
  he: { "common.live": "זמין" },
  hi: { "common.live": "उपलब्ध" },
  hu: { "common.live": "Elérhető" },
  id: { "common.live": "Aktif" },
  ig: { "common.live": "Dị ndụ" },
  ja: { "common.live": "公開中" },
  kk: { "common.live": "Белсенді" },
  km: { "common.live": "ដំណើរការ" },
  kn: { "common.live": "ಲಭ್ಯ" },
  ko: { "common.live": "사용 가능" },
  ku: { "common.live": "Çalak" },
  ml: { "common.live": "ലഭ്യം" },
  mr: { "common.live": "उपलब्ध" },
  ms: { "common.live": "Aktif" },
  my: { "common.live": "အသင့်" },
  ne: { "common.live": "उपलब्ध" },
  nl: { "common.live": "Beschikbaar" },
  or: { "common.live": "ଉପଲବ୍ଧ" },
  pa: { "common.live": "ਉਪਲਬਧ" },
  pl: { "common.live": "Dostępne" },
  ro: { "common.live": "Disponibil" },
  ru: { "common.live": "Доступно" },
  si: { "common.live": "ක්‍රියාත්මක" },
  sv: { "common.live": "Tillgänglig" },
  sw: { "common.live": "Inapatikana" },
  ta: { "common.live": "கிடைக்கிறது" },
  te: { "common.live": "అందుబాటులో" },
  th: { "common.live": "พร้อมใช้" },
  tl: { "common.live": "Magagamit" },
  tr: { "common.live": "Aktif" },
  uk: { "common.live": "Доступно" },
  ur: { "common.live": "دستیاب" },
  vi: { "common.live": "Đang hoạt động" },
  yo: { "common.live": "Ṣiṣẹ́" },
  zh: { "common.live": "已上线" },
};
