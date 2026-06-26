import { useState } from 'react'
import Report from '../../report/Report'
import { encodeProfile } from '../../report/persistence'
import { EMPTY_PROFILE } from '../types'
import type { ActProps } from '../DialogueFlow'
import type { FamilyProfile } from '../../engine/types'

export default function TakeawayAct({ profile }: ActProps) {
  const full = { ...EMPTY_PROFILE, ...profile } as FamilyProfile
  const [copied, setCopied] = useState(false)

  const myLink = `${location.origin}${location.pathname}?p=${encodeProfile(full)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(myLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Report profile={full} />

      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {/* A: 带走报告 */}
        <button onClick={() => window.print()} className="px-6 py-3 rounded-full bg-white text-black">
          下载这份报告
        </button>
        {/* B: 我的方案空间 */}
        <button onClick={copyLink} className="px-6 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors">
          {copied ? '链接已复制' : '保存我的方案（可回访）'}
        </button>
      </div>

      {/* C: 克制的门 */}
      <p className="text-center opacity-40 text-sm mt-16 leading-relaxed">
        什么时候你准备好往下走，我都在这儿。<br />不催你。
      </p>
    </div>
  )
}
