import { Search } from 'lucide-react'

type DepartmentSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function DepartmentSearch({ value, onChange }: DepartmentSearchProps) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-md border border-[#dfe4ef] bg-white px-3 py-2.5">
      <Search size={14} className="text-[#A7ABB5]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search people"
        className="w-full border-0 bg-transparent text-[12px] text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
      />
    </div>
  )
}
