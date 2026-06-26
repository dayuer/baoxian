import { useState } from 'react'
import Message from '../Message'
import NumberInput from '../inputs/NumberInput'
import type { ActProps } from '../DialogueFlow'

type Step = 'monthly' | 'education' | 'mortgage' | 'savings' | 'done'

export default function CalcAct({ update, next }: ActProps) {
  const [step, setStep] = useState<Step>('monthly')

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Message from="future">如果有一天我不在了，这个家每月还要花多少钱？</Message>
      {step === 'monthly' && (
        <NumberInput placeholder="月开支" suffix="元/月" onSubmit={(v) => {
          update({ monthlyExpense: v }); setStep('education')
        }} />
      )}

      {step === 'education' && (
        <>
          <Message from="future">每个孩子，一年的教育大概要花多少？没有就填 0。</Message>
          <NumberInput placeholder="每孩教育/年" suffix="元/年" onSubmit={(v) => {
            update({ educationPerChildYearly: v }); setStep('mortgage')
          }} />
        </>
      )}

      {step === 'mortgage' && (
        <>
          <Message from="future">还背着多少房贷或负债？</Message>
          <NumberInput placeholder="负债余额" suffix="元" onSubmit={(v) => {
            update({ mortgageBalance: v }); setStep('savings')
          }} />
        </>
      )}

      {step === 'savings' && (
        <>
          <Message from="future">现在家里的存款，大概有多少？</Message>
          <NumberInput placeholder="现有存款" suffix="元" onSubmit={(v) => {
            update({ savings: v }); setStep('done')
          }} />
        </>
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
    </div>
  )
}
