import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 24, rotate: -8, scale: 0.7 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 180,
    },
  },
}

export default function AnimatedHeroTitle() {
  const letters = "SUMIT.WEB".split("")

  return (
    <motion.h1
      className="hero-title hero-title--animated text-3d-rainbow tracking-tight"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="SUMIT.WEB"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="hero-title__letter"
          variants={letterVariants}
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  )
}
