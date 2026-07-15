import { motion, type Variants } from "framer-motion"

type BracketSpec = {
  id: number
  text: string
  className: string
  delay: number
}

const HERO_BRACKETS: BracketSpec[] = [
  { id: 1, text: "{", className: "floating-bracket floating-bracket--open", delay: 0 },
  { id: 2, text: "}", className: "floating-bracket floating-bracket--close", delay: 0.35 },
  { id: 3, text: "</>", className: "floating-bracket floating-bracket--tag", delay: 0.7 },
]

const bracketVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: [0.55, 1, 0.65],
    y: [0, -18, 0],
    x: [0, 8, 0],
    rotate: [0, 6, -4, 0],
    scale: [0.95, 1.08, 0.98],
    transition: {
      delay,
      duration: 4.5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  }),
}

export default function FloatingCodeBrackets() {
  return (
    <div className="floating-brackets" aria-hidden="true">
      {HERO_BRACKETS.map((bracket) => (
        <motion.span
          key={bracket.id}
          custom={bracket.delay}
          initial="hidden"
          animate="visible"
          variants={bracketVariants}
          className={bracket.className}
        >
          {bracket.text}
        </motion.span>
      ))}
    </div>
  )
}
