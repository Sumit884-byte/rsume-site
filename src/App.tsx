import { useMemo, type ReactNode } from "react"
import { Bot, Brain, Code2, ExternalLink, Github, Linkedin, Mail, Zap } from "lucide-react"
import { motion } from "framer-motion"
import autoContent from "./data/auto-content.json"
import { ARKA_REPO, arkaLinks } from "./config/arka"
import type { AutoContent, GitHubProject } from "./types/content"
import FloatingCodeBrackets from "./components/FloatingCodeBrackets"
import AnimatedHeroTitle from "./components/AnimatedHeroTitle"
import "./App.css"

const PROJECT_UI_GRADIENTS = [
  "linear-gradient(160deg, #ff9a3c 0%, #ffd93d 40%, #89c2f0 100%)",
  "linear-gradient(160deg, #ff6b6b 0%, #ffd6e0 50%, #6bcb77 100%)",
]

const featuredSkills = [
  { label: "AI & Data", icon: Brain, gradient: "from-[#ffd6a5] to-[#ffb347]" },
  { label: "Full Stack", icon: Code2, gradient: "from-[#bde0fe] to-[#89c2f0]" },
  { label: "Automation", icon: Bot, gradient: "from-[#caffbf] to-[#6bcb77]" },
]

function GlassCard({
  className = "",
  children,
  delay = 0,
}: {
  className?: string
  children: ReactNode
  delay?: number
}) {
  return (
    <motion.div
      className={`glass-card rounded-[28px] p-5 md:p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  )
}

function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 mesh-bg" aria-hidden="true">
      <div className="absolute inset-0 mesh-grid-overlay" />
    </div>
  )
}

function FloatingDecor() {
  const items = [
    { type: "star", className: "top-[8%] left-[6%]", delay: 0 },
    { type: "bracket", className: "top-[18%] right-[8%]", text: "</>", delay: 0.2 },
    { type: "moon", className: "bottom-[22%] left-[4%]", delay: 0.4 },
    { type: "star-green", className: "top-[42%] right-[4%]", delay: 0.1 },
    { type: "bracket", className: "bottom-[12%] right-[10%]", text: "{ }", delay: 0.3 },
    { type: "star", className: "top-[65%] left-[10%]", delay: 0.5 },
  ]

  return (
    <>
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`float-decor ${item.className}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + item.delay, duration: 0.5 }}
        >
          {item.type === "star" && <div className="decor-star" />}
          {item.type === "star-green" && <div className="decor-star decor-star-green" />}
          {item.type === "moon" && <div className="decor-moon" />}
          {item.type === "bracket" && <span className="decor-bracket">{item.text}</span>}
        </motion.div>
      ))}
    </>
  )
}

function PhoneMockup({
  project,
  tilt,
  variant,
}: {
  project: GitHubProject
  tilt: number
  variant: 0 | 1
}) {
  const gradient = PROJECT_UI_GRADIENTS[variant]

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`phone-mockup block aspect-[9/18] p-2.5 shrink-0 ${variant === 1 ? "phone-mockup-alt" : ""}`}
      style={{ rotate: `${tilt}deg` }}
      whileHover={{ scale: 1.06, rotate: tilt + 3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="h-full w-full rounded-[14px] overflow-hidden relative">
        <div className="absolute inset-0" style={{ background: gradient }} />
        <div className="relative h-full w-full p-2.5 flex flex-col">
          <div className="flex gap-1 mb-2">
            <span className="w-2 h-2 rounded-full bg-white/80" />
            <span className="w-2 h-2 rounded-full bg-white/60" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-6 rounded-lg bg-white/50" />
            <div className="h-3 rounded-md bg-white/35 w-3/4" />
            <div className="flex-1 rounded-xl bg-white/25 mt-1" />
            <div className="flex gap-1">
              <div className="h-8 flex-1 rounded-lg bg-white/40" />
              <div className="h-8 flex-1 rounded-lg bg-white/30" />
            </div>
          </div>
          <p className="font-display text-[9px] font-bold text-white/90 mt-2 leading-tight drop-shadow-sm">
            {project.title}
          </p>
        </div>
      </div>
    </motion.a>
  )
}

function QRCode({ url }: { url: string }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(url)}&bgcolor=fff5e6&color=ff6b35`

  return (
    <div className="relative w-[140px] h-[140px] mx-auto">
      <div className="qr-placeholder w-full h-full overflow-hidden">
        <img
          src={qrSrc}
          alt="LinkedIn QR code"
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
    </div>
  )
}

function sortProjects(projects: GitHubProject[]) {
  return [...projects].sort((a, b) => {
    if (a.url === ARKA_REPO) return -1
    if (b.url === ARKA_REPO) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export default function App() {
  const content = autoContent as AutoContent
  const projects = useMemo(() => sortProjects(content.projects), [content.projects])
  const phoneProjects = projects.filter((p) => p.url !== ARKA_REPO).slice(0, 2)
  const linkedInUrl = `https://linkedin.com/in/${content.linkedinUsername}`

  return (
    <div className="min-h-screen relative text-[#2d3436] selection:bg-[#89c2f0] selection:text-[#2d3436]">
      <MeshBackground />
      <FloatingDecor />

      <div className="app-content relative z-10 min-h-screen flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-6xl">
          <motion.div
            className="glass-shell pointer-events-auto"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="bento-grid">
              {/* Hero — large left card */}
              <GlassCard className="bento-hero !p-0 overflow-hidden flex flex-col" delay={0.1}>
                <div className="hero-content flex-1 flex flex-col items-center justify-center text-center">
                  <AnimatedHeroTitle />
                  <p className="hero-subtitle">Dream Coder</p>

                  <div className="hero-scene w-full flex-1">
                    <FloatingCodeBrackets />
                    <div className="hero-cloud" aria-hidden="true" />
                    <div className="hero-figure">
                      <img
                        src={content.profileImage}
                        alt="Sumit Mishra — developer portrait"
                        className="hero-character"
                        width={100}
                        height={100}
                      />
                      <div className="hero-laptop" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Skills — top middle */}
              <GlassCard className="bento-skills bg-gradient-to-br from-white/55 to-[#caffbf]/25" delay={0.2}>
                <h2 className="section-title">SKILLS</h2>
                <div className="skills-grid">
                  {featuredSkills.map(({ label, icon: Icon, gradient }, i) => (
                    <motion.div
                      key={label}
                      className="flex flex-col items-center text-center gap-2"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                      whileHover={{ y: -4 }}
                    >
                      <div
                        className={`clay-icon skill-icon bg-gradient-to-br ${gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-[#2d3436]/75" strokeWidth={2.2} />
                      </div>
                      <span className="skill-label">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Projects — bottom middle */}
              <GlassCard className="bento-projects bg-gradient-to-br from-white/50 to-[#ffc8dd]/20" delay={0.25}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="section-title !mb-0">PROJECTS</h2>
                  <a
                    href={`https://github.com/${content.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-[#636e72] hover:text-[#2d3436] flex items-center gap-1"
                  >
                    View all
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="project-row">
                  {phoneProjects.length > 0 ? (
                    phoneProjects.map((project, i) => (
                      <PhoneMockup
                        key={project.url}
                        project={project}
                        tilt={i === 0 ? -12 : 12}
                        variant={i as 0 | 1}
                      />
                    ))
                  ) : (
                    <>
                      <div className="phone-mockup aspect-[9/18] opacity-40" />
                      <div className="phone-mockup phone-mockup-alt aspect-[9/18] opacity-40" />
                    </>
                  )}
                </div>
              </GlassCard>

              {/* Powered by Arka — right top */}
              <GlassCard
                className="bento-arka bg-gradient-to-br from-[#bde0fe]/35 to-white/55 flex flex-col items-center justify-center text-center !py-5"
                delay={0.3}
              >
                <a
                  href={arkaLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="arka-cloud-icon">
                    <div className="cloud-body" />
                    <div className="lightning" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#636e72] uppercase tracking-wider mb-0.5">
                      Powered by
                    </p>
                    <p className="font-display text-xl font-bold text-[#2d3436] group-hover:text-[#4aa3cf] transition-colors flex items-center gap-1.5 justify-center">
                      <Zap className="w-4 h-4 text-[#ffd93d] fill-[#ffd93d]" />
                      Arka
                    </p>
                  </div>
                </a>
              </GlassCard>

              {/* Contact — right bottom */}
              <GlassCard
                className="bento-contact bg-gradient-to-br from-[#ffd6a5]/25 to-white/55 flex flex-col items-center justify-between gap-4"
                delay={0.35}
              >
                <div className="contact-icon-wrap flex items-center justify-center">
                  <div className="contact-owl" aria-hidden="true" />
                  <div className="contact-envelope" aria-hidden="true" />
                </div>

                <QRCode url={linkedInUrl} />

                <div className="flex gap-2 w-full justify-center">
                  <a
                    href={`https://github.com/${content.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="w-9 h-9 rounded-xl bg-white/70 border-2 border-white flex items-center justify-center hover:scale-105 transition-transform isometric-shadow"
                  >
                    <Github className="w-4 h-4 text-[#2d3436]" />
                  </a>
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-xl bg-white/70 border-2 border-white flex items-center justify-center hover:scale-105 transition-transform isometric-shadow"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                  </a>
                  <a
                    href="mailto:sah299610@gmail.com"
                    aria-label="Email"
                    className="w-9 h-9 rounded-xl bg-white/70 border-2 border-white flex items-center justify-center hover:scale-105 transition-transform isometric-shadow"
                  >
                    <Mail className="w-4 h-4 text-[#2d3436]" />
                  </a>
                </div>

                <a
                  href="mailto:sah299610@gmail.com"
                  className="clay-btn clay-btn-orange w-full text-center font-display font-bold py-3 px-6 rounded-full hover:scale-[1.02] transition-transform"
                >
                  Say Hi
                </a>
              </GlassCard>
            </div>
          </motion.div>

          <motion.footer
            className="text-center mt-6 text-sm font-semibold text-[#636e72]/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            © {new Date().getFullYear()} Sumit Mishra · React · Tailwind · CSS
          </motion.footer>
        </div>
      </div>
    </div>
  )
}
