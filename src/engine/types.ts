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
