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
