# 与未来的自己对话 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个自助式家庭保障缺口诊断体验——用户与"未来的自己"对话，自己把缺口算清楚，无后端、不逼单。

**Architecture:** 纯函数测算引擎（`engine/`）为大脑，对话状态机（`DialogueFlow`）为骨架，六幕组件逐幕推进，结果存 localStorage + URL 编码。现有 `App.tsx` 品牌站作为入口，通过顶层视图状态切换进入对话体验。

**Tech Stack:** React 19 + Vite 7 + TypeScript + Tailwind 4 + framer-motion（已有）+ Vitest（本计划新增）。

---

## 文件结构

| 文件 | 职责 |
|---|---|
| `src/engine/types.ts` | 数据模型 `FamilyProfile` / `GapResult` |
| `src/engine/gapCalculator.ts` | 纯函数：profile → 缺口结果 |
| `src/engine/gapCalculator.test.ts` | 引擎单测（含真实参考用例） |
| `src/report/persistence.ts` | localStorage + URL 编码存取 |
| `src/report/persistence.test.ts` | 编解码往返单测 |
| `src/dialogue/types.ts` | 对话状态 `DialogueState` / `Act` |
| `src/dialogue/DialogueFlow.tsx` | 六幕状态机 + 单向数据流容器 |
| `src/dialogue/Message.tsx` | 对话气泡（未来的我 / 用户） |
| `src/dialogue/inputs/ChoiceInput.tsx` | 点选输入 |
| `src/dialogue/inputs/NumberInput.tsx` | 数字输入 |
| `src/dialogue/acts/*.tsx` | ①~⑥ 每幕一个组件 |
| `src/visual/GapReveal.tsx` | 第④幕冷峻巨数动画 |
| `src/report/Report.tsx` | 缺口报告（下载/分享） |
| `src/App.tsx` | 顶层视图切换：brand → dialogue → report |
| `vitest.config.ts` | 测试配置 |

---

## Task 0: 安装并配置 Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/engine/smoke.test.ts`

- [ ] **Step 1: 安装 Vitest**

```bash
npm install -D vitest@^2.1.0
```

- [ ] **Step 2: 创建 vitest 配置**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 3: 在 package.json 的 scripts 增加 test**

`package.json` 的 `"scripts"` 块加入：

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: 写冒烟测试**

Create `src/engine/smoke.test.ts`:

```ts
import { test, expect } from 'vitest'

test('vitest runs', () => {
  expect(1 + 1).toBe(2)
})
```

- [ ] **Step 5: 运行确认通过**

Run: `npm test`
Expected: 1 passed

- [ ] **Step 6: 删除冒烟测试并提交**

```bash
rm src/engine/smoke.test.ts
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest test runner"
```

---

## Task 1: 数据模型与测算引擎（TDD）

**Files:**
- Create: `src/engine/types.ts`
- Create: `src/engine/gapCalculator.ts`
- Test: `src/engine/gapCalculator.test.ts`

- [ ] **Step 1: 定义数据模型**

Create `src/engine/types.ts`:

```ts
export type DependentRole = 'spouse' | 'child' | 'parent'

export interface Dependent {
  role: DependentRole
  age: number
  hasIncome: boolean
}

export interface FamilyProfile {
  dependents: Dependent[]
  monthlyExpense: number            // 家庭月开支（元）
  educationPerChildYearly: number   // 每个孩子年教育支出（元），无则 0
  mortgageBalance: number           // 负债余额（元）
  savings: number                   // 现有缓冲（元）
  residencyAbroad: boolean          // 是否长期境外居留
  supportUntilAge: number           // 供养至孩子几岁（默认 18）
}

export interface GapResult {
  livingNeed: number
  educationNeed: number
  debt: number
  totalNeed: number
  buffer: number
  gap: number
  preparedRatio: number             // 0~1
  breakdown: { label: string; value: number }[]
}
```

- [ ] **Step 2: 写失败测试（真实参考用例）**

Create `src/engine/gapCalculator.test.ts`:

```ts
import { test, expect } from 'vitest'
import { calculateGap } from './gapCalculator'
import type { FamilyProfile } from './types'

const baseProfile: FamilyProfile = {
  dependents: [
    { role: 'spouse', age: 26, hasIncome: false },
    { role: 'child', age: 3, hasIncome: false },
    { role: 'child', age: 1.5, hasIncome: false },
    { role: 'child', age: 1.5, hasIncome: false },
  ],
  monthlyExpense: 100_000,
  educationPerChildYearly: 200_000,
  mortgageBalance: 4_000_000,
  savings: 5_000_000,
  residencyAbroad: true,
  supportUntilAge: 18,
}

test('需供养年数取最小孩子到18岁：1.5岁 -> 16.5年', () => {
  const r = calculateGap(baseProfile)
  // 生活：100000 * 12 * 16.5 = 19,800,000
  expect(r.livingNeed).toBe(19_800_000)
})

test('教育按每个孩子各自剩余学年累加', () => {
  const r = calculateGap(baseProfile)
  // 孩子到18岁剩余年数：(18-3)+(18-1.5)+(18-1.5)=15+16.5+16.5=48 学年
  // 48 * 200000 = 9,600,000
  expect(r.educationNeed).toBe(9_600_000)
})

test('缺口 = 总需求 - 缓冲，且参考用例落在数千万量级', () => {
  const r = calculateGap(baseProfile)
  // total = 19,800,000 + 9,600,000 + 4,000,000 = 33,400,000
  // gap = 33,400,000 - 5,000,000 = 28,400,000
  expect(r.totalNeed).toBe(33_400_000)
  expect(r.gap).toBe(28_400_000)
})

test('缺口不为负：缓冲超过需求时归零', () => {
  const r = calculateGap({ ...baseProfile, savings: 999_999_999 })
  expect(r.gap).toBe(0)
})

test('preparedRatio 反映已准备比例', () => {
  const r = calculateGap(baseProfile)
  expect(r.preparedRatio).toBeCloseTo(5_000_000 / 33_400_000, 5)
})

test('breakdown 含生活/教育/负债三项人话标签', () => {
  const r = calculateGap(baseProfile)
  const labels = r.breakdown.map((b) => b.label)
  expect(labels).toContain('生活开支')
  expect(labels).toContain('子女教育')
  expect(labels).toContain('未偿负债')
})
```

- [ ] **Step 3: 运行确认失败**

Run: `npm test`
Expected: FAIL，报 `calculateGap` 未定义

- [ ] **Step 4: 实现引擎**

Create `src/engine/gapCalculator.ts`:

```ts
import type { FamilyProfile, GapResult } from './types'

export function calculateGap(profile: FamilyProfile): GapResult {
  const children = profile.dependents.filter((d) => d.role === 'child')

  // 需供养年数：最小孩子到 supportUntilAge
  const youngestAge = children.length
    ? Math.min(...children.map((c) => c.age))
    : 0
  const supportYears = Math.max(profile.supportUntilAge - youngestAge, 0)

  const livingNeed = profile.monthlyExpense * 12 * supportYears

  // 教育：每个孩子各自剩余学年累加
  const totalSchoolYears = children.reduce(
    (sum, c) => sum + Math.max(profile.supportUntilAge - c.age, 0),
    0,
  )
  const educationNeed = totalSchoolYears * profile.educationPerChildYearly

  const debt = profile.mortgageBalance
  const totalNeed = livingNeed + educationNeed + debt
  const buffer = profile.savings
  const gap = Math.max(totalNeed - buffer, 0)
  const preparedRatio = totalNeed > 0 ? buffer / totalNeed : 1

  const breakdown = [
    { label: '生活开支', value: livingNeed },
    { label: '子女教育', value: educationNeed },
    { label: '未偿负债', value: debt },
  ]

  return { livingNeed, educationNeed, debt, totalNeed, buffer, gap, preparedRatio, breakdown }
}
```

- [ ] **Step 5: 运行确认通过**

Run: `npm test`
Expected: 6 passed

- [ ] **Step 6: 提交**

```bash
git add src/engine/
git commit -m "feat: add family protection gap calculator engine"
```

---

## Task 2: 状态持久化（localStorage + URL 编码，TDD）

**Files:**
- Create: `src/report/persistence.ts`
- Test: `src/report/persistence.test.ts`

- [ ] **Step 1: 写失败测试**

Create `src/report/persistence.test.ts`:

```ts
import { test, expect } from 'vitest'
import { encodeProfile, decodeProfile } from './persistence'
import type { FamilyProfile } from '../engine/types'

const profile: FamilyProfile = {
  dependents: [{ role: 'child', age: 3, hasIncome: false }],
  monthlyExpense: 100_000,
  educationPerChildYearly: 200_000,
  mortgageBalance: 4_000_000,
  savings: 5_000_000,
  residencyAbroad: true,
  supportUntilAge: 18,
}

test('编码再解码得到等价 profile（往返无损）', () => {
  const token = encodeProfile(profile)
  expect(typeof token).toBe('string')
  expect(decodeProfile(token)).toEqual(profile)
})

test('解码非法字符串返回 null，不抛异常', () => {
  expect(decodeProfile('@@@not-valid@@@')).toBeNull()
})
```

- [ ] **Step 2: 运行确认失败**

Run: `npm test`
Expected: FAIL，`encodeProfile` 未定义

- [ ] **Step 3: 实现编解码**

Create `src/report/persistence.ts`:

```ts
import type { FamilyProfile } from '../engine/types'

// URL 安全的 base64（浏览器 + node 测试环境都可用）
function toBase64(s: string): string {
  if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(s)))
  return Buffer.from(s, 'utf-8').toString('base64')
}
function fromBase64(s: string): string {
  if (typeof atob === 'function') return decodeURIComponent(escape(atob(s)))
  return Buffer.from(s, 'base64').toString('utf-8')
}

export function encodeProfile(profile: FamilyProfile): string {
  return toBase64(JSON.stringify(profile))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeProfile(token: string): FamilyProfile | null {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    const parsed = JSON.parse(fromBase64(b64))
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.dependents)) {
      return null
    }
    return parsed as FamilyProfile
  } catch {
    return null
  }
}

const STORAGE_KEY = 'baoxian:lastProfile'

export function saveProfile(profile: FamilyProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, encodeProfile(profile))
  } catch {
    // 隐私模式不可用时静默降级，依赖 URL 编码
  }
}

export function loadProfile(): FamilyProfile | null {
  try {
    const token = localStorage.getItem(STORAGE_KEY)
    return token ? decodeProfile(token) : null
  } catch {
    return null
  }
}
```

- [ ] **Step 4: 运行确认通过**

Run: `npm test`
Expected: 全部 passed

- [ ] **Step 5: 提交**

```bash
git add src/report/persistence.ts src/report/persistence.test.ts
git commit -m "feat: add profile persistence with url-safe encoding"
```

---

## Task 3: 对话状态机骨架

**Files:**
- Create: `src/dialogue/types.ts`
- Create: `src/dialogue/DialogueFlow.tsx`

- [ ] **Step 1: 定义对话状态类型**

Create `src/dialogue/types.ts`:

```ts
import type { FamilyProfile } from '../engine/types'

export type ActId = 'opening' | 'family' | 'calc' | 'reveal' | 'solution' | 'takeaway'

export const ACT_ORDER: ActId[] = ['opening', 'family', 'calc', 'reveal', 'solution', 'takeaway']

export interface DialogueState {
  act: ActId
  profile: Partial<FamilyProfile>
}

export const EMPTY_PROFILE: Partial<FamilyProfile> = {
  dependents: [],
  monthlyExpense: 0,
  educationPerChildYearly: 0,
  mortgageBalance: 0,
  savings: 0,
  residencyAbroad: false,
  supportUntilAge: 18,
}
```

- [ ] **Step 2: 实现状态机容器**

Create `src/dialogue/DialogueFlow.tsx`:

```tsx
import { useState, useCallback } from 'react'
import type { FamilyProfile } from '../engine/types'
import { ACT_ORDER, EMPTY_PROFILE, type ActId, type DialogueState } from './types'
import { saveProfile } from '../report/persistence'

interface ActProps {
  profile: Partial<FamilyProfile>
  update: (patch: Partial<FamilyProfile>) => void
  next: () => void
  back: () => void
}

// 每幕组件在后续任务接入；先用占位映射，便于本任务独立编译。
const ACT_REGISTRY: Record<ActId, (p: ActProps) => React.ReactNode> = {
  opening: ({ next }) => <button onClick={next}>开始</button>,
  family: ({ next }) => <button onClick={next}>family →</button>,
  calc: ({ next }) => <button onClick={next}>calc →</button>,
  reveal: ({ next }) => <button onClick={next}>reveal →</button>,
  solution: ({ next }) => <button onClick={next}>solution →</button>,
  takeaway: () => <div>takeaway</div>,
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
```

- [ ] **Step 3: 类型检查通过**

Run: `npx tsc -b`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add src/dialogue/
git commit -m "feat: add dialogue flow state machine skeleton"
```

---

## Task 4: 对话气泡与输入控件

**Files:**
- Create: `src/dialogue/Message.tsx`
- Create: `src/dialogue/inputs/ChoiceInput.tsx`
- Create: `src/dialogue/inputs/NumberInput.tsx`

- [ ] **Step 1: 实现对话气泡**

Create `src/dialogue/Message.tsx`:

```tsx
import { motion } from 'framer-motion'

export default function Message({
  from,
  children,
}: {
  from: 'future' | 'self'
  children: React.ReactNode
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
```

- [ ] **Step 2: 实现点选输入**

Create `src/dialogue/inputs/ChoiceInput.tsx`:

```tsx
export interface Choice<T> {
  label: string
  value: T
}

export default function ChoiceInput<T extends string | number | boolean>({
  choices,
  onSelect,
}: {
  choices: Choice<T>[]
  onSelect: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-end my-4">
      {choices.map((c) => (
        <button
          key={String(c.value)}
          onClick={() => onSelect(c.value)}
          className="px-5 py-2 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black transition-colors"
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: 实现数字输入**

Create `src/dialogue/inputs/NumberInput.tsx`:

```tsx
import { useState } from 'react'

export default function NumberInput({
  placeholder,
  suffix,
  onSubmit,
}: {
  placeholder: string
  suffix?: string
  onSubmit: (value: number) => void
}) {
  const [raw, setRaw] = useState('')
  const num = Number(raw)
  const valid = raw !== '' && !Number.isNaN(num) && num >= 0
  return (
    <div className="flex items-center gap-3 justify-end my-4">
      <div className="flex items-center gap-2 border-b border-white/30 focus-within:border-white">
        <input
          inputMode="numeric"
          value={raw}
          placeholder={placeholder}
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && valid && onSubmit(num)}
          className="bg-transparent py-2 text-right outline-none w-40"
        />
        {suffix && <span className="opacity-50 text-sm">{suffix}</span>}
      </div>
      <button
        disabled={!valid}
        onClick={() => onSubmit(num)}
        className="px-4 py-2 rounded-full bg-white text-black disabled:opacity-30"
      >
        确定
      </button>
    </div>
  )
}
```

- [ ] **Step 4: 类型检查通过**

Run: `npx tsc -b`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
git add src/dialogue/Message.tsx src/dialogue/inputs/
git commit -m "feat: add message bubble and lightweight input controls"
```

---

## Task 5: 第①②③幕（开场 / 勾勒家庭 / 测算）

**Files:**
- Create: `src/dialogue/acts/OpeningAct.tsx`
- Create: `src/dialogue/acts/FamilyAct.tsx`
- Create: `src/dialogue/acts/CalcAct.tsx`
- Modify: `src/dialogue/DialogueFlow.tsx`（替换占位）

- [ ] **Step 1: 第①幕 开场**

Create `src/dialogue/acts/OpeningAct.tsx`:

```tsx
import { motion } from 'framer-motion'
import type { ActProps } from '../DialogueFlow'

export default function OpeningAct({ next }: ActProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-5xl font-light leading-snug max-w-2xl"
      >
        你生活里，<br />有没有一个<span className="text-[#e05c4a]">不能倒下</span>的理由？
      </motion.h1>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        onClick={next}
        className="mt-12 px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors"
      >
        和未来的自己聊聊
      </motion.button>
    </div>
  )
}
```

- [ ] **Step 2: 第②幕 勾勒家庭**

Create `src/dialogue/acts/FamilyAct.tsx`:

```tsx
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
```

- [ ] **Step 3: 第③幕 测算**

Create `src/dialogue/acts/CalcAct.tsx`:

```tsx
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
```

- [ ] **Step 4: 在 DialogueFlow 接入三幕**

修改 `src/dialogue/DialogueFlow.tsx`，在文件顶部加入 import：

```tsx
import OpeningAct from './acts/OpeningAct'
import FamilyAct from './acts/FamilyAct'
import CalcAct from './acts/CalcAct'
```

并把 `ACT_REGISTRY` 中 `opening` / `family` / `calc` 三项替换为：

```tsx
  opening: (p) => <OpeningAct {...p} />,
  family: (p) => <FamilyAct {...p} />,
  calc: (p) => <CalcAct {...p} />,
```

- [ ] **Step 5: 类型检查通过**

Run: `npx tsc -b`
Expected: 无错误

- [ ] **Step 6: 提交**

```bash
git add src/dialogue/
git commit -m "feat: add opening, family, and calc acts"
```

---

## Task 6: 第④幕 啊哈时刻（冷峻巨数）

**Files:**
- Create: `src/visual/GapReveal.tsx`
- Create: `src/dialogue/acts/RevealAct.tsx`
- Modify: `src/dialogue/DialogueFlow.tsx`

- [ ] **Step 1: 实现冷峻巨数动画组件**

Create `src/visual/GapReveal.tsx`:

```tsx
import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

function formatYuan(n: number): string {
  return '¥' + Math.round(n).toLocaleString('zh-CN')
}

export default function GapReveal({ gap }: { gap: number }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(mv, gap, { duration: 2.4, ease: 'easeOut' })
    const unsub = mv.on('change', (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
  }, [gap, mv])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-xs tracking-[0.4em] uppercase opacity-40"
      >
        你的家庭保障缺口
      </motion.div>
      <div className="text-4xl md:text-7xl font-light text-[#e05c4a] my-8 tabular-nums">
        {formatYuan(display)}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1.5 }}
        className="opacity-60 max-w-md"
      >
        这个数字，可能从来没有人帮你算过。
      </motion.p>
    </div>
  )
}
```

- [ ] **Step 2: 实现第④幕，调用引擎**

Create `src/dialogue/acts/RevealAct.tsx`:

```tsx
import { motion } from 'framer-motion'
import GapReveal from '../../visual/GapReveal'
import { calculateGap } from '../../engine/gapCalculator'
import { EMPTY_PROFILE } from '../types'
import type { ActProps } from '../DialogueFlow'
import type { FamilyProfile } from '../../engine/types'

export default function RevealAct({ profile, next }: ActProps) {
  const full = { ...EMPTY_PROFILE, ...profile } as FamilyProfile
  const result = calculateGap(full)

  return (
    <div className="relative">
      <GapReveal gap={result.gap} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="flex justify-center pb-16 -mt-10"
      >
        <button onClick={next} className="px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors">
          这个缺口，能怎么补？
        </button>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 3: 在 DialogueFlow 接入**

`src/dialogue/DialogueFlow.tsx` 顶部加：

```tsx
import RevealAct from './acts/RevealAct'
```

`ACT_REGISTRY` 的 `reveal` 替换为：

```tsx
  reveal: (p) => <RevealAct {...p} />,
```

- [ ] **Step 4: 类型检查通过**

Run: `npx tsc -b`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
git add src/visual/ src/dialogue/
git commit -m "feat: add aha-moment gap reveal (act 4)"
```

---

## Task 7: 第⑤幕 接住（方案=答案，含诚实边界）

**Files:**
- Create: `src/dialogue/acts/SolutionAct.tsx`
- Modify: `src/dialogue/DialogueFlow.tsx`

- [ ] **Step 1: 实现第⑤幕**

Create `src/dialogue/acts/SolutionAct.tsx`:

```tsx
import { motion } from 'framer-motion'
import { calculateGap } from '../../engine/gapCalculator'
import { EMPTY_PROFILE } from '../types'
import type { ActProps } from '../DialogueFlow'
import type { FamilyProfile } from '../../engine/types'

function formatYuan(n: number): string {
  return '¥' + Math.round(n).toLocaleString('zh-CN')
}

export default function SolutionAct({ profile, next }: ActProps) {
  const full = { ...EMPTY_PROFILE, ...profile } as FamilyProfile
  const r = calculateGap(full)
  const abroad = full.residencyAbroad

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="text-xs tracking-[0.3em] uppercase opacity-40 mb-3">缺口怎么被盖住</div>
      <h2 className="text-2xl md:text-3xl font-light leading-snug mb-8">
        你不需要现在拿出 {formatYuan(r.gap)}。<br />
        你需要的，是<span className="text-[#e05c4a]">万一发生时，这笔钱立刻到位</span>。
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
        盖住这个缺口最高效的工具，是用<b>每年一笔相对小的确定成本</b>，换一个"万一发生、立刻到位"的保证——
        这正是定期寿险被发明出来要解决的事。
        {abroad && '（你长期在境外，方案体系会不同，通常走香港等国际市场，多币种、可跨境理赔。）'}
      </p>

      <div className="mt-8 p-5 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xs tracking-widest uppercase opacity-50 mb-2">同样诚实地告诉你它不能做什么</div>
        <ul className="space-y-2 opacity-75 text-sm leading-relaxed list-disc pl-5">
          <li>定期寿险只保身故/全残，<b>不保"生病但活着"</b>——那是重疾险的事，逻辑要分开算。</li>
          <li>有等待期、健康告知与除外责任，不是所有情况都赔。</li>
          <li>这里给的是成本量级，<b>不是报价</b>，最终以核保为准。</li>
        </ul>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end mt-10">
        <button onClick={next} className="px-8 py-3 rounded-full bg-white text-black">
          带走属于我的报告
        </button>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: 在 DialogueFlow 接入**

顶部加 `import SolutionAct from './acts/SolutionAct'`，`ACT_REGISTRY` 的 `solution` 替换为 `solution: (p) => <SolutionAct {...p} />,`

- [ ] **Step 3: 类型检查通过**

Run: `npx tsc -b`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add src/dialogue/
git commit -m "feat: add solution act with honest limitations (act 5)"
```

---

## Task 8: 第⑥幕 带走（报告 + 我的方案空间 + 克制的门）

**Files:**
- Create: `src/report/Report.tsx`
- Create: `src/dialogue/acts/TakeawayAct.tsx`
- Modify: `src/dialogue/DialogueFlow.tsx`

- [ ] **Step 1: 实现报告组件**

Create `src/report/Report.tsx`:

```tsx
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
```

- [ ] **Step 2: 实现第⑥幕收尾（A 报告 + B 链接 + C 克制的门）**

Create `src/dialogue/acts/TakeawayAct.tsx`:

```tsx
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
```

- [ ] **Step 3: 在 DialogueFlow 接入**

顶部加 `import TakeawayAct from './acts/TakeawayAct'`，`ACT_REGISTRY` 的 `takeaway` 替换为 `takeaway: (p) => <TakeawayAct {...p} />,`

- [ ] **Step 4: 类型检查通过**

Run: `npx tsc -b`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
git add src/report/ src/dialogue/
git commit -m "feat: add takeaway act with report, shareable link, restrained CTA (act 6)"
```

---

## Task 9: 接入 App.tsx 视图切换 + URL 恢复

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 在 App 顶层加入视图状态与入口**

在 `src/App.tsx` 顶部 import 区加入：

```tsx
import DialogueFlow from './dialogue/DialogueFlow'
import { decodeProfile } from './report/persistence'
```

在 `App` 组件函数体最开始（return 之前）加入：

```tsx
  const [view, setView] = useState<'brand' | 'dialogue'>(() => {
    const p = new URLSearchParams(location.search).get('p')
    return p && decodeProfile(p) ? 'dialogue' : 'brand'
  })

  const initialProfile = (() => {
    const p = new URLSearchParams(location.search).get('p')
    return p ? decodeProfile(p) ?? undefined : undefined
  })()

  if (view === 'dialogue') {
    return <DialogueFlow initialProfile={initialProfile} />
  }
```

> 注：若 `App` 内已有 `useState` 导入则复用；`App.tsx` 第 1 行已 `import React, { useState, ... }`，无需重复。

- [ ] **Step 2: 给品牌站主 CTA 绑定进入对话**

在 `src/App.tsx` 中找到 hero 区主行动按钮（搜索现有"开始/探索/立即"等主按钮文案，或英雄区输入框的提交按钮），为其 `onClick` 增加 `setView('dialogue')`。若一时定位不到，退而在导航栏新增一个按钮：

```tsx
<button onClick={() => setView('dialogue')} className="pointer-events-auto px-5 py-2 rounded-full border border-black/20 hover:bg-black hover:text-white transition-colors">
  开始诊断
</button>
```

将其放入现有导航容器内（与 `VariableLogo` 同级的导航行）。

- [ ] **Step 3: 类型检查与构建通过**

Run: `npx tsc -b && npm run build`
Expected: 构建成功，dist 生成

- [ ] **Step 4: 本地手测**

Run: `npm run dev`
手动验证：
1. 打开首页 → 点"开始诊断" → 进入第①幕
2. 走完六幕，第④幕缺口数字滚动浮现
3. 第⑥幕点"保存我的方案"复制链接，新标签打开该链接 → 直接进入对话且 profile 已恢复

- [ ] **Step 5: 提交**

```bash
git add src/App.tsx
git commit -m "feat: wire dialogue experience into app with url restore"
```

---

## 完成标准

- `npm test` 全绿（引擎 + 持久化）
- `npm run build` 成功
- 六幕可从头走到尾，缺口数字正确（参考用例 ≈ 2840 万）
- "我的方案"链接可跨标签恢复 profile
- 全程无弹窗、无逼单，结尾克制
