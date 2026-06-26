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
