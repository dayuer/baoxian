// 幕内"上一步"入口：回退到上一个问题，或在首问时回到上一幕。
export default function StepBack({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex justify-start mt-8">
      <button
        onClick={onBack}
        className="text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors"
      >
        ← 上一步
      </button>
    </div>
  )
}
