import type { Dict } from "../types";

/**
 * Content copy (home-page worked example + subject taglines) — core tier.
 *
 * These locales fall back to the English subject blurbs; the worked example and
 * the taglines that appear on the home and dashboard cards are translated.
 */
export const SUBJECT_COPY_CORE: Record<string, Dict> = {
  // ── Romanian ─────────────────────────────────────────────────────────────
  ro: {
    "home.exampleTitle": "Ecuație de gradul doi",
    "home.exampleStep1": "Descompune în factori: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Egalează fiecare paranteză cu zero",
    "home.exampleAnswer": "x = 2 sau x = 3",
    "subject.maths.tagline":
      "Calculatoare, rezolvitoare și soluții complete pentru fiecare temă esențială.",
    "subject.physics.tagline":
      "Mișcare, forțe, energie și circuite — cu raționamentul explicat.",
    "subject.chemistry.tagline": "Moli, ecuații și reacții — egalate și explicate.",
    "subject.biology.tagline": "Celule, sisteme și ereditate — explicate pas cu pas.",
    "subject.computer-science.tagline": "Date, algoritmi și logică — urmărite și explicate.",
  },

  // ── Dutch ────────────────────────────────────────────────────────────────
  nl: {
    "home.exampleTitle": "Kwadratische vergelijking",
    "home.exampleStep1": "Ontbind in factoren: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Stel elk haakje gelijk aan nul",
    "home.exampleAnswer": "x = 2 of x = 3",
    "subject.maths.tagline":
      "Rekenmachines, oplossers en volledige uitwerkingen voor elk kernthema.",
    "subject.physics.tagline":
      "Beweging, krachten, energie en schakelingen — met de redenering erbij.",
    "subject.chemistry.tagline": "Mol, reactievergelijkingen en reacties — kloppend en uitgelegd.",
    "subject.biology.tagline": "Cellen, systemen en erfelijkheid — stap voor stap uitgelegd.",
    "subject.computer-science.tagline": "Data, algoritmen en logica — getraceerd en uitgelegd.",
  },

  // ── Hungarian ────────────────────────────────────────────────────────────
  hu: {
    "home.exampleTitle": "Másodfokú egyenlet",
    "home.exampleStep1": "Alakítsd szorzattá: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Tedd nullával egyenlővé mindkét zárójelet",
    "home.exampleAnswer": "x = 2 vagy x = 3",
    "subject.maths.tagline":
      "Számológépek, megoldók és teljes megoldások minden fő témához.",
    "subject.physics.tagline": "Mozgás, erők, energia és áramkörök — levezetve.",
    "subject.chemistry.tagline": "Mol, egyenletek és reakciók — rendezve és elmagyarázva.",
    "subject.biology.tagline": "Sejtek, szervrendszerek és öröklődés — lépésről lépésre.",
    "subject.computer-science.tagline":
      "Adatok, algoritmusok és logika — nyomon követve és elmagyarázva.",
  },

  // ── Czech ────────────────────────────────────────────────────────────────
  cs: {
    "home.exampleTitle": "Kvadratická rovnice",
    "home.exampleStep1": "Rozlož na součin: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Polož každou závorku rovnou nule",
    "home.exampleAnswer": "x = 2 nebo x = 3",
    "subject.maths.tagline": "Kalkulačky, řešiče a úplná řešení pro každé klíčové téma.",
    "subject.physics.tagline": "Pohyb, síly, energie a obvody — s vysvětleným postupem.",
    "subject.chemistry.tagline": "Moly, rovnice a reakce — vyčíslené a vysvětlené.",
    "subject.biology.tagline": "Buňky, soustavy a dědičnost — krok za krokem.",
    "subject.computer-science.tagline": "Data, algoritmy a logika — sledované a vysvětlené.",
  },

  // ── Swedish ──────────────────────────────────────────────────────────────
  sv: {
    "home.exampleTitle": "Andragradsekvation",
    "home.exampleStep1": "Faktorisera: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Sätt varje parentes lika med noll",
    "home.exampleAnswer": "x = 2 eller x = 3",
    "subject.maths.tagline": "Räknare, lösare och fullständiga lösningar för varje kärnområde.",
    "subject.physics.tagline": "Rörelse, krafter, energi och kretsar — med resonemanget utskrivet.",
    "subject.chemistry.tagline": "Mol, formler och reaktioner — balanserade och förklarade.",
    "subject.biology.tagline": "Celler, organsystem och ärftlighet — steg för steg.",
    "subject.computer-science.tagline": "Data, algoritmer och logik — spårade och förklarade.",
  },

  // ── Greek ────────────────────────────────────────────────────────────────
  el: {
    "home.exampleTitle": "Δευτεροβάθμια εξίσωση",
    "home.exampleStep1": "Παραγοντοποίησε: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Θέσε κάθε παρένθεση ίση με μηδέν",
    "home.exampleAnswer": "x = 2 ή x = 3",
    "subject.maths.tagline": "Υπολογιστές, επιλυτές και πλήρεις λύσεις για κάθε βασική ενότητα.",
    "subject.physics.tagline": "Κίνηση, δυνάμεις, ενέργεια και κυκλώματα — με τη συλλογιστική.",
    "subject.chemistry.tagline": "Mol, εξισώσεις και αντιδράσεις — ισοσταθμισμένες και εξηγημένες.",
    "subject.biology.tagline": "Κύτταρα, συστήματα και κληρονομικότητα — βήμα προς βήμα.",
    "subject.computer-science.tagline": "Δεδομένα, αλγόριθμοι και λογική — με ίχνη και εξήγηση.",
  },

  // ── Hebrew ───────────────────────────────────────────────────────────────
  he: {
    "home.exampleTitle": "משוואה ריבועית",
    "home.exampleStep1": "פרק לגורמים: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "השווה כל סוגר לאפס",
    "home.exampleAnswer": "x = 2 או x = 3",
    "subject.maths.tagline": "מחשבונים, פותרים ופתרונות מלאים לכל נושא מרכזי.",
    "subject.physics.tagline": "תנועה, כוחות, אנרגיה ומעגלים — עם הנימוק.",
    "subject.chemistry.tagline": "מולים, משוואות ותגובות — מאוזנות ומוסברות.",
    "subject.biology.tagline": "תאים, מערכות ותורשה — שלב אחר שלב.",
    "subject.computer-science.tagline": "נתונים, אלגוריתמים ולוגיקה — במעקב ובהסבר.",
  },

  // ── Azerbaijani ──────────────────────────────────────────────────────────
  az: {
    "home.exampleTitle": "Kvadrat tənlik",
    "home.exampleStep1": "Vuruqlara ayır: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Hər mötərizəni sıfıra bərabərləşdir",
    "home.exampleAnswer": "x = 2 və ya x = 3",
    "subject.maths.tagline": "Hər əsas mövzu üçün kalkulyatorlar, həlledicilər və tam həllər.",
    "subject.physics.tagline": "Hərəkət, qüvvələr, enerji və dövrələr — əsaslandırma ilə.",
    "subject.chemistry.tagline": "Mol, tənliklər və reaksiyalar — bərabərləşdirilmiş və izah edilmiş.",
    "subject.biology.tagline": "Hüceyrələr, sistemlər və irsiyyət — addım-addım.",
    "subject.computer-science.tagline": "Məlumat, alqoritmlər və məntiq — izlənmiş və izah edilmiş.",
  },

  // ── Kazakh ───────────────────────────────────────────────────────────────
  kk: {
    "home.exampleTitle": "Квадрат теңдеу",
    "home.exampleStep1": "Көбейткіштерге жікте: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Әр жақшаны нөлге теңестір",
    "home.exampleAnswer": "x = 2 немесе x = 3",
    "subject.maths.tagline": "Әр негізгі тақырыпқа калькуляторлар, шешушілер және толық шешімдер.",
    "subject.physics.tagline": "Қозғалыс, күштер, энергия және тізбектер — негіздемесімен.",
    "subject.chemistry.tagline": "Моль, теңдеулер және реакциялар — теңестірілген және түсіндірілген.",
    "subject.biology.tagline": "Жасушалар, жүйелер және тұқымқуалаушылық — кезең-кезеңімен.",
    "subject.computer-science.tagline": "Деректер, алгоритмдер және логика — бақыланып, түсіндірілген.",
  },

  // ── Tagalog ──────────────────────────────────────────────────────────────
  tl: {
    "home.exampleTitle": "Kuwadratikong ekwasyon",
    "home.exampleStep1": "I-factor: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Ipanagtabla sa sero ang bawat panaklong",
    "home.exampleAnswer": "x = 2 o x = 3",
    "subject.maths.tagline":
      "Mga calculator, solver at kumpletong solusyon sa bawat pangunahing paksa.",
    "subject.physics.tagline": "Galaw, puwersa, enerhiya at sirkito — may paliwanag.",
    "subject.chemistry.tagline": "Mole, ekwasyon at reaksyon — balanse at may paliwanag.",
    "subject.biology.tagline": "Selula, sistema at pagmamana — hakbang-hakbang.",
    "subject.computer-science.tagline": "Data, algorithm at lohika — sinusubaybayan at ipinaliwanag.",
  },

  // ── Malay ────────────────────────────────────────────────────────────────
  ms: {
    "home.exampleTitle": "Persamaan kuadratik",
    "home.exampleStep1": "Faktorkan: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Samakan setiap kurungan dengan sifar",
    "home.exampleAnswer": "x = 2 atau x = 3",
    "subject.maths.tagline":
      "Kalkulator, penyelesai dan penyelesaian lengkap bagi setiap topik utama.",
    "subject.physics.tagline": "Gerakan, daya, tenaga dan litar — dengan penaakulan.",
    "subject.chemistry.tagline": "Mol, persamaan dan tindak balas — seimbang dan dijelaskan.",
    "subject.biology.tagline": "Sel, sistem dan pewarisan — langkah demi langkah.",
    "subject.computer-science.tagline": "Data, algoritma dan logik — dijejaki dan dijelaskan.",
  },

  // ── Hausa ────────────────────────────────────────────────────────────────
  ha: {
    "home.exampleTitle": "Matsala ta biyu (kwadratik)",
    "home.exampleStep1": "Raba zuwa dalilai: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Sanya kowane baka daidai da sifili",
    "home.exampleAnswer": "x = 2 ko x = 3",
    "subject.maths.tagline":
      "Kalkuleta, masu warwarewa da cikakken bayani kan kowane babban batu.",
    "subject.physics.tagline": "Motsi, ƙarfi, kuzari da da'irori — da hujja.",
    "subject.chemistry.tagline": "Mol, daidaito da martani — an daidaita kuma an bayyana.",
    "subject.biology.tagline": "Kwayoyin halitta, tsarin jiki da gado — mataki-mataki.",
    "subject.computer-science.tagline": "Bayanai, algorithms da dabaru — an bibiya kuma an bayyana.",
  },

  // ── Kurdish ──────────────────────────────────────────────────────────────
  ku: {
    "home.exampleTitle": "Hevkêşeya çargoşe",
    "home.exampleStep1": "Faktor bike: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Her parantezê bi sifirê re wekhev bike",
    "home.exampleAnswer": "x = 2 an x = 3",
    "subject.maths.tagline":
      "Hesabker, çareserker û çareseriyên temam ji bo her mijara sereke.",
    "subject.physics.tagline": "Tevger, hêz, enerjî û çerx — bi sedemê re.",
    "subject.chemistry.tagline": "Mol, hevkêşe û reaksiyon — hevseng û ravekirî.",
    "subject.biology.tagline": "Xane, pergal û bomaweyî — gav bi gav.",
    "subject.computer-science.tagline": "Dane, algorîtma û mantiq — bi şopandin û ravekirinê.",
  },

  // ── Igbo ─────────────────────────────────────────────────────────────────
  ig: {
    "home.exampleTitle": "Nhazi akara nke abụọ",
    "home.exampleStep1": "Kewaa n'akụkụ: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Mee ka nkeji ọ bụla hà nhịahụ",
    "home.exampleAnswer": "x = 2 ma ọ bụ x = 3",
    "subject.maths.tagline":
      "Igwe mgbako, ihe ngwọta na ngwọta zuru ezu maka isiokwu ọ bụla.",
    "subject.physics.tagline": "Mmegharị, ike, ume na sekit — na nkọwa.",
    "subject.chemistry.tagline": "Mol, akara na mmeghachi omume — ha nhata ma kọwaa.",
    "subject.biology.tagline": "Mkpụrụ ndụ, sistem na ihe nketa — nke nta nke nta.",
    "subject.computer-science.tagline": "Data, algọridim na mgbagha — esoro ma kọwaa.",
  },

  // ── Yoruba ───────────────────────────────────────────────────────────────
  yo: {
    "home.exampleTitle": "Ìdọ́gba oníwọ̀n méjì",
    "home.exampleStep1": "Ṣe àwárí àwọn ìdí: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Fi kọ́bọ̀ kọ̀ọ̀kan dọ́gba pẹ̀lú odo",
    "home.exampleAnswer": "x = 2 tàbí x = 3",
    "subject.maths.tagline":
      "Ẹ̀rọ ìṣirò, olùyanjú àti ojútùú kíkún fún kókó pàtàkì kọ̀ọ̀kan.",
    "subject.physics.tagline": "Ìṣíkiri, agbára, agbára-ìṣe àti àwọn àyíká — pẹ̀lú ìdí.",
    "subject.chemistry.tagline": "Mol, ìdọ́gba àti ìdáhùn — tí a dọ́gba, tí a sì ṣàlàyé.",
    "subject.biology.tagline": "Àwọn sẹ́ẹ̀lì, ẹ̀yà ara àti ogún — ní ìgbésẹ̀.",
    "subject.computer-science.tagline": "Dátà, àlùpẹ̀tẹ̀ àti ọgbọ́n — tí a tọ̀pa, tí a sì ṣàlàyé.",
  },

  // ── Amharic ──────────────────────────────────────────────────────────────
  am: {
    "home.exampleTitle": "የካሬ እኩልታ",
    "home.exampleStep1": "ወደ ምክንያቶች ክፈል: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "እያንዳንዱን ቅንፍ ከዜሮ አስተካክል",
    "home.exampleAnswer": "x = 2 ወይም x = 3",
    "subject.maths.tagline": "ለእያንዳንዱ ዋና ርዕስ ካልኩሌተሮች፣ መፍታቾች እና ሙሉ መፍትሔዎች።",
    "subject.physics.tagline": "እንቅስቃሴ፣ ኃይሎች፣ ጉልበት እና ወረዳዎች — ከምክንያት ጋር።",
    "subject.chemistry.tagline": "ሞል፣ እኩልታዎች እና ምላሾች — ተመጣጣኝ እና የተብራሩ።",
    "subject.biology.tagline": "ሕዋሳት፣ ሥርዓቶች እና ውርስ — ደረጃ በደረጃ።",
    "subject.computer-science.tagline": "መረጃ፣ አልጎሪዝሞች እና ሎጂክ — ተከትለው የተብራሩ።",
  },

  // ── Nepali ───────────────────────────────────────────────────────────────
  ne: {
    "home.exampleTitle": "द्विघात समीकरण",
    "home.exampleStep1": "गुणनखण्ड गर्नुहोस्: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "हरेक कोष्ठकलाई शून्य बराबर राख्नुहोस्",
    "home.exampleAnswer": "x = 2 वा x = 3",
    "subject.maths.tagline": "हरेक मुख्य विषयका लागि क्याल्कुलेटर, समाधानकर्ता र पूर्ण हल।",
    "subject.physics.tagline": "गति, बल, ऊर्जा र परिपथ — तर्कसहित।",
    "subject.chemistry.tagline": "मोल, समीकरण र अभिक्रिया — सन्तुलित र व्याख्या गरिएका।",
    "subject.biology.tagline": "कोष, प्रणाली र वंशानुक्रम — चरणबद्ध रूपमा।",
    "subject.computer-science.tagline": "डेटा, एल्गोरिदम र तर्क — ट्रेस र व्याख्यासहित।",
  },

  // ── Sinhala ──────────────────────────────────────────────────────────────
  si: {
    "home.exampleTitle": "වර්ග සමීකරණය",
    "home.exampleStep1": "සාධක වෙන් කරන්න: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "සෑම වරහනක්ම බිංදුවට සමාන කරන්න",
    "home.exampleAnswer": "x = 2 හෝ x = 3",
    "subject.maths.tagline":
      "සෑම ප්‍රධාන මාතෘකාවකටම ගණක යන්ත්‍ර, විසඳුම්කරුවන් සහ සම්පූර්ණ විසඳුම්.",
    "subject.physics.tagline": "චලනය, බල, ශක්තිය සහ පරිපථ — තර්කය සමඟ.",
    "subject.chemistry.tagline": "මෝල්, සමීකරණ සහ ප්‍රතික්‍රියා — සමතුලිත සහ පැහැදිලි.",
    "subject.biology.tagline": "සෛල, පද්ධති සහ උරුමය — පියවරෙන් පියවර.",
    "subject.computer-science.tagline":
      "දත්ත, ඇල්ගොරිතම සහ තර්කනය — නිරීක්ෂණය සහ පැහැදිලි කිරීම සමඟ.",
  },

  // ── Khmer ────────────────────────────────────────────────────────────────
  km: {
    "home.exampleTitle": "សមីការដឺក្រេទីពីរ",
    "home.exampleStep1": "ញែកជាកត្តា: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ដាក់វង់ក្រចកនីមួយៗឱ្យស្មើសូន្យ",
    "home.exampleAnswer": "x = 2 ឬ x = 3",
    "subject.maths.tagline":
      "ម៉ាស៊ីនគិតលេខ កម្មវិធីដោះស្រាយ និងដំណោះស្រាយពេញលេញសម្រាប់រាល់ប្រធានបទសំខាន់។",
    "subject.physics.tagline": "ចលនា កម្លាំង ថាមពល និងសៀគ្វី — ជាមួយហេតុផល។",
    "subject.chemistry.tagline": "ម៉ូល សមីការ និងប្រតិកម្ម — សមតុល្យ និងពន្យល់។",
    "subject.biology.tagline": "កោសិកា ប្រព័ន្ធ និងកេរ្តិ៍ឈ្មោះ — មួយជំហានម្តង។",
    "subject.computer-science.tagline": "ទិន្នន័យ ក្បួនដោះស្រាយ និងតក្កវិជ្ជា — តាមដាន និងពន្យល់។",
  },

  // ── Burmese ──────────────────────────────────────────────────────────────
  my: {
    "home.exampleTitle": "နှစ်ထပ်ကိန်းညီမျှခြင်း",
    "home.exampleStep1": "အချက်ခွဲပါ: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ကွင်းစပ်တစ်ခုစီကို သုညနှင့် ညီစေပါ",
    "home.exampleAnswer": "x = 2 သို့မဟုတ် x = 3",
    "subject.maths.tagline":
      "အဓိကခေါင်းစဉ်တိုင်းအတွက် ဂဏန်းတွက်စက်၊ ဖြေရှင်းစက် နှင့် အပြည့်အစုံအဖြေများ။",
    "subject.physics.tagline": "ရွေ့လျားမှု၊ အား၊ စွမ်းအင် နှင့် ဆားကစ်များ — အကြောင်းပြချက်နှင့်တကွ။",
    "subject.chemistry.tagline": "မိုးလ်၊ ညီမျှခြင်း နှင့် တုံ့ပြန်မှုများ — ချိန်ညှိပြီး ရှင်းလင်းထားသည်။",
    "subject.biology.tagline": "ဆဲလ်များ၊ စနစ်များ နှင့် မျိုးရိုးလိုက်မှု — အဆင့်လိုက်။",
    "subject.computer-science.tagline":
      "ဒေတာ၊ အယ်လဂိုရီသမ် နှင့် ယုတ္တိ — ခြေရာခံပြီး ရှင်းလင်းထားသည်။",
  },

  // ── Punjabi ──────────────────────────────────────────────────────────────
  pa: {
    "home.exampleTitle": "ਦੋ-ਘਾਤੀ ਸਮੀਕਰਨ",
    "home.exampleStep1": "ਗੁਣਨਖੰਡ ਕਰੋ: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ਹਰ ਬਰੈਕਟ ਨੂੰ ਸਿਫ਼ਰ ਦੇ ਬਰਾਬਰ ਰੱਖੋ",
    "home.exampleAnswer": "x = 2 ਜਾਂ x = 3",
    "subject.maths.tagline": "ਹਰ ਮੁੱਖ ਵਿਸ਼ੇ ਲਈ ਕੈਲਕੁਲੇਟਰ, ਹੱਲ ਕਰਨ ਵਾਲੇ ਅਤੇ ਪੂਰੇ ਹੱਲ।",
    "subject.physics.tagline": "ਗਤੀ, ਬਲ, ਊਰਜਾ ਅਤੇ ਸਰਕਟ — ਤਰਕ ਸਮੇਤ।",
    "subject.chemistry.tagline": "ਮੋਲ, ਸਮੀਕਰਨ ਅਤੇ ਪ੍ਰਤੀਕਿਰਿਆਵਾਂ — ਸੰਤੁਲਿਤ ਅਤੇ ਸਮਝਾਈਆਂ।",
    "subject.biology.tagline": "ਸੈੱਲ, ਪ੍ਰਣਾਲੀਆਂ ਅਤੇ ਵਿਰਾਸਤ — ਕਦਮ ਦਰ ਕਦਮ।",
    "subject.computer-science.tagline": "ਡੇਟਾ, ਐਲਗੋਰਿਦਮ ਅਤੇ ਤਰਕ — ਟਰੇਸ ਅਤੇ ਵਿਆਖਿਆ ਸਮੇਤ।",
  },

  // ── Malayalam ────────────────────────────────────────────────────────────
  ml: {
    "home.exampleTitle": "ദ്വിഘാത സമവാക്യം",
    "home.exampleStep1": "ഘടകങ്ങളാക്കി മാറ്റുക: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ഓരോ ബ്രാക്കറ്റും പൂജ്യത്തിനു തുല്യമാക്കുക",
    "home.exampleAnswer": "x = 2 അല്ലെങ്കിൽ x = 3",
    "subject.maths.tagline":
      "ഓരോ പ്രധാന വിഷയത്തിനും കാൽക്കുലേറ്ററുകളും പരിഹാരകങ്ങളും പൂർണ്ണ പരിഹാരങ്ങളും.",
    "subject.physics.tagline": "ചലനം, ബലം, ഊർജ്ജം, സർക്യൂട്ടുകൾ — ന്യായീകരണത്തോടെ.",
    "subject.chemistry.tagline": "മോൾ, സമവാക്യങ്ങൾ, പ്രതിപ്രവർത്തനങ്ങൾ — സന്തുലിതവും വിശദീകരിച്ചതും.",
    "subject.biology.tagline": "കോശങ്ങൾ, വ്യവസ്ഥകൾ, പാരമ്പര്യം — ഘട്ടം ഘട്ടമായി.",
    "subject.computer-science.tagline": "ഡാറ്റ, അൽഗോരിതങ്ങൾ, തർക്കം — ട്രേസ് ചെയ്ത് വിശദീകരിച്ചത്.",
  },

  // ── Kannada ──────────────────────────────────────────────────────────────
  kn: {
    "home.exampleTitle": "ವರ್ಗ ಸಮೀಕರಣ",
    "home.exampleStep1": "ಅಪವರ್ತಿಸಿ: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ಪ್ರತಿ ಆವರಣವನ್ನು ಸೊನ್ನೆಗೆ ಸಮ ಮಾಡಿ",
    "home.exampleAnswer": "x = 2 ಅಥವಾ x = 3",
    "subject.maths.tagline":
      "ಪ್ರತಿ ಪ್ರಮುಖ ವಿಷಯಕ್ಕೂ ಕ್ಯಾಲ್ಕುಲೇಟರ್, ಬಿಡಿಸುವ ಸಾಧನ ಮತ್ತು ಪೂರ್ಣ ಪರಿಹಾರ.",
    "subject.physics.tagline": "ಚಲನೆ, ಬಲ, ಶಕ್ತಿ ಮತ್ತು ಮಂಡಲಗಳು — ತರ್ಕದೊಂದಿಗೆ.",
    "subject.chemistry.tagline": "ಮೋಲ್, ಸಮೀಕರಣ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆಗಳು — ಸಮತೋಲಿತ ಮತ್ತು ವಿವರಿಸಲಾಗಿದೆ.",
    "subject.biology.tagline": "ಜೀವಕೋಶ, ವ್ಯವಸ್ಥೆ ಮತ್ತು ಆನುವಂಶಿಕತೆ — ಹಂತ ಹಂತವಾಗಿ.",
    "subject.computer-science.tagline": "ಡೇಟಾ, ಅಲ್ಗಾರಿದಮ್ ಮತ್ತು ತರ್ಕ — ಜಾಡು ಹಿಡಿದು ವಿವರಿಸಲಾಗಿದೆ.",
  },

  // ── Odia ─────────────────────────────────────────────────────────────────
  or: {
    "home.exampleTitle": "ଦ୍ୱିଘାତ ସମୀକରଣ",
    "home.exampleStep1": "ଗୁଣନୀୟକ କର: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ପ୍ରତ୍ୟେକ ବନ୍ଧନୀକୁ ଶୂନ୍ୟ ସହ ସମାନ କର",
    "home.exampleAnswer": "x = 2 କିମ୍ବା x = 3",
    "subject.maths.tagline":
      "ପ୍ରତ୍ୟେକ ମୁଖ୍ୟ ବିଷୟ ପାଇଁ କାଲକୁଲେଟର, ସମାଧାନକାରୀ ଓ ସମ୍ପୂର୍ଣ୍ଣ ସମାଧାନ।",
    "subject.physics.tagline": "ଗତି, ବଳ, ଶକ୍ତି ଓ ପରିପଥ — ଯୁକ୍ତି ସହ।",
    "subject.chemistry.tagline": "ମୋଲ, ସମୀକରଣ ଓ ପ୍ରତିକ୍ରିୟା — ସନ୍ତୁଳିତ ଓ ବ୍ୟାଖ୍ୟା କରାଯାଇଛି।",
    "subject.biology.tagline": "କୋଷ, ତନ୍ତ୍ର ଓ ବଂଶାନୁକ୍ରମ — ପାଦ ପାଦ କରି।",
    "subject.computer-science.tagline": "ଡାଟା, ଆଲଗୋରିଦମ ଓ ତର୍କ — ଅନୁସରଣ ଓ ବ୍ୟାଖ୍ୟା ସହ।",
  },
};
