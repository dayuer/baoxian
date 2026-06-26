import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

export default function Message({
  from,
  children,
}: {
  from: 'future' | 'self'
  children: ReactNode
}) {
  const isFuture = from === 'future'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`max-w-xl my-4 ${isFuture ? 'mr-auto text-left' : 'ml-auto text-right'}`}
    >
      <div className="text-xs tracking-widest uppercase opacity-40 mb-1">
        {isFuture ? '未来的我' : '你'}
      </div>
      <div
        className={`inline-block px-5 py-3 rounded-2xl leading-relaxed ${
          isFuture ? 'bg-white/5' : 'bg-white text-black'
        }`}
      >
        {children}
      </div>
    </motion.div>
  )
}
