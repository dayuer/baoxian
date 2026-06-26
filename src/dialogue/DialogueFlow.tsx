import { useState, useCallback, type ReactNode } from 'react'
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
  back: () => void
}

// 每幕组件在后续任务接入；先用占位映射，便于本任务独立编译。
const ACT_REGISTRY: Record<ActId, (p: ActProps) => ReactNode> = {
  opening: (p) => <OpeningAct {...p} />,
  family: (p) => <FamilyAct {...p} />,
  calc: (p) => <CalcAct {...p} />,
  reveal: (p) => <RevealAct {...p} />,
  solution: (p) => <SolutionAct {...p} />,
  takeaway: (p) => <TakeawayAct {...p} />,
}

export default function DialogueFlow({
  initialProfile,
}: {
  initialProfile?: Partial<FamilyProfile>
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
  const back = useCallback(() => go(-1), [go])

  const Act = ACT_REGISTRY[state.act]

  return (
    <div className="min-h-screen bg-black text-white">
      <Act profile={state.profile} update={update} next={next} back={back} />
    </div>
  )
}

export type { ActProps }
