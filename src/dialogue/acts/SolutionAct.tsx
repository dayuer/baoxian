import { motion } from 'framer-motion'
import { calculateGap } from '../../engine/gapCalculator'
import { EMPTY_PROFILE } from '../types'
import type { ActProps } from '../DialogueFlow'
import type { FamilyProfile } from '../../engine/types'

function formatYuan(n: number): string {
  return '¥' + Math.round(n).toLocaleString('zh-CN')
}

export default function SolutionAct({ profile, next, back }: ActProps) {
  const full = { ...EMPTY_PROFILE, ...profile } as FamilyProfile
  const r = calculateGap(full)
  const abroad = full.residencyAbroad

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
      <div className="text-xs tracking-[0.3em] uppercase opacity-40 mb-3">一种安静的解法</div>
      <h2 className="text-2xl md:text-3xl font-light leading-snug mb-8">
        你不需要现在就拿出 {formatYuan(r.gap)}。<br />
        你需要的，是一个承诺——<span className="text-[#e05c4a]">万一那一天来了，这笔钱会到位</span>。
      </h2>

      <div className="space-y-4">
        {r.breakdown.filter((b) => b.value > 0).map((b) => (
          <div key={b.label} className="flex justify-between border-b border-white/10 pb-3">
            <span className="opacity-70">{b.label}</span>
            <span className="tabular-nums">{formatYuan(b.value)}</span>
          </div>
        ))}
      </div>

      <p className="mt-8 leading-relaxed opacity-80">
        用每年一笔不大的确定支出，换一个“万一发生，立刻到位”的承诺——这就是定期寿险存在的意义。
        {abroad && '（你长期在境外，方案体系会不同，通常走香港等国际市场，多币种、可跨境理赔。）'}
      </p>

      <div className="mt-8 p-5 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xs tracking-widest uppercase opacity-50 mb-2">同样诚实地说：它不能做什么</div>
        <ul className="space-y-2 opacity-75 text-sm leading-relaxed list-disc pl-5">
          <li>定期寿险只保身故/全残，<b>不保"生病但活着"</b>——那是重疾险的事，逻辑要分开算。</li>
          <li>有等待期、健康告知与除外责任，不是所有情况都赔。</li>
          <li>这里给的是成本量级，<b>不是报价</b>，最终以核保为准。</li>
        </ul>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between mt-10">
        <button
          onClick={back}
          className="text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors"
        >
          ← 上一步
        </button>
        <button onClick={next} className="px-8 py-3 rounded-full bg-white text-black">
          带走这份报告
        </button>
      </motion.div>
    </div>
  )
}
