import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "motion/react";
import {
  Mail, Phone, Linkedin, Github, ArrowUp, Download, ExternalLink,
  Sun, Moon, Menu, X, Sparkles, Code2, Database, Brain, GraduationCap,
  Briefcase, Award, FileText, Send, MapPin, Calendar, Rocket, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Portfolio });

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

const ROLES = [
  "AI Enthusiast",
  "Python Developer",
  "Full Stack Intern",
  "Problem Solver",
];

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

function useTyping(words: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length];
    const t = setTimeout(() => {
      if (!del) {
        setText(w.slice(0, text.length + 1));
        if (text.length + 1 === w.length) setTimeout(() => setDel(true), 1400);
      } else {
        setText(w.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setI(i + 1); }
      }
    }, del ? 45 : 85);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

function useActive() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

function Portfolio() {
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const active = useActive();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {loading && <Loader />}
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left gradient-bg" />
      <Backdrop />
      <Nav active={active} menu={menu} setMenu={setMenu} dark={dark} toggle={toggle} />

      <main className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Resume />
        <Contact />
      </main>

      <Footer />

      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full gradient-bg text-white shadow-lg shadow-primary/30 hover:scale-110 transition"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
}

function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.7, duration: 0.4 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-background pointer-events-none"
    >
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="absolute inset-0 grid place-items-center font-display text-xl font-bold gradient-text">L</span>
      </div>
    </motion.div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-glow/30 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-glow/25 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-glow/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:44px_44px]" />
    </div>
  );
}

function Nav({ active, menu, setMenu, dark, toggle }: { active: string; menu: boolean; setMenu: (b: boolean) => void; dark: boolean; toggle: () => void }) {
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenu(false);
  };
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass px-4 py-2.5 sm:px-6">
        <button onClick={() => go("home")} className="flex items-center gap-2 font-display font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-full gradient-bg text-white text-sm">LC</span>
          <span className="hidden sm:inline text-sm">Lakshmi<span className="gradient-text">.</span></span>
        </button>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition ${active === n.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {active === n.id && (
                <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-primary/15" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button onClick={toggle} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={() => setMenu(!menu)} aria-label="Menu" className="lg:hidden grid h-9 w-9 place-items-center rounded-full border border-border">
            {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {menu && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mx-auto mt-2 max-w-6xl rounded-2xl glass p-3">
          <div className="grid grid-cols-2 gap-1">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className={`rounded-xl px-3 py-2 text-left text-sm ${active === n.id ? "bg-primary/15 text-foreground" : "text-muted-foreground"}`}>
                {n.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <div className="mb-12 flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full gradient-bg" />{eyebrow}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold leading-[1.05]">{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

function Hero() {
  const typed = useTyping(ROLES);
  return (
    <section id="home" className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 pt-28 pb-16 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-mono text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Open to internships & collaborations
        </span>

        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] sm:text-7xl lg:text-8xl">
          Manam Lakshmi
          <br />
          <span className="gradient-text">Chaithanya</span>
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-lg sm:text-2xl">
          <span className="text-muted-foreground">I'm a</span>
          <span className="font-mono font-medium text-foreground min-w-[10ch]">
            {typed}<span className="caret" />
          </span>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          B.Tech Computer Science undergraduate at{" "}
          <span className="text-foreground font-medium">Sri Venkateswara College of Engineering, Tirupati</span>{" "}
          (Class of 2027, CGPA 9.3). Curious about AI, building user-friendly web apps in Python and full-stack technologies, and turning ideas into shipped products.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="/Lakshmi_Chaithanya_Resume.pdf" download
            className="group inline-flex items-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:scale-[1.03] transition">
            <Download className="h-4 w-4" /> Download Resume
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 text-sm font-semibold hover:border-primary/60 transition">
            <Send className="h-4 w-4" /> Get in touch
          </a>
          <div className="ml-2 flex items-center gap-2">
            <IconLink href="mailto:manamlakshmi2005@gmail.com" label="Email"><Mail className="h-4 w-4" /></IconLink>
            <IconLink href="https://www.linkedin.com/in/lakshmi-chaithanya" label="LinkedIn"><Linkedin className="h-4 w-4" /></IconLink>
            <IconLink href="tel:+919390424830" label="Phone"><Phone className="h-4 w-4" /></IconLink>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4">
          {[
            { k: "9.3", v: "CGPA / 10" },
            { k: "2027", v: "Graduation" },
            { k: "3+", v: "Certifications" },
            { k: "1", v: "Internship" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl p-4">
              <div className="font-display text-2xl font-bold gradient-text sm:text-3xl">{s.k}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      className="grid h-10 w-10 place-items-center rounded-full border border-border glass hover:border-primary/60 hover:text-primary transition">
      {children}
    </a>
  );
}

function About() {
  const items = [
    { icon: Sparkles, label: "Interests", value: "AI, Full Stack" },
    { icon: MapPin, label: "Location", value: "Tirupati, India" },
    { icon: Mail, label: "Email", value: "manamlakshmi2005@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91 93904 24830" },
    { icon: GraduationCap, label: "Degree", value: "B.Tech CSE, 3rd Year" },
    { icon: Rocket, label: "Currently", value: "Building AI Content Creator" },
  ];
  return (
    <Section id="about" eyebrow="About" title={<>A curious builder <span className="gradient-text">learning by shipping.</span></>}>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            I'm a Computer Science undergraduate who enjoys turning ideas into working products.
            My focus is on <span className="text-foreground font-medium">Python, frontend technologies, SQL, and OOP</span> — and I'm actively exploring
            AI fundamentals and machine learning workflows.
          </p>
          <p>
            My goal is simple: contribute to a dynamic engineering team, gain real industry exposure,
            and keep learning the technologies that shape tomorrow. I care about clean code, thoughtful UX,
            and solving problems end-to-end.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Problem Solving", "Team Collaboration", "Fast Learner", "Communication", "Adaptability"].map((s) => (
              <span key={s} className="rounded-full glass px-3 py-1 text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((it) => (
            <div key={it.label} className="glass rounded-2xl p-4">
              <it.icon className="h-4 w-4 text-primary" />
              <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{it.label}</div>
              <div className="mt-1 text-sm font-medium break-words">{it.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const EDU = [
  {
    title: "B.Tech, Computer Science & Engineering",
    place: "Sri Venkateswara College of Engineering, Tirupati",
    period: "2023 – 2027 (Expected)",
    grade: "CGPA: 9.3 / 10",
    icon: GraduationCap,
  },
  {
    title: "Intermediate (MPC)",
    place: "Higher Secondary Education",
    period: "2021 – 2023",
    grade: "Pre-University",
    icon: FileText,
  },
  {
    title: "Secondary School (SSC)",
    place: "Board of Secondary Education",
    period: "Completed 2021",
    grade: "Foundation",
    icon: FileText,
  },
];

function Education() {
  return (
    <Section id="education" eyebrow="Education" title={<>Academic <span className="gradient-text">timeline</span></>}>
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-glow via-violet-glow to-pink-glow sm:left-1/2" />
        <div className="space-y-8">
          {EDU.map((e, i) => (
            <motion.div key={e.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative grid gap-4 sm:grid-cols-2 ${i % 2 === 1 ? "sm:[&>*:first-child]:col-start-2" : ""}`}>
              <div className={`sm:${i % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                <div className="glass rounded-2xl p-5 hover:border-primary/60 transition">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-primary">{e.period}</div>
                  <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.place}</p>
                  <p className="mt-3 text-sm font-medium gradient-text">{e.grade}</p>
                </div>
              </div>
              <span className="absolute left-4 top-6 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full gradient-bg text-white ring-4 ring-background sm:left-1/2">
                <e.icon className="h-4 w-4" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const SKILL_GROUPS = [
  {
    icon: Code2, title: "Programming & Web",
    skills: [
      { name: "Python", level: 88 },
      { name: "JavaScript", level: 82 },
      { name: "HTML", level: 90 },
      { name: "CSS", level: 85 },
      { name: "MERN Stack", level: 75 },
    ],
  },
  {
    icon: Database, title: "Database & Querying",
    skills: [
      { name: "SQL", level: 82 },
    ],
  },
  {
    icon: Brain, title: "AI & Core Concepts",
    skills: [
      { name: "AI Fundamentals", level: 75 },
      { name: "OOP", level: 85 },
      { name: "Data Structures", level: 70 },
      { name: "Problem Solving", level: 82 },
    ],
  },
];

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title={<>Tools I use to <span className="gradient-text">build things.</span></>}>
      <div className="grid gap-5 md:grid-cols-3">
        {SKILL_GROUPS.map((g) => (
          <div key={g.title} className="glass rounded-3xl p-6 hover:border-primary/60 transition">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl gradient-bg text-white">
                <g.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">{g.title}</h3>
            </div>
            <div className="space-y-4">
              {g.skills.map((s) => (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full gradient-bg rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title={<>Where I've <span className="gradient-text">worked & learned.</span></>}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-3xl p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <div className="flex sm:flex-col items-center sm:items-start gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-bg text-white">
              <Briefcase className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-primary">May 2025 – Jul 2025</div>
              <div className="mt-1 text-xs text-muted-foreground">Remote</div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold sm:text-2xl">Full Stack Development Intern</h3>
            <p className="mt-1 text-sm text-muted-foreground">SmartBridge Educational Services</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {[
                "Built responsive full-stack web applications with CRUD operations and backend integration.",
                "Collaborated with team members to debug issues and deliver project milestones on time.",
                "Improved application performance by identifying and fixing bugs.",
                "Applied full-stack concepts to develop scalable and user-friendly solutions.",
              ].map((li) => (
                <li key={li} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript", "Python", "SQL"].map((t) => (
                <span key={t} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

const PROJECTS = [
  {
    title: "AI Content Creator",
    status: "Ongoing",
    period: "2025 – Present",
    desc: "An AI-based content generation system that automates text creation using NLP concepts, prompt engineering, and preprocessing pipelines to produce structured, relevant outputs — reducing manual effort on repetitive writing tasks.",
    features: [
      "NLP-driven structured text generation",
      "Prompt-based content shaping",
      "Preprocessing pipeline for relevance",
      "Automates repetitive content tasks",
    ],
    tech: ["Python", "NLP", "AI"],
  },
];

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title={<>Things I'm <span className="gradient-text">building.</span></>}>
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <motion.article key={p.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="group glass rounded-3xl overflow-hidden hover:border-primary/60 transition">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 gradient-bg opacity-90" />
              <div className="absolute inset-0 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="relative flex h-full items-center justify-center">
                <Brain className="h-16 w-16 text-white/90" strokeWidth={1.2} />
              </div>
              <span className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur px-3 py-1 text-[11px] font-mono text-white">
                {p.status}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <span className="text-[11px] font-mono text-muted-foreground">{p.period}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full gradient-bg" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">{t}</span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
        <div className="grid place-items-center rounded-3xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
          <div>
            <Rocket className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 max-w-xs">More projects in the pipeline — building, breaking, shipping.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

const CERTS = [
  { title: "Artificial Intelligence Fundamentals", org: "IBM SkillBuild", desc: "ML, NLP, AI lifecycle, and real-world applications." },
  { title: "Full Stack Development Internship", org: "SmartBridge", desc: "Frontend, backend, and database integration." },
  { title: "Data Analytics Job Simulation", org: "Deloitte", desc: "Data analysis, problem-solving, and visualization for business insights." },
];

function Certifications() {
  return (
    <Section id="certifications" eyebrow="Certifications" title={<>Learning, <span className="gradient-text">verified.</span></>}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c, i) => (
          <motion.div key={c.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="glass rounded-3xl p-6 hover:border-primary/60 hover:-translate-y-1 transition">
            <div className="mb-5 flex h-28 items-center justify-center rounded-2xl gradient-bg text-white relative overflow-hidden">
              <Award className="h-12 w-12" strokeWidth={1.4} />
              <div className="absolute inset-0 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:14px_14px] opacity-20" />
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-primary">{c.org}</div>
            <h3 className="mt-2 text-base font-semibold leading-snug">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Resume() {
  return (
    <Section id="resume" eyebrow="Resume" title={<>Prefer the <span className="gradient-text">one-pager?</span></>}>
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center glass rounded-3xl p-6 sm:p-10">
        <div>
          <h3 className="text-2xl font-semibold">Grab my full resume</h3>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Everything you've seen here — education, skills, internship, and projects — bundled into a single PDF, ready to share with your team or forward to a recruiter.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/Lakshmi_Chaithanya_Resume.pdf" download
              className="inline-flex items-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:scale-[1.03] transition">
              <Download className="h-4 w-4" /> Download PDF
            </a>
            <a href="/Lakshmi_Chaithanya_Resume.pdf" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 text-sm font-semibold hover:border-primary/60 transition">
              <ExternalLink className="h-4 w-4" /> View in browser
            </a>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative h-56 w-40 rounded-xl gradient-bg p-4 text-white shadow-xl">
            <FileText className="h-6 w-6" />
            <div className="mt-4 space-y-1.5">
              {[90, 60, 80, 40, 70, 55, 85, 45].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-white/40" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-[10px] font-mono uppercase tracking-widest opacity-80">Lakshmi.pdf</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const subject = String(fd.get("subject") || "Hello from your portfolio");
    const message = String(fd.get("message") || "");
    const body = `Hi Lakshmi,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)}`;
    window.location.href = `mailto:manamlakshmi2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSent(true);
  };
  return (
    <Section id="contact" eyebrow="Contact" title={<>Let's <span className="gradient-text">build something.</span></>}>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <p className="text-base text-muted-foreground sm:text-lg">
            Whether it's an internship opportunity, a project collab, or just a friendly hello — my inbox is open.
          </p>
          <div className="space-y-3">
            <ContactRow icon={Mail} label="Email" value="manamlakshmi2005@gmail.com" href="mailto:manamlakshmi2005@gmail.com" />
            <ContactRow icon={Phone} label="Phone" value="+91 93904 24830" href="tel:+919390424830" />
            <ContactRow icon={Linkedin} label="LinkedIn" value="lakshmi-chaithanya" href="https://www.linkedin.com/in/lakshmi-chaithanya" />
            <ContactRow icon={MapPin} label="Location" value="Tirupati, Andhra Pradesh, India" />
          </div>
        </div>
        <form onSubmit={onSubmit} className="lg:col-span-3 glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Your name" required />
            <Field name="email" type="email" label="Email" required />
          </div>
          <Field name="subject" label="Subject" />
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea name="message" required rows={5}
              className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition" />
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:scale-[1.02] transition">
            <Send className="h-4 w-4" /> {sent ? "Opening mail…" : "Send message"}
          </button>
        </form>
      </div>
    </Section>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-primary/60 transition">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-bg text-white">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a> : inner;
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</label>
      <input name={name} type={type} required={required}
        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full gradient-bg text-white font-display font-bold text-sm">LC</span>
            <div>
              <div className="text-sm font-semibold">Lakshmi Chaithanya</div>
              <div className="text-xs text-muted-foreground">Designed & built with care · 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconLink href="mailto:manamlakshmi2005@gmail.com" label="Email"><Mail className="h-4 w-4" /></IconLink>
            <IconLink href="https://www.linkedin.com/in/lakshmi-chaithanya" label="LinkedIn"><Linkedin className="h-4 w-4" /></IconLink>
            <IconLink href="tel:+919390424830" label="Phone"><Phone className="h-4 w-4" /></IconLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
