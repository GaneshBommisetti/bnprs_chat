import type { Employee } from '../types'
import { EmployeeRow } from './EmployeeRow'

type EmployeeSectionProps = {
  title: string
  count: number
  employees: Employee[]
  subtitle?: string
  selectedEmployeeId?: string
  onMessage?: (employee: Employee) => void
}

export function EmployeeSection({ title, count, employees, subtitle, selectedEmployeeId, onMessage }: EmployeeSectionProps) {
  return (
    <section className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-[#e5eaf3] bg-[#ffffff] shadow-sm shadow-[#dfe7f5]">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
          <span className="text-[12px] text-[#6b7280]">({count})</span>
        </div>
        {subtitle ? <span className="text-[12px] text-[#6b7280]">{subtitle}</span> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {employees.map((employee) => (
          <EmployeeRow key={employee.id} employee={employee} selected={selectedEmployeeId === employee.id} onMessage={onMessage} />
        ))}
      </div>
    </section>
  )
}
