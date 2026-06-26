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
