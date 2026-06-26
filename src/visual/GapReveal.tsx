import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

function formatYuan(n: number): string {
  return '¥' + Math.round(n).toLocaleString('zh-CN')
}

export default function GapReveal({ gap }: { gap: number }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(mv, gap, { duration: 2.4, ease: 'easeOut' })
    const unsub = mv.on('change', (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
  }, [gap, mv])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-xs tracking-[0.4em] uppercase opacity-40"
      >
        你的家庭保障缺口
      </motion.div>
      <div className="text-4xl md:text-7xl font-light text-[#e05c4a] my-8 tabular-nums">
        {formatYuan(display)}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1.5 }}
        className="opacity-60 max-w-md"
      >
        这个数字，可能从来没有人帮你算过。
      </motion.p>
    </div>
  )
}
