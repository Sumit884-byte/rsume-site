"use client"

import type React from "react"

import { Briefcase, GraduationCap, Code, Languages, Mail, Github, Linkedin, Star } from "lucide-react"
import { motion } from "framer-motion"
import "./App.css"

// --- Data ---
const navLinks = ["Objective", "Skills", "Projects", "Education", "Languages"]

const skills = {
  "Languages & Frameworks": ["Python", "Java", "JavaScript", "React", "FastAPI", "HTML", "CSS", "Tailwind CSS"],
  "Tools & Platforms": ["Git", "Docker", "VS Code", "Google Cloud Vision"],
  "Libraries & Concepts": [
    "PaddleOCR",
    "OCRmyPDF",
    "Web Scraping",
    "Automation",
    "PDF Processing",
    "Problem-Solving",
    "Semantic Search",
  ],
}

const projects = [
  {
    title: "PDF Processing and OCR Pipelines",
    description: [
      "Built Python scripts to extract and classify words from PDFs, including scanned documents using OCR.",
      "Utilized PaddleOCR, OCRmyPDF, and Google Cloud Vision for robust text extraction and cleanup.",
      "Automated the entire PDF processing workflow: page classification, keyword tagging, and data extraction.",
    ],
    tags: ["Python", "OCR", "Automation", "Google Cloud Vision"],
  },
  {
    title: "AI-Powered PDF Search & Keyword Matching",
    description: [
      "Implemented a semantic search engine for PDF documents using vector embeddings and FAISS.",
      "Combined classical keyword matching with AI-based semantic search to significantly improve recall and precision in document retrieval.",
      "Developed a FastAPI backend to serve the search API.",
    ],
    tags: ["Python", "AI", "Semantic Search", "FastAPI", "Vector Embeddings"],
  },
  {
    title: "Personal Resume Website",
    description: [
      "Designed and developed a fully responsive personal portfolio and resume website.",
      "Built with React and styled with Tailwind CSS for a modern, clean, and fast user experience.",
      "Deployed on Vercel with continuous integration through Git.",
    ],
    tags: ["React", "Tailwind CSS", "JavaScript", "Vercel"],
  },
]

const education = [
  {
    institution: "IITM",
    degree: "B.Sc. in Data Science",
    duration: "ongoing",
    details:
      "Relevant Coursework: Data Structures, Algorithms, Artificial Intelligence, Linear Algebra, Discrete Mathematics.",
  },
]

const languages = [
  { lang: "English", level: "Fluent", proficiency: 95 },
  { lang: "Hindi", level: "Native", proficiency: 100 },
  { lang: "German", level: "Beginner", proficiency: 30 },
]

const socialLinks = [
  { name: "GitHub", url: "https://github.com/Sumit884-byte", icon: Github },
  { name: "LinkedIn", url: "https://linkedin.com/in/sa-h-8a9a3a37b", icon: Linkedin },
  { name: "Email", url: "mailto:sah299610@gmail.com", icon: Mail },
]

// --- Enhanced Components ---

interface SectionProps {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}

interface SkillBadgeProps {
  skill: string
  index: number
}

interface ProjectCardProps {
  title: string
  description: string[]
  tags: string[]
  index: number
}

interface LanguageCardProps {
  lang: string
  level: string
  proficiency: number
  index: number
}

const Section = ({ id, title, icon: Icon, children }: SectionProps) => (
  <motion.section
    id={id}
    className="mb-20"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </motion.section>
)

const SkillBadge = ({ skill, index }: SkillBadgeProps) => (
  <motion.span
    className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 text-neutral-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300 cursor-default"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ scale: 1.05 }}
  >
    {skill}
  </motion.span>
)

const ProjectCard = ({ title, description, tags, index }: ProjectCardProps) => (
  <motion.div
    className="group rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 shadow-2xl border border-neutral-800 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-cyan-500/10"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">{title}</h3>
    </div>
    <ul className="list-disc ml-5 space-y-3 text-neutral-400 leading-relaxed">
      {description.map((point: string, pointIndex: number) => (
        <li key={pointIndex}>{point}</li>
      ))}
    </ul>
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((tag: string, tagIndex: number) => (
        <span
          key={tag}
          className="px-3 py-1 text-xs rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-800/50 font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
)

const LanguageCard = ({ lang, level, proficiency, index }: LanguageCardProps) => (
  <motion.div
    className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-6 rounded-xl hover:border-cyan-500/30 transition-all duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <div className="flex justify-between items-center mb-3">
      <p className="font-semibold text-white text-lg">{lang}</p>
      <p className="text-cyan-400 text-sm font-medium">{level}</p>
    </div>
    <div className="w-full bg-neutral-800 rounded-full h-2">
      <motion.div
        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: `${proficiency}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: index * 0.2 }}
      />
    </div>
  </motion.div>
)

// --- Main App Component ---

export default function App() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId.toLowerCase())?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"></div>
      </div>

      {/* Enhanced Navbar */}
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <motion.div
            className="font-bold tracking-tight text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Sumit Mishra — Resume
          </motion.div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
            {navLinks.map((link, index) => (
              <motion.button
                key={link}
                onClick={() => scrollToSection(link)}
                className="hover:text-cyan-400 transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* Enhanced Hero */}
        <section className="px-6 py-32 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 mb-4">
              Sumit Mishra
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            className="text-neutral-300 text-lg leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Computer Science & Mathematics student with a passion for building automated pipelines, AI-driven tools, and
            full-stack applications. Seeking opportunities to apply my technical skills in real-world projects and
            cutting-edge research.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href="mailto:sah299610@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-neutral-200 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              Contact Me
            </a>

            <div className="flex gap-3">
              {socialLinks.map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target={name !== "Email" ? "_blank" : undefined}
                  rel={name !== "Email" ? "noopener noreferrer" : undefined}
                  className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                  aria-label={name}
                >
                  <Icon className="w-5 h-5 text-neutral-400 hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        <main className="px-6 py-16">
          {/* Objective */}
          <Section id="objective" title="Career Objective" icon={Star}>
            <motion.p
              className="text-neutral-300 text-lg leading-relaxed bg-gradient-to-r from-neutral-900 to-neutral-950 p-8 rounded-2xl border border-neutral-800"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              A highly motivated Computer Science and Mathematics student with hands-on experience in Python, OCR, AI,
              React, and FastAPI. I am eager to contribute to innovative projects, particularly in the fields of process
              automation, artificial intelligence, and full-stack development. My goal is to leverage my analytical and
              problem-solving skills to build efficient and impactful software solutions.
            </motion.p>
          </Section>

          {/* Enhanced Skills */}
          <Section id="skills" title="Technical Skills" icon={Code}>
            <div className="space-y-8">
              {Object.entries(skills).map(([category, skillList], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <h3 className="font-bold text-xl text-cyan-300 mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {skillList.map((skill, index) => (
                      <SkillBadge key={skill} skill={skill} index={index} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Enhanced Projects */}
          <Section id="projects" title="Projects / Work Done" icon={Briefcase}>
            <div className="space-y-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.title} {...project} index={index} />
              ))}
            </div>
          </Section>

          {/* Enhanced Education */}
          <Section id="education" title="Education" icon={GraduationCap}>
            {education.map((edu, index) => (
              <motion.div
                key={edu.institution}
                className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 border border-neutral-800 hover:border-cyan-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">{edu.institution}</h3>
                    <p className="text-cyan-400 text-lg font-medium">{edu.degree}</p>
                    <p className="text-neutral-400 mt-3 leading-relaxed">{edu.details}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-cyan-500/10 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-500/20 font-medium">
                      {edu.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </Section>

          {/* Enhanced Languages */}
          <Section id="languages" title="Languages" icon={Languages}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {languages.map((lang, index) => (
                <LanguageCard key={lang.lang} {...lang} index={index} />
              ))}
            </div>
          </Section>
        </main>
      </div>

      {/* Enhanced Footer */}
      <footer className="w-full bg-gradient-to-r from-neutral-950 to-black border-t border-neutral-800 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-neutral-400 mb-4">
            © {new Date().getFullYear()} Sumit Mishra. Built with React & Tailwind CSS.
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map(({ name, url, icon: Icon }) => (
              <a
                key={name}
                href={url}
                target={name !== "Email" ? "_blank" : undefined}
                rel={name !== "Email" ? "noopener noreferrer" : undefined}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                aria-label={name}
              >
                <Icon className="w-4 h-4 text-neutral-400 hover:text-cyan-400" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
