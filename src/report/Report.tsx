import { calculateGap } from '../engine/gapCalculator'
import type { FamilyProfile } from '../engine/types'

function formatYuan(n: number): string {
  return '¥' + Math.round(n).toLocaleString('zh-CN')
}

export default function Report({ profile }: { profile: FamilyProfile }) {
  const r = calculateGap(profile)
  const pct = Math.round(r.preparedRatio * 100)
  return (
    <div className="max-w-xl mx-auto bg-white text-black rounded-2xl p-8 print:shadow-none">
      <div className="text-xs tracking-[0.3em] uppercase opacity-50">家庭保障缺口报告</div>
      <div className="text-4xl font-light text-[#c0392b] my-4 tabular-nums">{formatYuan(r.gap)}</div>
      <div className="text-sm opacity-60 mb-6">已准备 {pct}%</div>
      <div className="h-2 bg-black/10 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-[#2e7d5b]" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="space-y-3">
        {r.breakdown.filter((b) => b.value > 0).map((b) => (
          <div key={b.label} className="flex justify-between text-sm border-b border-black/5 pb-2">
            <span>{b.label}</span><span className="tabular-nums">{formatYuan(b.value)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-1">
          <span className="opacity-60">已有缓冲</span>
          <span className="tabular-nums opacity-60">- {formatYuan(r.buffer)}</span>
        </div>
      </div>
    </div>
  )
}
