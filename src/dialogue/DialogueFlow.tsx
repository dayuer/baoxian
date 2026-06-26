import { useState, useCallback, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FamilyProfile } from '../engine/types'
import { ACT_ORDER, EMPTY_PROFILE, type ActId, type DialogueState } from './types'
import { saveProfile } from '../report/persistence'
import OpeningAct from './acts/OpeningAct'
import FamilyAct from './acts/FamilyAct'
import CalcAct from './acts/CalcAct'
import RevealAct from './acts/RevealAct'
import SolutionAct from './acts/SolutionAct'
import TakeawayAct from './acts/TakeawayAct'

interface ActProps {
  profile: Partial<FamilyProfile>
  update: (patch: Partial<FamilyProfile>) => void
  next: () => void
  back: () => void // 回到上一幕（在幕内分步的开头调用）
}

const ACT_REGISTRY: Record<ActId, (p: ActProps) => ReactNode> = {
  opening: (p) => <OpeningAct {...p} />,
  family: (p) => <FamilyAct {...p} />,
  calc: (p) => <CalcAct {...p} />,
  reveal: (p) => <RevealAct {...p} />,
  solution: (p) => <SolutionAct {...p} />,
  takeaway: (p) => <TakeawayAct {...p} />,
}

// 顶部进度条只在"对话内容"幕显示，opening 与 reveal 全屏沉浸不打扰。
const CHROME_ACTS: ActId[] = ['family', 'calc', 'solution', 'takeaway']
// 进度标签：六幕里有意义的推进节点。
const PROGRESS_LABEL: Record<ActId, string> = {
  opening: '',
  family: '你的家',
  calc: '算一算',
  reveal: '',
  solution: '怎么办',
  takeaway: '带走',
}

export default function DialogueFlow({
  initialProfile,
  onExit,
}: {
  initialProfile?: Partial<FamilyProfile>
  onExit?: () => void
}) {
  const [state, setState] = useState<DialogueState>({
    act: 'opening',
    profile: { ...EMPTY_PROFILE, ...initialProfile },
  })

  const update = useCallback((patch: Partial<FamilyProfile>) => {
    setState((s) => {
      const profile = { ...s.profile, ...patch }
      saveProfile(profile as FamilyProfile)
      return { ...s, profile }
    })
  }, [])

  const go = useCallback((dir: 1 | -1) => {
    setState((s) => {
      const i = ACT_ORDER.indexOf(s.act)
      const j = Math.min(Math.max(i + dir, 0), ACT_ORDER.length - 1)
      return { ...s, act: ACT_ORDER[j] }
    })
  }, [])

  const next = useCallback(() => go(1), [go])
  const back = useCallback(() => {
    // 在第一幕按返回 = 退出回到品牌站
    if (state.act === ACT_ORDER[0]) {
      onExit?.()
      return
    }
    go(-1)
  }, [go, state.act, onExit])

  const Act = ACT_REGISTRY[state.act]
  const actIndex = ACT_ORDER.indexOf(state.act)
  const showChrome = CHROME_ACTS.includes(state.act)
  // 进度按"有意义的节点"计数（4 个内容幕）
  const milestones = ACT_ORDER.filter((a) => CHROME_ACTS.includes(a))
  const reachedCount = milestones.filter((a) => ACT_ORDER.indexOf(a) <= actIndex).length

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* 持久导航骨架：退出 / 进度 / 回退 */}
      <AnimatePresence>
        {showChrome && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-10 py-5 bg-gradient-to-b from-black via-black/80 to-transparent"
          >
            <button
              onClick={() => onExit?.()}
              className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
            >
              ✕ 退出
            </button>

            {/* 进度节点 */}
            <div className="flex items-center gap-2">
              {milestones.map((a, i) => {
                const reached = i < reachedCount
                const current = a === state.act
                return (
                  <div key={a} className="flex items-center gap-2">
                    <span
                      className={`text-[10px] tracking-widest transition-colors ${
                        current ? 'text-white' : reached ? 'text-white/40' : 'text-white/20'
                      }`}
                    >
                      {PROGRESS_LABEL[a]}
                    </span>
                    {i < milestones.length - 1 && (
                      <span className="w-4 h-px bg-white/15" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* 占位以保持进度居中（"上一步"由各幕在内容区自管） */}
            <span className="text-xs text-transparent select-none">退出</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.act}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Act profile={state.profile} update={update} next={next} back={back} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export type { ActProps }
