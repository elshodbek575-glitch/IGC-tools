import type { Dict } from "../types";

/** Content copy (home-page worked example + subject taglines/blurbs) — tier C. */
export const SUBJECT_COPY_C: Record<string, Dict> = {
  // ── Bengali ──────────────────────────────────────────────────────────────
  bn: {
    "home.exampleTitle": "দ্বিঘাত সমীকরণ",
    "home.exampleStep1": "উৎপাদকে বিশ্লেষণ করো: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "প্রতিটি বন্ধনীকে শূন্যের সমান ধরো",
    "home.exampleAnswer": "x = 2 অথবা x = 3",
    "subject.maths.tagline":
      "প্রতিটি মূল বিষয়ের জন্য ক্যালকুলেটর, সমাধানকারী ও পূর্ণ সমাধান।",
    "subject.maths.blurb":
      "করণি ও সহসমীকরণ থেকে বৃত্তের উপপাদ্য ও পরিসংখ্যান পর্যন্ত — প্রতিটি সমাধানকারী শেষ উত্তর নয়, প্রতিটি ধাপ দেখায়।",
    "subject.physics.tagline": "গতি, বল, শক্তি ও বর্তনী — যুক্তি সহ।",
    "subject.physics.blurb":
      "প্রতিটি ক্যালকুলেটর সূত্র, প্রতিস্থাপন ও এককের যুক্তি দেখায়, তাই পদ্ধতিও শেখা হয়।",
    "subject.chemistry.tagline": "মোল, সমীকরণ ও বিক্রিয়া — সমতুল ও ব্যাখ্যাসহ।",
    "subject.chemistry.blurb":
      "প্রতিবার অনুপাত, মোল ও একক ঠিক রাখো — যে সরঞ্জাম প্রতিটি ধাপের যুক্তি দেখায়।",
    "subject.biology.tagline": "কোষ, তন্ত্র ও বংশগতি — ধাপে ধাপে ব্যাখ্যা।",
    "subject.biology.blurb":
      "মৌলিক ইন্টারঅ্যাকটিভ চিত্র, জিনতত্ত্বের সরঞ্জাম ও বিষয়ভিত্তিক শব্দকোষ যুক্তি দৃশ্যমান করে।",
    "subject.computer-science.tagline":
      "ডেটা, অ্যালগরিদম ও যুক্তি — ট্রেস ও ব্যাখ্যাসহ।",
    "subject.computer-science.blurb":
      "রূপান্তর, অনুকরণ ও ট্রেস করো: প্রতিটি সরঞ্জাম অ্যালগরিদমের ধাপগুলো লুকিয়ে না রেখে দেখায়।",
  },

  // ── Persian ──────────────────────────────────────────────────────────────
  fa: {
    "home.exampleTitle": "معادله درجه دو",
    "home.exampleStep1": "تجزیه کن: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "هر پرانتز را برابر صفر بگذار",
    "home.exampleAnswer": "x = 2 یا x = 3",
    "subject.maths.tagline": "ماشین‌حساب، حل‌کننده و حل کامل برای هر مبحث اصلی.",
    "subject.maths.blurb":
      "از رادیکال‌ها و دستگاه معادلات تا قضیه‌های دایره و آمار — هر حل‌کننده همه مراحل را نشان می‌دهد، نه فقط پاسخ نهایی.",
    "subject.physics.tagline": "حرکت، نیرو، انرژی و مدارها — با استدلال روشن.",
    "subject.physics.blurb":
      "هر ماشین‌حساب فرمول، جای‌گذاری و استدلال یکاها را نشان می‌دهد تا روش را هم یاد بگیری.",
    "subject.chemistry.tagline": "مول، معادله و واکنش‌ها — موازنه‌شده و توضیح‌داده‌شده.",
    "subject.chemistry.blurb":
      "نسبت، مول و یکاها را هر بار درست به دست آور، با ابزارهایی که استدلال هر مرحله را نشان می‌دهند.",
    "subject.biology.tagline": "یاخته‌ها، دستگاه‌ها و وراثت — گام‌به‌گام.",
    "subject.biology.blurb":
      "نمودارهای تعاملی اورجینال، ابزارهای ژنتیک و واژه‌نامه‌های مبحثی که استدلال را دیدنی می‌کنند.",
    "subject.computer-science.tagline": "داده، الگوریتم و منطق — با ردگیری و توضیح.",
    "subject.computer-science.blurb":
      "تبدیل کن، شبیه‌سازی کن و ردگیری کن: هر ابزار مراحل الگوریتم را نشان می‌دهد، نه اینکه پنهان کند.",
  },

  // ── Polish ───────────────────────────────────────────────────────────────
  pl: {
    "home.exampleTitle": "Równanie kwadratowe",
    "home.exampleStep1": "Rozłóż na czynniki: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Przyrównaj każdy nawias do zera",
    "home.exampleAnswer": "x = 2 lub x = 3",
    "subject.maths.tagline":
      "Kalkulatory, solvery i pełne rozwiązania dla każdego kluczowego tematu.",
    "subject.maths.blurb":
      "Od pierwiastków i układów równań po twierdzenia o okręgu i statystykę — każdy solver pokazuje wszystkie kroki, nie tylko wynik.",
    "subject.physics.tagline": "Ruch, siły, energia i obwody — z wyjaśnionym rozumowaniem.",
    "subject.physics.blurb":
      "Każdy kalkulator pokazuje wzór, podstawienie i rozumowanie jednostek, więc uczysz się metody, nie tylko odpowiedzi.",
    "subject.chemistry.tagline": "Mole, równania i reakcje — uzgodnione i wyjaśnione.",
    "subject.chemistry.blurb":
      "Stosunek, mole i jednostki zawsze się zgadzają dzięki narzędziom pokazującym rozumowanie na każdym etapie.",
    "subject.biology.tagline": "Komórki, układy i dziedziczenie — krok po kroku.",
    "subject.biology.blurb":
      "Interaktywne autorskie schematy, narzędzia genetyki i słowniczki tematyczne, które pokazują tok rozumowania.",
    "subject.computer-science.tagline": "Dane, algorytmy i logika — śledzone i wyjaśnione.",
    "subject.computer-science.blurb":
      "Konwertuj, symuluj i śledź: każde narzędzie przechodzi kroki algorytmu, zamiast je ukrywać.",
  },

  // ── Ukrainian ────────────────────────────────────────────────────────────
  uk: {
    "home.exampleTitle": "Квадратне рівняння",
    "home.exampleStep1": "Розклади на множники: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Прирівняй кожну дужку до нуля",
    "home.exampleAnswer": "x = 2 або x = 3",
    "subject.maths.tagline":
      "Калькулятори, розв'язувачі та повні розв'язки для кожної ключової теми.",
    "subject.maths.blurb":
      "Від коренів і систем рівнянь до теорем кола та статистики — кожен розв'язувач показує всі кроки, а не лише відповідь.",
    "subject.physics.tagline": "Рух, сили, енергія та кола — з поясненим ходом думок.",
    "subject.physics.blurb":
      "Кожен калькулятор показує формулу, підстановку та роботу з одиницями, тож ви вчите метод, а не лише відповідь.",
    "subject.chemistry.tagline": "Молі, рівняння та реакції — збалансовано й пояснено.",
    "subject.chemistry.blurb":
      "Пропорції, молі та одиниці завжди правильні завдяки інструментам, що показують хід розв'язку на кожному кроці.",
    "subject.biology.tagline": "Клітини, системи та спадковість — покроково.",
    "subject.biology.blurb":
      "Інтерактивні авторські схеми, інструменти генетики й тематичні глосарії, що роблять міркування видимим.",
    "subject.computer-science.tagline": "Дані, алгоритми та логіка — з трасуванням і поясненням.",
    "subject.computer-science.blurb":
      "Перетворюй, моделюй і трасуй: кожен інструмент проходить кроки алгоритму, а не приховує їх.",
  },

  // ── Swahili ──────────────────────────────────────────────────────────────
  sw: {
    "home.exampleTitle": "Mlinganyo wa kwadratiki",
    "home.exampleStep1": "Tenganisha: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Weka kila mabano sawa na sifuri",
    "home.exampleAnswer": "x = 2 au x = 3",
    "subject.maths.tagline": "Vikokotoo, vitatuzi na suluhisho kamili kwa kila mada kuu.",
    "subject.maths.blurb":
      "Kutoka mizizi na milinganyo ya pamoja hadi nadharia za duara na takwimu — kila kitatuzi kinaonyesha hatua zote, si jibu la mwisho pekee.",
    "subject.physics.tagline": "Mwendo, nguvu, nishati na mizunguko — kwa hoja wazi.",
    "subject.physics.blurb":
      "Kila kikokotoo kinaonyesha mlinganyo, ubadilishaji na hoja ya vipimo, hivyo unajifunza mbinu pia.",
    "subject.chemistry.tagline": "Moli, milinganyo na athari — zilizosawazishwa na kuelezwa.",
    "subject.chemistry.blurb":
      "Pata uwiano, moli na vipimo kwa usahihi kila mara, kwa zana zinazoonyesha hoja katika kila hatua.",
    "subject.biology.tagline": "Seli, mifumo na urithi — hatua kwa hatua.",
    "subject.biology.blurb":
      "Michoro halisi inayoshirikisha, zana za jenetiki na kamusi za mada zinazofanya hoja ionekane.",
    "subject.computer-science.tagline": "Data, algoriti na mantiki — zikifuatiliwa na kuelezwa.",
    "subject.computer-science.blurb":
      "Badilisha, iga na fuatilia: kila zana inapitia hatua za algoriti badala ya kuzificha.",
  },

  // ── Tamil ────────────────────────────────────────────────────────────────
  ta: {
    "home.exampleTitle": "இருபடிச் சமன்பாடு",
    "home.exampleStep1": "காரணிப்படுத்து: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ஒவ்வொரு அடைப்பையும் பூஜ்ஜியத்திற்குச் சமன் செய்",
    "home.exampleAnswer": "x = 2 அல்லது x = 3",
    "subject.maths.tagline":
      "ஒவ்வொரு முக்கிய தலைப்புக்கும் கணிப்பான்கள், தீர்விகள், முழு விளக்கம்.",
    "subject.maths.blurb":
      "வர்க்கமூலங்கள், ஒருங்கமை சமன்பாடுகள் முதல் வட்டத் தேற்றங்கள், புள்ளியியல் வரை — ஒவ்வொரு தீர்வியும் இறுதி விடையை மட்டுமல்ல, ஒவ்வொரு படியையும் காட்டுகிறது.",
    "subject.physics.tagline": "இயக்கம், விசை, ஆற்றல், சுற்றுகள் — காரணங்களுடன்.",
    "subject.physics.blurb":
      "ஒவ்வொரு கணிப்பானும் சூத்திரம், பிரதியீடு, அலகு காரணங்களைக் காட்டுவதால் முறையையும் கற்கிறாய்.",
    "subject.chemistry.tagline": "மோல், சமன்பாடுகள், வினைகள் — சமநிலையுடன் விளக்கம்.",
    "subject.chemistry.blurb":
      "விகிதம், மோல், அலகுகளை ஒவ்வொரு முறையும் சரியாகப் பெறு — ஒவ்வொரு படியின் காரணத்தைக் காட்டும் கருவிகளுடன்.",
    "subject.biology.tagline": "செல்கள், அமைப்புகள், பாரம்பரியம் — படிப்படியாக.",
    "subject.biology.blurb":
      "அசல் ஊடாடும் படங்கள், மரபியல் கருவிகள், தலைப்பு அருஞ்சொற்பட்டியல்கள் காரணத்தைத் தெளிவாக்குகின்றன.",
    "subject.computer-science.tagline":
      "தரவு, வழிமுறைகள், தர்க்கம் — தடமறிந்து விளக்கப்படுகிறது.",
    "subject.computer-science.blurb":
      "மாற்று, உருவகப்படுத்து, தடமறி: ஒவ்வொரு கருவியும் வழிமுறையின் படிகளை மறைக்காமல் கடக்கிறது.",
  },

  // ── Telugu ───────────────────────────────────────────────────────────────
  te: {
    "home.exampleTitle": "వర్గ సమీకరణం",
    "home.exampleStep1": "కారణాంకాలుగా విభజించు: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ప్రతి కుండలీకరణాన్ని సున్నాకు సమం చెయ్యి",
    "home.exampleAnswer": "x = 2 లేదా x = 3",
    "subject.maths.tagline":
      "ప్రతి ముఖ్య అంశానికి కాలిక్యులేటర్లు, సాధకాలు, పూర్తి సాధన.",
    "subject.maths.blurb":
      "వర్గమూలాలు, యుగపద సమీకరణాల నుంచి వృత్త సిద్ధాంతాలు, గణాంకాల వరకు — ప్రతి సాధకం చివరి జవాబును మాత్రమే కాక ప్రతి దశను చూపుతుంది.",
    "subject.physics.tagline": "చలనం, బలాలు, శక్తి, వలయాలు — తార్కికంగా.",
    "subject.physics.blurb":
      "ప్రతి కాలిక్యులేటర్ సూత్రం, ప్రతిక్షేపణ, ప్రమాణాల తర్కాన్ని చూపుతుంది, కాబట్టి పద్ధతిని కూడా నేర్చుకుంటారు.",
    "subject.chemistry.tagline": "మోల్, సమీకరణాలు, చర్యలు — సమతుల్యంగా వివరణతో.",
    "subject.chemistry.blurb":
      "నిష్పత్తి, మోల్, ప్రమాణాలు ప్రతిసారీ సరిగ్గా — ప్రతి దశ తర్కాన్ని చూపే సాధనాలతో.",
    "subject.biology.tagline": "కణాలు, వ్యవస్థలు, వారసత్వం — దశలవారీగా.",
    "subject.biology.blurb":
      "అసలైన ఇంటరాక్టివ్ చిత్రాలు, జన్యు సాధనాలు, అంశాల పదకోశాలు తర్కాన్ని కనిపించేలా చేస్తాయి.",
    "subject.computer-science.tagline": "డేటా, అల్గారిథమ్‌లు, తర్కం — ట్రేస్‌తో వివరణ.",
    "subject.computer-science.blurb":
      "మార్చు, అనుకరించు, ట్రేస్ చెయ్యి: ప్రతి సాధనం అల్గారిథమ్ దశలను దాచకుండా చూపుతుంది.",
  },

  // ── Marathi ──────────────────────────────────────────────────────────────
  mr: {
    "home.exampleTitle": "वर्गसमीकरण",
    "home.exampleStep1": "अवयव पाडा: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "प्रत्येक कंस शून्याशी सम करा",
    "home.exampleAnswer": "x = 2 किंवा x = 3",
    "subject.maths.tagline":
      "प्रत्येक मुख्य घटकासाठी कॅल्क्युलेटर, सोडवणारे आणि पूर्ण उकल.",
    "subject.maths.blurb":
      "करणी व एकसामयिक समीकरणांपासून वर्तुळ प्रमेये आणि संख्याशास्त्रापर्यंत — प्रत्येक सोडवणारा केवळ उत्तर नव्हे, प्रत्येक पायरी दाखवतो.",
    "subject.physics.tagline": "गती, बल, ऊर्जा आणि परिपथ — तर्कासह.",
    "subject.physics.blurb":
      "प्रत्येक कॅल्क्युलेटर सूत्र, मूल्यभरण आणि एककांचा तर्क दाखवतो, त्यामुळे पद्धतही शिकता.",
    "subject.chemistry.tagline": "मोल, समीकरणे आणि अभिक्रिया — संतुलित आणि स्पष्ट.",
    "subject.chemistry.blurb":
      "गुणोत्तर, मोल आणि एकके दरवेळी बरोबर — प्रत्येक टप्प्यातील तर्क दाखवणाऱ्या साधनांसह.",
    "subject.biology.tagline": "पेशी, संस्था आणि आनुवंशिकता — टप्प्याटप्प्याने.",
    "subject.biology.blurb":
      "मूळ परस्परसंवादी आकृत्या, अनुवंशशास्त्राची साधने आणि विषयनिहाय शब्दकोश तर्क दृश्य करतात.",
    "subject.computer-science.tagline":
      "डेटा, अल्गोरिदम आणि तर्क — ट्रेससह स्पष्टीकरण.",
    "subject.computer-science.blurb":
      "रूपांतर करा, अनुकरण करा आणि ट्रेस करा: प्रत्येक साधन अल्गोरिदमच्या पायऱ्या लपवत नाही.",
  },

  // ── Thai ─────────────────────────────────────────────────────────────────
  th: {
    "home.exampleTitle": "สมการกำลังสอง",
    "home.exampleStep1": "แยกตัวประกอบ: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "จับแต่ละวงเล็บให้เท่ากับศูนย์",
    "home.exampleAnswer": "x = 2 หรือ x = 3",
    "subject.maths.tagline":
      "เครื่องคิดเลข ตัวแก้โจทย์ และวิธีทำครบทุกขั้นสำหรับทุกหัวข้อหลัก",
    "subject.maths.blurb":
      "จากรากที่สองและระบบสมการ ถึงทฤษฎีบทวงกลมและสถิติ — ทุกตัวแก้โจทย์แสดงทุกขั้นตอน ไม่ใช่แค่คำตอบสุดท้าย",
    "subject.physics.tagline": "การเคลื่อนที่ แรง พลังงาน และวงจร — พร้อมเหตุผล",
    "subject.physics.blurb":
      "ทุกเครื่องคิดเลขแสดงสูตร การแทนค่า และเหตุผลของหน่วย ทำให้ได้ทั้งวิธีและคำตอบ",
    "subject.chemistry.tagline": "โมล สมการ และปฏิกิริยา — ดุลแล้วและอธิบายชัด",
    "subject.chemistry.blurb":
      "อัตราส่วน โมล และหน่วยถูกต้องทุกครั้ง ด้วยเครื่องมือที่แสดงเหตุผลในทุกขั้น",
    "subject.biology.tagline": "เซลล์ ระบบ และพันธุกรรม — อธิบายทีละขั้น",
    "subject.biology.blurb":
      "แผนภาพอินเทอร์แอกทีฟที่วาดเอง เครื่องมือพันธุศาสตร์ และอภิธานศัพท์รายหัวข้อที่ทำให้เหตุผลมองเห็นได้",
    "subject.computer-science.tagline": "ข้อมูล อัลกอริทึม และตรรกะ — ตามรอยและอธิบาย",
    "subject.computer-science.blurb":
      "แปลง จำลอง และตามรอย: ทุกเครื่องมือไล่ทีละขั้นของอัลกอริทึม ไม่ปิดบัง",
  },

  // ── Gujarati ─────────────────────────────────────────────────────────────
  gu: {
    "home.exampleTitle": "દ્વિઘાત સમીકરણ",
    "home.exampleStep1": "અવયવ પાડો: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "દરેક કૌંસને શૂન્ય સાથે સરખાવો",
    "home.exampleAnswer": "x = 2 અથવા x = 3",
    "subject.maths.tagline": "દરેક મુખ્ય વિષય માટે કેલ્ક્યુલેટર, ઉકેલનાર અને પૂરો ઉકેલ.",
    "subject.maths.blurb":
      "કરણી અને સુસંગત સમીકરણોથી લઈને વર્તુળ પ્રમેય અને આંકડાશાસ્ત્ર સુધી — દરેક ઉકેલનાર ફક્ત જવાબ નહીં, દરેક પગલું બતાવે છે.",
    "subject.physics.tagline": "ગતિ, બળ, ઊર્જા અને પરિપથ — તર્ક સાથે.",
    "subject.physics.blurb":
      "દરેક કેલ્ક્યુલેટર સૂત્ર, આદેશ અને એકમનો તર્ક બતાવે છે, જેથી પદ્ધતિ પણ શીખો.",
    "subject.chemistry.tagline": "મોલ, સમીકરણો અને પ્રક્રિયાઓ — સંતુલિત અને સમજાવેલી.",
    "subject.chemistry.blurb":
      "ગુણોત્તર, મોલ અને એકમ દર વખતે સાચા — દરેક તબક્કે તર્ક બતાવતા સાધનો સાથે.",
    "subject.biology.tagline": "કોષ, તંત્રો અને આનુવંશિકતા — પગલે પગલે.",
    "subject.biology.blurb":
      "મૌલિક ઇન્ટરેક્ટિવ આકૃતિઓ, આનુવંશિકતાના સાધનો અને વિષયવાર શબ્દકોશ તર્કને દૃશ્ય બનાવે છે.",
    "subject.computer-science.tagline": "ડેટા, અલ્ગોરિધમ અને તર્ક — ટ્રેસ અને સમજૂતી સાથે.",
    "subject.computer-science.blurb":
      "રૂપાંતર કરો, અનુકરણ કરો અને ટ્રેસ કરો: દરેક સાધન અલ્ગોરિધમનાં પગલાં છુપાવતું નથી.",
  },
};
