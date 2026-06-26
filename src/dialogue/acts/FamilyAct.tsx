import { useState } from 'react'
import Message from '../Message'
import ChoiceInput from '../inputs/ChoiceInput'
import NumberInput from '../inputs/NumberInput'
import StepBack from '../StepBack'
import type { ActProps } from '../DialogueFlow'
import type { Dependent } from '../../engine/types'

type Step = 'hasSpouse' | 'childCount' | 'childAges' | 'residency' | 'done'

export default function FamilyAct({ profile, update, next, back }: ActProps) {
  const [step, setStep] = useState<Step>('hasSpouse')
  const [spouse, setSpouse] = useState<boolean | null>(null)
  const [childCount, setChildCount] = useState<number | null>(null)
  const [ages, setAges] = useState<number[]>([])
  const [abroad, setAbroad] = useState<boolean | null>(null)

  const commit = (allAges: number[], isAbroad: boolean) => {
    const dependents: Dependent[] = []
    if (spouse) dependents.push({ role: 'spouse', age: 0, hasIncome: false })
    allAges.forEach((age) => dependents.push({ role: 'child', age, hasIncome: false }))
    update({ dependents, residencyAbroad: isAbroad })
    setStep('done')
  }

  // 统一的"上一步"：在每个分步回退到上一个问题，首问时回到上一幕。
  const goBack = () => {
    switch (step) {
      case 'hasSpouse':
        back()
        break
      case 'childCount':
        setStep('hasSpouse')
        break
      case 'childAges':
        if (ages.length > 0) setAges(ages.slice(0, -1))
        else setStep('childCount')
        break
      case 'residency':
        if ((childCount ?? 0) > 0) {
          setAges(ages.slice(0, -1))
          setStep('childAges')
        } else {
          setStep('childCount')
        }
        break
      case 'done':
        setStep('residency')
        break
    }
  }

  const dependentCount = profile.dependents?.length ?? 0

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
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
              setAges([])
              if (n === 0) setStep('residency')
              else setStep('childAges')
            }}
          />
        </>
      )}

      {step !== 'hasSpouse' && step !== 'childCount' && childCount !== null && (
        <Message from="self">{childCount} 个孩子</Message>
      )}

      {step === 'childAges' && (
        <>
          <Message from="future">第 {ages.length + 1} 个孩子今年几岁？</Message>
          <NumberInput
            placeholder="年龄"
            suffix="岁"
            onSubmit={(age) => {
              const all = [...ages, age]
              setAges(all)
              if (all.length >= (childCount ?? 0)) setStep('residency')
            }}
          />
        </>
      )}

      {step === 'residency' && (
        <>
          <Message from="future">你们现在长期住在国内，还是境外？</Message>
          <ChoiceInput
            choices={[
              { label: '国内', value: false },
              { label: '境外', value: true },
            ]}
            onSelect={(v) => {
              setAbroad(v)
              commit(ages, v)
            }}
          />
        </>
      )}

      {step === 'done' && (
        <>
          <Message from="self">{abroad ? '长期境外' : '住在国内'}</Message>
          <Message from="future">
            {dependentCount > 0
              ? `记住了。${dependentCount} 个人，正等着你撑起这片天。`
              : '记住了。这一程，先把你自己稳稳兜住。'}
          </Message>
          <div className="flex justify-end mt-6">
            <button onClick={next} className="px-6 py-2 rounded-full bg-white text-black">
              继续
            </button>
          </div>
        </>
      )}

      {step !== 'done' && <StepBack onBack={goBack} />}
    </div>
  )
}
