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
  expect(r.livingNeed).toBe(19_800_000)
})

test('教育按每个孩子各自剩余学年累加', () => {
  const r = calculateGap(baseProfile)
  expect(r.educationNeed).toBe(9_600_000)
})

test('缺口 = 总需求 - 缓冲，且参考用例落在数千万量级', () => {
  const r = calculateGap(baseProfile)
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

test('无孩子时 supportYears 为 0，livingNeed 为 0', () => {
  const r = calculateGap({
    dependents: [{ role: 'spouse', age: 26, hasIncome: false }],
    monthlyExpense: 100_000,
    educationPerChildYearly: 200_000,
    mortgageBalance: 4_000_000,
    savings: 5_000_000,
    residencyAbroad: true,
    supportUntilAge: 18,
  })
  expect(r.livingNeed).toBe(0)
  expect(r.educationNeed).toBe(0)
})

test('breakdown 含生活/教育/负债三项人话标签', () => {
  const r = calculateGap(baseProfile)
  const labels = r.breakdown.map((b) => b.label)
  expect(labels).toContain('生活开支')
  expect(labels).toContain('子女教育')
  expect(labels).toContain('未偿负债')
})
