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
