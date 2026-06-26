import { motion } from 'framer-motion'
import GapReveal from '../../visual/GapReveal'
import { calculateGap } from '../../engine/gapCalculator'
import { EMPTY_PROFILE } from '../types'
import type { ActProps } from '../DialogueFlow'
import type { FamilyProfile } from '../../engine/types'

export default function RevealAct({ profile, next, back }: ActProps) {
  const full = { ...EMPTY_PROFILE, ...profile } as FamilyProfile
  const result = calculateGap(full)

  return (
    <div className="relative min-h-screen">
      <GapReveal gap={result.gap} />
      {/* 在同一屏内底部浮现操作区，避免按钮掉到首屏之外 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-12 inset-x-0 flex flex-col items-center gap-5"
      >
        <button
          onClick={next}
          className="px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors"
        >
           这个缺口，有办法补上吗？
        </button>
        <button
          onClick={back}
          className="text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors"
        >
           ← 数字有误？回去调整
        </button>
      </motion.div>
    </div>
  )
}
