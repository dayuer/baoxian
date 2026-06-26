import { motion } from 'framer-motion'
import type { ActProps } from '../DialogueFlow'

export default function OpeningAct({ next }: ActProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-5xl font-light leading-snug max-w-2xl"
      >
        你的生活里，<br />有没有一个<span className="text-[#e05c4a]">不能倒下</span>的理由？
      </motion.h1>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        onClick={next}
        className="mt-12 px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors"
      >
        静下来，想一想
      </motion.button>
    </div>
  )
}
