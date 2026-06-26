import { useState } from 'react'
import Message from '../Message'
import NumberInput from '../inputs/NumberInput'
import StepBack from '../StepBack'
import type { ActProps } from '../DialogueFlow'

type Step = 'monthly' | 'education' | 'mortgage' | 'savings' | 'done'

function wan(n: number): string {
  return n >= 10000 ? `${(n / 10000).toLocaleString('zh-CN')} 万` : `${n.toLocaleString('zh-CN')} 元`
}

export default function CalcAct({ profile, update, next, back }: ActProps) {
  const hasChildren = (profile.dependents ?? []).some((d) => d.role === 'child')
  const [step, setStep] = useState<Step>('monthly')
  const [monthly, setMonthly] = useState<number | null>(null)
  const [education, setEducation] = useState<number | null>(null)
  const [mortgage, setMortgage] = useState<number | null>(null)
  const [savings, setSavings] = useState<number | null>(null)

  const goBack = () => {
    switch (step) {
      case 'monthly':
        back()
        break
      case 'education':
        setStep('monthly')
        break
      case 'mortgage':
        setStep(hasChildren ? 'education' : 'monthly')
        break
      case 'savings':
        setStep('mortgage')
        break
      case 'done':
        setStep('savings')
        break
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
      <Message from="future">如果有一天我不在了，这个家每月还要花多少钱？</Message>
      {monthly !== null && <Message from="self">{wan(monthly)} / 月</Message>}
      {step === 'monthly' && (
        <NumberInput placeholder="月开支" suffix="元/月" onSubmit={(v) => {
          setMonthly(v); update({ monthlyExpense: v })
          setStep(hasChildren ? 'education' : 'mortgage')
        }} />
      )}

      {hasChildren && (step === 'education' || (monthly !== null && step !== 'monthly')) && (
        <Message from="future">每个孩子，一年的教育大概要花多少？没有就填 0。</Message>
      )}
      {education !== null && <Message from="self">{wan(education)} / 年 · 每个孩子</Message>}
      {step === 'education' && (
        <NumberInput placeholder="每孩教育/年" suffix="元/年" onSubmit={(v) => {
          setEducation(v); update({ educationPerChildYearly: v }); setStep('mortgage')
        }} />
      )}

      {(step === 'mortgage' || mortgage !== null) && (
        <Message from="future">还背着多少房贷或负债？</Message>
      )}
      {mortgage !== null && <Message from="self">{wan(mortgage)}</Message>}
      {step === 'mortgage' && (
        <NumberInput placeholder="负债余额" suffix="元" onSubmit={(v) => {
          setMortgage(v); update({ mortgageBalance: v }); setStep('savings')
        }} />
      )}

      {(step === 'savings' || savings !== null) && (
        <Message from="future">现在家里的存款，大概有多少？</Message>
      )}
      {savings !== null && <Message from="self">{wan(savings)}</Message>}
      {step === 'savings' && (
        <NumberInput placeholder="现有存款" suffix="元" onSubmit={(v) => {
          setSavings(v); update({ savings: v }); setStep('done')
        }} />
      )}

      {step === 'done' && (
        <>
          <Message from="future">够了。让我替你，把这些数字算成一个答案……</Message>
          <div className="flex justify-end mt-6">
            <button onClick={next} className="px-6 py-2 rounded-full bg-white text-black">
              看结果
            </button>
          </div>
        </>
      )}

      {step !== 'done' && <StepBack onBack={goBack} />}
    </div>
  )
}
