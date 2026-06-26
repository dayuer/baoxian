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
