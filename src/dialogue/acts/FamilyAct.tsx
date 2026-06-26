import { useState } from 'react'
import Message from '../Message'
import ChoiceInput from '../inputs/ChoiceInput'
import NumberInput from '../inputs/NumberInput'
import type { ActProps } from '../DialogueFlow'
import type { Dependent } from '../../engine/types'

type Step = 'hasSpouse' | 'childCount' | 'childAges' | 'done'

export default function FamilyAct({ profile, update, next }: ActProps) {
  const [step, setStep] = useState<Step>('hasSpouse')
  const [spouse, setSpouse] = useState<boolean | null>(null)
  const [childCount, setChildCount] = useState(0)
  const [ages, setAges] = useState<number[]>([])

  const commit = (allAges: number[]) => {
    const dependents: Dependent[] = []
    if (spouse) dependents.push({ role: 'spouse', age: 0, hasIncome: false })
    allAges.forEach((age) => dependents.push({ role: 'child', age, hasIncome: false }))
    update({ dependents })
    setStep('done')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Message from="future">先别急着算钱。我想知道，谁在依靠着你？</Message>

      {step === 'hasSpouse' && (
        <ChoiceInput
          choices={[
            { label: '有伴侣', value: true },
            { label: '暂时没有', value: false },
          ]}
          onSelect={(v) => {
            setSpouse(v)
            setStep('childCount')
          }}
        />
      )}

      {step !== 'hasSpouse' && (
        <Message from="self">{spouse ? '有伴侣' : '暂时没有'}</Message>
      )}

      {step === 'childCount' && (
        <>
          <Message from="future">有几个孩子？</Message>
          <ChoiceInput
            choices={[0, 1, 2, 3, 4].map((n) => ({ label: `${n} 个`, value: n }))}
            onSelect={(n) => {
              setChildCount(n)
              if (n === 0) commit([])
              else setStep('childAges')
            }}
          />
        </>
      )}

      {step === 'childAges' && (
        <>
          <Message from="future">
            第 {ages.length + 1} 个孩子今年几岁？
          </Message>
          <NumberInput
            placeholder="年龄"
            suffix="岁"
            onSubmit={(age) => {
              const all = [...ages, age]
              setAges(all)
              if (all.length >= childCount) commit(all)
            }}
          />
        </>
      )}

      {step === 'done' && (
        <>
          <Message from="future">
            记住了。{profile.dependents?.length ?? 0} 个人，正等着你撑起这片天。
          </Message>
          <div className="flex justify-end mt-6">
            <button onClick={next} className="px-6 py-2 rounded-full bg-white text-black">
              继续
            </button>
          </div>
        </>
      )}
    </div>
  )
}
