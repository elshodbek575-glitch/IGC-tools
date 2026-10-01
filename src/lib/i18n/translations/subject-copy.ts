import type { Dict } from "../types";

/**
 * Content copy that lives in the data files rather than the chrome.
 *
 * The English source for every one of these keys is the string stored in
 * `src/lib/subjects.ts` (subject taglines/blurbs) or in `Home.tsx` (the worked
 * example in the hero). Components read them with `tOr(key, englishSource)`,
 * so a missing translation simply keeps the English text — nothing ever
 * renders a raw key.
 *
 * The 101-entry tool catalogue uses the same mechanism under
 * `tool.<subjectId>.<toolSlug>.name` / `.note`.
 */
export const SUBJECT_COPY: Record<string, Dict> = {
  // ── Spanish ──────────────────────────────────────────────────────────────
  es: {
    "home.exampleTitle": "Ecuación cuadrática",
    "home.exampleStep1": "Factoriza: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Iguala cada paréntesis a cero",
    "home.exampleAnswer": "x = 2 o x = 3",
    "subject.maths.tagline":
      "Calculadoras, resolutores y soluciones desarrolladas para cada tema clave.",
    "subject.maths.blurb":
      "De los radicales y las ecuaciones simultáneas a los teoremas de la circunferencia y la estadística: cada resolutor muestra todos los pasos, no solo la respuesta final.",
    "subject.physics.tagline":
      "Movimiento, fuerzas, energía y circuitos, con el razonamiento detallado.",
    "subject.physics.blurb":
      "Cada calculadora muestra la ecuación, la sustitución y el razonamiento de las unidades, así aprendes el método y también la respuesta.",
    "subject.chemistry.tagline":
      "Moles, ecuaciones y reacciones: equilibradas y explicadas.",
    "subject.chemistry.blurb":
      "Acierta siempre con la proporción, los moles y las unidades con herramientas que muestran el razonamiento en cada etapa.",
    "subject.biology.tagline":
      "Células, sistemas y herencia: explicados paso a paso.",
    "subject.biology.blurb":
      "Diagramas originales interactivos, herramientas de genética y glosarios por tema que hacen visible el razonamiento.",
    "subject.computer-science.tagline":
      "Datos, algoritmos y lógica: trazados y explicados.",
    "subject.computer-science.blurb":
      "Convierte, simula y traza: cada herramienta recorre los pasos del algoritmo en lugar de ocultarlos.",
  },

  // ── French ───────────────────────────────────────────────────────────────
  fr: {
    "home.exampleTitle": "Équation du second degré",
    "home.exampleStep1": "Factorise : (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Chaque facteur est égal à zéro",
    "home.exampleAnswer": "x = 2 ou x = 3",
    "subject.maths.tagline":
      "Calculatrices, solveurs et solutions rédigées pour chaque thème essentiel.",
    "subject.maths.blurb":
      "Des racines et des systèmes d'équations aux théorèmes du cercle et aux statistiques : chaque solveur détaille toutes les étapes, pas seulement la réponse finale.",
    "subject.physics.tagline":
      "Mouvement, forces, énergie et circuits — avec le raisonnement détaillé.",
    "subject.physics.blurb":
      "Chaque calculatrice montre l'équation, la substitution et le raisonnement sur les unités : vous apprenez la méthode autant que la réponse.",
    "subject.chemistry.tagline":
      "Moles, équations et réactions — équilibrées et expliquées.",
    "subject.chemistry.blurb":
      "Justes sur le rapport, les moles et les unités à chaque fois, grâce à des outils qui montrent le raisonnement à chaque étape.",
    "subject.biology.tagline":
      "Cellules, systèmes et hérédité — expliqués étape par étape.",
    "subject.biology.blurb":
      "Des schémas originaux interactifs, des outils de génétique et des glossaires par thème qui rendent le raisonnement visible.",
    "subject.computer-science.tagline":
      "Données, algorithmes et logique — tracés et expliqués.",
    "subject.computer-science.blurb":
      "Convertir, simuler, tracer : chaque outil déroule les étapes de l'algorithme au lieu de les cacher.",
  },

  // ── German ───────────────────────────────────────────────────────────────
  de: {
    "home.exampleTitle": "Quadratische Gleichung",
    "home.exampleStep1": "Faktorisiere: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Setze jede Klammer gleich null",
    "home.exampleAnswer": "x = 2 oder x = 3",
    "subject.maths.tagline":
      "Rechner, Löser und vollständige Lösungswege für jedes Kernthema.",
    "subject.maths.blurb":
      "Von Wurzeln und linearen Gleichungssystemen bis zu Kreissätzen und Statistik — jeder Löser zeigt jeden Schritt, nicht nur das Ergebnis.",
    "subject.physics.tagline":
      "Bewegung, Kräfte, Energie und Stromkreise — mit nachvollziehbarer Herleitung.",
    "subject.physics.blurb":
      "Jeder Rechner zeigt die Formel, das Einsetzen und die Einheiten — so lernst du die Methode und nicht nur die Antwort.",
    "subject.chemistry.tagline":
      "Stoffmenge, Gleichungen und Reaktionen — ausgeglichen und erklärt.",
    "subject.chemistry.blurb":
      "Mit Werkzeugen, die den Rechenweg in jeder Stufe zeigen, stimmen Verhältnis, Stoffmenge und Einheiten immer.",
    "subject.biology.tagline":
      "Zellen, Systeme und Vererbung — Schritt für Schritt erklärt.",
    "subject.biology.blurb":
      "Interaktive eigene Diagramme, Genetik-Werkzeuge und Glossare pro Thema, die den Denkweg sichtbar machen.",
    "subject.computer-science.tagline":
      "Daten, Algorithmen und Logik — nachvollzogen und erklärt.",
    "subject.computer-science.blurb":
      "Umrechnen, simulieren, nachvollziehen: Jedes Werkzeug geht die Schritte des Algorithmus durch, statt sie zu verbergen.",
  },

  // ── Portuguese ───────────────────────────────────────────────────────────
  pt: {
    "home.exampleTitle": "Equação quadrática",
    "home.exampleStep1": "Fatoriza: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Iguala cada parêntese a zero",
    "home.exampleAnswer": "x = 2 ou x = 3",
    "subject.maths.tagline":
      "Calculadoras, solucionadores e resoluções completas para cada tema central.",
    "subject.maths.blurb":
      "Dos radicais e equações simultâneas aos teoremas da circunferência e à estatística: cada solucionador mostra todos os passos, não apenas a resposta final.",
    "subject.physics.tagline":
      "Movimento, forças, energia e circuitos — com o raciocínio detalhado.",
    "subject.physics.blurb":
      "Cada calculadora mostra a equação, a substituição e o raciocínio das unidades, para aprenderes o método e não só a resposta.",
    "subject.chemistry.tagline":
      "Moles, equações e reações — acertadas e explicadas.",
    "subject.chemistry.blurb":
      "Acerta na proporção, nos moles e nas unidades todas as vezes, com ferramentas que mostram o raciocínio em cada etapa.",
    "subject.biology.tagline":
      "Células, sistemas e hereditariedade — explicados passo a passo.",
    "subject.biology.blurb":
      "Diagramas originais interativos, ferramentas de genética e glossários por tema que tornam o raciocínio visível.",
    "subject.computer-science.tagline":
      "Dados, algoritmos e lógica — traçados e explicados.",
    "subject.computer-science.blurb":
      "Converte, simula e traça: cada ferramenta percorre os passos do algoritmo em vez de os esconder.",
  },

  // ── Italian ──────────────────────────────────────────────────────────────
  it: {
    "home.exampleTitle": "Equazione di secondo grado",
    "home.exampleStep1": "Scomponi: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Poni ogni parentesi uguale a zero",
    "home.exampleAnswer": "x = 2 oppure x = 3",
    "subject.maths.tagline":
      "Calcolatrici, risolutori e svolgimenti completi per ogni argomento chiave.",
    "subject.maths.blurb":
      "Dai radicali e dai sistemi di equazioni ai teoremi della circonferenza e alla statistica: ogni risolutore mostra tutti i passaggi, non solo il risultato.",
    "subject.physics.tagline":
      "Moto, forze, energia e circuiti — con il ragionamento spiegato.",
    "subject.physics.blurb":
      "Ogni calcolatrice mostra la formula, la sostituzione e il ragionamento sulle unità: impari il metodo oltre alla risposta.",
    "subject.chemistry.tagline":
      "Moli, equazioni e reazioni — bilanciate e spiegate.",
    "subject.chemistry.blurb":
      "Proporzioni, moli e unità sempre corrette, con strumenti che mostrano il ragionamento in ogni fase.",
    "subject.biology.tagline":
      "Cellule, sistemi ed ereditarietà — spiegati passo dopo passo.",
    "subject.biology.blurb":
      "Diagrammi originali interattivi, strumenti di genetica e glossari per argomento che rendono visibile il ragionamento.",
    "subject.computer-science.tagline":
      "Dati, algoritmi e logica — tracciati e spiegati.",
    "subject.computer-science.blurb":
      "Converti, simula e traccia: ogni strumento percorre i passaggi dell'algoritmo invece di nasconderli.",
  },

  // ── Russian ──────────────────────────────────────────────────────────────
  ru: {
    "home.exampleTitle": "Квадратное уравнение",
    "home.exampleStep1": "Разложи на множители: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Приравняй каждую скобку к нулю",
    "home.exampleAnswer": "x = 2 или x = 3",
    "subject.maths.tagline":
      "Калькуляторы, решатели и полные решения по каждой ключевой теме.",
    "subject.maths.blurb":
      "От корней и систем уравнений до теорем окружности и статистики: каждый решатель показывает все шаги, а не только ответ.",
    "subject.physics.tagline":
      "Движение, силы, энергия и цепи — с понятным ходом рассуждений.",
    "subject.physics.blurb":
      "Каждый калькулятор показывает формулу, подстановку и работу с единицами — так вы учите метод, а не только ответ.",
    "subject.chemistry.tagline":
      "Моли, уравнения и реакции — сбалансировано и объяснено.",
    "subject.chemistry.blurb":
      "Пропорции, моли и единицы всегда верны благодаря инструментам, которые показывают ход решения на каждом шаге.",
    "subject.biology.tagline":
      "Клетки, системы и наследственность — пошагово.",
    "subject.biology.blurb":
      "Интерактивные авторские схемы, инструменты генетики и глоссарии по темам, которые делают рассуждение наглядным.",
    "subject.computer-science.tagline":
      "Данные, алгоритмы и логика — с трассировкой и объяснением.",
    "subject.computer-science.blurb":
      "Переводи, моделируй и трассируй: каждый инструмент проходит по шагам алгоритма, а не скрывает их.",
  },

  // ── Arabic ───────────────────────────────────────────────────────────────
  ar: {
    "home.exampleTitle": "معادلة تربيعية",
    "home.exampleStep1": "حلّل إلى عوامل: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "اجعل كل قوس يساوي صفرًا",
    "home.exampleAnswer": "x = 2 أو x = 3",
    "subject.maths.tagline":
      "آلات حاسبة وحلّالات وحلول كاملة لكل موضوع أساسي.",
    "subject.maths.blurb":
      "من الجذور والمعادلات الآنية إلى نظريات الدائرة والإحصاء: كل حلّال يعرض كل خطوة، لا النتيجة النهائية فقط.",
    "subject.physics.tagline": "الحركة والقوى والطاقة والدوائر — بمنطق واضح.",
    "subject.physics.blurb":
      "كل آلة حاسبة تعرض المعادلة والتعويض ومنطق الوحدات، فتتعلّم الطريقة لا الجواب فقط.",
    "subject.chemistry.tagline":
      "المولات والمعادلات والتفاعلات — موزونة ومشروحة.",
    "subject.chemistry.blurb":
      "اضبط النسبة والمولات والوحدات في كل مرة بأدوات تعرض المنطق في كل مرحلة.",
    "subject.biology.tagline": "الخلايا والأجهزة والوراثة — بشرح خطوة بخطوة.",
    "subject.biology.blurb":
      "رسوم تفاعلية أصلية وأدوات للوراثة ومعاجم حسب الموضوع تجعل المنطق مرئيًا.",
    "subject.computer-science.tagline":
      "البيانات والخوارزميات والمنطق — بتتبّع وشرح.",
    "subject.computer-science.blurb":
      "حوّل وحاكِ وتتبّع: كل أداة تسير في خطوات الخوارزمية بدل إخفائها.",
  },

  // ── Chinese ──────────────────────────────────────────────────────────────
  zh: {
    "home.exampleTitle": "一元二次方程",
    "home.exampleStep1": "因式分解：(x − 2)(x − 3) = 0",
    "home.exampleStep2": "令每个括号等于零",
    "home.exampleAnswer": "x = 2 或 x = 3",
    "subject.maths.tagline": "计算器、求解器与完整解题步骤，覆盖每个核心主题。",
    "subject.maths.blurb":
      "从根式、联立方程到圆定理与统计——每个求解器都展示每一步，而不只是最终答案。",
    "subject.physics.tagline": "运动、力、能量与电路——推理过程清晰呈现。",
    "subject.physics.blurb":
      "每个计算器都展示公式、代入与单位推理，让你既懂方法也懂答案。",
    "subject.chemistry.tagline": "摩尔、方程式与反应——配平并解释。",
    "subject.chemistry.blurb":
      "用展示每一步推理的工具，每次都能正确处理比例、摩尔与单位。",
    "subject.biology.tagline": "细胞、系统与遗传——一步步讲解。",
    "subject.biology.blurb":
      "原创交互图示、遗传学工具与主题词汇表，让推理过程看得见。",
    "subject.computer-science.tagline":
      "数据、算法与逻辑——逐步追踪并解释。",
    "subject.computer-science.blurb":
      "转换、模拟、追踪：每个工具都走完算法的每一步，而不是把步骤藏起来。",
  },

  // ── Hindi ────────────────────────────────────────────────────────────────
  hi: {
    "home.exampleTitle": "द्विघात समीकरण",
    "home.exampleStep1": "गुणनखंड करें: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "हर कोष्ठक को शून्य के बराबर रखें",
    "home.exampleAnswer": "x = 2 या x = 3",
    "subject.maths.tagline":
      "हर मुख्य विषय के लिए कैलकुलेटर, हलकर्ता और पूर्ण हल।",
    "subject.maths.blurb":
      "करणी और युगपत समीकरणों से लेकर वृत्त प्रमेय और सांख्यिकी तक — हर हलकर्ता हर चरण दिखाता है, केवल अंतिम उत्तर नहीं।",
    "subject.physics.tagline": "गति, बल, ऊर्जा और परिपथ — तर्क सहित।",
    "subject.physics.blurb":
      "हर कैलकुलेटर सूत्र, प्रतिस्थापन और मात्रक का तर्क दिखाता है, ताकि आप विधि भी सीखें, केवल उत्तर नहीं।",
    "subject.chemistry.tagline":
      "मोल, समीकरण और अभिक्रियाएँ — संतुलित और समझाई गई।",
    "subject.chemistry.blurb":
      "हर बार अनुपात, मोल और मात्रक सही पाएँ — ऐसे उपकरण जो हर चरण का तर्क दिखाते हैं।",
    "subject.biology.tagline": "कोशिकाएँ, तंत्र और आनुवंशिकता — चरण दर चरण।",
    "subject.biology.blurb":
      "मौलिक इंटरैक्टिव आरेख, आनुवंशिकी उपकरण और विषय-वार शब्दावली जो तर्क को दृश्य बनाते हैं।",
    "subject.computer-science.tagline":
      "डेटा, एल्गोरिदम और तर्क — ट्रेस और व्याख्या सहित।",
    "subject.computer-science.blurb":
      "बदलें, अनुकरण करें और ट्रेस करें: हर उपकरण एल्गोरिदम के चरणों से गुज़रता है, छिपाता नहीं।",
  },

  // ── Urdu ─────────────────────────────────────────────────────────────────
  ur: {
    "home.exampleTitle": "دو درجی مساوات",
    "home.exampleStep1": "تجزی کریں: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "ہر بریکٹ کو صفر کے برابر رکھیں",
    "home.exampleAnswer": "x = 2 یا x = 3",
    "subject.maths.tagline":
      "ہر بنیادی موضوع کے لیے کیلکولیٹر، حل کرنے والے اور مکمل حل۔",
    "subject.maths.blurb":
      "جذروں اور بیک وقت مساواتوں سے لے کر دائرے کے قضیوں اور شماریات تک — ہر حل ہر مرحلہ دکھاتا ہے، صرف آخری جواب نہیں۔",
    "subject.physics.tagline": "حرکت، قوتیں، توانائی اور سرکٹس — دلیل کے ساتھ۔",
    "subject.physics.blurb":
      "ہر کیلکولیٹر مساوات، تقرر اور اکائیوں کی دلیل دکھاتا ہے، تاکہ آپ طریقہ بھی سیکھیں۔",
    "subject.chemistry.tagline": "مول، مساواتیں اور تعاملات — متوازن اور واضح۔",
    "subject.chemistry.blurb":
      "ہر بار تناسب، مول اور اکائیاں درست رکھیں — ایسے اوزار جو ہر مرحلے کی دلیل دکھاتے ہیں۔",
    "subject.biology.tagline": "خلیے، نظام اور وراثت — قدم بہ قدم۔",
    "subject.biology.blurb":
      "اصل متحرک خاکے، وراثت کے اوزار اور موضوع وار فرہنگ جو دلیل کو نمایاں کرتے ہیں۔",
    "subject.computer-science.tagline":
      "ڈیٹا، الخوارزم اور منطق — ٹریس اور وضاحت کے ساتھ۔",
    "subject.computer-science.blurb":
      "بدلیں، نقل کریں اور ٹریس کریں: ہر اوزار الخوارزم کے مراحل سے گزرتا ہے، چھپاتا نہیں۔",
  },

  // ── Indonesian ───────────────────────────────────────────────────────────
  id: {
    "home.exampleTitle": "Persamaan kuadrat",
    "home.exampleStep1": "Faktorkan: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Samakan setiap kurung dengan nol",
    "home.exampleAnswer": "x = 2 atau x = 3",
    "subject.maths.tagline":
      "Kalkulator, penyelesai, dan penyelesaian lengkap untuk setiap topik inti.",
    "subject.maths.blurb":
      "Dari bentuk akar dan persamaan simultan hingga teorema lingkaran dan statistika — setiap penyelesai menunjukkan semua langkah, bukan hanya jawaban akhir.",
    "subject.physics.tagline":
      "Gerak, gaya, energi, dan rangkaian — dengan penalaran yang jelas.",
    "subject.physics.blurb":
      "Setiap kalkulator menunjukkan rumus, substitusi, dan penalaran satuan, sehingga kamu belajar metodenya juga.",
    "subject.chemistry.tagline":
      "Mol, persamaan, dan reaksi — setara dan dijelaskan.",
    "subject.chemistry.blurb":
      "Rasio, mol, dan satuan selalu tepat dengan alat yang menunjukkan penalaran di setiap tahap.",
    "subject.biology.tagline":
      "Sel, sistem, dan pewarisan sifat — dijelaskan langkah demi langkah.",
    "subject.biology.blurb":
      "Diagram orisinal interaktif, alat genetika, dan glosarium per topik yang membuat penalaran terlihat.",
    "subject.computer-science.tagline":
      "Data, algoritma, dan logika — ditelusuri dan dijelaskan.",
    "subject.computer-science.blurb":
      "Konversi, simulasikan, telusuri: setiap alat menelusuri langkah algoritma, bukan menyembunyikannya.",
  },

  // ── Turkish ──────────────────────────────────────────────────────────────
  tr: {
    "home.exampleTitle": "İkinci dereceden denklem",
    "home.exampleStep1": "Çarpanlara ayır: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Her parantezi sıfıra eşitle",
    "home.exampleAnswer": "x = 2 veya x = 3",
    "subject.maths.tagline":
      "Her temel konu için hesap makineleri, çözücüler ve tam çözümler.",
    "subject.maths.blurb":
      "Köklü ifadeler ve denklem sistemlerinden çember teoremlerine ve istatistiğe — her çözücü yalnızca sonucu değil, tüm adımları gösterir.",
    "subject.physics.tagline":
      "Hareket, kuvvet, enerji ve devreler — gerekçesiyle birlikte.",
    "subject.physics.blurb":
      "Her hesap makinesi formülü, yerine koymayı ve birim mantığını gösterir; böylece yöntemi de öğrenirsin.",
    "subject.chemistry.tagline":
      "Mol, denklemler ve tepkimeler — denk ve açıklamalı.",
    "subject.chemistry.blurb":
      "Oranı, molleri ve birimleri her seferinde doğru yap; her aşamada gerekçeyi gösteren araçlarla.",
    "subject.biology.tagline":
      "Hücreler, sistemler ve kalıtım — adım adım anlatım.",
    "subject.biology.blurb":
      "Etkileşimli özgün şemalar, genetik araçları ve konu sözlükleri gerekçeyi görünür kılar.",
    "subject.computer-science.tagline":
      "Veri, algoritma ve mantık — izlenerek ve açıklanarak.",
    "subject.computer-science.blurb":
      "Dönüştür, benzet ve izle: her araç algoritmanın adımlarını saklamak yerine tek tek gösterir.",
  },

  // ── Uzbek ────────────────────────────────────────────────────────────────
  uz: {
    "home.exampleTitle": "Kvadrat tenglama",
    "home.exampleStep1": "Ko'paytuvchilarga ajrat: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Har bir qavsni nolga tenglashtir",
    "home.exampleAnswer": "x = 2 yoki x = 3",
    "subject.maths.tagline":
      "Har bir asosiy mavzu uchun kalkulyator, yechuvchi va to'liq yechimlar.",
    "subject.maths.blurb":
      "Ildizlar va birgalikdagi tenglamalardan aylana teoremalari va statistikagacha — har bir yechuvchi faqat javobni emas, har bir qadamni ko'rsatadi.",
    "subject.physics.tagline":
      "Harakat, kuchlar, energiya va zanjirlar — mulohaza bilan.",
    "subject.physics.blurb":
      "Har bir kalkulyator formulani, o'rniga qo'yishni va birliklar mantiqini ko'rsatadi, shunda usulni ham o'rganasiz.",
    "subject.chemistry.tagline":
      "Mol, tenglamalar va reaksiyalar — tenglashtirilgan va tushuntirilgan.",
    "subject.chemistry.blurb":
      "Nisbat, mol va birliklarni har safar to'g'ri chiqaring — har bosqichda mulohazani ko'rsatadigan vositalar bilan.",
    "subject.biology.tagline": "Hujayralar, tizimlar va irsiyat — qadam-baqadam.",
    "subject.biology.blurb":
      "Interaktiv original sxemalar, genetika vositalari va mavzuli lug'atlar mulohazani ko'rinadigan qiladi.",
    "subject.computer-science.tagline":
      "Ma'lumot, algoritm va mantiq — kuzatilgan va tushuntirilgan.",
    "subject.computer-science.blurb":
      "O'gir, taqlid qil va kuzat: har bir vosita algoritm qadamlarini yashirmay, birma-bir ko'rsatadi.",
  },

  // ── Japanese ─────────────────────────────────────────────────────────────
  ja: {
    "home.exampleTitle": "二次方程式",
    "home.exampleStep1": "因数分解：(x − 2)(x − 3) = 0",
    "home.exampleStep2": "各かっこを 0 とおく",
    "home.exampleAnswer": "x = 2 または x = 3",
    "subject.maths.tagline": "各単元の計算ツール、解法ツール、途中式つきの解答。",
    "subject.maths.blurb":
      "平方根や連立方程式から円の定理、統計まで、どの解法ツールも最終解答だけでなくすべての手順を示します。",
    "subject.physics.tagline": "運動・力・エネルギー・回路を、根拠つきで。",
    "subject.physics.blurb":
      "どの計算ツールも式・代入・単位の考え方を示すので、答えだけでなく解き方も身につきます。",
    "subject.chemistry.tagline": "モル・化学反応式・反応を、釣り合わせて解説。",
    "subject.chemistry.blurb":
      "比・モル・単位を毎回正確に。各段階の考え方を示すツールで学べます。",
    "subject.biology.tagline": "細胞・器官系・遺伝を、順を追って解説。",
    "subject.biology.blurb":
      "オリジナルの操作できる図、遺伝ツール、単元ごとの用語集で考え方が見えます。",
    "subject.computer-science.tagline": "データ・アルゴリズム・論理を、追跡して解説。",
    "subject.computer-science.blurb":
      "変換・シミュレーション・追跡。どのツールもアルゴリズムの手順を隠さずたどります。",
  },

  // ── Korean ───────────────────────────────────────────────────────────────
  ko: {
    "home.exampleTitle": "이차방정식",
    "home.exampleStep1": "인수분해: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "각 괄호를 0과 같게 놓기",
    "home.exampleAnswer": "x = 2 또는 x = 3",
    "subject.maths.tagline": "핵심 주제마다 계산기, 해법 도구, 전체 풀이.",
    "subject.maths.blurb":
      "무리수와 연립방정식부터 원의 정리와 통계까지 — 모든 해법 도구가 최종 답만이 아니라 모든 단계를 보여줍니다.",
    "subject.physics.tagline": "운동, 힘, 에너지, 회로 — 근거와 함께.",
    "subject.physics.blurb":
      "모든 계산기가 공식, 대입, 단위 논리를 보여 주어 방법까지 익힐 수 있습니다.",
    "subject.chemistry.tagline": "몰, 화학 반응식, 반응 — 균형과 설명까지.",
    "subject.chemistry.blurb":
      "비율, 몰, 단위를 매번 정확하게. 각 단계의 논리를 보여 주는 도구로 익히세요.",
    "subject.biology.tagline": "세포, 기관계, 유전 — 단계별 설명.",
    "subject.biology.blurb":
      "직접 만든 인터랙티브 그림, 유전 도구, 주제별 용어집으로 사고 과정이 보입니다.",
    "subject.computer-science.tagline": "데이터, 알고리즘, 논리 — 추적하고 설명합니다.",
    "subject.computer-science.blurb":
      "변환하고 시뮬레이션하고 추적하세요. 모든 도구가 알고리즘의 단계를 숨기지 않고 따라갑니다.",
  },

  // ── Vietnamese ───────────────────────────────────────────────────────────
  vi: {
    "home.exampleTitle": "Phương trình bậc hai",
    "home.exampleStep1": "Phân tích thành nhân tử: (x − 2)(x − 3) = 0",
    "home.exampleStep2": "Cho mỗi dấu ngoặc bằng không",
    "home.exampleAnswer": "x = 2 hoặc x = 3",
    "subject.maths.tagline":
      "Máy tính, công cụ giải và lời giải đầy đủ cho mọi chủ đề cốt lõi.",
    "subject.maths.blurb":
      "Từ căn thức, hệ phương trình đến định lý đường tròn và thống kê — mỗi công cụ giải đều trình bày từng bước, không chỉ đáp án.",
    "subject.physics.tagline":
      "Chuyển động, lực, năng lượng và mạch điện — có lập luận rõ ràng.",
    "subject.physics.blurb":
      "Mỗi máy tính đều hiển thị công thức, phép thay số và lập luận về đơn vị, để bạn học cả phương pháp.",
    "subject.chemistry.tagline":
      "Mol, phương trình và phản ứng — cân bằng và giải thích.",
    "subject.chemistry.blurb":
      "Tỉ lệ, số mol và đơn vị luôn đúng nhờ công cụ hiển thị lập luận ở từng bước.",
    "subject.biology.tagline":
      "Tế bào, hệ cơ quan và di truyền — giải thích từng bước.",
    "subject.biology.blurb":
      "Sơ đồ tương tác tự vẽ, công cụ di truyền và bảng thuật ngữ theo chủ đề giúp lập luận trở nên rõ ràng.",
    "subject.computer-science.tagline":
      "Dữ liệu, thuật toán và logic — vết chạy và giải thích.",
    "subject.computer-science.blurb":
      "Chuyển đổi, mô phỏng và truy vết: mỗi công cụ đi qua từng bước của thuật toán thay vì giấu đi.",
  },
};
