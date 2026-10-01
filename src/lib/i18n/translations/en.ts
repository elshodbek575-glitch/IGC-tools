import type { Dict } from "../types";

/**
 * English source strings. Every other locale is a partial override of these —
 * anything a locale omits falls back to the value here, so the app is always
 * readable even when a translation is missing.
 *
 * `{name}` placeholders are interpolated at render time by `t()`.
 */
export const en: Dict = {
  // ── Chrome / navigation ──────────────────────────────────────────────────
  "header.brandSub": "IGCSE STEM",
  "header.home": "Home",
  "header.subjects": "Subjects",
  "header.igcseSubjects": "IGCSE subjects",
  "header.toolsCount": "{count} tools",
  "header.openMenu": "Open menu",
  "header.search": "Search",
  "header.searchAria": "Search tools",
  "header.themeLight": "Switch to light mode",
  "header.themeDark": "Switch to dark mode",
  "header.language": "Language",
  "header.selectLanguage": "Select language",

  // ── Common actions ───────────────────────────────────────────────────────
  "common.home": "Home",
  "common.signIn": "Sign in",
  "common.signOut": "Sign out",
  "common.dashboard": "Dashboard",
  "common.copy": "Copy",
  "common.copied": "Copied!",
  "common.copyResult": "Copy result",
  "common.solve": "Solve",
  "common.reset": "Reset",
  "common.answer": "Answer",
  "common.formula": "Formula",
  "common.backHome": "Back to home",
  "common.exploreMaths": "Explore Maths",
  "common.explorePhysics": "Explore Physics",
  "common.buildingNow": "Building now",
  "common.planned": "Planned",
  "common.comingSoon": "Coming soon",
  "common.inDevelopment": "In development",
  "common.live": "Live",
  "common.openTool": "Open tool",
  "common.openSection": "Open section",
  "common.toolNumber": "Tool {number}",
  "common.loading": "Loading...",

  // ── Footer ───────────────────────────────────────────────────────────────
  "footer.description":
    "A free IGCSE STEM revision toolkit for Mathematics, Physics, Chemistry, Biology and Computer Science. Every tool shows its working.",
  "footer.subjects": "Subjects",
  "footer.toolkit": "Toolkit",
  "footer.account": "Account",
  "footer.startRevising": "Start revising",
  "footer.howItWorks": "How it works",
  "footer.roadmap": "Roadmap",
  "footer.copyright": "© {year} NovaTools · Built for IGCSE students.",
  "footer.disclaimer":
    "Written from the publicly published Cambridge and Edexcel IGCSE syllabus specifications. Not affiliated with or endorsed by the exam boards.",

  // ── Search ───────────────────────────────────────────────────────────────
  "search.findTool": "Find a tool",
  "search.placeholder":
    "Search tools — surds, Ohm's law, moles, Punnett square…",
  "search.noMatch": "No tools match \u201c{query}\u201d.",
  "search.dialogTitle": "Search tools",
  "search.dialogDescription": "Find an IGCSE revision tool by name or topic",
  "search.inputPlaceholder": "Search tools…",
  "search.empty": "No tools match that search.",

  // ── Home ─────────────────────────────────────────────────────────────────
  "home.seoTitle": "NovaTools · IGCSE STEM Revision Toolkit",
  "home.seoDescription":
    "Free IGCSE revision tools for Mathematics, Physics, Chemistry, Biology and Computer Science. Every tool shows its working — built on the Cambridge and Edexcel syllabuses.",
  "home.badge": "Cambridge & Edexcel IGCSE",
  "home.heroTitle": "One revision toolkit for all five IGCSE STEM subjects.",
  "home.heroBody":
    "NovaTools builds calculators, solvers and practice generators for Mathematics, Physics, Chemistry, Biology and Computer Science — and every one of them shows the working, not just the answer.",
  "home.startMaths": "Start with Maths",
  "home.browseSubjects": "Browse subjects",
  "home.statTools": "Planned tools",
  "home.statSubjects": "Subjects",
  "home.statUploaded": "Uploaded to a server",
  "home.subjectsTitle": "Five subjects. Five sections.",
  "home.subjectsBody":
    "Each subject has its own landing page listing its tools and the syllabus topics they map to. Jump between them any time from the navigation.",
  "home.builtTitle": "Built subject by subject",
  "home.builtBody":
    "Maths is being built first, then Physics, Chemistry, Biology and Computer Science. Open a section to see its topics and tool list.",
  "home.principlesTitle": "Designed for how students actually revise.",
  "home.p1Title": "Every tool shows its working",
  "home.p1Body":
    "Each calculator, solver and generator reveals the full method — the formula, the substitution and the units — not just a final answer.",
  "home.p2Title": "Original content only",
  "home.p2Body":
    "Questions, explanations and diagrams are written and drawn from scratch. Diagrams are original SVG, never textbook images.",
  "home.p3Title": "Runs entirely in your browser",
  "home.p3Body":
    "Tools run client-side like the rest of the site. Nothing is uploaded or stored on a server, so revision is instant and private.",
  "home.syllabusTitle": "Mapped to the official syllabus",
  "home.syllabusBody":
    "We work from the freely published Cambridge and Edexcel IGCSE subject specifications — the documents that list every topic and required skill. No copyrighted textbook content is used.",
  "home.roadmapTitle": "Shipping one subject at a time.",
  "home.roadmapBody":
    "Each subject goes live with a full set of tools before the next one starts, so what is on the site is always finished and reliable.",
  "home.step": "Step {number}",
  "home.ctaTitle": "Start revising the way exams are marked.",
  "home.ctaBody":
    "Pick a subject to explore its syllabus topics and the tools being built for it.",

  // ── Subject page ─────────────────────────────────────────────────────────
  "subject.notFoundTitle": "Subject not found",
  "subject.notFoundBody": "That subject doesn't exist yet.",
  "subject.allSubjects": "All subjects",
  "subject.revisionTools": "IGCSE revision tools",
  "subject.browseTools": "Browse {count} tools",
  "subject.syllabusTopics": "Syllabus topics",
  "subject.atGlance": "Section at a glance",
  "subject.tools": "Tools",
  "subject.topicAreas": "Topic areas",
  "subject.glanceNote":
    "Every tool in this section will show its full working. The pages below are live shells while the tools are built.",
  "subject.topicsTitle": "Syllabus topics we're building from.",
  "subject.topicsBody":
    "These topic areas come from the published {boards} specifications. Tools are mapped to these topics — not generic STEM ideas.",
  "subject.toolsMappedTitle": "{count} tools mapped to these topics.",
  "subject.toolsBuildingBody":
    "Maths leads the build. These tool pages are ready as shells while their logic is written.",
  "subject.toolsQueuedBody":
    "This section is queued behind Maths. Here is the tool set mapped to the topics above.",
  "subject.jumpTitle": "Jump to another subject",

  // ── Tool page / shell ────────────────────────────────────────────────────
  "tool.notFoundTitle": "Tool not found",
  "tool.notFoundBody":
    "There's no tool at that address. Browse a subject to see every tool in its section.",
  "shell.breadcrumb": "Breadcrumb",
  "shell.workingTitle": "Built to show its working",
  "shell.workingBody":
    "Every step is laid out in order — the formula, the substitution and the arithmetic — above the final answer. The layout is the same on every tool, so nothing moves around between topics.",
  "shell.placeholderLabel": "Value",
  "shell.placeholderInput": "Inputs arrive with the tool",
  "shell.placeholderNote":
    "Inputs for this tool appear here, with labels above each field.",
  "shell.placeholderResult":
    "The worked solution appears here, step by step.",

  // ── Tool runners ─────────────────────────────────────────────────────────
  "panels.inputs": "Inputs",
  "panels.resultWorking": "Result & working",
  "calc.chooseOption": "Choose an option",
  "calc.emptyHint":
    "Fill in the inputs and press Solve — the answer appears here with every step of the working.",
  "calc.cantSolve": "Can't solve that yet",
  "explorer.topics": "Topics",
  "explorer.noTopics": "No topics yet.",
  "explorer.nothing": "Nothing to show.",
  "explorer.topicLabel": "Topic {number}",
  "explorer.cardOf": "Card {index} of {total}",
  "explorer.tryRecall": "Try to recall the definition, then reveal it.",
  "explorer.reveal": "Reveal definition",
  "explorer.hide": "Hide definition",
  "explorer.previous": "Previous",
  "explorer.next": "Next",
  "explorer.restart": "Restart",
  "diagram.mode": "Mode",
  "diagram.labelQuiz": "Label quiz",
  "diagram.showLabels": "Show labels",
  "diagram.whichPart": "Which part is numbered {number}?",
  "diagram.nextPart": "Next part",
  "diagram.restartQuiz": "Restart quiz",
  "diagram.settled":
    "Settled correctly: {solved} of {total} · attempts {attempts}",
  "diagram.labelledParts": "Labelled parts",
  "diagram.diagram": "Diagram",
  "diagram.hintQuiz":
    "Find the numbered part on the diagram, then choose its name.",
  "diagram.hintReference": "Every part labelled, with what it does.",
  "diagram.wrong": "Not that one. Look again at where the marker sits.",
  "diagram.choose": "Choose an answer on the left.",

  // ── Auth ─────────────────────────────────────────────────────────────────
  "auth.backHome": "Back to home",
  "auth.getStarted": "Get Started",
  "auth.enterEmail": "Enter your email to log in or sign up",
  "auth.or": "Or",
  "auth.guest": "Continue as Guest",
  "auth.checkEmail": "Check your email",
  "auth.sentCode": "We've sent a code to {email}",
  "auth.noCode": "Didn't receive a code?",
  "auth.tryAgain": "Try again",
  "auth.verifying": "Verifying...",
  "auth.verifyCode": "Verify code",
  "auth.differentEmail": "Use different email",
  "auth.securedBy": "Secured by",
  "auth.errorSend": "Failed to send verification code. Please try again.",
  "auth.errorCode": "The verification code you entered is incorrect.",
  "auth.errorGuest": "Failed to sign in as guest: {error}",

  // ── Require auth ─────────────────────────────────────────────────────────
  "requireAuth.title": "Sign in to continue",
  "requireAuth.description": "This page is only available to signed-in users.",
  "requireAuth.returnNote":
    "You'll come straight back to this page once you're signed in.",

  // ── Dashboard ────────────────────────────────────────────────────────────
  "dash.seoTitle": "Your dashboard · NovaTools",
  "dash.seoDescription": "Your NovaTools IGCSE revision workspace.",
  "dash.welcome": "Welcome back",
  "dash.body":
    "Pick a subject to explore its syllabus topics and the tools being built for it. Progress will save here as each subject goes live.",

  // ── Not found ────────────────────────────────────────────────────────────
  "nf.seoTitle": "Page not found · NovaTools",
  "nf.seoDescription": "The page you were looking for doesn't exist.",
  "nf.title": "Page not found",
  "nf.body":
    "That page doesn't exist. Search for a tool below, or head back home.",

  // ── Subject names ────────────────────────────────────────────────────────
  "subject.maths": "Mathematics",
  "subject.physics": "Physics",
  "subject.chemistry": "Chemistry",
  "subject.biology": "Biology",
  "subject.computer-science": "Computer Science",
};
