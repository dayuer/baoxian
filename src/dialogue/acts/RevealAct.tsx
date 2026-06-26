import { motion } from 'framer-motion'
import GapReveal from '../../visual/GapReveal'
import { calculateGap } from '../../engine/gapCalculator'
import { EMPTY_PROFILE } from '../types'
import type { ActProps } from '../DialogueFlow'
import type { FamilyProfile } from '../../engine/types'

export default function RevealAct({ profile, next }: ActProps) {
  const full = { ...EMPTY_PROFILE, ...profile } as FamilyProfile
  const result = calculateGap(full)

  return (
    <div className="relative">
      <GapReveal gap={result.gap} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="flex justify-center pb-16 -mt-10"
      >
        <button onClick={next} className="px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors">
          这个缺口，能怎么补？
        </button>
      </motion.div>
    </div>
  )
}
