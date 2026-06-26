import type { FamilyProfile, GapResult } from './types'

export function calculateGap(profile: FamilyProfile): GapResult {
  const children = profile.dependents.filter((d) => d.role === 'child')

  const youngestAge = children.length
    ? Math.min(...children.map((c) => c.age))
    : 0
  const supportYears = Math.max(profile.supportUntilAge - youngestAge, 0)

  const livingNeed = profile.monthlyExpense * 12 * supportYears

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
