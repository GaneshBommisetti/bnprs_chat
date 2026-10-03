type RemoteWorkToggleProps = {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function RemoteWorkToggle({ enabled, onChange }: RemoteWorkToggleProps) {
  return (
    <div className="flex items-center justify-between text-[12px] text-[#111827]">
      <div className="flex items-center gap-2">
        <span>Remote</span>
      </div>
      <label className="relative inline-flex cursor-pointer items-center" title="Toggle remote work">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onChange(event.target.checked)}
          aria-label="Toggle remote work"
          className="peer sr-only"
        />
        <span className="h-5 w-9 rounded-full bg-[#d1d5db] transition-colors peer-checked:bg-[#F2992F]" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </label>
    </div>
  )
}